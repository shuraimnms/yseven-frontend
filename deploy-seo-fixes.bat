@echo off
echo ========================================
echo Y7 SEO Fixes - Deploy to Production
echo ========================================
echo.

echo This will deploy:
echo - Updated sitemap.xml with current dates
echo - Fixed asset imports (no more 404s)
echo - Enhanced SEO meta tags
echo.

pause

echo [1/4] Cleaning old build...
if exist dist rmdir /s /q dist
echo Done!
echo.

echo [2/4] Installing dependencies...
call npm install
echo Done!
echo.

echo [3/4] Building production bundle...
call npm run build
echo Done!
echo.

echo [4/4] Deploying to Vercel...
call vercel --prod
echo Done!
echo.

echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Go to Google Search Console
echo 2. Resubmit sitemap: https://ysevenfoods.com/sitemap.xml
echo 3. Request indexing for each page manually
echo 4. Or run: node request-indexing.js (after setup)
echo.
echo See FIX_GOOGLE_INDEXING.md for detailed instructions
echo.
pause
