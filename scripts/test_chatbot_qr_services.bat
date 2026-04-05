@echo off
echo ===================================================================
echo Testing ChatBot API and QR Code API Services
echo ===================================================================
echo.

:: Check if curl is available
where curl >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: curl command not found. This script requires curl to test the APIs.
    echo Please install curl or ensure it's in your PATH.
    pause
    exit /b 1
)

echo Testing ChatBot API at http://localhost:8000/test...
curl -s http://localhost:8000/test
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: ChatBot API is not responding. Make sure it's running.
) else (
    echo.
    echo SUCCESS: ChatBot API is up and running!
)

echo.
echo.
echo Testing QR Code API at http://localhost:8001/health...
curl -s http://localhost:8001/health
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: QR Code API is not responding. Make sure it's running.
) else (
    echo.
    echo SUCCESS: QR Code API is up and running!
)

echo.
echo.
echo ===================================================================
echo Testing a ChatBot API query...
echo.
echo Request: http://localhost:8000/direct-query?query=xin%%20ch%%C3%%A0o
curl -s "http://localhost:8000/direct-query?query=xin%%20ch%%C3%%A0o"
echo.
echo.

echo ===================================================================
echo Testing a QR Code generation...
echo.
echo Request: http://localhost:8001/generate?amount=100000&bankType=mbbank
echo.
echo Getting QR code from endpoint (base64 will be shown in response)...
curl -s "http://localhost:8001/generate?amount=100000&bankType=mbbank"
echo.
echo.

echo ===================================================================
echo Testing complete!
echo.
echo If you see JSON responses above, the services are working correctly.
echo If you see error messages, please ensure the services are running.
echo.
echo ===================================================================

pause 