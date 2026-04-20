-- Run this in Supabase SQL Editor to enable live updates.
-- After this, adding/editing products in admin instantly
-- updates every open page on the website — no refresh needed.

alter publication supabase_realtime add table products;
alter publication supabase_realtime add table categories;
