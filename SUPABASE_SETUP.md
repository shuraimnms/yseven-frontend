# Supabase Setup Guide

## ❌ Getting a 400 error on login?
That means the admin user doesn't exist in Supabase Auth yet.
Follow the steps below to fix it.

---

## Step 1 — Run the Schema SQL
In **Supabase Dashboard → SQL Editor**, paste and run `supabase/schema.sql`.

This creates the `profiles`, `categories`, and `products` tables.

---

## Step 2 — Create the Admin User

### Option A: Script (recommended)
```bash
# Get service_role key from: Supabase → Settings → API → service_role secret
# Then run:
set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
npx tsx supabase/create-admin.ts
```
This creates `admin@y7foods.com` with password `Admin@123456` and sets role to `admin`.

---

### Option B: Supabase Dashboard (manual)

1. Go to **Authentication → Users → Add user**
2. Fill in:
   - Email: `admin@y7foods.com`
   - Password: `Admin@123456`
   - ✅ Auto Confirm User
3. Click **Create User**
4. Go to **SQL Editor** and run:
```sql
update profiles
  set role = 'admin'
  where id = (
    select id from auth.users where email = 'admin@y7foods.com'
  );
```

---

## Step 3 — Login
Go to `/auth/login`:
- Email: `admin@y7foods.com`
- Password: `Admin@123456`

You will be **automatically redirected to `/admin`**.

---

## Step 4 — Migrate Products (optional)
```bash
set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
npx tsx supabase/migrate-products.ts
```
Inserts all 26 existing products + 4 categories into Supabase.

---

## Environment Variables
In `yseven-frontend/.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
Get from: Supabase Dashboard → Settings → API

---

## Storage Bucket (for image uploads)
Supabase → Storage → New Bucket:
- Name: `product-images`
- Public: ✅ Yes


---

## AI Product Auto-Fill (NVIDIA NIM)

The AI fill feature uses a Supabase Edge Function to proxy requests to NVIDIA — no CORS issues.

### Deploy the Edge Function (one time)

```bash
# Install Supabase CLI if needed
npm install -g supabase

# Login
npx supabase login

# Link to your project
npx supabase link --project-ref jegiuiwyykhptzhmuiab

# Deploy the function
npx supabase functions deploy ai-product-fill

# Set your NVIDIA API key
npx supabase secrets set NVIDIA_API_KEY=nvapi-xxxxxxxxxxxx
```

Get a free NVIDIA key at: **https://build.nvidia.com** → Sign in → Get API Key

### How it works
1. Admin opens Add Product dialog
2. Types product name + optional prompt
3. Clicks "Fill All Fields with AI"
4. Frontend → Supabase Edge Function → NVIDIA Llama 3.1 70B → fills all fields
