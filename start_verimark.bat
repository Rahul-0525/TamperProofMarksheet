@echo off
TITLE VeriMark - Tamper-Proof Exam Result Ledger Launcher
echo =====================================================================
echo           VeriMark (H8) - College Hackathon System Launcher
echo =====================================================================
echo.
echo [1/2] Starting FastAPI Backend on http://localhost:8000...
start "VeriMark Backend (FastAPI)" cmd /k "cd backend && venv\Scripts\uvicorn.exe app.main:app --reload --port 8000"

echo [2/2] Starting React + Vite Frontend on http://localhost:5173...
start "VeriMark Frontend (Vite)" cmd /k "cd frontend && npm run dev"

echo.
echo =====================================================================
echo Both servers are launching!
echo - Web Application:  http://localhost:5173
echo - Swagger Docs:     http://localhost:8000/docs
echo - Backend Health:   http://localhost:8000/
echo =====================================================================
pause
