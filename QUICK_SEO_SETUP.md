# Quick SEO System Setup

## Step 1: Run Database Migration

1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the entire content from `supabase/migrations/001_seo_system.sql`
3. Click "Run" to create all tables

## Step 2: Deploy Edge Functions

1. Go to Supabase Dashboard → Edge Functions
2. Create 4 new functions:

### Function 1: seo-crawler
- Copy code from `supabase/functions/seo-crawler/index.ts`
- Deploy

### Function 2: seo-ai-analyzer
- Copy code from `supabase/functions/seo-ai-analyzer/index.ts`
- Deploy

### Function 3: seo-auto-fix
- Copy code from `supabase/functions/seo-auto-fix/index.ts`
- Deploy

### Function 4: seo-cron-daily
- Copy code from `supabase/functions/seo-cron-daily/index.ts`
- Deploy

## Step 3: Copy Shared CORS File

For each function, also copy the `_shared/cors.ts` file:
- Copy code from `supabase/functions/_shared/cors.ts`

## Step 4: Set Environment Variables

In Supabase Dashboard → Edge Functions → Settings, add:
```
SITE_URL=https://ysevenfoods.com
```

## Step 5: Initialize Settings

Run this SQL in Supabase SQL Editor:
```sql
INSERT INTO seo_settings (key, value, description) VALUES
('ai_engine_enabled', 'true', 'Enable/disable AI SEO engine'),
('auto_fix_enabled', 'false', 'Enable/disable automatic fixes'),
('nvidia_api_key', '', 'NVIDIA API key for AI analysis (optional)'),
('crawl_frequency', '24', 'Hours between automatic crawls');
```

## Step 6: Access SEO Dashboard

1. Login to admin panel
2. Click "SEO Dashboard" in sidebar
3. Toggle "AI Engine" ON
4. Click "Start Crawl" to begin

## Done!

The system will now:
- Crawl your site when you click "Start Crawl"
- Detect SEO issues automatically
- Show issues in the dashboard
- Allow you to enable Auto-Fix for automatic corrections
