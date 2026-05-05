-- ============================================================
-- AUTONOMOUS AI SEO OPERATING SYSTEM - DATABASE SCHEMA
-- Enterprise-grade SEO automation infrastructure
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- ============================================================
-- CORE SEO PAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS seo_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL UNIQUE,
  path TEXT NOT NULL,
  title TEXT,
  meta_description TEXT,
  h1 TEXT,
  canonical_url TEXT,
  status_code INTEGER,
  content_hash TEXT,
  word_count INTEGER DEFAULT 0,
  last_crawled_at TIMESTAMPTZ,
  last_modified_at TIMESTAMPTZ,
  is_indexable BOOLEAN DEFAULT true,
  is_orphan BOOLEAN DEFAULT false,
  depth INTEGER DEFAULT 0,
  page_type TEXT, -- product, category, blog, static
  seo_score DECIMAL(5,2) DEFAULT 0,
  performance_score DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_seo_pages_url ON seo_pages(url);
CREATE INDEX idx_seo_pages_path ON seo_pages(path);
CREATE INDEX idx_seo_pages_score ON seo_pages(seo_score DESC);
CREATE INDEX idx_seo_pages_orphan ON seo_pages(is_orphan) WHERE is_orphan = true;
CREATE INDEX idx_seo_pages_crawled ON seo_pages(last_crawled_at DESC);

-- ============================================================
-- CRAWL SESSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS seo_crawls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'running', -- running, completed, failed
  pages_crawled INTEGER DEFAULT 0,
  issues_found INTEGER DEFAULT 0,
  fixes_applied INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  error_message TEXT,
  crawl_config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_seo_crawls_status ON seo_crawls(status);
CREATE INDEX idx_seo_crawls_started ON seo_crawls(started_at DESC);

-- ============================================================
-- SEO ISSUES
-- ============================================================
CREATE TABLE IF NOT EXISTS seo_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES seo_pages(id) ON DELETE CASCADE,
  crawl_id UUID REFERENCES seo_crawls(id) ON DELETE SET NULL,
  issue_type TEXT NOT NULL, -- broken_link, missing_meta, duplicate_content, etc.
  severity TEXT NOT NULL, -- critical, high, medium, low
  category TEXT NOT NULL, -- technical, content, links, performance
  title TEXT NOT NULL,
  description TEXT,
  impact_score DECIMAL(5,2) DEFAULT 0,
  fix_priority INTEGER DEFAULT 0,
  current_value TEXT,
  recommended_value TEXT,
  status TEXT DEFAULT 'open', -- open, fixed, ignored, in_progress
  auto_fixable BOOLEAN DEFAULT false,
  confidence_score DECIMAL(5,2) DEFAULT 0,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  fixed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_seo_issues_page ON seo_issues(page_id);
CREATE INDEX idx_seo_issues_status ON seo_issues(status);
CREATE INDEX idx_seo_issues_severity ON seo_issues(severity);
CREATE INDEX idx_seo_issues_type ON seo_issues(issue_type);
CREATE INDEX idx_seo_issues_priority ON seo_issues(fix_priority DESC);

-- ============================================================
-- SEO FIXES
-- ============================================================
CREATE TABLE IF NOT EXISTS seo_fixes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID REFERENCES seo_issues(id) ON DELETE CASCADE,
  page_id UUID REFERENCES seo_pages(id) ON DELETE CASCADE,
  fix_type TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  applied_by TEXT DEFAULT 'ai_engine', -- ai_engine, manual, scheduled
  status TEXT DEFAULT 'pending', -- pending, applied, rolled_back, failed
  rollback_data JSONB,
  impact_prediction JSONB,
  actual_impact JSONB,
  approval_required BOOLEAN DEFAULT false,
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_seo_fixes_issue ON seo_fixes(issue_id);
CREATE INDEX idx_seo_fixes_page ON seo_fixes(page_id);
CREATE INDEX idx_seo_fixes_status ON seo_fixes(status);
CREATE INDEX idx_seo_fixes_applied ON seo_fixes(applied_at DESC);

-- ============================================================
-- CHANGE HISTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS seo_change_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES seo_pages(id) ON DELETE CASCADE,
  fix_id UUID REFERENCES seo_fixes(id) ON DELETE SET NULL,
  field_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  change_type TEXT NOT NULL, -- update, insert, delete
  changed_by TEXT DEFAULT 'ai_engine',
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  rollback_available BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_seo_history_page ON seo_change_history(page_id);
CREATE INDEX idx_seo_history_changed ON seo_change_history(changed_at DESC);

