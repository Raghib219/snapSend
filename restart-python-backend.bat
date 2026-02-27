@echo off
echo ========================================
echo Restarting Python Backend
echo ========================================
echo.

echo Stopping old Python processes...
taskkill /F /IM python.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo.
echo Starting Python backend...
cd backend_python
start cmd /k "python app.py"

echo.
echo ========================================
echo Python backend is restarting!
echo Check the new window for output.
echo ========================================
echo.
pause
