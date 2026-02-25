-- Run this in Supabase SQL Editor after schema.sql.
alter table jobs enable row level security;
create policy "Users can view own jobs" on jobs for select using (auth.uid() = user_id);
create policy "Users can insert own jobs" on jobs for insert with check (auth.uid() = user_id);
create policy "Users can update own jobs" on jobs for update using (auth.uid() = user_id);
create policy "Users can delete own jobs" on jobs for delete using (auth.uid() = user_id);

alter table trackers enable row level security;
create policy "Users can view own trackers" on trackers for select using (auth.uid() = user_id);
create policy "Users can insert own trackers" on trackers for insert with check (auth.uid() = user_id);
create policy "Users can update own trackers" on trackers for update using (auth.uid() = user_id);
create policy "Users can delete own trackers" on trackers for delete using (auth.uid() = user_id);