-- ============================================================
-- SEO SCORES
-- ============================================================
CREATE TABLE IF NOT EXISTS seo_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES seo_pages(id) ON DELETE CASCADE,
  overall_score DECIMAL(5,2) DEFAULT 0,
  technical_score DECIMAL(5,2) DEFAULT 0,
  content_score DECIMAL(5,2) DEFAULT 0,
  links_score DECIMAL(5,2) DEFAULT 0,
  performance_score DECIMAL(5,2) DEFAULT 0,
  mobile_score DECIMAL(5,2) DEFAULT 0,
  score_breakdown JSONB DEFAULT '{}',
  recommendations JSONB DEFAULT '[]',
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_seo_scores_page ON seo_scores(page_id);
CREATE INDEX idx_seo_scores_overall ON seo_scores(overall_score DESC);
CREATE INDEX idx_seo_scores_calculated ON seo_scores(calculated_at DESC);

-- ============================================================
-- KEYWORDS & RANKINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS seo_keywords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  keyword TEXT NOT NULL,
  search_volume INTEGER DEFAULT 0,
  difficulty INTEGER DEFAULT 0,
  target_url TEXT,
  current_position INTEGER,
  previous_position INTEGER,
  best_position INTEGER,
  tracked_since TIMESTAMPTZ DEFAULT NOW(),
  last_checked_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active', -- active, paused, archived
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_seo_keywords_keyword ON seo_keywords(keyword);
CREATE INDEX idx_seo_keywords_position ON seo_keywords(current_position);
CREATE INDEX idx_seo_keywords_status ON seo_keywords(status);

CREATE TABLE IF NOT EXISTS seo_rankings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  keyword_id UUID REFERENCES seo_keywords(id) ON DELETE CASCADE,
  page_id UUID REFERENCES seo_pages(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  url TEXT NOT NULL,
  search_volume INTEGER,
  checked_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_seo_rankings_keyword ON seo_rankings(keyword_id);
CREATE INDEX idx_seo_rankings_page ON seo_rankings(page_id);
CREATE INDEX idx_seo_rankings_checked ON seo_rankings(checked_at DESC);

-- ============================================================
-- INTERNAL LINKS
-- ============================================================
CREATE TABLE IF NOT EXISTS seo_internal_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_page_id UUID REFERENCES seo_pages(id) ON DELETE CASCADE,
  target_page_id UUID REFERENCES seo_pages(id) ON DELETE CASCADE,
  anchor_text TEXT,
  link_position TEXT, -- header, content, footer, sidebar
  is_nofollow BOOLEAN DEFAULT false,
  link_strength DECIMAL(5,2) DEFAULT 1.0,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active', -- active, broken, removed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(source_page_id, target_page_id, anchor_text)
);

CREATE INDEX idx_seo_links_source ON seo_internal_links(source_page_id);
CREATE INDEX idx_seo_links_target ON seo_internal_links(target_page_id);
CREATE INDEX idx_seo_links_status ON seo_internal_links(status);

-- ============================================================
-- BACKLINKS
-- ============================================================
CREATE TABLE IF NOT EXISTS seo_backlinks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  target_page_id UUID REFERENCES seo_pages(id) ON DELETE CASCADE,
  source_url TEXT NOT NULL,
  source_domain TEXT NOT NULL,
  anchor_text TEXT,
  link_type TEXT, -- dofollow, nofollow, ugc, sponsored
  domain_authority INTEGER,
  page_authority INTEGER,
  spam_score INTEGER DEFAULT 0,
  is_toxic BOOLEAN DEFAULT false,
  first_seen_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active', -- active, lost, new
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_seo_backlinks_target ON seo_backlinks(target_page_id);
CREATE INDEX idx_seo_backlinks_domain ON seo_backlinks(source_domain);
CREATE INDEX idx_seo_backlinks_status ON seo_backlinks(status);
CREATE INDEX idx_seo_backlinks_toxic ON seo_backlinks(is_toxic) WHERE is_toxic = true;

-- ============================================================
-- TOPIC CLUSTERS
-- ============================================================
CREATE TABLE IF NOT EXISTS seo_topic_clusters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  pillar_page_id UUID REFERENCES seo_pages(id) ON DELETE SET NULL,
  topic_keywords TEXT[] DEFAULT '{}',
  authority_score DECIMAL(5,2) DEFAULT 0,
  completeness_score DECIMAL(5,2) DEFAULT 0,
  status TEXT DEFAULT 'active',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_seo_clusters_name ON seo_topic_clusters(name);
