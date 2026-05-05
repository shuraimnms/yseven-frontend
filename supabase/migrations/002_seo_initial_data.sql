-- Initialize SEO Settings with proper JSONB values and category
INSERT INTO seo_settings (key, value, category, description) VALUES
('ai_engine_enabled', 'true'::jsonb, 'engine', 'Enable/disable AI SEO engine'),
('auto_fix_enabled', 'false'::jsonb, 'engine', 'Enable/disable automatic fixes'),
('nvidia_api_key', '""'::jsonb, 'api', 'NVIDIA API key for AI analysis (optional)'),
('crawl_frequency', '24'::jsonb, 'crawler', 'Hours between automatic crawls'),
('max_crawl_depth', '10'::jsonb, 'crawler', 'Maximum depth for crawling'),
('max_pages_per_crawl', '1000'::jsonb, 'crawler', 'Maximum pages to crawl per session')
ON CONFLICT (key) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_seo_pages_url ON seo_pages(url);
CREATE INDEX IF NOT EXISTS idx_seo_pages_status ON seo_pages(status_code);
CREATE INDEX IF NOT EXISTS idx_seo_issues_severity ON seo_issues(severity);
CREATE INDEX IF NOT EXISTS idx_seo_issues_status ON seo_issues(status);
CREATE INDEX IF NOT EXISTS idx_seo_crawls_status ON seo_crawls(status);
CREATE INDEX IF NOT EXISTS idx_seo_internal_links_source ON seo_internal_links(source_page_id);
CREATE INDEX IF NOT EXISTS idx_seo_internal_links_target ON seo_internal_links(target_page_id);
