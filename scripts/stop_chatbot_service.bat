@echo off
setlocal enabledelayedexpansion

echo ===================================
echo     DỪNG TECHBOT CHATBOT SERVICE
echo ===================================

echo [INFO] Đang tìm các tiến trình ChatBot đang chạy...

REM Tìm các tiến trình Python đang chạy trên cổng 8000
set "found=0"
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do (
    set "pid=%%a"
    set "found=1"
    
    REM Kiểm tra xem tiến trình có phải là Python không
    for /f "tokens=1" %%b in ('tasklist /fi "PID eq %%a" /fo csv /nh') do (
        set "process=%%~b"
        if "!process!"=="python.exe" (
            echo [INFO] Tìm thấy tiến trình Python với PID: %%a
            echo [INFO] Đang dừng tiến trình...
            taskkill /F /PID %%a
            if !errorlevel! equ 0 (
                echo [SUCCESS] Đã dừng tiến trình thành công.
            ) else (
                echo [ERROR] Không thể dừng tiến trình. Vui lòng kiểm tra quyền truy cập.
            )
        )
    )
)

REM Tìm các cửa sổ cmd có tiêu đề chứa "TechBot ChatBot Service"
for /f "tokens=2" %%a in ('tasklist /v /fi "IMAGENAME eq cmd.exe" /fo csv ^| findstr /i "TechBot ChatBot Service"') do (
    set "pid=%%~a"
    set "found=1"
    echo [INFO] Tìm thấy cửa sổ CMD của ChatBot Service với PID: !pid!
    echo [INFO] Đang dừng tiến trình...
    taskkill /F /PID !pid!
    if !errorlevel! equ 0 (
        echo [SUCCESS] Đã dừng tiến trình thành công.
    ) else (
        echo [ERROR] Không thể dừng tiến trình. Vui lòng kiểm tra quyền truy cập.
    )
)

if "!found!"=="0" (
    echo [INFO] Không tìm thấy tiến trình ChatBot nào đang chạy.
) else (
    echo [INFO] Đã dừng tất cả các tiến trình ChatBot.
)

echo [INFO] Nhấn Enter để đóng cửa sổ này.
pause > nul 