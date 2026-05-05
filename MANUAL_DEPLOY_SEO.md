# 🚀 Manual Deployment Guide (No CLI Required)

## Deploy Autonomous AI SEO System via Supabase Dashboard

**No command line needed!** Everything can be done through the web interface.

---

## Step 1: Deploy Database Schema (5 minutes)

### 1.1 Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar

### 1.2 Run Migration SQL
1. Click **New Query**
2. Open file: `yseven-backend/supabase/migrations/001_seo_system.sql`
3. **Copy ALL the SQL** (it's a big file, ~500 lines)
4. **Paste into SQL Editor**
5. Click **Run** (bottom right)
6. Wait for "Success" message

✅ **Done!** All 20+ tables are now created.

---

## Step 2: Deploy Edge Functions (10 minutes)

Since you don't have CLI, we'll use the **Supabase Dashboard** to deploy functions.

### 2.1 Enable Edge Functions
1. In Supabase Dashboard, go to **Edge Functions**
2. If not enabled, click **Enable Edge Functions**

### 2.2 Deploy Crawler Function

**Option A: Via Dashboard (Recommended)**
1. Click **Create a new function**
2. Name: `seo-crawler`
3. Copy code from `yseven-backend/supabase/functions/seo-crawler/index.ts`
4. Paste into editor
5. Click **Deploy function**

**Option B: Manual Upload**
1. Download Supabase CLI: https://supabase.com/docs/guides/cli
2. Or use GitHub integration (see below)

### 2.3 Deploy Other Functions
Repeat for:
- `seo-ai-analyzer` (from `seo-ai-analyzer/index.ts`)
- `seo-auto-fix` (from `seo-auto-fix/index.ts`)
- `seo-cron-daily` (from `seo-cron-daily/index.ts`)

---

## Step 3: Set Environment Variables (2 minutes)

1. Go to **Settings** → **Edge Functions** → **Secrets**
2. Add these secrets:

```
SITE_URL = https://ysevenfoods.com
NVIDIA_API_KEY = your_nvidia_key_here
```

(NVIDIA_API_KEY is optional - system works without it)

---

## Step 4: Configure Cron Job (3 minutes)

### 4.1 Enable pg_cron Extension
1. Go to **Database** → **Extensions**
2. Search for `pg_cron`
3. Click **Enable**

### 4.2 Create Cron Job
1. Go to **SQL Editor**
2. Click **New Query**
3. Paste this SQL:

```sql
-- Daily crawl at 2 AM
SELECT cron.schedule(
  'daily-seo-crawl',
  '0 2 * * *',
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/seo-cron-daily',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  );
  $$
);
```

4. **Replace:**
   - `YOUR_PROJECT_REF` with your project reference (found in Settings → API)
   - `YOUR_SERVICE_ROLE_KEY` with your service role key (Settings → API → service_role secret)

5. Click **Run**

✅ **Done!** System will crawl daily at 2 AM.

---

## Step 5: Test the System (5 minutes)

### 5.1 Manual Test Crawl

1. Go to **Edge Functions** → `seo-crawler`
2. Click **Invoke function**
3. Leave body empty: `{}`
4. Click **Send**
5. Wait for response (may take 30-60 seconds)

You should see:
```json
{
  "success": true,
  "crawlId": "...",
  "pagesProcessed": 25,
  "issuesFound": 15
}
```

### 5.2 Check Database

1. Go to **Table Editor**
2. Open `seo_pages` table
3. You should see your pages!
4. Open `seo_issues` table
5. You should see detected issues!

### 5.3 Check Health Score

1. Go to **SQL Editor**
2. Run this query:

```sql
SELECT * FROM get_global_seo_health();
```

You should see:
```json
{
  "overall_score": 75.5,
  "total_pages": 25,
  "pages_with_issues": 8,
  "critical_issues": 2,
  "pending_fixes": 5,
  "orphan_pages": 1
}
```

---

## Step 6: Access Admin Dashboard (2 minutes)

### 6.1 Add Route to Your Frontend

1. Open `yseven-frontend/src/App.tsx` (or your router file)
2. Add this import:
```tsx
import SEODashboard from '@/pages/admin/SEODashboard';
```

3. Add this route:
```tsx
<Route path="/admin/seo" element={<SEODashboard />} />
```

### 6.2 Access Dashboard

1. Go to: `http://localhost:5173/admin/seo` (dev)
2. Or: `https://ysevenfoods.com/admin/seo` (production)

You should see:
- ✅ SEO Health Score
- ✅ Critical Issues count
- ✅ AI Engine toggle (ON/OFF)
- ✅ Auto-Fix toggle (ON/OFF)
- ✅ Start Crawl button

---

## Alternative: GitHub Integration (Easiest!)

If you have your code on GitHub:

1. Go to **Edge Functions** → **Settings**
2. Click **Connect to GitHub**
3. Select your repository
4. Supabase will auto-deploy functions on every push!

---

## Troubleshooting

### Can't deploy Edge Functions via Dashboard?

**Solution 1: Install Supabase CLI**
```powershell
# Install via npm
npm install -g supabase

# Or via Scoop (Windows)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

Then:
```powershell
cd yseven-backend
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy seo-crawler
supabase functions deploy seo-ai-analyzer
supabase functions deploy seo-auto-fix
supabase functions deploy seo-cron-daily
```

**Solution 2: Use GitHub Integration**
1. Push code to GitHub
2. Connect Supabase to GitHub
3. Auto-deploy on push

**Solution 3: Manual Copy-Paste**
1. Create function in Dashboard
2. Copy code from files
3. Paste and deploy

### SQL Migration Failed?

1. Check for syntax errors
2. Run in smaller chunks
3. Check table doesn't already exist
4. Review error message in SQL Editor

### Cron Job Not Running?

1. Check `pg_cron` extension is enabled
2. Verify URL and service key are correct
3. Check Edge Function logs
4. Test function manually first

### Dashboard Not Loading?

1. Check route is added to router
2. Verify Supabase credentials in `.env`
3. Check browser console for errors
4. Ensure you're logged in as admin

---

## Quick Start Checklist

- [ ] Run SQL migration in SQL Editor
- [ ] Deploy 4 Edge Functions
- [ ] Set environment variables (SITE_URL)
- [ ] Enable pg_cron extension
- [ ] Create cron job
- [ ] Test manual crawl
- [ ] Check database tables
- [ ] Add dashboard route
- [ ] Access dashboard
- [ ] Toggle AI Engine ON
- [ ] Click "Start Crawl"
- [ ] Watch issues appear!

---

## What Happens After Deployment?

### Immediately:
- ✅ Database tables created
- ✅ Edge Functions deployed
- ✅ System ready to use

### First Crawl (Manual or Cron):
- ✅ Crawls all pages (1-5 minutes)
- ✅ Detects SEO issues
- ✅ Stores in database
- ✅ Triggers AI analyzer
- ✅ Applies auto-fixes (if enabled)

### Daily (Automatic):
- ✅ Crawls at 2 AM
- ✅ Finds new issues
- ✅ Fixes automatically
- ✅ Learns from results
- ✅ Improves over time

---

## System Status Check

Run these queries in SQL Editor:

### Check if tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'seo_%';
```

Should return 20+ tables.

### Check crawl history:
```sql
SELECT * FROM seo_crawls 
ORDER BY started_at DESC 
LIMIT 5;
```

### Check issues:
```sql
SELECT severity, COUNT(*) 
FROM seo_issues 
WHERE status = 'open' 
GROUP BY severity;
```

### Check settings:
```sql
SELECT * FROM seo_settings;
```

---

## Need Help?

1. **Check Logs:** Supabase Dashboard → Edge Functions → Logs
2. **Check Tables:** Table Editor → Browse data
3. **Run Queries:** SQL Editor → Test queries
4. **Test Functions:** Edge Functions → Invoke manually

---

## Next Steps

1. ✅ Deploy system (follow steps above)
2. ✅ Run first crawl
3. ✅ Check dashboard
4. ✅ Enable AI Engine
5. ✅ Enable Auto-Fix
6. ✅ Monitor results
7. ✅ Watch SEO improve automatically!

---

**No CLI needed!** Everything works through the dashboard. 🚀

**Estimated Total Time:** 30 minutes
**Difficulty:** Easy (just copy-paste!)
