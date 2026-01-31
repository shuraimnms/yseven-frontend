// Temporary helper for admin testing
// This should be removed in production

export const setTestAdmin = () => {
  const testAdminUser = {
    _id: 'test-admin-id',
    name: 'Test Admin',
    email: 'admin@y7sauces.com',
    phone: '9999999999',
    role: 'admin' as const,
    emailVerified: true,
    phoneVerified: true,
    addresses: [],
    wishlist: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Set in localStorage for testing
  localStorage.setItem('auth-storage', JSON.stringify({
    state: {
      user: testAdminUser,
      isAuthenticated: true
    },
    version: 0
  }));

  // Set a test token
  document.cookie = 'accessToken=test-admin-token; path=/';
  
  console.log('Test admin user set:', testAdminUser);
  
  // Reload to apply changes
  window.location.reload();
};

// Add to window for easy access in console
if (typeof window !== 'undefined') {
  (window as any).setTestAdmin = setTestAdmin;
}