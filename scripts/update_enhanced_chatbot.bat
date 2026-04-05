@echo off
echo ===================================================================
echo             UPDATING PACKAGE.JSON FOR ENHANCED CHATBOT
echo ===================================================================
echo.

REM Tạo thư mục ChatBot trong scripts nếu chưa tồn tại
if not exist "ChatBot" (
    echo Creating ChatBot directory in scripts...
    mkdir ChatBot
)

REM Tạo file batch cho các chức năng mới của Enhanced ChatBot

echo Creating Enhanced ChatBot scripts...

REM 1. Start Enhanced ChatBot Service
echo @echo off > ChatBot\start_enhanced_chatbot.bat
echo echo ==================================================================== >> ChatBot\start_enhanced_chatbot.bat
echo echo             STARTING ENHANCED CHATBOT SERVICE >> ChatBot\start_enhanced_chatbot.bat
echo echo ==================================================================== >> ChatBot\start_enhanced_chatbot.bat
echo echo. >> ChatBot\start_enhanced_chatbot.bat
echo. >> ChatBot\start_enhanced_chatbot.bat
echo cd /d "%%~dp0..\..\python-ChatBot\pycode" >> ChatBot\start_enhanced_chatbot.bat
echo. >> ChatBot\start_enhanced_chatbot.bat
echo REM Kiểm tra và tạo thư mục venv nếu cần >> ChatBot\start_enhanced_chatbot.bat
echo if not exist "venv" ( >> ChatBot\start_enhanced_chatbot.bat
echo     echo Creating virtual environment... >> ChatBot\start_enhanced_chatbot.bat
echo     python -m venv venv >> ChatBot\start_enhanced_chatbot.bat
echo     if %%ERRORLEVEL%% NEQ 0 ( >> ChatBot\start_enhanced_chatbot.bat
echo         echo Error creating virtual environment. Please make sure Python is installed. >> ChatBot\start_enhanced_chatbot.bat
echo         pause >> ChatBot\start_enhanced_chatbot.bat
echo         exit /b 1 >> ChatBot\start_enhanced_chatbot.bat
echo     ) >> ChatBot\start_enhanced_chatbot.bat
echo ) >> ChatBot\start_enhanced_chatbot.bat
echo. >> ChatBot\start_enhanced_chatbot.bat
echo REM Kích hoạt môi trường ảo >> ChatBot\start_enhanced_chatbot.bat
echo echo Activating virtual environment... >> ChatBot\start_enhanced_chatbot.bat
echo call venv\Scripts\activate.bat >> ChatBot\start_enhanced_chatbot.bat
echo. >> ChatBot\start_enhanced_chatbot.bat
echo REM Cài đặt các thư viện cần thiết >> ChatBot\start_enhanced_chatbot.bat
echo echo Installing required packages... >> ChatBot\start_enhanced_chatbot.bat
echo pip install -r requirements.txt >> ChatBot\start_enhanced_chatbot.bat
echo if %%ERRORLEVEL%% NEQ 0 ( >> ChatBot\start_enhanced_chatbot.bat
echo     echo Warning: Some packages could not be installed. The service may not work correctly. >> ChatBot\start_enhanced_chatbot.bat
echo ) else ( >> ChatBot\start_enhanced_chatbot.bat
echo     echo All packages installed successfully. >> ChatBot\start_enhanced_chatbot.bat
echo ) >> ChatBot\start_enhanced_chatbot.bat
echo. >> ChatBot\start_enhanced_chatbot.bat
echo echo. >> ChatBot\start_enhanced_chatbot.bat
echo echo ==================================================================== >> ChatBot\start_enhanced_chatbot.bat
echo echo             STARTING ENHANCED CHATBOT API SERVER >> ChatBot\start_enhanced_chatbot.bat
echo echo ==================================================================== >> ChatBot\start_enhanced_chatbot.bat
echo echo. >> ChatBot\start_enhanced_chatbot.bat
echo echo Server will start at: http://127.0.0.1:8000 >> ChatBot\start_enhanced_chatbot.bat
echo echo. >> ChatBot\start_enhanced_chatbot.bat
echo echo Press Ctrl+C to stop the server >> ChatBot\start_enhanced_chatbot.bat
echo echo ==================================================================== >> ChatBot\start_enhanced_chatbot.bat
echo echo. >> ChatBot\start_enhanced_chatbot.bat
echo. >> ChatBot\start_enhanced_chatbot.bat
echo REM Khởi động server >> ChatBot\start_enhanced_chatbot.bat
echo python main.py >> ChatBot\start_enhanced_chatbot.bat
echo. >> ChatBot\start_enhanced_chatbot.bat
echo REM Nếu server dừng, dừng môi trường ảo >> ChatBot\start_enhanced_chatbot.bat
echo call venv\Scripts\deactivate.bat >> ChatBot\start_enhanced_chatbot.bat
echo. >> ChatBot\start_enhanced_chatbot.bat
echo pause >> ChatBot\start_enhanced_chatbot.bat

