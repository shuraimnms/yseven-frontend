// Utility functions for API calls

// Get the API base URL from environment or fallback to local development
export const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';
};

// Create a fetch wrapper that automatically uses the correct base URL with better error handling
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = getApiBaseUrl();
  const url = endpoint.startsWith('/') ? `${baseUrl}${endpoint}` : `${baseUrl}/${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  // Check if response is JSON before parsing
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response;
  } else {
    // If we got HTML instead of JSON, it's likely an error page
    const text = await response.text();
    if (text.includes('<!doctype') || text.includes('<html')) {
      throw new Error(`Expected JSON, got HTML. This usually means the API endpoint doesn't exist or there's a routing issue.`);
    }
    throw new Error(`Expected JSON response, got ${contentType || 'unknown content type'}`);
  }
};

// Create an authenticated fetch wrapper for admin endpoints with better error handling
export const authApiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = getApiBaseUrl();
  const url = endpoint.startsWith('/') ? `${baseUrl}${endpoint}` : `${baseUrl}/${endpoint}`;
  
  // Get token from cookies
  const token = document.cookie.split('accessToken=')[1]?.split(';')[0] || '';
  
  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  // Check if response is JSON before parsing
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response;
  } else {
    // If we got HTML instead of JSON, it's likely an error page or redirect
    const text = await response.text();
    if (text.includes('<!doctype') || text.includes('<html')) {
      if (response.status === 401) {
        throw new Error('Authentication required. Please login again.');
      } else if (response.status === 403) {
        throw new Error('Access denied. Admin privileges required.');
      } else {
        throw new Error(`Expected JSON, got HTML. This usually means the API endpoint doesn't exist or there's a routing issue.`);
      }
    }
    throw new Error(`Expected JSON response, got ${contentType || 'unknown content type'}`);
  }
};