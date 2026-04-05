@echo off
setlocal

echo ===================================================
echo Starting all backend services...
echo ===================================================
echo.

REM Create logs directory if it doesn't exist
if not exist logs mkdir logs

REM Start QR Code service
echo Starting QR Code Service...
start "QR Code Service" cmd /c call run_qr_service.bat

REM Start Invoice Generator service
echo Starting Invoice Generator Service...
start "Invoice Generator Service" cmd /c call start_invoice_service.bat

REM Add other services here as needed
REM Example:
REM echo Starting Another Service...
REM start "Another Service" cmd /c call start_another_service.bat

echo.
echo All services started!
echo.
echo Services running:
echo - QR Code Service: http://localhost:8001
echo - Invoice Generator Service: http://localhost:8002
echo.
echo To stop all services, run stop_all_services.bat
echo To test all services, run test_all_services.bat
echo.

endlocal 