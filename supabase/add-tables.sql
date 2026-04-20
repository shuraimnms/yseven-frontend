-- ============================================================
-- Run this in Supabase SQL Editor
-- Only adds the NEW tables (orders, payments, contact_requests)
-- Safe to run even if profiles/categories/products already exist
-- ============================================================

-- ─── ORDERS ──────────────────────────────────────────────────
create table if not exists orders (
  id               uuid primary key default gen_random_uuid(),
  order_number     text unique,
  customer_name    text,
  customer_email   text,
  customer_phone   text,
  items            jsonb default '[]',
  total            numeric(10,2) default 0,
  status           text not null default 'pending'
                     check (status in ('pending','processing','shipped','delivered','cancelled')),
  payment_status   text default 'pending'
                     check (payment_status in ('pending','paid','failed','refunded')),
  shipping_address jsonb,
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table orders enable row level security;

drop policy if exists "Admin manage orders" on orders;
create policy "Admin manage orders" on orders
  for all using (auth.role() = 'authenticated');

-- ─── PAYMENTS ────────────────────────────────────────────────
create table if not exists payments (
  id             uuid primary key default gen_random_uuid(),
  order_id       text,
  transaction_id text,
  customer_name  text,
  customer_email text,
  amount         numeric(10,2) default 0,
  status         text not null default 'pending'
                   check (status in ('pending','paid','failed','refunded')),
  gateway        text default 'cashfree'
                   check (gateway in ('cashfree','razorpay','other')),
  gateway_data   jsonb,
  created_at     timestamptz not null default now()
);

alter table payments enable row level security;

drop policy if exists "Admin manage payments" on payments;
create policy "Admin manage payments" on payments
  for all using (auth.role() = 'authenticated');

-- ─── CONTACT REQUESTS ────────────────────────────────────────
create table if not exists contact_requests (
  id         uuid primary key default gen_random_uuid(),
  full_name  text not null,
  email      text not null,
  phone      text,
  subject    text,
  message    text,
  type       text default 'general'
               check (type in ('general','bulk','partnership','support','media','export','press','chat')),
  status     text default 'new'
               check (status in ('new','in-progress','resolved','closed')),
  priority   text default 'medium'
               check (priority in ('low','medium','high','urgent')),
  notes      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table contact_requests enable row level security;

drop policy if exists "Public insert contact" on contact_requests;
create policy "Public insert contact" on contact_requests
  for insert with check (true);

drop policy if exists "Admin manage contacts" on contact_requests;
create policy "Admin manage contacts" on contact_requests
  for all using (auth.role() = 'authenticated');


-- ─── CHAT LEADS ──────────────────────────────────────────────
create table if not exists chat_leads (
  id         uuid primary key default gen_random_uuid(),
  name       text,
  phone      text,
  email      text,
  country    text,
  interest   text default 'general',
  message    text,
  status     text default 'new' check (status in ('new','contacted','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table chat_leads enable row level security;

drop policy if exists "Public insert chat_leads" on chat_leads;
create policy "Public insert chat_leads" on chat_leads
  for insert with check (true);

drop policy if exists "Admin manage chat_leads" on chat_leads;
create policy "Admin manage chat_leads" on chat_leads
  for all using (auth.role() = 'authenticated');


-- ─── ADD cover_video TO categories ───────────────────────────
-- Run this if you already have the categories table
alter table categories add column if not exists cover_video text;
