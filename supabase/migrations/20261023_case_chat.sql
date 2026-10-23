-- Fallchat: im SQL Editor des bestehenden Projekts ausführen. Keine bestehenden Portaldaten werden verändert.
begin;
create table if not exists public.doj_case_messages (
 id text primary key check(id ~ '^[a-f0-9]{24}$'),
 seq bigint generated always as identity unique,
 case_id text not null check(case_id ~ '^[a-f0-9]{24}$'),
 author_id text not null,
 body text not null default '' check(char_length(body)<=5000),
 reference_ids jsonb not null default '[]' check(jsonb_typeof(reference_ids)='array' and jsonb_array_length(reference_ids)<=10),
 reply_to text references public.doj_case_messages(id),
 client_nonce text not null,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 deleted_at timestamptz,
 deleted_by text,
 edit_history jsonb not null default '[]',
 unique(case_id,author_id,client_nonce)
);
create index if not exists doj_case_messages_case_seq on public.doj_case_messages(case_id,seq desc);
create index if not exists doj_case_messages_author_time on public.doj_case_messages(author_id,created_at desc);
create table if not exists public.doj_case_chat_reads (
 case_id text not null,user_id text not null,last_read_seq bigint not null default 0 check(last_read_seq>=0),
 updated_at timestamptz not null default now(),primary key(case_id,user_id)
);
create table if not exists public.doj_case_reactions (
 message_id text references public.doj_case_messages(id) on delete cascade,
 user_id text not null,kind text not null check(kind in ('check','cross')),
 updated_at timestamptz not null default now(),primary key(message_id,user_id)
);
alter table public.doj_case_messages enable row level security;
alter table public.doj_case_chat_reads enable row level security;
alter table public.doj_case_reactions enable row level security;
revoke all on public.doj_case_messages,public.doj_case_chat_reads,public.doj_case_reactions from public,anon,authenticated;
grant select,insert,update on public.doj_case_messages,public.doj_case_chat_reads to service_role;
grant select,insert,update,delete on public.doj_case_reactions to service_role;
grant usage,select on sequence public.doj_case_messages_seq_seq to service_role;

create or replace function public.doj_chat_send(p_id text,p_case text,p_author text,p_body text,p_refs jsonb,p_reply text,p_nonce text)
returns setof public.doj_case_messages language plpgsql security invoker set search_path='' as $$
begin
 perform pg_advisory_xact_lock(hashtextextended(p_author,0));
 if exists(select 1 from public.doj_case_messages where case_id=p_case and author_id=p_author and client_nonce=p_nonce) then
  return query select * from public.doj_case_messages where case_id=p_case and author_id=p_author and client_nonce=p_nonce;return;
 end if;
 if (select count(*) from public.doj_case_messages where author_id=p_author and created_at>now()-interval '10 seconds')>=5 then
  raise exception 'DOJ_CHAT_RATE_LIMIT';
 end if;
 if p_reply is not null and not exists(select 1 from public.doj_case_messages where id=p_reply and case_id=p_case) then raise exception 'DOJ_CHAT_INVALID_REPLY';end if;
 if char_length(trim(p_body))=0 and jsonb_array_length(p_refs)=0 then raise exception 'DOJ_CHAT_EMPTY';end if;
 return query insert into public.doj_case_messages(id,case_id,author_id,body,reference_ids,reply_to,client_nonce)
 values(p_id,p_case,p_author,p_body,p_refs,p_reply,p_nonce) returning *;
end;$$;
create or replace function public.doj_chat_mark_read(p_case text,p_user text,p_seq bigint)
returns void language sql security invoker set search_path='' as $$
 insert into public.doj_case_chat_reads(case_id,user_id,last_read_seq)
 values(p_case,p_user,greatest(0,least(p_seq,coalesce((select max(seq) from public.doj_case_messages where case_id=p_case),0))))
 on conflict(case_id,user_id) do update set last_read_seq=greatest(public.doj_case_chat_reads.last_read_seq,excluded.last_read_seq),updated_at=now();
$$;
create or replace function public.doj_chat_unread(p_user text,p_cases text[])
returns table(case_id text,unread bigint) language sql stable security invoker set search_path='' as $$
 select m.case_id,count(*) from public.doj_case_messages m
 left join public.doj_case_chat_reads r on r.case_id=m.case_id and r.user_id=p_user
 where m.case_id=any(p_cases) and m.seq>coalesce(r.last_read_seq,0) and m.author_id<>p_user and m.deleted_at is null
 group by m.case_id;
$$;
revoke all on function public.doj_chat_send(text,text,text,text,jsonb,text,text),public.doj_chat_mark_read(text,text,bigint),public.doj_chat_unread(text,text[]) from public,anon,authenticated;
grant execute on function public.doj_chat_send(text,text,text,text,jsonb,text,text),public.doj_chat_mark_read(text,text,bigint),public.doj_chat_unread(text,text[]) to service_role;
notify pgrst,'reload schema';
commit;