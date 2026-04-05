@echo off
setlocal

echo ===================================================
echo Testing all backend services...
echo ===================================================
echo.

REM Create logs directory if it doesn't exist
if not exist logs mkdir logs

REM Test QR Code service
echo Testing QR Code Service...
call test-qr-server.bat
echo.

REM Test Invoice Generator service
echo Testing Invoice Generator Service...
call test-invoice-service.bat
echo.

REM Add other services here as needed
REM Example:
REM echo Testing Another Service...
REM call test_another_service.bat
REM echo.

echo ===================================================
echo All tests completed!
echo ===================================================
echo.
echo If any service failed, please check the logs in the logs directory.
echo.

endlocal 