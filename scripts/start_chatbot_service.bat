@echo off
setlocal enabledelayedexpansion

echo ===================================
echo       TECHBOT CHATBOT SERVICE
echo ===================================

REM Đường dẫn tới thư mục gốc của dự án
set "PROJECT_ROOT=%~dp0.."
set "CHATBOT_DIR=%PROJECT_ROOT%\python-ChatBot\pycode"

echo [INFO] Đường dẫn ChatBot: %CHATBOT_DIR%

REM Kiểm tra xem thư mục ChatBot có tồn tại không
if not exist "%CHATBOT_DIR%" (
    echo [ERROR] Không tìm thấy thư mục ChatBot tại đường dẫn: %CHATBOT_DIR%
    echo [ERROR] Vui lòng kiểm tra lại cấu trúc thư mục dự án.
    goto :error
)

REM Kiểm tra Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python không được cài đặt! Vui lòng cài đặt Python 3.8 trở lên.
    goto :error
)

REM Chuyển đến thư mục ChatBot
cd /d "%CHATBOT_DIR%"

REM Kiểm tra và tạo môi trường ảo nếu chưa có
if not exist venv (
    echo [INFO] Đang tạo môi trường ảo...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo [ERROR] Không thể tạo môi trường ảo! Vui lòng kiểm tra lại cài đặt Python.
        goto :error
    )
)

REM Kiểm tra xem có cần cài đặt các gói phụ thuộc không
if not exist "venv\Scripts\activate" (
    echo [ERROR] Môi trường ảo không hợp lệ. Vui lòng xóa thư mục venv và thử lại.
    goto :error
)

REM Kích hoạt môi trường ảo
call venv\Scripts\activate

REM Kiểm tra và cài đặt các gói phụ thuộc
echo [INFO] Đang cài đặt các gói phụ thuộc...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Không thể cài đặt các gói phụ thuộc.
    goto :error
)

REM Kiểm tra file .env
if not exist .env (
    echo [INFO] File .env không tồn tại. Đang tạo từ mẫu...
    copy .env-example .env
    echo [WARNING] Vui lòng mở file .env và cập nhật GROQ_API_KEY của bạn.
)

REM Tạo thư mục logs nếu chưa có
if not exist "%PROJECT_ROOT%\scripts\logs" (
    mkdir "%PROJECT_ROOT%\scripts\logs"
)

REM Khởi động ứng dụng
echo [INFO] Đang khởi động TechBot API...
echo [INFO] Nhật ký (log) sẽ được lưu tại: %PROJECT_ROOT%\scripts\logs\chatbot.log

REM Kiểm tra xem cổng 8000 có đang được sử dụng không
netstat -ano | findstr :8000 > nul
if %errorlevel% equ 0 (
    echo [WARNING] Cổng 8000 đã được sử dụng. Có thể một instance khác của ChatBot đang chạy.
    echo [WARNING] Vui lòng kiểm tra và dừng instance đó trước khi tiếp tục.
    choice /C YN /M "Bạn có muốn tiếp tục khởi động không (Y/N)?"
    if !errorlevel! equ 2 goto :error
)

REM Khởi động ứng dụng và ghi log
start "TechBot ChatBot Service" /MIN cmd /c "call venv\Scripts\activate && python run.py > "%PROJECT_ROOT%\scripts\logs\chatbot.log" 2>&1"

echo [SUCCESS] TechBot ChatBot Service đã được khởi động!
echo [INFO] Truy cập API tại: http://localhost:8000
echo [INFO] Nhấn Enter để đóng cửa sổ này (ChatBot sẽ tiếp tục chạy trong nền)
pause > nul
goto :eof

:error
echo [ERROR] Đã xảy ra lỗi khi khởi động TechBot ChatBot Service.
pause
exit /b 1 