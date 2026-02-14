echo ===================================
echo   STARTING BACKEND SERVER
echo ===================================

cd /d "C:\Users\dhire\M&A\backend"

echo 1. Checking Node version...
node -v

echo 2. Installing dependencies (just in case)...
call npm install --no-audit

echo 3. Starting Server...
echo -----------------------------------
set PORT=5000
set NODE_ENV=development
:: Force email disabled to prevent startup errors
set ENABLE_EMAIL_NOTIFICATIONS=false

node src/server.js

echo -----------------------------------
echo SERVER CRASHED OR STOPPED
echo -----------------------------------
pause
