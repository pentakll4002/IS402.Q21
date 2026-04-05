@echo off
setlocal enabledelayedexpansion

REM ===== QR SERVICE CONFIGURATION =====
set SERVICE_NAME=QR Code Payment Service
set PID_FILE=logs\qr_service.pid

echo Stopping %SERVICE_NAME%...

REM Check if the service is running
if exist %PID_FILE% (
    set /p PID=<%PID_FILE%
    echo Found service with PID !PID!
    
    wmic process where "ProcessId=!PID!" get CommandLine 2>nul | find "uvicorn" >nul
    if !errorlevel! equ 0 (
        echo Stopping service...
        taskkill /PID !PID! /F >nul 2>&1
        if !errorlevel! equ 0 (
            echo Service stopped successfully.
            del %PID_FILE%
        ) else (
            echo Failed to stop service.
        )
    ) else (
        echo Service with PID !PID! is not running.
        echo Removing stale PID file.
        del %PID_FILE%
    )
) else (
    echo No running service found.
)

echo Done.
endlocal 