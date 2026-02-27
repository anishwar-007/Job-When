-- Run in Supabase SQL Editor. HR contacts table (Name, Company, Phone, Email).
-- tracker_id links to trackers; when set, create/update of a tracker syncs here. Delete of tracker cascades.
create table if not exists hr_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  tracker_id uuid references trackers(id) on delete cascade,
  name text not null,
  company_name text not null default '',
  phone text not null default '',
  email text not null default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create unique index if not exists idx_hr_contacts_tracker_id on hr_contacts(tracker_id) where tracker_id is not null;

create index if not exists idx_hr_contacts_user_id on hr_contacts(user_id);

alter table hr_contacts enable row level security;
create policy "Users can view own hr_contacts" on hr_contacts for select using (auth.uid() = user_id);
create policy "Users can insert own hr_contacts" on hr_contacts for insert with check (auth.uid() = user_id);
create policy "Users can update own hr_contacts" on hr_contacts for update using (auth.uid() = user_id);
create policy "Users can delete own hr_contacts" on hr_contacts for delete using (auth.uid() = user_id);
