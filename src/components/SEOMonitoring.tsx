import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Search, 
  Users, 
  Eye, 
  MousePointer, 
  Clock,
  Target,
  BarChart3,
  Globe,
  Smartphone
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SEOMetrics {
  organicTraffic: number;
  keywordRankings: number;
  averagePosition: number;
  clickThroughRate: number;
  bounceRate: number;
  pageLoadTime: number;
  mobileScore: number;
  coreWebVitals: {
    lcp: number;
    fid: number;
    cls: number;
  };
}

interface KeywordRanking {
  keyword: string;
  position: number;
  previousPosition: number;
  searchVolume: number;
  difficulty: string;
  url: string;
}

const SEOMonitoring = () => {
  const [metrics, setMetrics] = useState<SEOMetrics>({
    organicTraffic: 0,
    keywordRankings: 0,
    averagePosition: 0,
    clickThroughRate: 0,
    bounceRate: 0,
    pageLoadTime: 0,
    mobileScore: 0,
    coreWebVitals: {
      lcp: 0,
      fid: 0,
      cls: 0
    }
  });

  const [topKeywords, setTopKeywords] = useState<KeywordRanking[]>([]);

  useEffect(() => {
    // Simulate fetching SEO metrics
    const fetchSEOMetrics = () => {
      // In a real implementation, this would fetch from Google Search Console API,
      // Google Analytics API, and other SEO monitoring tools
      setMetrics({
        organicTraffic: 15420,
        keywordRankings: 247,
        averagePosition: 8.3,
        clickThroughRate: 3.2,
        bounceRate: 42.1,
        pageLoadTime: 1.8,
        mobileScore: 96,
        coreWebVitals: {
          lcp: 2.1,
          fid: 85,
          cls: 0.08
        }
      });

      setTopKeywords([
        {
          keyword: 'premium hot sauce',
          position: 3,
          previousPosition: 5,
          searchVolume: 8900,
          difficulty: 'Medium',
          url: '/hot-sauces'
        },
        {
          keyword: 'peri peri sauce online',
          position: 1,
          previousPosition: 2,
          searchVolume: 5400,
          difficulty: 'Low',
          url: '/products/peri-peri'
        },
        {
          keyword: 'gourmet mayonnaise',
          position: 4,
          previousPosition: 7,
          searchVolume: 3200,
          difficulty: 'Medium',
          url: '/mayonnaise'
        },
        {
          keyword: 'sambal sauce recipes',
          position: 2,
          previousPosition: 3,
          searchVolume: 2800,
          difficulty: 'Low',
          url: '/blog/sambal-recipes'
        },
        {
          keyword: 'international sauce collection',
          position: 6,
          previousPosition: 8,
          searchVolume: 1900,
          difficulty: 'High',
          url: '/international'
        }
      ]);
    };

    fetchSEOMetrics();
    
    // Set up periodic updates (every 5 minutes in real implementation)
    const interval = setInterval(fetchSEOMetrics, 300000);
    
    return () => clearInterval(interval);
  }, []);

  const getPositionChange = (current: number, previous: number) => {
    const change = previous - current; // Lower position number is better
    if (change > 0) return { type: 'up', value: change };
    if (change < 0) return { type: 'down', value: Math.abs(change) };
    return { type: 'same', value: 0 };
  };

  const getCoreWebVitalStatus = (metric: string, value: number) => {
    switch (metric) {
      case 'lcp':
        if (value <= 2.5) return 'good';
        if (value <= 4.0) return 'needs-improvement';
        return 'poor';
      case 'fid':
        if (value <= 100) return 'good';
        if (value <= 300) return 'needs-improvement';
        return 'poor';
      case 'cls':
        if (value <= 0.1) return 'good';
        if (value <= 0.25) return 'needs-improvement';
        return 'poor';
      default:
        return 'good';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-500';
      case 'needs-improvement': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Organic Traffic</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.organicTraffic.toLocaleString()}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +23.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Keyword Rankings</CardTitle>
            <Search className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.keywordRankings}</div>
            <p className="text-xs text-blue-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +18 new rankings
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Avg. Position</CardTitle>
            <Target className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.averagePosition}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              -1.2 positions improved
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Click-Through Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.clickThroughRate}%</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.8% improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Core Web Vitals */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-yellow-500" />
            Core Web Vitals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Largest Contentful Paint</div>
              <div className={`text-2xl font-bold ${getStatusColor(getCoreWebVitalStatus('lcp', metrics.coreWebVitals.lcp))}`}>
                {metrics.coreWebVitals.lcp}s
              </div>
              <Badge className={`mt-2 ${getCoreWebVitalStatus('lcp', metrics.coreWebVitals.lcp) === 'good' ? 'bg-green-500' : getCoreWebVitalStatus('lcp', metrics.coreWebVitals.lcp) === 'needs-improvement' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                {getCoreWebVitalStatus('lcp', metrics.coreWebVitals.lcp)}
              </Badge>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">First Input Delay</div>
              <div className={`text-2xl font-bold ${getStatusColor(getCoreWebVitalStatus('fid', metrics.coreWebVitals.fid))}`}>
                {metrics.coreWebVitals.fid}ms
              </div>
              <Badge className={`mt-2 ${getCoreWebVitalStatus('fid', metrics.coreWebVitals.fid) === 'good' ? 'bg-green-500' : getCoreWebVitalStatus('fid', metrics.coreWebVitals.fid) === 'needs-improvement' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                {getCoreWebVitalStatus('fid', metrics.coreWebVitals.fid)}
              </Badge>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Cumulative Layout Shift</div>
              <div className={`text-2xl font-bold ${getStatusColor(getCoreWebVitalStatus('cls', metrics.coreWebVitals.cls))}`}>
                {metrics.coreWebVitals.cls}
              </div>
              <Badge className={`mt-2 ${getCoreWebVitalStatus('cls', metrics.coreWebVitals.cls) === 'good' ? 'bg-green-500' : getCoreWebVitalStatus('cls', metrics.coreWebVitals.cls) === 'needs-improvement' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                {getCoreWebVitalStatus('cls', metrics.coreWebVitals.cls)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Keywords */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center">
            <Search className="h-5 w-5 mr-2 text-blue-500" />
            Top Performing Keywords
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topKeywords.map((keyword, index) => {
              const change = getPositionChange(keyword.position, keyword.previousPosition);
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-white">{keyword.keyword}</div>
                    <div className="text-sm text-gray-400">{keyword.url}</div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-gray-400">Position</div>
                      <div className="font-bold text-white">#{keyword.position}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-gray-400">Change</div>
                      <div className={`font-bold flex items-center ${
                        change.type === 'up' ? 'text-green-500' : 
                        change.type === 'down' ? 'text-red-500' : 'text-gray-400'
                      }`}>
                        {change.type === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                        {change.type === 'down' && <TrendingUp className="h-3 w-3 mr-1 rotate-180" />}
                        {change.value > 0 ? change.value : '—'}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-gray-400">Volume</div>
                      <div className="font-bold text-white">{keyword.searchVolume.toLocaleString()}</div>
                    </div>
                    
                    <Badge variant={keyword.difficulty === 'Low' ? 'default' : keyword.difficulty === 'Medium' ? 'secondary' : 'destructive'}>
                      {keyword.difficulty}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Page Load Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.pageLoadTime}s</div>
            <p className="text-xs text-green-500">Excellent performance</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Mobile Score</CardTitle>
            <Smartphone className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.mobileScore}/100</div>
            <p className="text-xs text-green-500">Mobile optimized</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Bounce Rate</CardTitle>
            <Eye className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.bounceRate}%</div>
            <p className="text-xs text-green-500">Below industry average</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SEOMonitoring;