@echo off
chcp 65001 >nul
echo ==========================================
echo   KHOI DONG LOCAL - ENGLISHINGLESH
echo ==========================================
echo.

echo [1/2] Dang khoi dong Backend...
start "Backend" cmd /k "cd backend && node app.js"

echo [2/2] Dang khoi dong Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ==========================================
echo   DA MO 2 CUA SO TERMINAL!
echo ==========================================
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:5173
echo ==========================================
pause