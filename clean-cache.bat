@echo off
echo Cleaning all caches...
rmdir /s /q node_modules\.vite 2>nul
rmdir /s /q dist 2>nul
echo Done! Now restart your dev server and do a hard refresh in browser (Ctrl+Shift+R)
pause
