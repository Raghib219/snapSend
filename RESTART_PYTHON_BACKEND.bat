@echo off
echo ========================================
echo   Restarting Python Backend
echo ========================================
echo.
echo Killing existing Python processes on port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do taskkill /F /PID %%a

timeout /t 2 /nobreak > nul

echo.
echo Starting Python backend...
cd backend_python
start "Python Backend" cmd /k "python app.py"

echo.
echo ========================================
echo   Backend restarted!
echo ========================================
echo Check the new window for logs.
pause