REM 2. Test Enhanced ChatBot Service
echo @echo off > ChatBot\test_enhanced_chatbot.bat
echo echo ==================================================================== >> ChatBot\test_enhanced_chatbot.bat
echo echo              TESTING ENHANCED CHATBOT SERVICE >> ChatBot\test_enhanced_chatbot.bat
echo echo ==================================================================== >> ChatBot\test_enhanced_chatbot.bat
echo echo. >> ChatBot\test_enhanced_chatbot.bat
echo. >> ChatBot\test_enhanced_chatbot.bat
echo REM Test các API endpoints của Enhanced ChatBot >> ChatBot\test_enhanced_chatbot.bat
echo echo Testing basic connectivity... >> ChatBot\test_enhanced_chatbot.bat
echo curl -s http://localhost:8000/test >> ChatBot\test_enhanced_chatbot.bat
echo echo. >> ChatBot\test_enhanced_chatbot.bat
echo echo. >> ChatBot\test_enhanced_chatbot.bat
echo echo Testing direct query API... >> ChatBot\test_enhanced_chatbot.bat
echo curl -s -G --data-urlencode "query=Tư vấn laptop gaming dưới 25 triệu" http://localhost:8000/direct-query >> ChatBot\test_enhanced_chatbot.bat
echo echo. >> ChatBot\test_enhanced_chatbot.bat
echo echo. >> ChatBot\test_enhanced_chatbot.bat
echo echo Testing product categories API... >> ChatBot\test_enhanced_chatbot.bat
echo curl -s http://localhost:8000/product-categories >> ChatBot\test_enhanced_chatbot.bat
echo echo. >> ChatBot\test_enhanced_chatbot.bat
echo echo. >> ChatBot\test_enhanced_chatbot.bat
echo echo ==================================================================== >> ChatBot\test_enhanced_chatbot.bat
echo echo If you see JSON responses above, the Enhanced ChatBot service is working correctly. >> ChatBot\test_enhanced_chatbot.bat
echo echo ==================================================================== >> ChatBot\test_enhanced_chatbot.bat
echo echo. >> ChatBot\test_enhanced_chatbot.bat
echo pause >> ChatBot\test_enhanced_chatbot.bat

echo Batch files created successfully.
echo.

REM Bây giờ cập nhật package.json
echo Updating package.json with new scripts...

REM Tạo file JSON tạm thời chứa scripts mới
echo {> temp_scripts.json
echo   "service:enhanced-chatbot": "cd scripts && ChatBot\\start_enhanced_chatbot.bat",>> temp_scripts.json
echo   "test:enhanced-chatbot": "cd scripts && ChatBot\\test_enhanced_chatbot.bat",>> temp_scripts.json
echo   "fullstack:enhanced": "start cmd /c \"npm run dev\" && start cmd /c \"cd scripts && ChatBot\\start_enhanced_chatbot.bat\" && start cmd /c \"cd scripts && run_qr_service.bat\" && start cmd /c \"cd scripts && start_invoice_service.bat\"">> temp_scripts.json
echo }>> temp_scripts.json

REM Sử dụng powershell để merge scripts mới vào package.json
echo Merging new scripts into package.json...
powershell -Command "$json = Get-Content -Raw -Path '../package.json' | ConvertFrom-Json; $newScripts = Get-Content -Raw -Path 'temp_scripts.json' | ConvertFrom-Json; foreach ($prop in $newScripts.PSObject.Properties) { $json.scripts | Add-Member -MemberType NoteProperty -Name $prop.Name -Value $prop.Value -Force }; $json | ConvertTo-Json -Depth 10 | Set-Content -Path '../package.json'"

REM Xóa file tạm
del temp_scripts.json

echo.
echo ===================================================================
echo             PACKAGE.JSON UPDATED SUCCESSFULLY
echo ===================================================================
echo.
echo Added the following NPM scripts:
echo  - npm run service:enhanced-chatbot  : Start Enhanced ChatBot service
echo  - npm run test:enhanced-chatbot     : Test Enhanced ChatBot service
echo  - npm run fullstack:enhanced        : Run frontend with all backend services including Enhanced ChatBot
echo.
echo Now you can use these commands to manage the Enhanced ChatBot service.
echo.
pause 