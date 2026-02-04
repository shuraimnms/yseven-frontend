#!/usr/bin/env node

/**
 * SEO Validation Script
 * Validates SEO implementation and provides recommendations
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  siteUrl: 'https://y7sauces.com',
  publicDir: path.join(__dirname, '../public'),
  srcDir: path.join(__dirname, '../src')
};

// Validation results
let validationResults = {
  passed: [],
  warnings: [],
  errors: [],
  score: 0
};

// Helper functions
function addResult(type, message, points = 0) {
  validationResults[type].push(message);
  if (type === 'passed') validationResults.score += points;
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return null;
  }
}

// Validation functions
function validateSitemap() {
  console.log('🔍 Validating sitemap...');
  
  const sitemapPath = path.join(config.publicDir, 'sitemap.xml');
  if (!fileExists(sitemapPath)) {
    addResult('errors', '❌ sitemap.xml not found');
    return;
  }
  
  const sitemap = readFile(sitemapPath);
  if (!sitemap) {
    addResult('errors', '❌ Could not read sitemap.xml');
    return;
  }
  
  // Check sitemap structure
  if (sitemap.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
    addResult('passed', '✅ Sitemap has proper XML declaration', 5);
  } else {
    addResult('warnings', '⚠️ Sitemap missing XML declaration');
  }
  
  if (sitemap.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
    addResult('passed', '✅ Sitemap has proper namespace', 5);
  } else {
    addResult('errors', '❌ Sitemap missing proper namespace');
  }
  
  // Count URLs
  const urlCount = (sitemap.match(/<url>/g) || []).length;
  if (urlCount > 0) {
    addResult('passed', `✅ Sitemap contains ${urlCount} URLs`, 10);
  } else {
    addResult('errors', '❌ Sitemap contains no URLs');
  }
  
  // Check for required elements
  if (sitemap.includes('<loc>') && sitemap.includes('<lastmod>')) {
    addResult('passed', '✅ Sitemap URLs have loc and lastmod elements', 5);
  } else {
    addResult('warnings', '⚠️ Some sitemap URLs missing required elements');
  }
}

function validateRobotsTxt() {
  console.log('🔍 Validating robots.txt...');
  
  const robotsPath = path.join(config.publicDir, 'robots.txt');
  if (!fileExists(robotsPath)) {
    addResult('errors', '❌ robots.txt not found');
    return;
  }
  
  const robots = readFile(robotsPath);
  if (!robots) {
    addResult('errors', '❌ Could not read robots.txt');
    return;
  }
  
  // Check basic structure
  if (robots.includes('User-agent: *')) {
    addResult('passed', '✅ robots.txt has User-agent directive', 5);
  } else {
    addResult('errors', '❌ robots.txt missing User-agent directive');
  }
  
  if (robots.includes('Sitemap:')) {
    addResult('passed', '✅ robots.txt references sitemap', 5);
  } else {
    addResult('warnings', '⚠️ robots.txt should reference sitemap');
  }
  
  // Check for disallowed paths
  if (robots.includes('Disallow: /admin/') && robots.includes('Disallow: /api/')) {
    addResult('passed', '✅ robots.txt properly disallows sensitive paths', 5);
  } else {
    addResult('warnings', '⚠️ Consider disallowing sensitive paths in robots.txt');
  }
}

function validateIndexHtml() {
  console.log('🔍 Validating index.html...');
  
  const indexPath = path.join(__dirname, '../index.html');
  if (!fileExists(indexPath)) {
    addResult('errors', '❌ index.html not found');
    return;
  }
  
  const html = readFile(indexPath);
  if (!html) {
    addResult('errors', '❌ Could not read index.html');
    return;
  }
  
  // Check meta tags
  const metaChecks = [
    { tag: '<title>', name: 'Title tag', points: 10 },
    { tag: 'name="description"', name: 'Meta description', points: 10 },
    { tag: 'name="keywords"', name: 'Meta keywords', points: 5 },
    { tag: 'property="og:title"', name: 'Open Graph title', points: 5 },
    { tag: 'property="og:description"', name: 'Open Graph description', points: 5 },
    { tag: 'property="og:image"', name: 'Open Graph image', points: 5 },
    { tag: 'name="twitter:card"', name: 'Twitter Card', points: 5 },
    { tag: 'rel="canonical"', name: 'Canonical URL', points: 5 },
    { tag: 'application/ld+json', name: 'Structured data', points: 10 }
  ];
  
  metaChecks.forEach(check => {
    if (html.includes(check.tag)) {
      addResult('passed', `✅ ${check.name} present`, check.points);
    } else {
      addResult('warnings', `⚠️ ${check.name} missing`);
    }
  });
  
  // Check for noscript content
  if (html.includes('<noscript>')) {
    addResult('passed', '✅ Noscript fallback content present', 10);
  } else {
    addResult('warnings', '⚠️ Consider adding noscript fallback for crawlers');
  }
  
  // Check language attribute
  if (html.includes('lang="en"')) {
    addResult('passed', '✅ HTML language attribute set', 5);
  } else {
    addResult('warnings', '⚠️ HTML language attribute missing');
  }
}

function validateSEOComponents() {
  console.log('🔍 Validating SEO components...');
  
  const seoComponentPath = path.join(config.srcDir, 'components/SEO.tsx');
  if (fileExists(seoComponentPath)) {
    addResult('passed', '✅ SEO component exists', 10);
  } else {
    addResult('warnings', '⚠️ SEO component not found');
  }
  
  const seoLibPath = path.join(config.srcDir, 'lib/seo.ts');
  if (fileExists(seoLibPath)) {
    addResult('passed', '✅ SEO configuration library exists', 10);
  } else {
    addResult('warnings', '⚠️ SEO configuration library not found');
  }
  
  const sitemapLibPath = path.join(config.srcDir, 'lib/sitemap.ts');
  if (fileExists(sitemapLibPath)) {
    addResult('passed', '✅ Sitemap generation library exists', 5);
  } else {
    addResult('warnings', '⚠️ Sitemap generation library not found');
  }
}

function validateAdditionalFiles() {
  console.log('🔍 Validating additional SEO files...');
  
  const additionalFiles = [
    { file: 'manifest.json', name: 'PWA Manifest', points: 5 },
    { file: 'humans.txt', name: 'Humans.txt', points: 2 },
    { file: '.well-known/security.txt', name: 'Security.txt', points: 3 },
    { file: 'favicon.png', name: 'Favicon', points: 5 },
    { file: 'og-image.jpg', name: 'Open Graph image', points: 5 }
  ];
  
  additionalFiles.forEach(item => {
    const filePath = path.join(config.publicDir, item.file);
    if (fileExists(filePath)) {
      addResult('passed', `✅ ${item.name} exists`, item.points);
    } else {
      addResult('warnings', `⚠️ ${item.name} not found`);
    }
  });
}

function validatePerformance() {
  console.log('🔍 Validating performance optimizations...');
  
  const indexHtml = readFile(path.join(__dirname, '../index.html'));
  if (!indexHtml) return;
  
  // Check for preconnect links
  if (indexHtml.includes('rel="preconnect"')) {
    addResult('passed', '✅ Preconnect links present for performance', 5);
  } else {
    addResult('warnings', '⚠️ Consider adding preconnect links for external resources');
  }
  
  // Check for DNS prefetch
  if (indexHtml.includes('rel="dns-prefetch"')) {
    addResult('passed', '✅ DNS prefetch links present', 3);
  } else {
    addResult('warnings', '⚠️ Consider adding DNS prefetch for external domains');
  }
  
  // Check for theme color
  if (indexHtml.includes('name="theme-color"')) {
    addResult('passed', '✅ Theme color meta tag present', 2);
  } else {
    addResult('warnings', '⚠️ Theme color meta tag missing');
  }
}

function generateReport() {
  console.log('\n📊 SEO Validation Report');
  console.log('========================\n');
  
  // Calculate score percentage
  const maxScore = 150; // Approximate maximum possible score
  const scorePercentage = Math.min(100, Math.round((validationResults.score / maxScore) * 100));
  
  console.log(`🎯 SEO Score: ${validationResults.score}/${maxScore} (${scorePercentage}%)\n`);
  
  // Score interpretation
  if (scorePercentage >= 90) {
    console.log('🏆 Excellent! Your SEO implementation is outstanding.');
  } else if (scorePercentage >= 75) {
    console.log('🎉 Great! Your SEO implementation is very good.');
  } else if (scorePercentage >= 60) {
    console.log('👍 Good! Your SEO implementation is solid with room for improvement.');
  } else if (scorePercentage >= 40) {
    console.log('⚠️ Fair. Your SEO implementation needs significant improvements.');
  } else {
    console.log('🚨 Poor. Your SEO implementation requires immediate attention.');
  }
  
  console.log('\n✅ Passed Checks:');
  validationResults.passed.forEach(item => console.log(`  ${item}`));
  
  if (validationResults.warnings.length > 0) {
    console.log('\n⚠️ Warnings:');
    validationResults.warnings.forEach(item => console.log(`  ${item}`));
  }
  
  if (validationResults.errors.length > 0) {
    console.log('\n❌ Errors:');
    validationResults.errors.forEach(item => console.log(`  ${item}`));
  }
  
  console.log('\n📋 Recommendations:');
  console.log('  1. Ensure all meta tags are properly filled with unique content');
  console.log('  2. Regularly update your sitemap with new content');
  console.log('  3. Monitor your site with Google Search Console');
  console.log('  4. Test your site with Google\'s Rich Results Test');
  console.log('  5. Optimize images with proper alt text and file names');
  console.log('  6. Ensure fast loading times and mobile responsiveness');
  console.log('  7. Create high-quality, original content regularly');
  
  console.log('\n🔗 Useful Tools:');
  console.log('  • Google Search Console: https://search.google.com/search-console');
  console.log('  • Google Rich Results Test: https://search.google.com/test/rich-results');
  console.log('  • Google PageSpeed Insights: https://pagespeed.web.dev/');
  console.log('  • Schema.org Validator: https://validator.schema.org/');
  
  return scorePercentage;
}

// Main execution
function main() {
  console.log('🚀 Starting SEO validation...\n');
  
  try {
    validateSitemap();
    validateRobotsTxt();
    validateIndexHtml();
    validateSEOComponents();
    validateAdditionalFiles();
    validatePerformance();
    
    const score = generateReport();
    
    // Exit with appropriate code
    if (validationResults.errors.length > 0) {
      console.log('\n❌ Validation completed with errors.');
      process.exit(1);
    } else if (score < 60) {
      console.log('\n⚠️ Validation completed but SEO score is below recommended threshold.');
      process.exit(1);
    } else {
      console.log('\n✅ SEO validation completed successfully!');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Error during SEO validation:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  validateSitemap,
  validateRobotsTxt,
  validateIndexHtml,
  validateSEOComponents,
  validateAdditionalFiles,
  validatePerformance,
  generateReport,
  main
};