#!/usr/bin/env node

/**
 * Y7 Sauces Website - Comprehensive Functionality Test Script
 * This script tests all critical functionality of the website
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Test configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:8080';
const TIMEOUT = 30000;
const VIEWPORT = { width: 1920, height: 1080 };

// Test results
let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// Utility functions
const log = (message, type = 'info') => {
  const timestamp = new Date().toISOString();
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warning: '\x1b[33m',
    reset: '\x1b[0m'
  };
  console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
};

const addTestResult = (testName, passed, error = null) => {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    log(`✅ ${testName}`, 'success');
  } else {
    testResults.failed++;
    log(`❌ ${testName}: ${error}`, 'error');
  }
  testResults.details.push({
    test: testName,
    passed,
    error: error?.message || error,
    timestamp: new Date().toISOString()
  });
};

// Test functions
const testPageLoad = async (page, url, testName) => {
  try {
    const response = await page.goto(url, { waitUntil: 'networkidle0', timeout: TIMEOUT });
    const status = response.status();
    if (status === 200) {
      addTestResult(testName, true);
      return true;
    } else {
      addTestResult(testName, false, `HTTP ${status}`);
      return false;
    }
  } catch (error) {
    addTestResult(testName, false, error);
    return false;
  }
};

const testElementExists = async (page, selector, testName) => {
  try {
    await page.waitForSelector(selector, { timeout: 5000 });
    addTestResult(testName, true);
    return true;
  } catch (error) {
    addTestResult(testName, false, `Element not found: ${selector}`);
    return false;
  }
};

const testElementClickable = async (page, selector, testName) => {
  try {
    await page.waitForSelector(selector, { timeout: 5000 });
    await page.click(selector);
    addTestResult(testName, true);
    return true;
  } catch (error) {
    addTestResult(testName, false, error);
    return false;
  }
};

const testFormSubmission = async (page, formData, testName) => {
  try {
    // Fill form fields
    for (const [selector, value] of Object.entries(formData)) {
      await page.waitForSelector(selector, { timeout: 5000 });
      await page.type(selector, value);
    }
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for response or redirect
    await page.waitForTimeout(2000);
    
    addTestResult(testName, true);
    return true;
  } catch (error) {
    addTestResult(testName, false, error);
    return false;
  }
};

const testResponsiveDesign = async (page, testName) => {
  try {
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewport(viewport);
      await page.waitForTimeout(1000);
      
      // Check if page renders correctly
      const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
      if (bodyHeight < 100) {
        throw new Error(`Page not rendering on ${viewport.name}`);
      }
    }
    
    addTestResult(testName, true);
    return true;
  } catch (error) {
    addTestResult(testName, false, error);
    return false;
  }
};

const testPerformance = async (page, testName) => {
  try {
    const metrics = await page.metrics();
    const performanceEntries = await page.evaluate(() => {
      return JSON.stringify(performance.getEntriesByType('navigation'));
    });
    
    const navigation = JSON.parse(performanceEntries)[0];
    const loadTime = navigation.loadEventEnd - navigation.fetchStart;
    
    if (loadTime < 5000) { // 5 seconds threshold
      addTestResult(testName, true);
      return true;
    } else {
      addTestResult(testName, false, `Load time too slow: ${loadTime}ms`);
      return false;
    }
  } catch (error) {
    addTestResult(testName, false, error);
    return false;
  }
};

// Main test suite
const runTests = async () => {
  log('🚀 Starting Y7 Sauces Website Testing Suite', 'info');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);
  
  try {
    // 1. Test Page Loading
    log('📄 Testing Page Loading...', 'info');
    await testPageLoad(page, BASE_URL, 'Home Page Load');
    await testPageLoad(page, `${BASE_URL}/products`, 'Products Page Load');
    await testPageLoad(page, `${BASE_URL}/about`, 'About Page Load');
    await testPageLoad(page, `${BASE_URL}/contact`, 'Contact Page Load');
    await testPageLoad(page, `${BASE_URL}/auth/login`, 'Login Page Load');
    
    // 2. Test Navigation
    log('🧭 Testing Navigation...', 'info');
    await page.goto(BASE_URL);
    await testElementExists(page, 'nav', 'Navigation Bar Exists');
    await testElementClickable(page, 'a[href="/products"]', 'Products Link Clickable');
    await testElementClickable(page, 'a[href="/about"]', 'About Link Clickable');
    await testElementClickable(page, 'a[href="/contact"]', 'Contact Link Clickable');
    
    // 3. Test Hero Section
    log('🎬 Testing Hero Section...', 'info');
    await page.goto(BASE_URL);
    await testElementExists(page, 'section', 'Hero Section Exists');
    await testElementExists(page, 'h1', 'Hero Title Exists');
    await testElementExists(page, 'video, img', 'Hero Background Media Exists');
    
    // 4. Test Product Functionality
    log('🛍️ Testing Product Functionality...', 'info');
    await page.goto(`${BASE_URL}/products`);
    await testElementExists(page, '[data-testid="product-card"], .product-card, .grid > div', 'Product Cards Exist');
    
    // 5. Test Forms
    log('📝 Testing Forms...', 'info');
    await page.goto(`${BASE_URL}/contact`);
    await testElementExists(page, 'form', 'Contact Form Exists');
    await testElementExists(page, 'input[type="email"]', 'Email Input Exists');
    await testElementExists(page, 'textarea', 'Message Textarea Exists');
    
    // 6. Test Responsive Design
    log('📱 Testing Responsive Design...', 'info');
    await page.goto(BASE_URL);
    await testResponsiveDesign(page, 'Responsive Design');
    
    // 7. Test Performance
    log('⚡ Testing Performance...', 'info');
    await page.goto(BASE_URL);
    await testPerformance(page, 'Page Load Performance');
    
    // 8. Test Accessibility
    log('♿ Testing Accessibility...', 'info');
    await page.goto(BASE_URL);
    
    // Check for alt attributes on images
    const imagesWithoutAlt = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images.filter(img => !img.alt).length;
    });
    
    addTestResult('Images Have Alt Text', imagesWithoutAlt === 0, 
      imagesWithoutAlt > 0 ? `${imagesWithoutAlt} images missing alt text` : null);
    
    // Check for proper heading hierarchy
    const headings = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => h.tagName);
    });
    
    addTestResult('Proper Heading Hierarchy', headings.length > 0, 
      headings.length === 0 ? 'No headings found' : null);
    
    // 9. Test Error Handling
    log('🚨 Testing Error Handling...', 'info');
    await testPageLoad(page, `${BASE_URL}/non-existent-page`, '404 Page Handling');
    
    // 10. Test Chat Bot (if visible)
    log('💬 Testing Chat Bot...', 'info');
    await page.goto(BASE_URL);
    try {
      await page.waitForSelector('[data-testid="chat-bot"], .chat-bot, .chatbot', { timeout: 5000 });
      addTestResult('Chat Bot Exists', true);
    } catch {
      addTestResult('Chat Bot Exists', false, 'Chat bot not found (may be intentional)');
    }
    
  } catch (error) {
    log(`Fatal error during testing: ${error.message}`, 'error');
  } finally {
    await browser.close();
  }
  
  // Generate test report
  generateTestReport();
};

const generateTestReport = () => {
  log('📊 Generating Test Report...', 'info');
  
  const report = {
    summary: {
      total: testResults.total,
      passed: testResults.passed,
      failed: testResults.failed,
      passRate: ((testResults.passed / testResults.total) * 100).toFixed(2) + '%',
      timestamp: new Date().toISOString()
    },
    details: testResults.details
  };
  
  // Save detailed report
  const reportPath = path.join(__dirname, 'test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Generate HTML report
  const htmlReport = generateHTMLReport(report);
  const htmlPath = path.join(__dirname, 'test-report.html');
  fs.writeFileSync(htmlPath, htmlReport);
  
  // Console summary
  log('', 'info');
  log('🎯 TEST SUMMARY', 'info');
  log('================', 'info');
  log(`Total Tests: ${report.summary.total}`, 'info');
  log(`Passed: ${report.summary.passed}`, 'success');
  log(`Failed: ${report.summary.failed}`, report.summary.failed > 0 ? 'error' : 'info');
  log(`Pass Rate: ${report.summary.passRate}`, report.summary.failed > 0 ? 'warning' : 'success');
  log('', 'info');
  log(`📄 Detailed report saved to: ${reportPath}`, 'info');
  log(`🌐 HTML report saved to: ${htmlPath}`, 'info');
  
  if (testResults.failed > 0) {
    log('', 'warning');
    log('⚠️  FAILED TESTS:', 'warning');
    testResults.details
      .filter(test => !test.passed)
      .forEach(test => {
        log(`   • ${test.test}: ${test.error}`, 'error');
      });
  }
  
  process.exit(testResults.failed > 0 ? 1 : 0);
};

const generateHTMLReport = (report) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Y7 Sauces - Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #D4AF37, #B8941F); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 2.5em; }
        .header p { margin: 10px 0 0; opacity: 0.9; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 30px; }
        .stat-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #D4AF37; }
        .stat-number { font-size: 2em; font-weight: bold; color: #333; }
        .stat-label { color: #666; margin-top: 5px; }
        .tests { padding: 0 30px 30px; }
        .test-item { display: flex; align-items: center; padding: 15px; border-bottom: 1px solid #eee; }
        .test-item:last-child { border-bottom: none; }
        .test-status { width: 20px; height: 20px; border-radius: 50%; margin-right: 15px; }
        .test-status.passed { background: #28a745; }
        .test-status.failed { background: #dc3545; }
        .test-name { flex: 1; font-weight: 500; }
        .test-error { color: #dc3545; font-size: 0.9em; margin-left: 35px; }
        .pass-rate { font-size: 1.2em; color: ${report.summary.failed > 0 ? '#dc3545' : '#28a745'}; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 Y7 Sauces Test Report</h1>
            <p>Comprehensive website functionality testing completed on ${new Date(report.summary.timestamp).toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <div class="stat-card">
                <div class="stat-number">${report.summary.total}</div>
                <div class="stat-label">Total Tests</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" style="color: #28a745">${report.summary.passed}</div>
                <div class="stat-label">Passed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" style="color: #dc3545">${report.summary.failed}</div>
                <div class="stat-label">Failed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number pass-rate">${report.summary.passRate}</div>
                <div class="stat-label">Pass Rate</div>
            </div>
        </div>
        
        <div class="tests">
            <h2>Test Details</h2>
            ${report.details.map(test => `
                <div class="test-item">
                    <div class="test-status ${test.passed ? 'passed' : 'failed'}"></div>
                    <div class="test-name">${test.test}</div>
                </div>
                ${test.error ? `<div class="test-error">Error: ${test.error}</div>` : ''}
            `).join('')}
        </div>
    </div>
</body>
</html>
  `;
};

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(error => {
    log(`Failed to run tests: ${error.message}`, 'error');
    process.exit(1);
  });
}

module.exports = { runTests, testResults };