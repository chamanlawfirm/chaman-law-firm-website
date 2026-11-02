-- INSTALL ONLY IN A DEDICATED, AUTHORISED CHAMAN LAW FIRM SUPABASE PROJECT.
-- Run as a migration after verifying database scope and backup strategy.
-- API access must remain service_role only; do not grant access to anon/authenticated.
create table if not exists public.client_feedback (
 id uuid primary key default gen_random_uuid(),
 reference text not null unique check (reference ~ '^CF-[A-F0-9]{16}$'),
 submitted_at timestamptz not null default now(),
 payload jsonb not null,
 status text not null default 'new' check (status in ('new','under_review','awaiting_follow_up','resolved','closed')),
 assigned_reviewer uuid,
 management_notes jsonb not null default '[]'::jsonb,
 notification_status text not null default 'pending' check (notification_status in ('pending','sent','failed')),
 notification_attempts integer not null default 0,
 last_notification_at timestamptz,
 last_updated_at timestamptz not null default now()
);
alter table public.client_feedback enable row level security;
revoke all on table public.client_feedback from PUBLIC, anon, authenticated;
-- No public RLS policies. Only a private server credential with service_role
-- can insert; do not make this table public through an unrestricted view.
create index if not exists client_feedback_submitted_at_idx on public.client_feedback(submitted_at desc);
create index if not exists client_feedback_status_idx on public.client_feedback(status);
create table if not exists public.client_feedback_audit (
 id uuid primary key default gen_random_uuid(),
 feedback_id uuid not null references public.client_feedback(id),
 happened_at timestamptz not null default now(),
 actor_id uuid,
 action text not null,
 details jsonb not null default '{}'::jsonb
);
alter table public.client_feedback_audit enable row level security;
revoke all on table public.client_feedback_audit from PUBLIC, anon, authenticated;
-- A management UI must use separately authenticated server-side reviewer RBAC.
-- Never expose a service-role token to browsers or generic staff dashboards.
