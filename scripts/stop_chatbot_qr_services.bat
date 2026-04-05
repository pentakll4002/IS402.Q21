@echo off
echo ===================================================================
echo Stopping Python ChatBot API and QR Code API Services
echo ===================================================================
echo.

echo Looking for running services...

:: Find and kill ChatBot API process (running on port 8000)
for /f "tokens=5" %%p in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    echo Found ChatBot API process with PID: %%p
    taskkill /PID %%p /F
    if %ERRORLEVEL% EQU 0 (
        echo Successfully stopped ChatBot API service.
    ) else (
        echo Failed to stop ChatBot API service.
    )
)

:: Find and kill QR Code API process (running on port 8001)
for /f "tokens=5" %%p in ('netstat -ano ^| findstr :8001 ^| findstr LISTENING') do (
    echo Found QR Code API process with PID: %%p
    taskkill /PID %%p /F
    if %ERRORLEVEL% EQU 0 (
        echo Successfully stopped QR Code API service.
    ) else (
        echo Failed to stop QR Code API service.
    )
)

:: Also look for any remaining uvicorn processes
for /f "tokens=2" %%p in ('tasklist ^| findstr uvicorn') do (
    echo Found uvicorn process with PID: %%p
    taskkill /PID %%p /F >nul 2>&1
)

:: Also look for Python processes running our server files
for /f "tokens=2" %%p in ('wmic process where "commandline like '%%uvicorn%%' and name like '%%python%%'" get processid ^| findstr /r "[0-9]"') do (
    echo Found Python uvicorn process with PID: %%p
    taskkill /PID %%p /F >nul 2>&1
)

echo.
echo ===================================================================
echo All services have been stopped.
echo ===================================================================

pause 