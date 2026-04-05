# PowerShell script to start all services
Write-Host "=============================================================" -ForegroundColor Green
Write-Host "   EDUCATION PLATFORM - COMPLETE SERVICES MANAGER (POWERSHELL)" -ForegroundColor Green
Write-Host "=============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "This script will start all backend services in separate windows." -ForegroundColor Yellow
Write-Host ""

# Check for port conflicts
Write-Host "Checking for port conflicts..." -ForegroundColor Yellow
Write-Host ""

# Check port 8000 (ChatBot)
$port8000 = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($port8000) {
    Write-Host "Port 8000 is in use. Please close the application using this port." -ForegroundColor Red
    Read-Host "Press Enter to continue after closing the application"
}

# Check port 8002 (Invoice)
$port8002 = Get-NetTCPConnection -LocalPort 8002 -ErrorAction SilentlyContinue
if ($port8002) {
    Write-Host "Port 8002 is in use. Please close the application using this port." -ForegroundColor Red
    Read-Host "Press Enter to continue after closing the application"
}

# Check port 8003 (QR Code)
$port8003 = Get-NetTCPConnection -LocalPort 8003 -ErrorAction SilentlyContinue
if ($port8003) {
    Write-Host "Port 8003 is in use. Please close the application using this port." -ForegroundColor Red
    Read-Host "Press Enter to continue after closing the application"
}

# Function to start a service
function Start-PythonService {
    param (
        [string]$ServiceName,
        [string]$Directory,
        [int]$Port
    )
    
    Write-Host "Starting $ServiceName on port $Port..." -ForegroundColor Green
    
    # Start the service in a new window
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Directory'; python -m uvicorn main:app --host 127.0.0.1 --port $Port"
}

# Service paths
$projectPath = Split-Path -Parent $PSScriptRoot
$chatbotPath = Join-Path -Path $projectPath -ChildPath "python-ChatBot\pycode"
$invoicePath = Join-Path -Path $projectPath -ChildPath "python-ChatBot\exportInvoice"
$qrCodePath = Join-Path -Path $projectPath -ChildPath "python-ChatBot\qrCode"

# Start each service
Start-PythonService -ServiceName "ChatBot Service" -Directory $chatbotPath -Port 8000
Start-PythonService -ServiceName "PDF Invoice Service" -Directory $invoicePath -Port 8002
Start-PythonService -ServiceName "QR Code Service" -Directory $qrCodePath -Port 8003

Write-Host ""
Write-Host "=============================================================" -ForegroundColor Green
Write-Host "All services started in separate windows." -ForegroundColor Green
Write-Host ""
Write-Host "Please do not close those windows while using the application." -ForegroundColor Yellow
Write-Host ""
Write-Host "Service endpoints:" -ForegroundColor Cyan
Write-Host "- ChatBot API: http://127.0.0.1:8000/test" -ForegroundColor Cyan
Write-Host "- Invoice API: http://127.0.0.1:8002/generate-invoice" -ForegroundColor Cyan
Write-Host "- QR Code API: http://127.0.0.1:8003/generate" -ForegroundColor Cyan
Write-Host "=============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Press Enter to close this manager (services will keep running)." -ForegroundColor Yellow
Read-Host 