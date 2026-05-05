-- ============================================
-- SEO DATABASE FUNCTIONS
-- ============================================

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS get_global_seo_health();
DROP FUNCTION IF EXISTS get_recent_crawls(INTEGER);
DROP FUNCTION IF EXISTS get_issues_by_severity();
DROP FUNCTION IF EXISTS get_top_issues(INTEGER);

-- Function to get global SEO health metrics
CREATE OR REPLACE FUNCTION get_global_seo_health()
RETURNS TABLE (
  overall_score INTEGER,
  total_pages BIGINT,
  pages_with_issues BIGINT,
  critical_issues BIGINT,
  pending_fixes BIGINT,
  orphan_pages BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(AVG(p.seo_score)::INTEGER, 0) as overall_score,
    COUNT(DISTINCT p.id) as total_pages,
    COUNT(DISTINCT CASE WHEN i.id IS NOT NULL THEN p.id END) as pages_with_issues,
    COUNT(CASE WHEN i.severity = 'critical' AND i.status = 'open' THEN 1 END) as critical_issues,
    COUNT(CASE WHEN i.status = 'in_progress' THEN 1 END) as pending_fixes,
    COUNT(CASE WHEN p.is_orphan = true THEN 1 END) as orphan_pages
  FROM seo_pages p
  LEFT JOIN seo_issues i ON i.page_id = p.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recent crawl sessions
CREATE OR REPLACE FUNCTION get_recent_crawls(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  status TEXT,
  pages_crawled INTEGER,
  issues_found INTEGER,
  fixes_applied INTEGER,
  duration_seconds INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.started_at,
    c.completed_at,
    c.status,
    c.pages_crawled,
    c.issues_found,
    c.fixes_applied,
    c.duration_seconds
  FROM seo_crawls c
  ORDER BY c.started_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get issues by severity
CREATE OR REPLACE FUNCTION get_issues_by_severity()
RETURNS TABLE (
  severity TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.severity,
    COUNT(*)::BIGINT as count
  FROM seo_issues i
  WHERE i.status = 'open'
  GROUP BY i.severity
  ORDER BY 
    CASE i.severity
      WHEN 'critical' THEN 1
      WHEN 'high' THEN 2
      WHEN 'medium' THEN 3
      WHEN 'low' THEN 4
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get top issues
CREATE OR REPLACE FUNCTION get_top_issues(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  page_url TEXT,
  issue_type TEXT,
  severity TEXT,
  title TEXT,
  description TEXT,
  impact_score INTEGER,
  auto_fixable BOOLEAN,
  detected_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.id,
    p.url as page_url,
    i.issue_type,
    i.severity,
    i.title,
    i.description,
    i.impact_score,
    i.auto_fixable,
    i.detected_at
  FROM seo_issues i
  JOIN seo_pages p ON p.id = i.page_id
  WHERE i.status = 'open'
  ORDER BY 
    CASE i.severity
      WHEN 'critical' THEN 1
      WHEN 'high' THEN 2
      WHEN 'medium' THEN 3
      WHEN 'low' THEN 4
    END,
    i.impact_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
