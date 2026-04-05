@echo off
title Python Requirements Installer
color 0E

echo =======================================================
echo        PYTHON REQUIREMENTS INSTALLER
echo =======================================================
echo.
echo This script will install all required Python packages.
echo.

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

:: Install main requirements
echo Installing main requirements...
cd "%~dp0\.."
%PYTHON_CMD% -m pip install --quiet --disable-pip-version-check -r requirements.txt
echo Done!
echo.

:: Install module-specific requirements
echo Installing module-specific requirements...

echo - Installing exportInvoice requirements...
cd "%~dp0\..\python-ChatBot\exportInvoice"
%PYTHON_CMD% -m pip install --quiet --disable-pip-version-check -r requirements.txt

echo - Installing qrCode requirements...
cd "%~dp0\..\python-ChatBot\qrCode"
%PYTHON_CMD% -m pip install --quiet --disable-pip-version-check -r requirements.txt

echo - Installing pycode requirements...
cd "%~dp0\..\python-ChatBot\pycode"
%PYTHON_CMD% -m pip install --quiet --disable-pip-version-check -r requirements.txt

echo.
echo =======================================================
echo All Python requirements have been installed successfully!
echo =======================================================
echo.
echo Press any key to exit.
pause
exit /b 0 