@echo off
title All Services Launcher - Fixed Version
color 0A

echo =======================================================
echo     ALL SERVICES LAUNCHER - FIXED VERSION
echo =======================================================
echo.
echo This script will start all backend services in sequence
echo with port conflict detection and verification.
echo.

:: Kill any processes using ports we need
echo Checking for port conflicts...
echo.

:: Check for port 8000 (ChatBot)
netstat -ano | findstr ":8000" > nul
if %ERRORLEVEL% EQU 0 (
    echo Port 8000 is in use. Attempting to free it...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000"') do (
        echo Attempting to kill process with PID: %%a
        taskkill /F /PID %%a >nul 2>&1
    )
)

:: Check for port 8002 (Invoice Service)
netstat -ano | findstr ":8002" > nul
if %ERRORLEVEL% EQU 0 (
    echo Port 8002 is in use. Attempting to free it...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8002"') do (
        echo Attempting to kill process with PID: %%a
        taskkill /F /PID %%a >nul 2>&1
    )
)

:: Check for port 8003 (QR Service)
netstat -ano | findstr ":8003" > nul
if %ERRORLEVEL% EQU 0 (
    echo Port 8003 is in use. Attempting to free it...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8003"') do (
        echo Attempting to kill process with PID: %%a
        taskkill /F /PID %%a >nul 2>&1
    )
)

echo Port check complete.
echo.

:: Create a function to verify service availability
echo @echo off > verify-service.bat
echo set URL=%%1 >> verify-service.bat
echo set SERVICE=%%2 >> verify-service.bat
echo echo Verifying %%SERVICE%% at %%URL%% >> verify-service.bat
echo powershell -Command "try { Invoke-WebRequest -Uri '%%URL%%' -UseBasicParsing -TimeoutSec 5 ^> $null; if($?) { Write-Host '[SUCCESS] %%SERVICE%% is running' -ForegroundColor Green; exit 0 } } catch { Write-Host '[FAILED] %%SERVICE%% is not responding' -ForegroundColor Red; exit 1 }" >> verify-service.bat

echo Starting all services in sequence...
echo.

:: Start the PDF Invoice Service
echo [1/3] Starting PDF Invoice Service...
start "PDF Invoice Service" cmd /c "%~dp0\start_invoice_service.bat"
timeout /t 5 > nul
call verify-service.bat http://localhost:8002/test "PDF Invoice Service"

:: Start the QR Code Service
echo [2/3] Starting QR Code Service...
start "QR Code Service" cmd /c "%~dp0\run_qr_service.bat"
timeout /t 5 > nul
call verify-service.bat http://localhost:8003/test "QR Code Service"

:: Start the ChatBot Service
echo [3/3] Starting ChatBot Service...
start "ChatBot Service" cmd /c "%~dp0\start_chatbot_service.bat"
timeout /t 5 > nul
call verify-service.bat http://localhost:8000/test "ChatBot Service"

:: Clean up the temporary verification script
del verify-service.bat > nul 2>&1

echo.
echo =======================================================
echo.
echo All services have been started in separate windows.
echo.
echo If any service failed to start, please check the 
echo corresponding window for error messages.
echo.
echo Service URLs:
echo - ChatBot:   http://localhost:8000
echo - Invoice:   http://localhost:8002
echo - QR Code:   http://localhost:8003
echo.
echo =======================================================
echo.
echo Please do not close those windows while using the application.
echo Press any key to close this manager (services will keep running).
pause
exit /b 0 