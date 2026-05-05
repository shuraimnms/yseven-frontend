-- ============================================
-- COMPLETE SEO SYSTEM SETUP
-- Run this entire file in Supabase SQL Editor
-- ============================================

-- Drop existing tables if they exist (clean slate)
DROP TABLE IF EXISTS seo_learning_data CASCADE;
DROP TABLE IF EXISTS seo_ai_recommendations CASCADE;
DROP TABLE IF EXISTS seo_content_gaps CASCADE;
DROP TABLE IF EXISTS seo_topic_clusters CASCADE;
DROP TABLE IF EXISTS seo_backlinks CASCADE;
DROP TABLE IF EXISTS seo_competitors CASCADE;
DROP TABLE IF EXISTS seo_keywords CASCADE;
DROP TABLE IF EXISTS seo_rankings CASCADE;
DROP TABLE IF EXISTS seo_scores CASCADE;
DROP TABLE IF EXISTS seo_change_history CASCADE;
DROP TABLE IF EXISTS seo_fixes CASCADE;
DROP TABLE IF EXISTS seo_internal_links CASCADE;
DROP TABLE IF EXISTS seo_issues CASCADE;
DROP TABLE IF EXISTS seo_pages CASCADE;
DROP TABLE IF EXISTS seo_crawls CASCADE;
DROP TABLE IF EXISTS seo_settings CASCADE;

-- ============================================
-- 1. SEO SETTINGS TABLE
-- ============================================
CREATE TABLE seo_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. SEO CRAWLS TABLE
-- ============================================
CREATE TABLE seo_crawls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'running',
  pages_crawled INTEGER DEFAULT 0,
  issues_found INTEGER DEFAULT 0,
  fixes_applied INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  crawl_config JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. SEO PAGES TABLE
-- ============================================
CREATE TABLE seo_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT UNIQUE NOT NULL,
  path TEXT NOT NULL,
  title TEXT,
  meta_description TEXT,
  h1 TEXT,
  canonical_url TEXT,
  status_code INTEGER,
  content_hash TEXT,
  word_count INTEGER,
  depth INTEGER DEFAULT 0,
  is_indexable BOOLEAN DEFAULT TRUE,
  is_orphan BOOLEAN DEFAULT FALSE,
  last_crawled_at TIMESTAMPTZ,
  seo_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. SEO ISSUES TABLE
-- ============================================
CREATE TABLE seo_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES seo_pages(id) ON DELETE CASCADE,
  crawl_id UUID REFERENCES seo_crawls(id) ON DELETE CASCADE,
  issue_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  impact_score INTEGER DEFAULT 0,
  current_value TEXT,
  recommended_value TEXT,
  auto_fixable BOOLEAN DEFAULT FALSE,
  confidence_score DECIMAL(3,2) DEFAULT 0.0,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'fixed', 'ignored', 'in_progress')),
  fix_priority INTEGER DEFAULT 0,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  fixed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. SEO INTERNAL LINKS TABLE
-- ============================================
CREATE TABLE seo_internal_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_page_id UUID REFERENCES seo_pages(id) ON DELETE CASCADE,
  target_page_id UUID REFERENCES seo_pages(id) ON DELETE CASCADE,
  anchor_text TEXT,
  link_position TEXT,
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. SEO FIXES TABLE
-- ============================================
CREATE TABLE seo_fixes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID REFERENCES seo_issues(id) ON DELETE CASCADE,
  fix_type TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  applied_by TEXT DEFAULT 'ai_engine',
  success BOOLEAN DEFAULT TRUE,
  rollback_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. SEO CHANGE HISTORY TABLE
-- ============================================
CREATE TABLE seo_change_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES seo_pages(id) ON DELETE CASCADE,
  change_type TEXT NOT NULL,
  field_name TEXT,
  old_value TEXT,
  new_value TEXT,
  changed_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. SEO SCORES TABLE
-- ============================================
CREATE TABLE seo_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES seo_pages(id) ON DELETE CASCADE,
  overall_score INTEGER DEFAULT 0,
  technical_score INTEGER DEFAULT 0,
  content_score INTEGER DEFAULT 0,
  performance_score INTEGER DEFAULT 0,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. SEO RANKINGS TABLE
