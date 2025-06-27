-- 03-project-access-table.sql
-- Creates the project_access table and RLS policies
-- Run this AFTER the 01-initial-schema.sql script.

---------------------------
-- 1) Table definition
---------------------------
create table if not exists public.project_access (
  id         uuid default gen_random_uuid() primary key,
  project_id uuid not null
             references public.projects(id) on delete cascade,
  user_id    uuid not null
             references public.profiles(id) on delete cascade,
  role       text not null
             check (role in ('owner','editor','viewer')),
  granted_by uuid not null
             references public.profiles(id),
  created_at timestamptz default now() not null,
  unique (project_id, user_id)
);

---------------------------
-- 2) Enable Row-Level Security
---------------------------
alter table public.project_access enable row level security;

---------------------------
-- 3) Policies
---------------------------

-- Anyone who already has access (or is the owner) can see who else has access.
create policy "Select: project viewers & owners"
on public.project_access
for select
using (
  auth.uid() = user_id
  or project_id in (select id from public.projects where owner_id = auth.uid())
);

-- Only project owners can grant / revoke access.
create policy "Owners manage access"
on public.project_access
for all   -- covers insert, update, delete
using (
  project_id in (select id from public.projects where owner_id = auth.uid())
);

---------------------------
-- 4) COMMENTs  (optional but nice for Supabase UI)
---------------------------
comment on table  public.project_access is
'Per-project role assignments (owner, editor, viewer)';
comment on column public.project_access.role is
'owner = full control · editor = can edit assessments · viewer = read-only';

-- ✅ Done.  Refresh Supabase table view to see it.
