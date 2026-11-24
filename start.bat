@echo off
title Global Keyword Intelligence Platform
color 0B
cd /d "%~dp0"

echo ============================================================
echo    GLOBAL KEYWORD INTELLIGENCE & AI SEO PLATFORM (v2.1)
echo ============================================================
echo.

:: 1. Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js is not found on this computer!
    echo Please install Node.js from https://nodejs.org and try again.
    echo.
    pause
    exit /b 1
)

:: 2. Check if node_modules already exists (Only install if missing)
if not exist "node_modules\" (
    echo [SETUP] First time setup: Installing dependencies...
    echo Yeh sirf pehli dafa hoga, agay sy direct start hoga...
    echo.
    call npm install --loglevel=error
    if %errorlevel% neq 0 (
        color 0C
        echo [ERROR] Installation failed. Please check internet connection.
        pause
        exit /b 1
    )
    echo [OK] Setup completed!
    echo.
) else (
    echo [OK] Packages already installed. Starting instantly...
)

:: 3. Automatically open browser in 3 seconds
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"

:: 4. Start server
echo.
echo ============================================================
echo   Application is Live: http://localhost:3000
echo   Browser will open automatically in 3 seconds.
echo   (Is window ko band na karein jab tak app use krni hai)
echo ============================================================
echo.

call npm run dev
pause