-- ============================================
CREATE TABLE seo_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES seo_pages(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  position INTEGER,
  search_volume INTEGER,
  tracked_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. SEO KEYWORDS TABLE
-- ============================================
CREATE TABLE seo_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT UNIQUE NOT NULL,
  search_volume INTEGER,
  difficulty INTEGER,
  target_page_id UUID REFERENCES seo_pages(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 11. SEO COMPETITORS TABLE
-- ============================================
CREATE TABLE seo_competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL,
  page_url TEXT,
  keyword TEXT,
  position INTEGER,
  analyzed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 12. SEO BACKLINKS TABLE
-- ============================================
CREATE TABLE seo_backlinks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_page_id UUID REFERENCES seo_pages(id) ON DELETE CASCADE,
  source_url TEXT NOT NULL,
  anchor_text TEXT,
  domain_authority INTEGER,
  is_toxic BOOLEAN DEFAULT FALSE,
  discovered_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 13. SEO TOPIC CLUSTERS TABLE
-- ============================================
CREATE TABLE seo_topic_clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_name TEXT NOT NULL,
  pillar_page_id UUID REFERENCES seo_pages(id) ON DELETE SET NULL,
  cluster_pages JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 14. SEO CONTENT GAPS TABLE
-- ============================================
CREATE TABLE seo_content_gaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  keyword TEXT,
  priority INTEGER DEFAULT 0,
  suggested_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 15. SEO AI RECOMMENDATIONS TABLE
-- ============================================
CREATE TABLE seo_ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES seo_pages(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  current_state TEXT,
  recommended_action TEXT,
  expected_impact TEXT,
  confidence_score DECIMAL(3,2) DEFAULT 0.0,
  priority INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 16. SEO LEARNING DATA TABLE
-- ============================================
CREATE TABLE seo_learning_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL,
  page_id UUID REFERENCES seo_pages(id) ON DELETE CASCADE,
  before_score INTEGER,
  after_score INTEGER,
  ranking_change INTEGER,
  success BOOLEAN,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INSERT INITIAL SETTINGS
-- ============================================
INSERT INTO seo_settings (key, value, category, description) VALUES
('ai_engine_enabled', 'true'::jsonb, 'engine', 'Enable/disable AI SEO engine'),
('auto_fix_enabled', 'false'::jsonb, 'engine', 'Enable/disable automatic fixes'),
('nvidia_api_key', '""'::jsonb, 'api', 'NVIDIA API key for AI analysis (optional)'),
('crawl_frequency', '24'::jsonb, 'crawler', 'Hours between automatic crawls'),
('max_crawl_depth', '10'::jsonb, 'crawler', 'Maximum depth for crawling'),
('max_pages_per_crawl', '1000'::jsonb, 'crawler', 'Maximum pages to crawl per session')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- CREATE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_seo_pages_url ON seo_pages(url);
CREATE INDEX IF NOT EXISTS idx_seo_pages_status ON seo_pages(status_code);
CREATE INDEX IF NOT EXISTS idx_seo_issues_severity ON seo_issues(severity);
CREATE INDEX IF NOT EXISTS idx_seo_issues_status ON seo_issues(status);
CREATE INDEX IF NOT EXISTS idx_seo_crawls_status ON seo_crawls(status);
CREATE INDEX IF NOT EXISTS idx_seo_internal_links_source ON seo_internal_links(source_page_id);
CREATE INDEX IF NOT EXISTS idx_seo_internal_links_target ON seo_internal_links(target_page_id);

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_crawls ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_internal_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_fixes ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_change_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_backlinks ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_topic_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_content_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_learning_data ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE RLS POLICIES (Allow authenticated users)
-- ============================================
CREATE POLICY "Allow authenticated read access" ON seo_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON seo_crawls FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON seo_pages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON seo_issues FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON seo_internal_links FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON seo_fixes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON seo_change_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON seo_scores FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON seo_rankings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON seo_keywords FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON seo_competitors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON seo_backlinks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON seo_topic_clusters FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON seo_content_gaps FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON seo_ai_recommendations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON seo_learning_data FOR SELECT TO authenticated USING (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access" ON seo_settings FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service role full access" ON seo_crawls FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service role full access" ON seo_pages FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service role full access" ON seo_issues FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service role full access" ON seo_internal_links FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service role full access" ON seo_fixes FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service role full access" ON seo_change_history FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service role full access" ON seo_scores FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service role full access" ON seo_rankings FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service role full access" ON seo_keywords FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service role full access" ON seo_competitors FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service role full access" ON seo_backlinks FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service role full access" ON seo_topic_clusters FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service role full access" ON seo_content_gaps FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service role full access" ON seo_ai_recommendations FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service role full access" ON seo_learning_data FOR ALL TO service_role USING (true);

-- ============================================
-- DONE! SEO System is ready
-- ============================================
