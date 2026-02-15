@echo off
echo ========================================
echo Y7 Frontend - Fix Assets and Deploy
echo ========================================
echo.

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
echo Your site should be live with fixed assets.
echo Check the Vercel dashboard for deployment URL.
echo.
pause
