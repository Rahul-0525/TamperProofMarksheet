# VeriMark System Launcher for PowerShell
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "          VeriMark (H8) - College Hackathon System Launcher" -ForegroundColor Yellow
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/2] Launching FastAPI Backend on http://localhost:8000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\uvicorn.exe app.main:app --reload --port 8000"

Write-Host "[2/2] Launching React+Vite Frontend on http://localhost:5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm.cmd run dev"

Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "Both servers are launching!" -ForegroundColor Green
Write-Host "- Web UI:        http://localhost:5173" -ForegroundColor White
Write-Host "- API Docs:      http://localhost:8000/docs" -ForegroundColor White
Write-Host "- Backend Root:  http://localhost:8000/" -ForegroundColor White
Write-Host "=====================================================================" -ForegroundColor Cyan
