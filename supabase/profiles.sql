-- Run in Supabase SQL Editor. Creates profiles table for resume (and future user settings).
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  resume_path text,
  resume_updated_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Optional: create profile row on signup (run if you want auto-creation)
-- create or replace function public.handle_new_user()
-- returns trigger as $$
-- begin
--   insert into public.profiles (id) values (new.id);
--   return new;
-- end;
-- $$ language plpgsql security definer;
-- create or replace trigger on_auth_user_created
--   after insert on auth.users
--   for each row execute procedure public.handle_new_user();
