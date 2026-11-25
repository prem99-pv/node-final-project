@echo off
title MedCare Clinic Multi-Doctor Launcher
echo ===================================================
echo   MedCare - Multi-Doctor Healthcare Portal (MERN)
echo ===================================================
echo.
echo Starting Backend (Node.js/Express on http://localhost:5000)...
start "MedCare Backend (Port 5000)" cmd /k "cd /d "%~dp0backend" && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Frontend (React/Vite on http://localhost:5173)...
start "MedCare Frontend (Port 5173)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ===================================================
echo Backend and Frontend have been launched!
echo Access the site at: http://localhost:5173
echo API runs at:        http://localhost:5000
echo ===================================================
pause
