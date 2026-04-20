-- ============================================================
-- Y7 Foods – Supabase Schema  (idempotent — safe to re-run)
-- ============================================================

create extension if not exists "pgcrypto";

-- ─── PROFILES ────────────────────────────────────────────────
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text,
  role       text not null default 'customer' check (role in ('admin','customer')),
  created_at timestamptz not null default now()
);

create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

alter table profiles enable row level security;
drop policy if exists "Users can read own profile"          on profiles;
drop policy if exists "Users can update own profile"        on profiles;
drop policy if exists "Authenticated can read all profiles" on profiles;
create policy "Users can read own profile"          on profiles for select using (auth.uid() = id);
create policy "Users can update own profile"        on profiles for update using (auth.uid() = id);
create policy "Authenticated can read all profiles" on profiles for select using (auth.role() = 'authenticated');

-- ─── CATEGORIES ──────────────────────────────────────────────
create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  cover_image text,
  cover_video text,
  description text,
  status      text not null default 'active' check (status in ('active','inactive')),
  created_at  timestamptz not null default now()
);

alter table categories enable row level security;
drop policy if exists "Public read categories" on categories;
drop policy if exists "Admin all categories"   on categories;
create policy "Public read categories" on categories for select using (status = 'active');
create policy "Admin all categories"   on categories for all    using (auth.role() = 'authenticated');

-- ─── PRODUCTS ────────────────────────────────────────────────
create table if not exists products (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  slug           text not null unique,
  category_id    uuid references categories(id) on delete set null,
  tagline        text,
  description    text,
  ingredients    text,
  features       jsonb default '[]',
  benefits       jsonb default '[]',
  perfect_for    jsonb default '[]',
  pack_sizes     jsonb default '[]',
  selected_size  text,
  main_image     text,
  gallery_images jsonb default '[]',
  status         text not null default 'active' check (status in ('active','inactive')),
  is_best_seller boolean not null default false,
  is_new         boolean not null default false,
  created_at     timestamptz not null default now()
);

alter table products enable row level security;
drop policy if exists "Public read products" on products;
drop policy if exists "Admin all products"   on products;
create policy "Public read products" on products for select using (status = 'active');
create policy "Admin all products"   on products for all    using (auth.role() = 'authenticated');

create index if not exists idx_products_slug        on products(slug);
create index if not exists idx_products_category_id on products(category_id);
create index if not exists idx_categories_slug      on categories(slug);

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
create policy "Admin manage orders" on orders for all using (auth.role() = 'authenticated');

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
create policy "Admin manage payments" on payments for all using (auth.role() = 'authenticated');

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
drop policy if exists "Public insert contact"  on contact_requests;
drop policy if exists "Admin manage contacts"  on contact_requests;
create policy "Public insert contact" on contact_requests for insert with check (true);
create policy "Admin manage contacts" on contact_requests for all    using (auth.role() = 'authenticated');

-- ─── JWT ROLE INJECTION ───────────────────────────────────────
create or replace function inject_role_into_jwt()
returns trigger language plpgsql security definer as $$
declare
  user_role text;
begin
  select role into user_role from public.profiles where id = new.id;
  if user_role is not null then
    new.raw_app_meta_data = coalesce(new.raw_app_meta_data, '{}'::jsonb)
      || jsonb_build_object('role', user_role);
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
  before update on auth.users
  for each row execute procedure inject_role_into_jwt();

-- ─── ADMIN USER SETUP ────────────────────────────────────────
-- After creating admin@y7foods.com in Auth → Users, run:
--
-- update profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'admin@y7foods.com');
--
-- update auth.users
--   set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb
--   where email = 'admin@y7foods.com';


-- ─── ENABLE REALTIME ─────────────────────────────────────────
-- Run this once to enable live updates on products & categories.
-- After this, any change in admin instantly appears on the website.
alter publication supabase_realtime add table products;
alter publication supabase_realtime add table categories;
