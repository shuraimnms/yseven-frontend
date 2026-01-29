import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Cookies from 'js-cookie';

const DebugPanel = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  const testEndpoints = async () => {
    setIsLoading(true);
    const results: any = {};

    try {
      // Test health endpoint
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://yseven-backend.onrender.com';
      const healthResponse = await fetch(`${baseUrl.replace('/api/v1', '')}/health`);
      results.health = {
        status: healthResponse.status,
        ok: healthResponse.ok,
        data: await healthResponse.json()
      };
    } catch (error: any) {
      results.health = { error: error.message };
    }

    try {
      // Test analytics endpoint
      const analyticsResponse = await adminAPI.analytics.getDashboard();
      results.analytics = {
        status: analyticsResponse.status,
        data: analyticsResponse.data
      };
    } catch (error: any) {
      results.analytics = {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      };
    }

    try {
      // Test orders endpoint
      const ordersResponse = await adminAPI.orders.getAll();
      results.orders = {
        status: ordersResponse.status,
        data: ordersResponse.data
      };
    } catch (error: any) {
      results.orders = {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      };
    }

    // Add auth info
    results.auth = {
      isAuthenticated,
      user: user ? { id: user.id, email: user.email, role: user.role } : null,
      accessToken: !!Cookies.get('accessToken'),
      refreshToken: !!Cookies.get('refreshToken')
    };

    setDebugInfo(results);
    setIsLoading(false);
  };

  return (
    <Card className="bg-charcoal border-gold/20 mb-6">
      <CardHeader>
        <CardTitle className="text-cream flex items-center justify-between">
          Debug Panel
          <Button 
            onClick={testEndpoints}
            disabled={isLoading}
            variant="outline" 
            size="sm"
            className="border-gold/30 text-cream hover:bg-gold/10"
          >
            {isLoading ? 'Testing...' : 'Test Endpoints'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {debugInfo && (
          <pre className="text-xs text-cream/80 bg-obsidian p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        )}
      </CardContent>
    </Card>
  );
};

export default DebugPanel;