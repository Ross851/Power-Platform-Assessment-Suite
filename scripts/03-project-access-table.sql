-- ███████████████████████████████████████████████████████████
-- 03-project-access-table.sql
-- Creates project_access table + RLS policies.
-- Run AFTER 01-initial-schema.sql.
-- ███████████████████████████████████████████████████████████

--------------------------------------------------------------
-- 1)  TABLE DEFINITION
--------------------------------------------------------------
create table if not exists public.project_access (
  id          uuid default gen_random_uuid() primary key,
  project_id  uuid not null
              references public.projects(id) on delete cascade,
  user_id     uuid not null
              references public.profiles(id) on delete cascade,
  role        text   not null
              check (role in ('owner','editor','viewer')),
  granted_by  uuid not null
              references public.profiles(id),
  created_at  timestamptz default now() not null,
  unique (project_id, user_id)
);

--------------------------------------------------------------
-- 2)  ENABLE ROW-LEVEL SECURITY
--------------------------------------------------------------
alter table public.project_access enable row level security;

--------------------------------------------------------------
-- 3)  RLS POLICIES
--------------------------------------------------------------

-- Anyone already on the project (or the owner) can see access rows.
create policy "Select: members & owners"
on public.project_access
for select
using (
  auth.uid() = user_id
  or project_id in (
    select id from public.projects where owner_id = auth.uid()
  )
);

-- Only project owners may insert / update / delete rows.
create policy "Owners manage access"
on public.project_access
for all
using (
  project_id in (
    select id from public.projects where owner_id = auth.uid()
  )
);

--------------------------------------------------------------
-- 4)  COMMENTS  (visible in Supabase Studio)
--------------------------------------------------------------
comment on table  public.project_access is
'Per-project role assignments (owner, editor, viewer)';
comment on column public.project_access.role is
'owner = full control · editor = edit assessments · viewer = read-only';

-- ✅  DONE - refresh your table view to see “project_access”.
