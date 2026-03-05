@echo off
echo ========================================
echo Y7 Foods - Production Deployment Script
echo ========================================
echo.

echo [1/5] Cleaning old build...
if exist dist rmdir /s /q dist
echo Done!
echo.

echo [2/5] Incrementing service worker version...
powershell -Command "(Get-Content public\sw-ultra.js) -replace \"const CACHE_VERSION = 'v(\d+)'\", { \"const CACHE_VERSION = 'v$([int]$($_.Groups[1].Value) + 1)'\" } | Set-Content public\sw-ultra.js"
echo Done!
echo.

echo [3/5] Building production bundle...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    exit /b %errorlevel%
)
echo Done!
echo.

echo [4/5] Build completed successfully!
echo.
echo Deployment package ready in: dist/
echo.

echo [5/5] Next steps:
echo   1. Upload the entire 'dist' folder to your hosting
echo   2. Clear CDN cache if using one
echo   3. Test the deployed site
echo   4. Service worker will auto-update on user's next visit
echo.

echo ========================================
echo Deployment package ready!
echo ========================================
pause
