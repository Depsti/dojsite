-- Discord-Tickets: einmal im Supabase SQL Editor ausführen; wiederholbar.
-- Portal-Anmeldung erfolgt über den Node-Server. Kein direkter Browserzugriff.
begin;
create table if not exists public.doj_ticket_messages (
 guild_id text not null, channel_id text not null, message_id text not null,
 seq bigint generated always as identity unique,
 author jsonb not null default '{}'::jsonb, body text not null default '',
 attachments jsonb not null default '[]'::jsonb, embeds jsonb not null default '[]'::jsonb,
 reply_to text, created_at timestamptz not null, source_updated_at timestamptz not null,
 deleted_at timestamptz, ingested_at timestamptz not null default now(),
 primary key(guild_id,channel_id,message_id),
 check(guild_id ~ '^[0-9]{15,22}$' and channel_id ~ '^[0-9]{15,22}$' and message_id ~ '^[0-9]{15,22}$'),
 check(length(body)<=10000),check(jsonb_typeof(attachments)='array' and jsonb_typeof(embeds)='array')
);
alter table public.doj_ticket_messages add column if not exists mentions jsonb not null default '[]'::jsonb;
create index if not exists doj_ticket_messages_channel_seq on public.doj_ticket_messages(guild_id,channel_id,seq desc);
alter table public.doj_ticket_messages enable row level security;
revoke all on public.doj_ticket_messages from public,anon,authenticated;
grant select,insert,update,delete on public.doj_ticket_messages to service_role;
revoke all on sequence public.doj_ticket_messages_seq_seq from public,anon,authenticated;
grant usage,select on sequence public.doj_ticket_messages_seq_seq to service_role;
create or replace function public.doj_ticket_ingest(p_event jsonb) returns setof public.doj_ticket_messages
language sql security invoker set search_path=public as $$
 insert into public.doj_ticket_messages as existing(guild_id,channel_id,message_id,author,body,attachments,embeds,reply_to,created_at,source_updated_at,deleted_at,mentions)
 values(p_event->>'guildId',p_event->>'channelId',p_event->>'messageId',
 case when p_event->>'type'='message.delete' then '{}'::jsonb else p_event->'author' end,
 case when p_event->>'type'='message.delete' then '' else p_event->>'content' end,
 case when p_event->>'type'='message.delete' then '[]'::jsonb else p_event->'attachments' end,
 case when p_event->>'type'='message.delete' then '[]'::jsonb else p_event->'embeds' end,
 p_event->>'replyTo',coalesce((p_event->>'createdAt')::timestamptz,(p_event->>'changedAt')::timestamptz),
 (p_event->>'changedAt')::timestamptz,case when p_event->>'type'='message.delete' then (p_event->>'changedAt')::timestamptz end,
 case when p_event->>'type'='message.delete' then '[]'::jsonb else coalesce(p_event->'mentions','[]'::jsonb) end)
 on conflict(guild_id,channel_id,message_id) do update set
 author=excluded.author,body=case when excluded.source_updated_at>existing.source_updated_at or excluded.deleted_at is not null then excluded.body else existing.body end,mentions=excluded.mentions,attachments=excluded.attachments,embeds=excluded.embeds,reply_to=excluded.reply_to,
 source_updated_at=excluded.source_updated_at,deleted_at=excluded.deleted_at,ingested_at=case when excluded.source_updated_at>existing.source_updated_at or excluded.deleted_at is not null then now() else existing.ingested_at end
 where existing.deleted_at is null and (excluded.source_updated_at>existing.source_updated_at or excluded.deleted_at is not null or (excluded.source_updated_at=existing.source_updated_at and p_event->>'displayVersion'='1'))
 returning *;
$$;
revoke all on function public.doj_ticket_ingest(jsonb) from public,anon,authenticated;
grant execute on function public.doj_ticket_ingest(jsonb) to service_role;
notify pgrst,'reload schema';
commit;
