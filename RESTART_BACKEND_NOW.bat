@echo off
echo ========================================
echo RESTARTING PYTHON BACKEND
echo ========================================
echo.
echo Killing all Python processes...
taskkill /F /IM python.exe /T >nul 2>&1
timeout /t 2 /nobreak >nul

echo.
echo Starting new Python backend...
cd backend_python
start "Python Backend" cmd /k "python app.py"

echo.
echo ========================================
echo Backend restarted!
echo Check the new window for logs.
echo.
echo After it starts:
echo 1. Upload CSV in Analyzer
echo 2. Try chatbot again
echo ========================================
pause
