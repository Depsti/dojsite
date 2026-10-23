-- Private Direktnachrichten: zusätzlich zur bestehenden Fallchat-Migration ausführen.
begin;
create table if not exists public.doj_direct_messages (
 id text primary key check(id ~ '^[a-f0-9]{24}$'),
 seq bigint generated always as identity unique,
 sender_id text not null check(sender_id ~ '^[a-f0-9]{24}$'),
 recipient_id text not null check(recipient_id ~ '^[a-f0-9]{24}$'),
 thread_key text generated always as (least(sender_id,recipient_id)||':'||greatest(sender_id,recipient_id)) stored,
 body text not null default '' check(char_length(body)<=5000),
 reference_ids jsonb not null default '[]' check(jsonb_typeof(reference_ids)='array' and jsonb_array_length(reference_ids)<=10),
 reply_to text references public.doj_direct_messages(id),
 client_nonce text not null,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 deleted_at timestamptz,deleted_by text,edit_history jsonb not null default '[]',
 check(sender_id<>recipient_id),unique(sender_id,recipient_id,client_nonce)
);
create index if not exists doj_direct_messages_thread_seq on public.doj_direct_messages(thread_key,seq desc);
create index if not exists doj_direct_messages_sender_time on public.doj_direct_messages(sender_id,created_at desc);
create index if not exists doj_direct_messages_recipient_seq on public.doj_direct_messages(recipient_id,seq desc);
create index if not exists doj_direct_messages_reply on public.doj_direct_messages(reply_to) where reply_to is not null;
create table if not exists public.doj_direct_reads (
 user_id text not null,peer_id text not null,last_read_seq bigint not null default 0 check(last_read_seq>=0),
 updated_at timestamptz not null default now(),primary key(user_id,peer_id),check(user_id<>peer_id)
);
create table if not exists public.doj_direct_reactions (
 message_id text references public.doj_direct_messages(id) on delete cascade,
 user_id text not null,kind text not null check(kind in ('check','cross')),
 updated_at timestamptz not null default now(),primary key(message_id,user_id)
);
alter table public.doj_direct_messages enable row level security;
alter table public.doj_direct_reads enable row level security;
alter table public.doj_direct_reactions enable row level security;
revoke all on public.doj_direct_messages,public.doj_direct_reads,public.doj_direct_reactions from public,anon,authenticated;
grant select,insert,update on public.doj_direct_messages,public.doj_direct_reads to service_role;
grant select,insert,update,delete on public.doj_direct_reactions to service_role;
grant usage,select on sequence public.doj_direct_messages_seq_seq to service_role;

create or replace function public.doj_direct_send(p_id text,p_sender text,p_recipient text,p_body text,p_refs jsonb,p_reply text,p_nonce text)
returns setof public.doj_direct_messages language plpgsql security invoker set search_path='' as $$
declare v_key text:=least(p_sender,p_recipient)||':'||greatest(p_sender,p_recipient);
begin
 perform pg_advisory_xact_lock(hashtextextended('direct:'||p_sender,0));
 if exists(select 1 from public.doj_direct_messages where sender_id=p_sender and recipient_id=p_recipient and client_nonce=p_nonce) then
  return query select * from public.doj_direct_messages where sender_id=p_sender and recipient_id=p_recipient and client_nonce=p_nonce;return;
 end if;
 if (select count(*) from public.doj_direct_messages where sender_id=p_sender and created_at>now()-interval '10 seconds')>=5 then raise exception 'DOJ_DIRECT_RATE_LIMIT';end if;
 if p_reply is not null and not exists(select 1 from public.doj_direct_messages where id=p_reply and thread_key=v_key) then raise exception 'DOJ_DIRECT_INVALID_REPLY';end if;
 if char_length(trim(p_body))=0 and jsonb_array_length(p_refs)=0 then raise exception 'DOJ_DIRECT_EMPTY';end if;
 return query insert into public.doj_direct_messages(id,sender_id,recipient_id,body,reference_ids,reply_to,client_nonce)
 values(p_id,p_sender,p_recipient,p_body,p_refs,p_reply,p_nonce) returning *;
end;$$;
create or replace function public.doj_direct_mark_read(p_user text,p_peer text,p_seq bigint)
returns void language sql security invoker set search_path='' as $$
 insert into public.doj_direct_reads(user_id,peer_id,last_read_seq)
 values(p_user,p_peer,greatest(0,least(p_seq,coalesce((select max(seq) from public.doj_direct_messages where thread_key=least(p_user,p_peer)||':'||greatest(p_user,p_peer)),0))))
 on conflict(user_id,peer_id) do update set last_read_seq=greatest(public.doj_direct_reads.last_read_seq,excluded.last_read_seq),updated_at=now();
$$;
create or replace function public.doj_direct_summary(p_user text)
returns table(peer_id text,unread bigint,latest_at timestamptz) language sql stable security invoker set search_path='' as $$
 with related as (
  select m.*,case when m.sender_id=p_user then m.recipient_id else m.sender_id end as peer
  from public.doj_direct_messages m where m.sender_id=p_user or m.recipient_id=p_user
 )
 select m.peer,count(*) filter(where m.recipient_id=p_user and m.deleted_at is null and m.seq>coalesce(r.last_read_seq,0)),max(m.created_at)
 from related m left join public.doj_direct_reads r on r.user_id=p_user and r.peer_id=m.peer group by m.peer;
$$;
revoke all on function public.doj_direct_send(text,text,text,text,jsonb,text,text),public.doj_direct_mark_read(text,text,bigint),public.doj_direct_summary(text) from public,anon,authenticated;
grant execute on function public.doj_direct_send(text,text,text,text,jsonb,text,text),public.doj_direct_mark_read(text,text,bigint),public.doj_direct_summary(text) to service_role;
notify pgrst,'reload schema';
commit;
