#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Checks if all required environment variables and configurations are correct
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Y7 Foods - Deployment Verification\n');

let hasErrors = false;
let hasWarnings = false;

// Check 1: Verify vercel.json exists and has correct structure
console.log('1️⃣  Checking vercel.json...');
try {
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  
  // Check rewrites for SPA
  if (!vercelConfig.rewrites || vercelConfig.rewrites.length === 0) {
    console.error('   ❌ Missing rewrites configuration for SPA routing');
    hasErrors = true;
  } else {
    const spaRewrite = vercelConfig.rewrites.find(r => r.destination === '/index.html');
    if (spaRewrite) {
      console.log('   ✅ SPA rewrite rule configured correctly');
    } else {
      console.error('   ❌ SPA rewrite rule not found');
      hasErrors = true;
    }
  }
  
  // Check output directory
  if (vercelConfig.outputDirectory !== 'dist') {
    console.warn('   ⚠️  Output directory is not "dist", make sure this matches vite.config.ts');
    hasWarnings = true;
  } else {
    console.log('   ✅ Output directory set to "dist"');
  }
  
  // Check build command
  if (!vercelConfig.buildCommand || !vercelConfig.buildCommand.includes('build')) {
    console.error('   ❌ Build command not configured properly');
    hasErrors = true;
  } else {
    console.log('   ✅ Build command configured');
  }
  
} catch (error) {
  console.error('   ❌ vercel.json not found or invalid JSON');
  hasErrors = true;
}

// Check 2: Verify .env.example exists
console.log('\n2️⃣  Checking environment variable template...');
try {
  const envExample = fs.readFileSync('.env.example', 'utf8');
  const requiredVars = [
    'VITE_API_BASE_URL',
    'VITE_APP_NAME',
    'VITE_APP_VERSION'
  ];
  
  const missingVars = requiredVars.filter(v => !envExample.includes(v));
  if (missingVars.length > 0) {
    console.warn(`   ⚠️  Missing variables in .env.example: ${missingVars.join(', ')}`);
    hasWarnings = true;
  } else {
    console.log('   ✅ All required variables documented in .env.example');
  }
} catch (error) {
  console.warn('   ⚠️  .env.example not found');
  hasWarnings = true;
}

// Check 3: Verify dist folder structure (if exists)
console.log('\n3️⃣  Checking build output...');
if (fs.existsSync('dist')) {
  const distFiles = fs.readdirSync('dist');
  
  if (!distFiles.includes('index.html')) {
    console.error('   ❌ index.html not found in dist folder');
    hasErrors = true;
  } else {
    console.log('   ✅ index.html exists');
  }
  
  const requiredFolders = ['js', 'css'];
  const missingFolders = requiredFolders.filter(f => !distFiles.includes(f));
  if (missingFolders.length > 0) {
    console.warn(`   ⚠️  Missing folders in dist: ${missingFolders.join(', ')}`);
    hasWarnings = true;
  } else {
    console.log('   ✅ Required asset folders exist');
  }
} else {
  console.warn('   ⚠️  dist folder not found. Run "npm run build" first');
  hasWarnings = true;
}

// Check 4: Verify vite.config.ts
console.log('\n4️⃣  Checking Vite configuration...');
try {
  const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
  
  if (!viteConfig.includes("outDir: 'dist'")) {
    console.error('   ❌ outDir not set to "dist" in vite.config.ts');
    hasErrors = true;
  } else {
    console.log('   ✅ outDir configured correctly');
  }
  
  if (!viteConfig.includes("base: '/'")) {
    console.warn('   ⚠️  base path not explicitly set to "/" in vite.config.ts');
    hasWarnings = true;
  } else {
    console.log('   ✅ base path configured correctly');
  }
} catch (error) {
  console.error('   ❌ vite.config.ts not found');
  hasErrors = true;
}

// Check 5: Verify package.json scripts
console.log('\n5️⃣  Checking package.json scripts...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (!packageJson.scripts || !packageJson.scripts.build) {
    console.error('   ❌ Build script not found in package.json');
    hasErrors = true;
  } else {
    console.log(`   ✅ Build script: "${packageJson.scripts.build}"`);
  }
  
  if (packageJson.scripts.build && packageJson.scripts.build.includes('vite build')) {
    console.log('   ✅ Using Vite for build');
  } else {
    console.warn('   ⚠️  Build script does not use "vite build"');
    hasWarnings = true;
  }
} catch (error) {
  console.error('   ❌ package.json not found or invalid');
  hasErrors = true;
}

// Check 6: Verify API configuration
console.log('\n6️⃣  Checking API configuration...');
try {
  const apiFile = fs.readFileSync('src/lib/api.ts', 'utf8');
  
  if (apiFile.includes('import.meta.env.VITE_API_BASE_URL')) {
    console.log('   ✅ Using environment variable for API URL');
  } else {
    console.warn('   ⚠️  API URL might be hardcoded');
    hasWarnings = true;
  }
  
  if (apiFile.includes('withCredentials: true')) {
    console.log('   ✅ CORS credentials configured');
  }
} catch (error) {
  console.warn('   ⚠️  Could not verify API configuration');
  hasWarnings = true;
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 VERIFICATION SUMMARY\n');

if (!hasErrors && !hasWarnings) {
  console.log('✅ All checks passed! Your configuration looks good.');
  console.log('\n📝 Next steps for Vercel deployment:');
  console.log('   1. Set environment variables in Vercel dashboard');
  console.log('   2. Deploy or redeploy your application');
  console.log('   3. Check deployment logs for any build errors');
} else if (hasErrors) {
  console.log('❌ Found critical errors that need to be fixed before deployment');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  Found warnings - deployment might work but review recommended');
}

console.log('\n📚 For detailed troubleshooting, see: VERCEL_404_FIX_GUIDE.md');
console.log('='.repeat(60) + '\n');

process.exit(hasErrors ? 1 : 0);
