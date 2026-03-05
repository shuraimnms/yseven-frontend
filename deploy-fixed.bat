@echo off
echo ========================================
echo Y7 Foods - Fixed Production Deployment
echo ========================================
echo.

echo [1/4] Cleaning old build...
if exist dist rmdir /s /q dist
echo ✓ Clean complete
echo.

echo [2/4] Building for production...
call npm run build
if %errorlevel% neq 0 (
    echo ✗ Build failed!
    pause
    exit /b 1
)
echo ✓ Build complete
echo.

echo [3/4] Verifying build output...
if not exist dist\index.html (
    echo ✗ index.html not found!
    pause
    exit /b 1
)
if not exist dist\js (
    echo ✗ js folder not found!
    pause
    exit /b 1
)
echo ✓ Build verification passed
echo.

echo [4/4] Deploying to Vercel...
call vercel --prod
if %errorlevel% neq 0 (
    echo ✗ Deployment failed!
    pause
    exit /b 1
)
echo.
echo ========================================
echo ✓ Deployment Complete!
echo ========================================
echo.
echo Your site should now be live at:
echo https://www.ysevenfoods.com
echo.
echo IMPORTANT: Clear your browser cache or test in incognito mode!
echo.
pause
