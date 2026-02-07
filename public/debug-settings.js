/**
 * Settings Debug Script
 * 
 * Paste this entire script into browser console to diagnose settings issues
 * 
 * Usage:
 * 1. Open browser console (F12)
 * 2. Copy and paste this entire file
 * 3. Run: await debugSettings()
 */

async function debugSettings() {
  console.log('🔍 Starting Settings Debug...\n');
  
  const results = {
    apiUrl: '',
    apiStatus: 'unknown',
    apiData: null,
    localStorageData: null,
    sessionStorageData: null,
    caches: [],
    issues: [],
    recommendations: []
  };

  // 1. Check API URL
  console.log('1️⃣ Checking API URL...');
  const apiUrl = window.location.origin.includes('localhost')
    ? 'http://localhost:5000/api/v1'
    : 'https://yseven-backend.onrender.com/api/v1';
  results.apiUrl = apiUrl;
  console.log(`   API URL: ${apiUrl}`);

  // 2. Test API Connection
  console.log('\n2️⃣ Testing API Connection...');
  try {
    const response = await fetch(`${apiUrl}/settings/public`);
    results.apiStatus = response.status;
    
    if (response.ok) {
      const data = await response.json();
      results.apiData = data.data;
      console.log(`   ✅ API Status: ${response.status} OK`);
      console.log(`   📧 API Email: ${data.data?.supportEmail}`);
      console.log(`   📞 API Phone: ${data.data?.supportPhone}`);
      console.log(`   🏢 API Title: ${data.data?.siteTitle}`);
    } else {
      results.issues.push(`API returned status ${response.status}`);
      console.log(`   ❌ API Status: ${response.status}`);
    }
  } catch (error) {
    results.issues.push(`API Error: ${error.message}`);
    console.log(`   ❌ API Error: ${error.message}`);
  }

  // 3. Check localStorage
  console.log('\n3️⃣ Checking localStorage...');
  try {
    const stored = localStorage.getItem('y7-settings-storage');
    if (stored) {
      const parsed = JSON.parse(stored);
      results.localStorageData = parsed;
      console.log(`   ✅ localStorage found`);
      console.log(`   📧 Stored Email: ${parsed.state?.settings?.supportEmail}`);
      console.log(`   📞 Stored Phone: ${parsed.state?.settings?.supportPhone}`);
      console.log(`   🏢 Stored Title: ${parsed.state?.settings?.siteTitle}`);
      console.log(`   ⏰ Last Fetch: ${new Date(parsed.state?.lastFetch).toLocaleString()}`);
      
      // Compare with API
      if (results.apiData && parsed.state?.settings) {
        if (results.apiData.supportEmail !== parsed.state.settings.supportEmail) {
          results.issues.push('localStorage email does not match API email');
          console.log(`   ⚠️ EMAIL MISMATCH!`);
          console.log(`      API: ${results.apiData.supportEmail}`);
          console.log(`      localStorage: ${parsed.state.settings.supportEmail}`);
        } else {
          console.log(`   ✅ Email matches API`);
        }
      }
    } else {
      results.issues.push('No settings in localStorage');
      console.log(`   ⚠️ No settings in localStorage`);
    }
  } catch (error) {
    results.issues.push(`localStorage Error: ${error.message}`);
    console.log(`   ❌ localStorage Error: ${error.message}`);
  }

  // 4. Check sessionStorage
  console.log('\n4️⃣ Checking sessionStorage...');
  const sessionKeys = Object.keys(sessionStorage).filter(k => k.includes('y7') || k.includes('settings'));
  if (sessionKeys.length > 0) {
    console.log(`   Found ${sessionKeys.length} relevant keys:`, sessionKeys);
    results.sessionStorageData = sessionKeys;
  } else {
    console.log(`   No relevant sessionStorage data`);
  }

  // 5. Check caches
  console.log('\n5️⃣ Checking Service Worker Caches...');
  try {
    const cacheNames = await caches.keys();
    results.caches = cacheNames;
    console.log(`   Found ${cacheNames.length} caches:`, cacheNames);
  } catch (error) {
    console.log(`   ⚠️ Cache API not available`);
  }

  // 6. Check for service worker
  console.log('\n6️⃣ Checking Service Worker...');
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    console.log(`   Found ${registrations.length} service worker(s)`);
    registrations.forEach((reg, i) => {
      console.log(`   SW ${i + 1}: ${reg.active?.scriptURL || 'inactive'}`);
    });
  } else {
    console.log(`   ⚠️ Service Worker not supported`);
  }

  // 7. Generate recommendations
  console.log('\n7️⃣ Generating Recommendations...');
  
  if (results.issues.length === 0) {
    results.recommendations.push('✅ Everything looks good!');
  } else {
    if (results.apiStatus !== 200) {
      results.recommendations.push('🔧 Fix: Check if backend API is running');
      results.recommendations.push('🔧 Fix: Verify API URL is correct');
    }
    
    if (results.issues.some(i => i.includes('mismatch'))) {
      results.recommendations.push('🔧 Fix: Clear localStorage and reload');
      results.recommendations.push('   Run: localStorage.clear(); location.reload();');
    }
    
    if (results.caches.length > 0) {
      results.recommendations.push('🔧 Fix: Clear all caches');
      results.recommendations.push('   Run: await clearAllCaches();');
    }
  }

  // 8. Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`API URL: ${results.apiUrl}`);
  console.log(`API Status: ${results.apiStatus}`);
  console.log(`Issues Found: ${results.issues.length}`);
  
  if (results.issues.length > 0) {
    console.log('\n❌ ISSUES:');
    results.issues.forEach((issue, i) => {
      console.log(`   ${i + 1}. ${issue}`);
    });
  }
  
  if (results.recommendations.length > 0) {
    console.log('\n💡 RECOMMENDATIONS:');
    results.recommendations.forEach((rec, i) => {
      console.log(`   ${i + 1}. ${rec}`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🔧 QUICK FIXES:');
  console.log('='.repeat(60));
  console.log('Clear localStorage:');
  console.log('   localStorage.clear(); location.reload();');
  console.log('\nClear all caches:');
  console.log('   await clearAllCaches();');
  console.log('\nForce fetch fresh settings:');
  console.log('   await forceFetchSettings();');
  console.log('='.repeat(60));
  
  return results;
}

async function clearAllCaches() {
  console.log('🧹 Clearing all caches...');
  
  // Clear caches
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
  console.log(`✅ Cleared ${cacheNames.length} caches`);
  
  // Clear localStorage
  localStorage.clear();
  console.log('✅ Cleared localStorage');
  
  // Clear sessionStorage
  sessionStorage.clear();
  console.log('✅ Cleared sessionStorage');
  
  console.log('🔄 Reloading in 2 seconds...');
  setTimeout(() => location.reload(), 2000);
}

async function forceFetchSettings() {
  console.log('🔄 Force fetching settings...');
  
  const apiUrl = window.location.origin.includes('localhost')
    ? 'http://localhost:5000/api/v1'
    : 'https://yseven-backend.onrender.com/api/v1';
  
  try {
    const response = await fetch(`${apiUrl}/settings/public`);
    const data = await response.json();
    
    console.log('✅ Fetched settings:', data.data);
    
    // Update localStorage
    localStorage.setItem('y7-settings-storage', JSON.stringify({
      state: {
        settings: data.data,
        lastFetch: 0
      },
      version: 0
    }));
    
    console.log('✅ Updated localStorage');
    console.log('🔄 Reloading...');
    location.reload();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Auto-run on load
console.log('🔧 Settings Debug Script Loaded!');
console.log('📝 Run: await debugSettings()');
console.log('🧹 Run: await clearAllCaches()');
console.log('🔄 Run: await forceFetchSettings()');
