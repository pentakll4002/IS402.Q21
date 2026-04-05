@echo off
setlocal enabledelayedexpansion

REM ===== QR SERVICE CONFIGURATION =====
set SERVICE_NAME=QR Code Payment Service
set LOG_FILE=logs\qr_service.log
set PID_FILE=logs\qr_service.pid

echo Restarting %SERVICE_NAME%...

REM Check if the service is running
if exist %PID_FILE% (
    set /p PID=<%PID_FILE%
    echo Stopping service with PID !PID!...
    taskkill /PID !PID! /F >nul 2>&1
    if !errorlevel! equ 0 (
        echo Service stopped successfully.
        del %PID_FILE%
    ) else (
        echo Failed to stop service or service not running.
        echo Removing stale PID file.
        del %PID_FILE%
    )
) else (
    echo No running service found.
)

REM Wait a moment before restarting
timeout /t 2 /nobreak >nul

REM Start the service again
call run_qr_service.bat

endlocal 