@echo off
TITLE VeriMark - Full Adversarial Test Gauntlet
echo =====================================================================
echo    VeriMark (H8) — Running Full Adversarial & Stress Test Suite
echo =====================================================================
echo.
cd backend
python -m pytest tests\test_adversarial_suite.py -v
echo.
echo =====================================================================
pause
