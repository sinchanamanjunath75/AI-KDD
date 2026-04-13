# DRIFT.AI Unified Launch Script
# This script launches both the backend and frontend in separate windows.
$ProjectRoot = Get-Location

Write-Host "Starting DRIFT.AI Platform..." -ForegroundColor Cyan

# Start Backend in a new window
Write-Host "Starting Flask Backend..." -ForegroundColor Green
Start-Process "powershell.exe" -ArgumentList "-NoExit", "-Command", "& { cd '$ProjectRoot'; python run_backend.py }"

# Start Frontend in a new window
Write-Host "Starting React Frontend..." -ForegroundColor Magenta
Start-Process "powershell.exe" -ArgumentList "-NoExit", "-Command", "& { cd '$ProjectRoot\drift-ai'; npm run dev }"

Write-Host "`nSuccessfully triggered launch!" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "`nPlease check the newly opened windows for any error messages." -ForegroundColor White
