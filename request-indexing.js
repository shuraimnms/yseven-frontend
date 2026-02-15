/**
 * Google Indexing API Request Script
 * 
 * This script helps request indexing for all pages using Google's Indexing API
 * 
 * Setup:
 * 1. Go to Google Cloud Console
 * 2. Enable "Web Search Indexing API"
 * 3. Create a service account
 * 4. Download the JSON key file
 * 5. Share your Search Console property with the service account email
 * 6. Save the key file as 'service-account-key.json' in this directory
 * 
 * Usage:
 * node request-indexing.js
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Your website URLs to index
const urls = [
  'https://ysevenfoods.com/',
  'https://ysevenfoods.com/about',
  'https://ysevenfoods.com/products',
  'https://ysevenfoods.com/shop',
  'https://ysevenfoods.com/blog',
  'https://ysevenfoods.com/recipes',
  'https://ysevenfoods.com/contact',
  'https://ysevenfoods.com/hot-sauces',
  'https://ysevenfoods.com/mayonnaise',
  'https://ysevenfoods.com/international',
  'https://ysevenfoods.com/bbq-sauces',
  'https://ysevenfoods.com/bulk-orders',
  'https://ysevenfoods.com/export',
  'https://ysevenfoods.com/certifications',
  'https://ysevenfoods.com/quality',
  'https://ysevenfoods.com/faq',
  'https://ysevenfoods.com/careers',
  'https://ysevenfoods.com/press',
  'https://ysevenfoods.com/partnerships',
  'https://ysevenfoods.com/privacy',
  'https://ysevenfoods.com/terms',
  'https://ysevenfoods.com/refund',
  'https://ysevenfoods.com/shipping'
];

async function requestIndexing() {
  try {
    // Check if service account key exists
    const keyPath = path.join(__dirname, 'service-account-key.json');
    if (!fs.existsSync(keyPath)) {
      console.error('❌ Error: service-account-key.json not found!');
      console.log('\nPlease follow these steps:');
      console.log('1. Go to https://console.cloud.google.com/');
      console.log('2. Enable "Web Search Indexing API"');
      console.log('3. Create a service account and download the JSON key');
      console.log('4. Save it as "service-account-key.json" in this directory');
      console.log('5. Share your Search Console property with the service account email');
      return;
    }

    // Load service account credentials
    const key = require('./service-account-key.json');
    
    // Create JWT client
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      ['https://www.googleapis.com/auth/indexing'],
      null
    );

    // Authorize
    await jwtClient.authorize();
    console.log('✅ Authorized with Google Indexing API\n');

    // Request indexing for each URL
    for (const url of urls) {
      try {
        const response = await google.indexing('v3').urlNotifications.publish({
          auth: jwtClient,
          requestBody: {
            url: url,
            type: 'URL_UPDATED'
          }
        });

        console.log(`✅ Requested indexing for: ${url}`);
        
        // Rate limiting - wait 1 second between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Error for ${url}:`, error.message);
      }
    }

    console.log('\n✅ Indexing requests completed!');
    console.log('\nNote: It may take a few days for Google to process these requests.');
    console.log('Check Google Search Console for indexing status.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
requestIndexing();
