-- Run after hr_contacts.sql. Links hr_contacts to trackers and enables sync on create/update.
-- When a tracker is deleted, the linked hr_contact row is removed automatically.
alter table hr_contacts add column if not exists tracker_id uuid references trackers(id) on delete cascade;
create unique index if not exists idx_hr_contacts_tracker_id on hr_contacts(tracker_id) where tracker_id is not null;
