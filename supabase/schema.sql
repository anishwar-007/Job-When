-- Run this in Supabase SQL Editor.
-- Jobs: one row per "job" (jobIds item in app)
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text not null,
  status text not null default 'open',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trackers: one row per HR contact (emails in app)
create table if not exists trackers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  job_id uuid references jobs(id) on delete set null,
  name text not null,
  config jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_jobs_user_id on jobs(user_id);
create index if not exists idx_trackers_user_id on trackers(user_id);
create index if not exists idx_trackers_job_id on trackers(job_id);
