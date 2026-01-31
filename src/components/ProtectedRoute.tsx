import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, checkAuth, isLoading } = useAuthStore();
  const [isChecking, setIsChecking] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const initAuth = async () => {
      console.log('ProtectedRoute: Starting auth check...', { isAuthenticated, user: !!user });
      
      // Only check auth if we're not already authenticated
      if (!isAuthenticated || !user) {
        setIsChecking(true);
        await checkAuth();
        setIsChecking(false);
      }
      
      console.log('ProtectedRoute: Auth check complete', { isAuthenticated, user, requireAdmin });
    };
    initAuth();
  }, [checkAuth, isAuthenticated, user]);

  // Show loading while checking authentication
  if (isChecking || isLoading) {
    console.log('ProtectedRoute: Loading...', { isChecking, isLoading });
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cream/60">Checking authentication...</p>
        </div>
      </div>
    );
  }

  console.log('ProtectedRoute: Final check', { isAuthenticated, user: user?.role, requireAdmin });

  if (!isAuthenticated || !user) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    console.log('ProtectedRoute: Not admin, access denied', { userRole: user?.role });
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-cream mb-4">Access Denied</h1>
          <p className="text-cream/60 mb-6">You don't have permission to access this area.</p>
          <p className="text-cream/40 text-sm mb-6">Your role: {user?.role || 'Unknown'}</p>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-gold text-obsidian rounded-lg hover:bg-gold/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  console.log('ProtectedRoute: Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;