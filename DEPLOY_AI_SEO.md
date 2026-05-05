# 🚀 Deploy Autonomous AI SEO System

## All files are now in `yseven-frontend` folder!

---

## ✅ Quick Deploy (3 Steps)

### Step 1: Deploy Database (5 min)

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **New Query**
3. Open file: `yseven-frontend/supabase/migrations/001_seo_system.sql`
4. **Copy ALL the SQL** (entire file)
5. **Paste** into SQL Editor
6. Click **Run**
7. Wait for "Success" ✅

### Step 2: Deploy Edge Functions (10 min)

**Option A: Via Supabase Dashboard**
1. Go to **Edge Functions** → **Create function**
2. Deploy these 4 functions:

**Function 1: seo-crawler**
- Name: `seo-crawler`
- Code: Copy from `supabase/functions/seo-crawler/index.ts`
- Click **Deploy**

**Function 2: seo-ai-analyzer**
- Name: `seo-ai-analyzer`
- Code: Copy from `supabase/functions/seo-ai-analyzer/index.ts`
- Click **Deploy**

**Function 3: seo-auto-fix**
- Name: `seo-auto-fix`
- Code: Copy from `supabase/functions/seo-auto-fix/index.ts`
- Click **Deploy**

**Function 4: seo-cron-daily**
- Name: `seo-cron-daily`
- Code: Copy from `supabase/functions/seo-cron-daily/index.ts`
- Click **Deploy**

**Option B: Via CLI (if you have it)**
```bash
cd yseven-frontend
supabase functions deploy seo-crawler
supabase functions deploy seo-ai-analyzer
supabase functions deploy seo-auto-fix
supabase functions deploy seo-cron-daily
```

### Step 3: Set Environment Variables (2 min)

1. Go to **Settings** → **Edge Functions** → **Secrets**
2. Add:
```
SITE_URL = https://ysevenfoods.com
```

Optional (for AI features):
```
NVIDIA_API_KEY = your_nvidia_key
```

---

## ✅ Test It Works

### Test 1: Manual Crawl
1. Go to **Edge Functions** → `seo-crawler`
2. Click **Invoke**
3. Body: `{}`
4. Click **Send**
5. Should see: `{"success": true, "pagesProcessed": 25}`

### Test 2: Check Database
1. Go to **Table Editor**
2. Open `seo_pages` table
3. You should see your pages!

### Test 3: Access Dashboard
1. Go to: `http://localhost:5173/admin/seo`
2. Toggle **AI Engine ON**
3. Click **Start Crawl**
4. Watch issues appear!

---

## 📁 File Structure

```
yseven-frontend/
├── supabase/
│   ├── migrations/
│   │   └── 001_seo_system.sql          ← Database schema
│   └── functions/
│       ├── seo-crawler/
│       │   └── index.ts                ← Crawler engine
│       ├── seo-ai-analyzer/
│       │   └── index.ts                ← AI analyzer
│       ├── seo-auto-fix/
│       │   └── index.ts                ← Auto-fix engine
│       ├── seo-cron-daily/
│       │   └── index.ts                ← Cron scheduler
│       └── _shared/
│           └── cors.ts                 ← CORS headers
├── src/
│   └── pages/
│       └── admin/
│           └── SEODashboard.tsx        ← Admin dashboard
├── SEO_SYSTEM_README.md                ← Full documentation
└── MANUAL_DEPLOY_SEO.md                ← Detailed manual deploy guide
```

---

## 🎯 What Happens After Deploy

1. **Database:** 20+ tables created for SEO data
2. **Functions:** 4 Edge Functions deployed
3. **Dashboard:** Access at `/admin/seo`
4. **Cron:** Set up daily crawl (optional)

---

## 🔧 Optional: Setup Cron Job

1. Go to **Database** → **Extensions**
2. Enable `pg_cron`
3. Go to **SQL Editor**
4. Run:

```sql
SELECT cron.schedule(
  'daily-seo-crawl',
  '0 2 * * *',
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT.supabase.co/functions/v1/seo-cron-daily',
    headers := '{"Authorization": "Bearer YOUR_SERVICE_KEY"}'::jsonb
  );
  $$
);
```

Replace:
- `YOUR_PROJECT` with your project ref
- `YOUR_SERVICE_KEY` with service role key

---

## 🎛️ Dashboard Controls

Access: `http://localhost:5173/admin/seo`

**Controls:**
- ✅ **AI Engine Toggle** - Turn system ON/OFF
- ✅ **Auto-Fix Toggle** - Enable/disable automatic fixes
- ✅ **Start Crawl Button** - Manual crawl trigger
- ✅ **Real-time Monitoring** - Live issue tracking

---

## 📊 Check System Status

Run in SQL Editor:

```sql
-- Check health
SELECT * FROM get_global_seo_health();

-- Check recent crawls
SELECT * FROM seo_crawls ORDER BY started_at DESC LIMIT 5;

-- Check issues
SELECT severity, COUNT(*) FROM seo_issues WHERE status = 'open' GROUP BY severity;

-- Check settings
SELECT * FROM seo_settings;
```

---

## 🚨 Troubleshooting

### Functions not deploying?
- Check code has no syntax errors
- Try deploying one at a time
- Check Supabase logs

### Database migration failed?
- Run SQL in smaller chunks
- Check for existing tables
- Review error message

### Dashboard not loading?
- Check route added to App.tsx
- Verify Supabase credentials
- Check browser console

---

## 📞 Need Help?

**Read these files:**
- `SEO_SYSTEM_README.md` - Complete system documentation
- `MANUAL_DEPLOY_SEO.md` - Detailed deployment guide

**Check:**
- Supabase Dashboard → Edge Functions → Logs
- Supabase Dashboard → Table Editor
- Browser Console (F12)

---

## ✅ Deployment Checklist

- [ ] Run SQL migration (001_seo_system.sql)
- [ ] Deploy 4 Edge Functions
- [ ] Set SITE_URL environment variable
- [ ] Test manual crawl
- [ ] Check database tables
- [ ] Access dashboard at /admin/seo
- [ ] Toggle AI Engine ON
- [ ] Click "Start Crawl"
- [ ] Watch SEO improve automatically!

---

**Everything is ready!** Just follow the 3 steps above. 🚀

**Estimated Time:** 20 minutes
**Difficulty:** Easy (copy-paste!)
