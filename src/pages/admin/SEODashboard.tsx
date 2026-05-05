/**
 * AUTONOMOUS AI SEO DASHBOARD
 * Enterprise-grade SEO monitoring and control center
 */

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Zap,
  Settings,
  Play,
  Pause,
  RefreshCw,
} from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface SEOHealth {
  overall_score: number;
  total_pages: number;
  pages_with_issues: number;
  critical_issues: number;
  pending_fixes: number;
  orphan_pages: number;
}

interface CrawlSession {
  id: string;
  started_at: string;
  completed_at: string | null;
  status: string;
  pages_crawled: number;
  issues_found: number;
  fixes_applied: number;
  duration_seconds: number | null;
}

interface Issue {
  id: string;
  issue_type: string;
  severity: string;
  title: string;
  description: string;
  impact_score: number;
  status: string;
  seo_pages: {
    url: string;
    title: string;
  };
}

export default function SEODashboard() {
  const [health, setHealth] = useState<SEOHealth | null>(null);
  const [recentCrawls, setRecentCrawls] = useState<CrawlSession[]>([]);
  const [topIssues, setTopIssues] = useState<Issue[]>([]);
  const [aiEngineEnabled, setAiEngineEnabled] = useState(true);
  const [autoFixEnabled, setAutoFixEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [crawling, setCrawling] = useState(false);

  useEffect(() => {
    loadDashboardData();
    
    // Subscribe to real-time updates
    const subscription = supabase
      .channel('seo_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'seo_crawls' }, () => {
        loadDashboardData();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function loadDashboardData() {
    try {
      // Get SEO health
      const { data: healthData } = await supabase.rpc('get_global_seo_health');
      setHealth(healthData);

      // Get recent crawls
      const { data: crawls } = await supabase
        .from('seo_crawls')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(5);
      setRecentCrawls(crawls || []);

      // Get top issues
      const { data: issues } = await supabase
        .from('seo_issues')
        .select('*, seo_pages(url, title)')
        .eq('status', 'open')
        .order('impact_score', { ascending: false })
        .limit(10);
      setTopIssues(issues || []);

      // Get settings
      const { data: aiSetting } = await supabase
        .from('seo_settings')
        .select('value')
        .eq('key', 'ai_engine_enabled')
        .single();
      setAiEngineEnabled(aiSetting?.value === true);

      const { data: autoFixSetting } = await supabase
        .from('seo_settings')
        .select('value')
        .eq('key', 'auto_fix_enabled')
        .single();
      setAutoFixEnabled(autoFixSetting?.value === true);

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleAIEngine(enabled: boolean) {
    setAiEngineEnabled(enabled);
    await supabase
      .from('seo_settings')
      .update({ value: enabled })
      .eq('key', 'ai_engine_enabled');
  }

  async function toggleAutoFix(enabled: boolean) {
    setAutoFixEnabled(enabled);
    await supabase
      .from('seo_settings')
      .update({ value: enabled })
      .eq('key', 'auto_fix_enabled');
  }

  async function startCrawl() {
    setCrawling(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/seo-crawler`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });
      
      if (response.ok) {
        await loadDashboardData();
      }
    } catch (error) {
      console.error('Error starting crawl:', error);
    } finally {
      setCrawling(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Autonomous AI SEO System</h1>
          <p className="text-muted-foreground">
            Enterprise-grade SEO automation and monitoring
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={startCrawl}
            disabled={crawling || !aiEngineEnabled}
            className="gap-2"
          >
            {crawling ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Crawling...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start Crawl
              </>
            )}
          </Button>
        </div>
      </div>

      {/* AI Engine Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            AI Engine Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">AI SEO Engine</p>
              <p className="text-sm text-muted-foreground">
                Enable autonomous SEO analysis and optimization
              </p>
            </div>
            <Switch
              checked={aiEngineEnabled}
              onCheckedChange={toggleAIEngine}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto-Fix Engine</p>
              <p className="text-sm text-muted-foreground">
                Automatically apply high-confidence SEO fixes
              </p>
            </div>
            <Switch
              checked={autoFixEnabled}
              onCheckedChange={toggleAutoFix}
              disabled={!aiEngineEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SEO Health Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {health?.overall_score?.toFixed(1) || 0}/100
            </div>
            <p className="text-xs text-muted-foreground">
              {health?.total_pages || 0} pages monitored
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {health?.critical_issues || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fixes</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {health?.pending_fixes || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval or execution
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pages with Issues</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {health?.pages_with_issues || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of {health?.total_pages || 0} total pages
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="issues" className="space-y-4">
        <TabsList>
          <TabsTrigger value="issues">Top Issues</TabsTrigger>
          <TabsTrigger value="crawls">Recent Crawls</TabsTrigger>
          <TabsTrigger value="fixes">Applied Fixes</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Priority Issues</CardTitle>
              <CardDescription>
                Issues ranked by impact score and severity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className="flex items-start justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            issue.severity === 'critical'
                              ? 'destructive'
                              : issue.severity === 'high'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {issue.severity}
                        </Badge>
                        <span className="font-medium">{issue.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {issue.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Page: {issue.seo_pages.url}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        Impact: {issue.impact_score}
                      </div>
                      <Button size="sm" variant="outline" className="mt-2">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crawls" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Crawl Sessions</CardTitle>
              <CardDescription>
                History of automated site crawls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCrawls.map((crawl) => (
                  <div
                    key={crawl.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {crawl.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : crawl.status === 'running' ? (
                          <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="font-medium capitalize">{crawl.status}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Started: {new Date(crawl.started_at).toLocaleString()}
                      </p>
                      {crawl.completed_at && (
                        <p className="text-sm text-muted-foreground">
                          Duration: {crawl.duration_seconds}s
                        </p>
                      )}
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-sm">
                        <span className="font-medium">{crawl.pages_crawled}</span> pages
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{crawl.issues_found}</span> issues
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{crawl.fixes_applied}</span> fixes
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fixes">
          <Card>
            <CardHeader>
              <CardTitle>Applied Fixes</CardTitle>
              <CardDescription>
                Recently applied SEO optimizations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Fix history will appear here...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                SEO performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Performance charts will appear here...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