CREATE INDEX idx_seo_clusters_authority ON seo_topic_clusters(authority_score DESC);

CREATE TABLE IF NOT EXISTS seo_cluster_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cluster_id UUID REFERENCES seo_topic_clusters(id) ON DELETE CASCADE,
  page_id UUID REFERENCES seo_pages(id) ON DELETE CASCADE,
  page_role TEXT, -- pillar, supporting, related
  relevance_score DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cluster_id, page_id)
);

CREATE INDEX idx_seo_cluster_pages_cluster ON seo_cluster_pages(cluster_id);
CREATE INDEX idx_seo_cluster_pages_page ON seo_cluster_pages(page_id);

-- ============================================================
-- CONTENT GAPS
-- ============================================================
CREATE TABLE IF NOT EXISTS seo_content_gaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cluster_id UUID REFERENCES seo_topic_clusters(id) ON DELETE CASCADE,
  gap_type TEXT NOT NULL, -- missing_topic, thin_content, missing_keyword
  title TEXT NOT NULL,
  description TEXT,
  target_keywords TEXT[] DEFAULT '{}',
  search_volume INTEGER DEFAULT 0,
  difficulty INTEGER DEFAULT 0,
  priority_score DECIMAL(5,2) DEFAULT 0,
  status TEXT DEFAULT 'identified', -- identified, planned, in_progress, completed
  recommended_content JSONB,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_seo_gaps_cluster ON seo_content_gaps(cluster_id);
CREATE INDEX idx_seo_gaps_status ON seo_content_gaps(status);
CREATE INDEX idx_seo_gaps_priority ON seo_content_gaps(priority_score DESC);

-- ============================================================
-- COMPETITORS
-- ============================================================
CREATE TABLE IF NOT EXISTS seo_competitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain TEXT NOT NULL UNIQUE,
  name TEXT,
  domain_authority INTEGER,
  organic_traffic INTEGER,
  ranking_keywords INTEGER,
  backlinks_count INTEGER,
  status TEXT DEFAULT 'active',
  last_analyzed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_seo_competitors_domain ON seo_competitors(domain);
CREATE INDEX idx_seo_competitors_authority ON seo_competitors(domain_authority DESC);

CREATE TABLE IF NOT EXISTS seo_competitor_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competitor_id UUID REFERENCES seo_competitors(id) ON DELETE CASCADE,
  our_page_id UUID REFERENCES seo_pages(id) ON DELETE CASCADE,
  competitor_url TEXT NOT NULL,
  keyword TEXT,
  their_position INTEGER,
  our_position INTEGER,
  content_gap_analysis JSONB,
  outrank_strategy JSONB,
  analyzed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_seo_comp_pages_competitor ON seo_competitor_pages(competitor_id);
CREATE INDEX idx_seo_comp_pages_our_page ON seo_competitor_pages(our_page_id);

