-- Update für bestehende Discord-Tickets: Namen und Erwähnungen. Keine Daten werden gelöscht.
begin;
alter table public.doj_ticket_messages add column if not exists mentions jsonb not null default '[]'::jsonb;
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
