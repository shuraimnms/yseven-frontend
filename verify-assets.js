// Asset Verification Script
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verifying Assets...\n');

// 1. Check if build exists
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ dist/ folder not found! Run: npm run build');
  process.exit(1);
}

// 2. Check critical files
const criticalFiles = [
  'dist/index.html',
  'public/logo.png',
  'public/favicon.ico',
  'public/favicon.png',
  'src/assets/hero-sauce.jpg'
];

criticalFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`✅ ${file} exists`);
  } else {
    console.error(`❌ ${file} missing`);
  }
});

// 3. Check for font references in built files
const indexPath = path.join(__dirname, 'dist/index.html');
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  if (indexContent.includes('fonts/inter-var.woff2')) {
    console.error('❌ Still references missing font: inter-var.woff2');
  } else {
    console.log('✅ No references to missing fonts');
  }
  
  if (indexContent.includes('hero-sauce.webp')) {
    console.error('❌ Still references missing WebP: hero-sauce.webp');
  } else {
    console.log('✅ No references to missing WebP files');
  }
  
  if (indexContent.includes('fonts.googleapis.com')) {
    console.log('✅ Google Fonts properly referenced');
  } else {
    console.error('❌ Google Fonts not found');
  }
}

// 4. Check bundled assets
const imgPath = path.join(__dirname, 'dist/img');
if (fs.existsSync(imgPath)) {
  const images = fs.readdirSync(imgPath);
  const heroAssets = images.filter(file => file.includes('hero-sauce'));
  
  if (heroAssets.length > 0) {
    console.log(`✅ Hero image bundled: ${heroAssets[0]}`);
  } else {
    console.error('❌ Hero image not bundled');
  }
  
  console.log(`✅ ${images.length} images bundled`);
}

const jsPath = path.join(__dirname, 'dist/js');
if (fs.existsSync(jsPath)) {
  const jsFiles = fs.readdirSync(jsPath);
  console.log(`✅ ${jsFiles.length} JS files bundled`);
}

const cssPath = path.join(__dirname, 'dist/css');
if (fs.existsSync(cssPath)) {
  const cssFiles = fs.readdirSync(cssPath);
  console.log(`✅ ${cssFiles.length} CSS files bundled`);
}

console.log('\n📝 Next steps:');
console.log('1. Run: npm run build');
console.log('2. Deploy the dist/ folder');
console.log('3. Test in production');
console.log('4. Check Network tab for 404 errors');