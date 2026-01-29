// Utility functions for API calls

// Get the API base URL from environment or fallback to production
export const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'https://yseven-backend.onrender.com/api/v1';
};

// Create a fetch wrapper that automatically uses the correct base URL
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = getApiBaseUrl();
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
  const baseUrl = getApiBaseUrl();
  const url = endpoint.startsWith('/') ? `${baseUrl}${endpoint}` : `${baseUrl}/${endpoint}`;
  
  // Get token from cookies
  const token = document.cookie.split('accessToken=')[1]?.split(';')[0] || '';
  
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