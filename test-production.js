// Production Site Testing Script
import https from 'https';

const PRODUCTION_URL = 'https://www.ysevenfoods.com';
const TIMEOUT = 10000; // 10 seconds

console.log('🔍 Testing Production Site...\n');

// Test main site
function testSite() {
  return new Promise((resolve, reject) => {
    const req = https.get(PRODUCTION_URL, { timeout: TIMEOUT }, (res) => {
      let data = '';
      
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`✅ Site Status: ${res.statusCode}`);
        
        // Check for problematic asset references
        const issues = [];
        
        if (data.includes('fonts/inter-var.woff2')) {
          issues.push('❌ Still references missing font: inter-var.woff2');
        }
        
        if (data.includes('fonts/playfair-display.woff2')) {
          issues.push('❌ Still references missing font: playfair-display.woff2');
        }
        
        if (data.includes('hero-sauce.webp')) {
          issues.push('❌ Still references missing WebP: hero-sauce.webp');
        }
        
        if (data.includes('fonts.googleapis.com')) {
          console.log('✅ Google Fonts properly loaded');
        } else {
          issues.push('❌ Google Fonts not found');
        }
        
        if (data.includes('<div id="root">')) {
          console.log('✅ React root element found');
        } else {
          issues.push('❌ React root element missing');
        }
        
        if (data.includes('src="/js/index-')) {
          console.log('✅ Main JS bundle referenced');
        } else {
          issues.push('❌ Main JS bundle not found');
        }
        
        if (issues.length === 0) {
          console.log('\n🎉 All checks passed! Site should load without 404 errors.');
        } else {
          console.log('\n⚠️  Issues found:');
          issues.forEach(issue => console.log(issue));
        }
        
        resolve({ status: res.statusCode, issues });
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.on('error', reject);
  });
}

// Test specific assets that were causing 404s
async function testAssets() {
  const assetsToTest = [
    '/favicon.ico',
    '/logo.png',
    '/manifest.json'
  ];
  
  console.log('\n🔍 Testing Critical Assets...');
  
  for (const asset of assetsToTest) {
    try {
      await new Promise((resolve, reject) => {
        const req = https.get(`${PRODUCTION_URL}${asset}`, { timeout: 5000 }, (res) => {
          if (res.statusCode === 200) {
            console.log(`✅ ${asset} - Status: ${res.statusCode}`);
          } else {
            console.log(`❌ ${asset} - Status: ${res.statusCode}`);
          }
          resolve();
        });
        
        req.on('timeout', () => {
          req.destroy();
          console.log(`⏰ ${asset} - Timeout`);
          resolve();
        });
        
        req.on('error', () => {
          console.log(`❌ ${asset} - Error`);
          resolve();
        });
      });
    } catch (error) {
      console.log(`❌ ${asset} - ${error.message}`);
    }
  }
}

// Run tests
async function runTests() {
  try {
    await testSite();
    await testAssets();
    
    console.log('\n📝 Manual Testing Steps:');
    console.log('1. Open https://www.ysevenfoods.com in incognito mode');
    console.log('2. Open DevTools → Network tab');
    console.log('3. Reload the page');
    console.log('4. Check for any 404 errors (should be none)');
    console.log('5. Verify no multiple refreshes occur');
    console.log('6. Check Console tab for errors (ignore browser extension errors)');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTests();