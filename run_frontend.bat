echo ===================================
echo   STARTING FRONTEND SERVER
echo ===================================

cd /d "C:\Users\dhire\M&A\frontend"

echo 1. Checking Node version...
node -v

echo 2. Installing dependencies (just in case)...
call npm install --no-audit

echo 3. Starting Vite Server...
echo -----------------------------------
:: Use direct path to vite binary to avoid PATH issues
node node_modules/vite/bin/vite.js

echo -----------------------------------
echo SERVER CRASHED OR STOPPED
echo -----------------------------------
pause
