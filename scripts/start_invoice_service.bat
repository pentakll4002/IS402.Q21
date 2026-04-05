@echo off
setlocal enabledelayedexpansion

REM ===== INVOICE SERVICE CONFIGURATION =====
set SERVICE_NAME=Invoice Generator Service
set SERVICE_PATH=..\python-ChatBot\exportInvoice
set SERVICE_PORT=8002
set LOG_FILE=logs\invoice_service.log
set PID_FILE=logs\invoice_service.pid

REM Create logs directory if it doesn't exist
if not exist logs mkdir logs

REM Check if the service is already running
if exist %PID_FILE% (
    set /p PID=<%PID_FILE%
    wmic process where "ProcessId=%PID%" get CommandLine 2>nul | find "uvicorn" >nul
    if !errorlevel! equ 0 (
        echo %SERVICE_NAME% is already running with PID !PID!
        echo To restart the service, use restart-invoice-service.bat
        goto :eof
    ) else (
        echo Removing stale PID file
        del %PID_FILE%
    )
)

echo Starting %SERVICE_NAME%...
echo Logs will be saved to %LOG_FILE%

REM Start the service
cd %SERVICE_PATH%
start /B cmd /c "python -m uvicorn main:app --host 127.0.0.1 --port %SERVICE_PORT% --reload > ..\..\scripts\%LOG_FILE% 2>&1"

REM Get the PID of the process
for /f "tokens=2" %%a in ('wmic process where "CommandLine like '%%uvicorn main:app --host 127.0.0.1 --port %SERVICE_PORT%%%'" get ProcessId /value ^| find "="') do (
    set PID=%%a
)

REM Save the PID to file
echo !PID! > %PID_FILE%

echo %SERVICE_NAME% started with PID !PID!
echo Service running at http://127.0.0.1:%SERVICE_PORT%
echo.
echo API Endpoints:
echo - POST /generate-invoice/ : Generate invoice from order data
echo - GET /test-invoice/ : Generate a test invoice
echo.
echo Press any key to view the log file (Ctrl+C to exit)
pause > nul
type %LOG_FILE%

endlocal 