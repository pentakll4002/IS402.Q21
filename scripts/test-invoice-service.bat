@echo off
setlocal

REM ===== INVOICE SERVICE TEST CONFIGURATION =====
set SERVICE_NAME=Invoice Generator Service
set SERVICE_URL=http://127.0.0.1:8002
set TEST_ENDPOINT=/test-invoice/
set HEALTH_ENDPOINT=/health

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
    echo Please start the service using start_invoice_service.bat
    goto :end
)

echo.
echo Testing invoice generation...
echo This will download a sample invoice PDF.
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

REM Test invoice generation
echo Generating test invoice...
curl -s -o test_invoice.pdf %SERVICE_URL%%TEST_ENDPOINT%
if %errorlevel% equ 0 (
    echo.
    echo Test invoice generated successfully!
    echo Saved as test_invoice.pdf
    
    REM Try to open the PDF
    echo.
    echo Attempting to open the PDF...
    start test_invoice.pdf
) else (
    echo.
    echo ERROR: Failed to generate test invoice.
)

:end
echo.
echo Test completed.
endlocal 