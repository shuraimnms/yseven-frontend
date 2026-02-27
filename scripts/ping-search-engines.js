const https = require('https');

const sitemap = 'https://ysevenfoods.com/sitemap.xml';
const sitemapEnhanced = 'https://ysevenfoods.com/sitemap-enhanced.xml';

console.log('🔔 Pinging search engines...\n');

// Ping Google
https.get(`https://www.google.com/ping?sitemap=${sitemap}`, (res) => {
  console.log(`✅ Google pinged (sitemap.xml): ${res.statusCode}`);
});

https.get(`https://www.google.com/ping?sitemap=${sitemapEnhanced}`, (res) => {
  console.log(`✅ Google pinged (sitemap-enhanced.xml): ${res.statusCode}`);
});

// Ping Bing
https.get(`https://www.bing.com/ping?sitemap=${sitemap}`, (res) => {
  console.log(`✅ Bing pinged (sitemap.xml): ${res.statusCode}`);
});

https.get(`https://www.bing.com/ping?sitemap=${sitemapEnhanced}`, (res) => {
  console.log(`✅ Bing pinged (sitemap-enhanced.xml): ${res.statusCode}`);
});

console.log('\n✨ Search engines notified successfully!');
console.log('📝 Next steps:');
console.log('1. Verify in Google Search Console');
console.log('2. Submit sitemaps manually in GSC');
console.log('3. Request indexing for top 20 pages');
