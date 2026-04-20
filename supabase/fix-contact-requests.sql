-- ============================================================
-- Run this in Supabase SQL Editor
-- Adds 'quote' as a valid type in contact_requests
-- ============================================================

-- Drop the old type constraint and add 'quote'
alter table contact_requests
  drop constraint if exists contact_requests_type_check;

alter table contact_requests
  add constraint contact_requests_type_check
  check (type in ('general','bulk','partnership','support','media','export','press','chat','quote'));
