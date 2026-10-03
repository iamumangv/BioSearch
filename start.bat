@echo off
title BioSearch Platform Dev Server
echo ===================================================
echo   Starting BioSearch Platform on http://localhost:8080
echo ===================================================
echo.

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python 3.8+ to run the local server.
    pause
    exit /b 1
)

:: Start browser after brief delay in background
start "" cmd /c "ping 127.0.0.1 -n 2 >nul && start http://localhost:8080"

:: Start Python HTTP Server
echo Server running at: http://localhost:8080
echo Press Ctrl+C or run stop.bat to stop the server.
echo.
python -m http.server 8080
