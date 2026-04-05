@echo off
setlocal enabledelayedexpansion

echo ===================================
echo     KIỂM TRA CHATBOT SERVICE
echo ===================================

echo [INFO] Đang kiểm tra trạng thái ChatBot Service...

REM Kiểm tra xem cổng 8000 có đang được sử dụng không
netstat -ano | findstr :8000 > nul
if %errorlevel% equ 0 (
    echo [SUCCESS] ChatBot Service đang chạy trên cổng 8000.
    
    REM Tạo file HTML tạm thời để kiểm tra kết nối
    set "TEST_FILE=%TEMP%\chatbot_test.html"
    echo ^<!DOCTYPE html^> > "%TEST_FILE%"
    echo ^<html^> >> "%TEST_FILE%"
    echo ^<head^> >> "%TEST_FILE%"
    echo     ^<title^>ChatBot Test^</title^> >> "%TEST_FILE%"
    echo     ^<style^> >> "%TEST_FILE%"
    echo         body { font-family: Arial, sans-serif; margin: 20px; } >> "%TEST_FILE%"
    echo         .success { color: green; } >> "%TEST_FILE%"
    echo         .error { color: red; } >> "%TEST_FILE%"
    echo     ^</style^> >> "%TEST_FILE%"
    echo ^</head^> >> "%TEST_FILE%"
    echo ^<body^> >> "%TEST_FILE%"
    echo     ^<h1^>Kiểm tra kết nối ChatBot Service^</h1^> >> "%TEST_FILE%"
    echo     ^<div id="result"^>Đang kiểm tra kết nối...^</div^> >> "%TEST_FILE%"
    echo     ^<script^> >> "%TEST_FILE%"
    echo         fetch('http://localhost:8000/test') >> "%TEST_FILE%"
    echo             .then(response =^> response.json()) >> "%TEST_FILE%"
    echo             .then(data =^> { >> "%TEST_FILE%"
    echo                 document.getElementById('result').innerHTML = >> "%TEST_FILE%"
    echo                     '^<div class="success"^>Kết nối thành công: ' + JSON.stringify(data) + '^</div^>'; >> "%TEST_FILE%"
    echo             }) >> "%TEST_FILE%"
    echo             .catch(error =^> { >> "%TEST_FILE%"
    echo                 document.getElementById('result').innerHTML = >> "%TEST_FILE%"
    echo                     '^<div class="error"^>Kết nối thất bại: ' + error + '^</div^>'; >> "%TEST_FILE%"
    echo             }); >> "%TEST_FILE%"
    echo     ^</script^> >> "%TEST_FILE%"
    echo ^</body^> >> "%TEST_FILE%"
    echo ^</html^> >> "%TEST_FILE%"
    
    echo [INFO] Mở trình duyệt để kiểm tra kết nối...
    start "" "%TEST_FILE%"
    
    echo [INFO] Đang thử gửi yêu cầu kiểm tra đến API...
    curl -s -X GET http://localhost:8000/test
    echo.
    
) else (
    echo [ERROR] ChatBot Service không chạy trên cổng 8000.
    echo [INFO] Vui lòng chạy start_chatbot_service.bat để khởi động dịch vụ.
)

echo.
echo [INFO] Nhấn Enter để đóng cửa sổ này.
pause > nul 