-- ============================================================
-- AI RECOMMENDATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS seo_ai_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES seo_pages(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  current_state TEXT,
  recommended_action TEXT,
  expected_impact JSONB,
  confidence_score DECIMAL(5,2) DEFAULT 0,
  priority INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected, applied
  applied_at TIMESTAMPTZ,
  result JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_seo_ai_recs_page ON seo_ai_recommendations(page_id);
CREATE INDEX idx_seo_ai_recs_status ON seo_ai_recommendations(status);
CREATE INDEX idx_seo_ai_recs_priority ON seo_ai_recommendations(priority DESC);
CREATE INDEX idx_seo_ai_recs_confidence ON seo_ai_recommendations(confidence_score DESC);

-- ============================================================
-- LEARNING & PERFORMANCE
-- ============================================================
CREATE TABLE IF NOT EXISTS seo_learning_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fix_id UUID REFERENCES seo_fixes(id) ON DELETE CASCADE,
  page_id UUID REFERENCES seo_pages(id) ON DELETE CASCADE,
  optimization_type TEXT NOT NULL,
  before_metrics JSONB DEFAULT '{}',
  after_metrics JSONB DEFAULT '{}',
  improvement_score DECIMAL(5,2),
  ranking_change INTEGER,
  traffic_change INTEGER,
  conversion_change DECIMAL(5,2),
  success_rating INTEGER, -- 1-5
  learned_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_seo_learning_fix ON seo_learning_data(fix_id);
CREATE INDEX idx_seo_learning_page ON seo_learning_data(page_id);
CREATE INDEX idx_seo_learning_type ON seo_learning_data(optimization_type);
CREATE INDEX idx_seo_learning_success ON seo_learning_data(success_rating DESC);

-- ============================================================
-- SYSTEM SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS seo_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_seo_settings_key ON seo_settings(key);
CREATE INDEX idx_seo_settings_category ON seo_settings(category);

-- Insert default settings
INSERT INTO seo_settings (key, value, category, description) VALUES
  ('ai_engine_enabled', 'true', 'system', 'Enable/disable AI SEO engine'),
  ('auto_fix_enabled', 'true', 'automation', 'Enable automatic fixes'),
  ('crawl_frequency', '"daily"', 'crawler', 'Crawl frequency: hourly, daily, weekly'),
  ('max_crawl_depth', '10', 'crawler', 'Maximum crawl depth'),
  ('approval_threshold', '0.8', 'automation', 'Confidence threshold for auto-approval'),
  ('nvidia_api_key', '""', 'ai', 'NVIDIA API key for AI analysis'),
  ('site_url', '"https://ysevenfoods.com"', 'system', 'Primary site URL')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- JOB QUEUE
-- ============================================================
CREATE TABLE IF NOT EXISTS seo_job_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_type TEXT NOT NULL,
  priority INTEGER DEFAULT 0,
  payload JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending', -- pending, running, completed, failed
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  scheduled_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_seo_jobs_status ON seo_job_queue(status);
CREATE INDEX idx_seo_jobs_priority ON seo_job_queue(priority DESC, scheduled_at);
CREATE INDEX idx_seo_jobs_type ON seo_job_queue(job_type);

-- ============================================================
-- AUDIT LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS seo_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  user_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  changes JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_seo_audit_action ON seo_audit_logs(action);
CREATE INDEX idx_seo_audit_entity ON seo_audit_logs(entity_type, entity_id);
CREATE INDEX idx_seo_audit_created ON seo_audit_logs(created_at DESC);

-- ============================================================
-- TRIGGERS FOR AUTO-UPDATE
-- ============================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_seo_pages_updated_at BEFORE UPDATE ON seo_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seo_topic_clusters_updated_at BEFORE UPDATE ON seo_topic_clusters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE seo_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_crawls ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_fixes ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

-- Admin-only access
CREATE POLICY "Admin full access seo_pages" ON seo_pages FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access seo_crawls" ON seo_crawls FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access seo_issues" ON seo_issues FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access seo_fixes" ON seo_fixes FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access seo_settings" ON seo_settings FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================
-- UTILITY FUNCTIONS
-- ============================================================

-- Get global SEO health score
CREATE OR REPLACE FUNCTION get_global_seo_health()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'overall_score', COALESCE(AVG(seo_score), 0),
    'total_pages', COUNT(*),
    'pages_with_issues', COUNT(*) FILTER (WHERE seo_score < 70),
    'critical_issues', (SELECT COUNT(*) FROM seo_issues WHERE severity = 'critical' AND status = 'open'),
    'pending_fixes', (SELECT COUNT(*) FROM seo_fixes WHERE status = 'pending'),
    'orphan_pages', COUNT(*) FILTER (WHERE is_orphan = true)
  ) INTO result
  FROM seo_pages;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Calculate page SEO score
CREATE OR REPLACE FUNCTION calculate_page_seo_score(page_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
  score DECIMAL := 100;
  issue_count INTEGER;
BEGIN
  -- Deduct points for issues
  SELECT COUNT(*) INTO issue_count
  FROM seo_issues
  WHERE page_id = page_uuid AND status = 'open';
  
  score := score - (issue_count * 5);
  
  -- Ensure score is between 0 and 100
  score := GREATEST(0, LEAST(100, score));
  
  RETURN score;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- COMMENTS
-- ============================================================

COMMENT ON TABLE seo_pages IS 'Core pages table with SEO metadata';
COMMENT ON TABLE seo_crawls IS 'Crawl session tracking';
COMMENT ON TABLE seo_issues IS 'Detected SEO issues';
COMMENT ON TABLE seo_fixes IS 'Applied SEO fixes with rollback support';
COMMENT ON TABLE seo_learning_data IS 'ML training data from fix outcomes';
COMMENT ON TABLE seo_settings IS 'System configuration';
