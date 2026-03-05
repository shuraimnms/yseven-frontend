#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * Analyzes build output and provides optimization recommendations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist');

console.log('📦 Bundle Analysis');
console.log('==================\n');

if (!fs.existsSync(DIST_DIR)) {
  console.log('❌ Build directory not found. Run "npm run build" first.\n');
  process.exit(1);
}

function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function analyzeDirectory(dir, prefix = '') {
  const files = fs.readdirSync(dir);
  const results = {
    js: [],
    css: [],
    images: [],
    other: [],
    total: 0
  };

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      const subResults = analyzeDirectory(filePath, prefix + file + '/');
      results.js.push(...subResults.js);
      results.css.push(...subResults.css);
      results.images.push(...subResults.images);
      results.other.push(...subResults.other);
      results.total += subResults.total;
    } else {
      const size = getFileSize(filePath);
      const ext = path.extname(file).toLowerCase();
      const relativePath = prefix + file;

      results.total += size;

      if (ext === '.js') {
        results.js.push({ path: relativePath, size });
      } else if (ext === '.css') {
        results.css.push({ path: relativePath, size });
      } else if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(ext)) {
        results.images.push({ path: relativePath, size });
      } else {
        results.other.push({ path: relativePath, size });
      }
    }
  }

  return results;
}

const results = analyzeDirectory(DIST_DIR);

// Sort by size
results.js.sort((a, b) => b.size - a.size);
results.css.sort((a, b) => b.size - a.size);
results.images.sort((a, b) => b.size - a.size);

console.log('📊 JavaScript Files:');
console.log('--------------------');
let jsTotal = 0;
results.js.forEach(file => {
  jsTotal += file.size;
  console.log(`${formatBytes(file.size).padStart(10)} - ${file.path}`);
});
console.log(`${'Total:'.padStart(10)} ${formatBytes(jsTotal)}\n`);

console.log('🎨 CSS Files:');
console.log('-------------');
let cssTotal = 0;
results.css.forEach(file => {
  cssTotal += file.size;
  console.log(`${formatBytes(file.size).padStart(10)} - ${file.path}`);
});
console.log(`${'Total:'.padStart(10)} ${formatBytes(cssTotal)}\n`);

console.log('🖼️  Images:');
console.log('----------');
let imgTotal = 0;
results.images.slice(0, 10).forEach(file => {
  imgTotal += file.size;
  console.log(`${formatBytes(file.size).padStart(10)} - ${file.path}`);
});
if (results.images.length > 10) {
  console.log(`... and ${results.images.length - 10} more images`);
}
results.images.slice(10).forEach(file => imgTotal += file.size);
console.log(`${'Total:'.padStart(10)} ${formatBytes(imgTotal)}\n`);

console.log('📦 Summary:');
console.log('-----------');
console.log(`JavaScript: ${formatBytes(jsTotal)}`);
console.log(`CSS:        ${formatBytes(cssTotal)}`);
console.log(`Images:     ${formatBytes(imgTotal)}`);
console.log(`Other:      ${formatBytes(results.other.reduce((sum, f) => sum + f.size, 0))}`);
console.log(`Total:      ${formatBytes(results.total)}\n`);

// Recommendations
console.log('💡 Optimization Recommendations:');
console.log('--------------------------------');

if (jsTotal > 500 * 1024) {
  console.log('⚠️  JavaScript bundle is large (>500KB)');
  console.log('   - Consider code splitting');
  console.log('   - Lazy load non-critical components');
  console.log('   - Review and remove unused dependencies');
}

if (cssTotal > 100 * 1024) {
  console.log('⚠️  CSS bundle is large (>100KB)');
  console.log('   - Enable CSS purging');
  console.log('   - Remove unused Tailwind classes');
  console.log('   - Consider critical CSS extraction');
}

if (imgTotal > 1024 * 1024) {
  console.log('⚠️  Images are large (>1MB total)');
  console.log('   - Convert to WebP format');
  console.log('   - Implement responsive images');
  console.log('   - Use lazy loading');
  console.log('   - Consider using a CDN');
}

const largeFiles = [...results.js, ...results.css, ...results.images]
  .filter(f => f.size > 200 * 1024)
  .sort((a, b) => b.size - a.size);

if (largeFiles.length > 0) {
  console.log('\n🔍 Large Files (>200KB):');
  largeFiles.forEach(file => {
    console.log(`   ${formatBytes(file.size).padStart(10)} - ${file.path}`);
  });
}

console.log('\n✅ Analysis complete!\n');
