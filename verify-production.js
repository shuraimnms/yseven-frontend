// Production Deployment Verification Script
const https = require('https');
const fs = require('fs');
const path = require('path');

const PRODUCTION_URL = 'https://www.ysevenfoods.com';
const API_URL = 'https://yseven-backend.onrender.com/api/v1';

console.log('🔍 Verifying Production Deployment...\n');

// 1. Check if dist folder exists
console.log('1️⃣ Checking build output...');
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ dist/ folder not found! Run: npm run build');
  process.exit(1);
}

const indexPath = path.join(distPath, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('❌ dist/index.html not found!');
  process.exit(1);
}
console.log('✅ Build output exists\n');

// 2. Check environment variables
console.log('2️⃣ Checking environment variables...');
const envProdPath = path.join(__dirname, '.env.production');
if (!fs.existsSync(envProdPath)) {
  console.error('❌ .env.production not found!');
  process.exit(1);
}

const envContent = fs.readFileSync(envProdPath, 'utf8');
if (!envContent.includes('VITE_API_BASE_URL')) {
  console.error('❌ VITE_API_BASE_URL not found in .env.production!');
  console.error('   This is likely causing your production issue.');
  process.exit(1);
}
console.log('✅ Environment variables configured\n');

// 3. Test API endpoint
console.log('3️⃣ Testing API endpoint...');
https.get(`${API_URL}/products`, (res) => {
  if (res.statusCode === 200) {
    console.log('✅ API is reachable\n');
  } else {
    console.error(`❌ API returned status: ${res.statusCode}`);
  }
}).on('error', (err) => {
  console.error('❌ API is not reachable:', err.message);
});

// 4. Test production site
console.log('4️⃣ Testing production site...');
https.get(PRODUCTION_URL, (res) => {
  if (res.statusCode === 200) {
    console.log('✅ Production site is reachable\n');
    
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      // Check if it's returning HTML (not a redirect or error)
      if (data.includes('<div id="root">')) {
        console.log('✅ HTML structure looks correct\n');
      } else {
        console.error('❌ HTML structure might be incorrect');
      }
      
      // Check for script tags
      if (data.includes('<script') && data.includes('src=')) {
        console.log('✅ JavaScript bundles are referenced\n');
      } else {
        console.error('❌ JavaScript bundles not found in HTML');
      }
    });
  } else {
    console.error(`❌ Production site returned status: ${res.statusCode}`);
  }
}).on('error', (err) => {
  console.error('❌ Production site is not reachable:', err.message);
});

console.log('\n📝 Manual checks to perform:');
console.log('   1. Open DevTools → Network tab');
console.log('   2. Check if JS bundles load (Status 200)');
console.log('   3. Check if API calls work');
console.log('   4. Clear browser cache and service workers');
console.log('   5. Test in incognito mode\n');
