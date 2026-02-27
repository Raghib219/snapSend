@echo off
echo ========================================
echo    SnapSpend - Starting Application
echo ========================================
echo.

echo Starting Backend Server...
start "SnapSpend Backend" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "SnapSpend Frontend" cmd /k "npm run dev"

timeout /t 3 /nobreak > nul

echo.
echo ========================================
echo    Both servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Check the new terminal windows for logs.
echo Press any key to exit this window...
pause > nul
