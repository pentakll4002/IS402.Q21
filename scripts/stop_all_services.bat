@echo off
setlocal

echo ===================================================
echo Stopping all backend services...
echo ===================================================
echo.

REM Stop QR Code service
echo Stopping QR Code Service...
call stop-qr-service.bat >nul 2>&1
echo Done.

REM Stop Invoice Generator service
echo Stopping Invoice Generator Service...
call stop-invoice-service.bat >nul 2>&1
echo Done.

REM Add other services here as needed
REM Example:
REM echo Stopping Another Service...
REM call stop_another_service.bat >nul 2>&1
REM echo Done.

echo.
echo All services stopped!
echo.

endlocal 