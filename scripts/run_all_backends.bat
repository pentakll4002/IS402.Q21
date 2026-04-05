@echo off
echo ===================================================================
echo Starting All Backend Services - ChatBot, QR Code, and Invoice
echo ===================================================================
echo.

:: Set working directory to the script location
cd /d %~dp0
cd ..
set BASE_DIR=%CD%
echo Base directory: %BASE_DIR%

:: Check for Python installation
where python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Python not found in PATH. Checking other locations...
    
    :: Try to find Python in common locations
    set PYTHON_PATHS=C:\Python310\python.exe C:\Python39\python.exe C:\Python38\python.exe C:\Python37\python.exe C:\Python36\python.exe C:\Program Files\Python310\python.exe C:\Program Files\Python39\python.exe C:\Program Files\Python38\python.exe C:\Program Files\Python37\python.exe C:\Program Files\Python36\python.exe C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python310\python.exe C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python39\python.exe C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python38\python.exe C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python37\python.exe
    
    for %%i in (%PYTHON_PATHS%) do (
        if exist %%i (
            echo Found Python at: %%i
            set PYTHON_EXE=%%i
            goto :FoundPython
        )
    )
    
    echo ERROR: Python not found. Please install Python 3.6+ or add it to your PATH.
    pause
    exit /b 1
) else (
    set PYTHON_EXE=python
)

:FoundPython

echo.
echo Checking and fixing dependencies to prevent version conflicts...
echo.
%PYTHON_EXE% -m pip install --upgrade pip

:: Install compatible versions of libraries
echo Installing compatible versions of numpy and pandas...
%PYTHON_EXE% -m pip install numpy==1.24.3 pandas==2.0.3

echo.
echo Starting ChatBot API (pycode)...
echo.
start "ChatBot API" cmd /c "cd /d %BASE_DIR%\python-ChatBot\pycode && echo Installing dependencies for ChatBot API... && %PYTHON_EXE% -m pip install -r requirements.txt && echo. && echo Starting ChatBot API server on port 8000... && %PYTHON_EXE% -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

:: Wait a bit before starting next service
timeout /t 2 /nobreak >nul

echo.
echo Starting QR Code API...
echo.
start "QR Code API" cmd /c "cd /d %BASE_DIR%\python-ChatBot\qrCode && echo Installing dependencies for QR Code API... && %PYTHON_EXE% -m pip install -r requirements.txt && echo. && echo Starting QR Code API server on port 8001... && %PYTHON_EXE% -m uvicorn main:app --reload --host 0.0.0.0 --port 8001"

:: Wait a bit before starting next service
timeout /t 2 /nobreak >nul

echo.
echo Starting Invoice API...
echo.
start "Invoice API" cmd /c "cd /d %BASE_DIR%\python-ChatBot\exportInvoice && echo Installing dependencies for Invoice API... && %PYTHON_EXE% -m pip install -r requirements.txt && echo. && echo Starting Invoice API server on port 8002... && %PYTHON_EXE% -m uvicorn main:app --reload --host 0.0.0.0 --port 8002"

:: Check if the services have started successfully
echo.
echo Waiting for services to start...
timeout /t 5 /nobreak >nul

echo.
echo ===================================================================
echo All services started successfully!
echo.
echo ChatBot API: http://localhost:8000/test
echo QR Code API: http://localhost:8001/health
echo Invoice API: http://localhost:8002/generate-invoice/
echo.
echo To test connection, open these URLs in your browser:
echo  - ChatBot API test: http://localhost:8000/test
echo  - QR Code API health check: http://localhost:8001/health
echo  - Invoice API: http://localhost:8002/generate-invoice/
echo.
echo Press Ctrl+C in the respective console windows to stop the services
echo ===================================================================
echo. 