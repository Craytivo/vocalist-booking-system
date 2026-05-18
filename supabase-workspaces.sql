-- Simplified workspace support for Supabase Auth (one workspace per user)

create extension if not exists pgcrypto;

create table if not exists artist_workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete cascade,
  artist_name text,
  artist_email text,
  artist_logo text,
  share_slug text unique not null,
  created_at timestamptz default now()
);

alter table artist_workspaces
  add column if not exists owner_user_id uuid references auth.users(id) on delete cascade;

-- Remove invite_code column if it exists
alter table artist_workspaces
  drop column if exists invite_code;

alter table contracts
  add column if not exists workspace_id uuid references artist_workspaces(id);

alter table contract_versions
  add column if not exists workspace_id uuid references artist_workspaces(id);

alter table artist_workspaces enable row level security;
alter table contracts enable row level security;
alter table contract_versions enable row level security;

drop policy if exists "Public demo workspaces can be read" on artist_workspaces;
drop policy if exists "Public demo workspaces can be created" on artist_workspaces;
drop policy if exists "Public demo contracts can be read" on contracts;
drop policy if exists "Public demo contracts can be inserted" on contracts;
drop policy if exists "Public demo contracts can be updated" on contracts;
drop policy if exists "Public demo contracts can be deleted" on contracts;
drop policy if exists "Public demo contract versions can be read" on contract_versions;
drop policy if exists "Public demo contract versions can be inserted" on contract_versions;
drop policy if exists "Public demo contract versions can be deleted" on contract_versions;

drop policy if exists "Artists can read owned or invited workspaces" on artist_workspaces;
drop policy if exists "Users can read their own workspace" on artist_workspaces;
create policy "Users can read their own workspace"
on artist_workspaces for select
using (auth.uid() = owner_user_id);

drop policy if exists "Artists can create owned workspaces" on artist_workspaces;
drop policy if exists "Users can create their own workspace" on artist_workspaces;
create policy "Users can create their own workspace"
on artist_workspaces for insert
with check (auth.uid() = owner_user_id);

drop policy if exists "Artists can read workspace contracts" on contracts;
drop policy if exists "Users can read their workspace contracts" on contracts;
create policy "Users can read their workspace contracts"
on contracts for select
using (
  exists (
    select 1
    from artist_workspaces
    where artist_workspaces.id = contracts.workspace_id
      and artist_workspaces.owner_user_id = auth.uid()
  )
);

drop policy if exists "Artists can insert workspace contracts" on contracts;
drop policy if exists "Users can insert their workspace contracts" on contracts;
create policy "Users can insert their workspace contracts"
on contracts for insert
with check (
  exists (
    select 1
    from artist_workspaces
    where artist_workspaces.id = contracts.workspace_id
      and artist_workspaces.owner_user_id = auth.uid()
  )
);

drop policy if exists "Artists can update workspace contracts" on contracts;
drop policy if exists "Users can update their workspace contracts" on contracts;
create policy "Users can update their workspace contracts"
on contracts for update
using (
  exists (
    select 1
    from artist_workspaces
    where artist_workspaces.id = contracts.workspace_id
      and artist_workspaces.owner_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from artist_workspaces
    where artist_workspaces.id = contracts.workspace_id
      and artist_workspaces.owner_user_id = auth.uid()
  )
);

drop policy if exists "Artists can delete workspace contracts" on contracts;
drop policy if exists "Users can delete their workspace contracts" on contracts;
create policy "Users can delete their workspace contracts"
on contracts for delete
using (
  exists (
    select 1
    from artist_workspaces
    where artist_workspaces.id = contracts.workspace_id
      and artist_workspaces.owner_user_id = auth.uid()
  )
);

drop policy if exists "Artists can read workspace contract versions" on contract_versions;
drop policy if exists "Users can read their workspace contract versions" on contract_versions;
create policy "Users can read their workspace contract versions"
on contract_versions for select
using (
  exists (
    select 1
    from artist_workspaces
    where artist_workspaces.id = contract_versions.workspace_id
      and artist_workspaces.owner_user_id = auth.uid()
  )
);

drop policy if exists "Artists can insert workspace contract versions" on contract_versions;
drop policy if exists "Users can insert their workspace contract versions" on contract_versions;
create policy "Users can insert their workspace contract versions"
on contract_versions for insert
with check (
  exists (
    select 1
    from artist_workspaces
    where artist_workspaces.id = contract_versions.workspace_id
      and artist_workspaces.owner_user_id = auth.uid()
  )
);

drop policy if exists "Artists can delete workspace contract versions" on contract_versions;
drop policy if exists "Users can delete their workspace contract versions" on contract_versions;
create policy "Users can delete their workspace contract versions"
on contract_versions for delete
using (
  exists (
    select 1
    from artist_workspaces
    where artist_workspaces.id = contract_versions.workspace_id
      and artist_workspaces.owner_user_id = auth.uid()
  )
);
