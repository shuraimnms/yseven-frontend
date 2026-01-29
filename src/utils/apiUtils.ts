// Utility functions for API calls

// Get the API base URL from environment or fallback to production
export const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'https://yseven-backend.onrender.com';
};

// Get the full API base URL with /api/v1 suffix
export const getFullApiBaseUrl = () => {
  return `${getApiBaseUrl()}/api/v1`;
};

// Create a fetch wrapper that automatically uses the correct base URL
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = getFullApiBaseUrl();
  const url = endpoint.startsWith('/') ? `${baseUrl}${endpoint}` : `${baseUrl}/${endpoint}`;
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
};

// Create an authenticated fetch wrapper for admin endpoints
export const authApiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = getFullApiBaseUrl();
  const url = endpoint.startsWith('/') ? `${baseUrl}${endpoint}` : `${baseUrl}/${endpoint}`;
  
  // Get token from localStorage and cookies
  const token = localStorage.getItem('token') || document.cookie.split('accessToken=')[1]?.split(';')[0] || '';
  
  return fetch(url, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });
};

// Health check function for server status
export const healthCheck = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${getApiBaseUrl()}/health`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    return response.ok && response.status === 200;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};