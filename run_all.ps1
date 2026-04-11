# DRIFT.AI Unified Launch Script
Write-Host "🚀 Starting DRIFT.AI Platform..." -ForegroundColor Cyan

# Start Backend in a new window
Write-Host "📡 Starting Flask Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Backend; ..\venv\Scripts\python app.py"

# Start Frontend in a new window
Write-Host "🎨 Starting React Frontend..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd drift-ai; npm run dev"

Write-Host "✅ Both servers are starting. Check the new windows for logs." -ForegroundColor Yellow
Write-Host "🔗 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔗 Backend: http://localhost:5000" -ForegroundColor Cyan
