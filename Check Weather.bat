@echo off
title Check Weather - Weather App Launcher
color 0B

cls
echo.
echo ========================================
echo    🌦️ Check Weather App Launcher
echo ========================================
echo.

cd /d "%~dp0"

echo Starting Weather App Server...
echo.
echo 📍 Server will be available at: http://localhost:8080
echo 🌐 Opening browser automatically...
echo.

REM Start the server in background
start /B node server.js

REM Wait a moment for server to start
timeout /t 3 /nobreak >nul

REM Open browser automatically
start http://localhost:8080

echo.
echo ✅ Weather App is now running!
echo 📱 Your browser should open automatically
echo.
echo 🛑 To stop the server, close this window or press Ctrl+C
echo.

echo Press any key to stop the server...
pause >nul

REM Kill the node process
taskkill /f /im node.exe >nul 2>&1

echo.
echo 🛑 Weather App server stopped.
echo.
pause 