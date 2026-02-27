@echo off
echo ========================================
echo Y7 PREMIUM SAUCES - SEO DEPLOYMENT
echo ========================================
echo.

echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed
echo.

echo [2/5] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

echo [3/5] Running SEO implementation script...
node scripts/implement-seo.js
echo ✓ SEO files generated
echo.

echo [4/5] Building production site...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo ✓ Site built successfully
echo.

echo [5/5] Deployment ready!
echo.
echo ========================================
echo DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your SEO-optimized site is ready in the 'dist' folder.
echo.
echo NEXT STEPS:
echo 1. Deploy the 'dist' folder to your hosting
echo 2. Set up Google Search Console
echo 3. Submit your sitemap
echo 4. Request indexing
echo.
echo Read DEPLOY_SEO_NOW.md for detailed instructions.
echo.
pause
