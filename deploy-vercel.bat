@echo off
echo ========================================
echo Y7 Foods - Vercel Deployment Script
echo ========================================
echo.

echo Step 1: Building the project...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b %errorlevel%
)
echo Build completed successfully!
echo.

echo Step 2: Committing changes to Git...
git add .
git commit -m "Deploy: Force rebuild for Vercel"
git push
echo Git push completed!
echo.

echo ========================================
echo Deployment pushed to GitHub
echo Vercel will auto-deploy in 1-2 minutes
echo ========================================
echo.
echo Next steps:
echo 1. Go to https://vercel.com/dashboard
echo 2. Find your project
echo 3. Wait for deployment to complete
echo 4. Clear browser cache (Ctrl+Shift+R)
echo 5. Test: https://ysevenfoods.com
echo.
pause
