@echo off
title QR Code Server
color 0A

echo =======================================================
echo                QR CODE SERVER
echo =======================================================
echo.
echo Please leave this window open while using the payment system.
echo.

cd "%~dp0\..\python-ChatBot\qrCode"

:: Check for Python installation
echo Checking Python...
py -3 --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    python --version >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Python not found!
        echo Please install Python from https://www.python.org/downloads/
        pause
        exit /b 1
    ) else (
        set PYTHON_CMD=python
    )
) else (
    set PYTHON_CMD=py -3
)

echo Python found: %PYTHON_CMD%
echo.

:: Install required packages from requirements.txt
echo Installing required packages from requirements.txt...
%PYTHON_CMD% -m pip install --quiet --disable-pip-version-check -r requirements.txt
echo Done!
echo.

echo =======================================================
echo Starting QR Code Server (Please don't close this window)
echo =======================================================
echo.
echo Server running at:
echo   http://127.0.0.1:8001
echo.
echo Press CTRL+C to exit when done.
echo.

:: Start the server - use port 8001 to avoid conflict with invoice service
%PYTHON_CMD% -m uvicorn main:app --host 0.0.0.0 --port 8001

echo.
echo Server stopped. Press any key to exit.
pause
exit /b 0 