@echo off
echo ========================================
echo   Starting Python Backend Server
echo ========================================
echo.

cd backend_python

echo Checking Python installation...
python --version
if errorlevel 1 (
    echo ERROR: Python is not installed!
    echo Please install Python 3.8+ from python.org
    pause
    exit /b 1
)

echo.
echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Starting Flask server...
python app.py

pause
