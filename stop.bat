@echo off
title Stop BioSearch Server
echo ===================================================
echo   Stopping BioSearch Platform Server (Port 8080)
echo ===================================================
echo.

set FOUND=0
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080" ^| findstr "LISTENING"') do (
    echo Terminating PID %%a listening on port 8080...
    taskkill /F /PID %%a >nul 2>&1
    set FOUND=1
)

if %FOUND%==1 (
    echo [SUCCESS] Server stopped successfully!
) else (
    echo [INFO] No server found running on port 8080.
)

echo.
ping 127.0.0.1 -n 3 >nul
