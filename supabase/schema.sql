-- Einmal im SQL Editor des Supabase-Projekts ausführen. Kann gefahrlos erneut ausgeführt werden.
begin;
create table if not exists public.doj_portal_state (
  id smallint primary key check (id = 1),
  revision bigint not null check (revision > 0),
  payload jsonb not null check (
    jsonb_typeof(payload) = 'object'
    and payload ?& array['users','records','audit','settings']
    and jsonb_typeof(payload->'users') = 'array'
    and jsonb_typeof(payload->'records') = 'array'
    and jsonb_typeof(payload->'audit') = 'array'
    and jsonb_typeof(payload->'settings') = 'object'
  ),
  updated_at timestamptz not null default now()
);

-- Sitzungen: gemeinsam für alle Server-Instanzen, überleben Neustarts.
create table if not exists public.doj_sessions (
  token_hash text primary key,
  user_id text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists doj_sessions_user_idx on public.doj_sessions(user_id);
create index if not exists doj_sessions_expires_idx on public.doj_sessions(expires_at);

-- Anmeldeversuche: Sperre gilt serverübergreifend.
create table if not exists public.doj_login_attempts (
  key text primary key,
  count integer not null default 0,
  until timestamptz not null
);

-- Nur der Server (Service-Rolle) hat Zugriff. Browser-Rollen erhalten nichts.
alter table public.doj_portal_state enable row level security;
alter table public.doj_sessions enable row level security;
alter table public.doj_login_attempts enable row level security;
revoke all on table public.doj_portal_state, public.doj_sessions, public.doj_login_attempts from public, anon, authenticated;
grant select, insert, update on table public.doj_portal_state to service_role;
grant select, insert, update, delete on table public.doj_sessions, public.doj_login_attempts to service_role;
commit;
