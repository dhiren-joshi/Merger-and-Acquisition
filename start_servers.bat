@echo off
echo Starting M and A Platform Servers...
echo --------------------------------
start "Backend Server" cmd /k "run_backend.bat"
start "Frontend Server" cmd /k "run_frontend.bat"
echo Servers launched in separate windows.
