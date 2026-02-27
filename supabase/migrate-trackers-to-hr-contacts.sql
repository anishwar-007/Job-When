-- Migrate tracker data into hr_contacts for user ac112aec-dc59-41d0-bb7f-265d4684005b
-- Run after hr_contacts.sql. Creates one hr_contact row per tracker (name, company, phone, email from config).
insert into hr_contacts (user_id, name, company_name, phone, email)
select
  t.user_id,
  t.name,
  coalesce(t.config->>'companyName', ''),
  coalesce(t.config->>'phone', ''),
  coalesce(t.config->>'email', '')
from trackers t
where t.user_id = 'ac112aec-dc59-41d0-bb7f-265d4684005b'::uuid;
