-- Run in Supabase SQL Editor after creating the bucket.
-- 1) Create bucket in Dashboard: Storage → New bucket → name "resumes", Private.
-- 2) Then run this to allow each user to read/write only their own folder (path: {user_id}/...).

insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do update set public = false;

-- RLS policies: user can only access files under their own folder (name like 'user_id/...')
create policy "Users can upload own resume"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can update own resume"
on storage.objects for update
to authenticated
using (
  bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can read own resume"
on storage.objects for select
to authenticated
using (
  bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can delete own resume"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text
);
