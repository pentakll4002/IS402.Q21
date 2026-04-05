@echo off
setlocal

REM ===== QR SERVICE TEST CONFIGURATION =====
set SERVICE_NAME=QR Code Payment Service
set SERVICE_URL=http://localhost:8001
set HEALTH_ENDPOINT=/health
set MB_ENDPOINT=/mb/qr
set MOMO_ENDPOINT=/momo/qr

echo Testing %SERVICE_NAME%...
echo.

REM Check if curl is available
where curl >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: curl command not found.
    echo Please install curl or add it to your PATH.
    goto :end
)

REM Test health endpoint
echo Testing health endpoint...
curl -s -o nul -w "Status: %%{http_code}\n" %SERVICE_URL%%HEALTH_ENDPOINT%
if %errorlevel% neq 0 (
    echo ERROR: Service is not running.
    echo Please start the service using run_qr_service.bat
    goto :end
)

echo.
echo Service is running!
echo.
echo Available endpoints:
echo - MB Bank QR: %SERVICE_URL%%MB_ENDPOINT%?amount=1000000
echo - Momo QR: %SERVICE_URL%%MOMO_ENDPOINT%?amount=1000000
echo.
echo Test completed successfully.

:end
endlocal 