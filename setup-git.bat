@echo off
echo ========================================
echo Safe Browser - Git Repository Setup
echo ========================================
echo.

:: Check if Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed!
    echo.
    echo Please install Git from: https://git-scm.com/download/win
    echo Then run this script again.
    pause
    exit /b 1
)

echo Git is installed!
echo.

:: Check if already a git repository
if exist .git (
    echo Warning: This directory is already a git repository.
    echo.
    set /p CONTINUE="Do you want to continue? (y/n): "
    if /i not "%CONTINUE%"=="y" exit /b 0
    echo.
)

:: Initialize git repository
echo [1/5] Initializing git repository...
git init
if errorlevel 1 (
    echo ERROR: Failed to initialize git repository
    pause
    exit /b 1
)

:: Add all files
echo [2/5] Adding files...
git add .
if errorlevel 1 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)

:: Create initial commit
echo [3/5] Creating initial commit...
git commit -m "Initial commit: Safe Browser with CI/CD setup"
if errorlevel 1 (
    echo ERROR: Failed to create commit
    echo Note: If this is not your first commit, this is normal.
    pause
    exit /b 1
)

:: Ask for remote URL
echo.
echo [4/5] Setting up remote repository...
echo.
echo Please enter your GitHub repository URL:
echo Example: https://github.com/glitchy1122/safe-browser.git
echo.
set /p REMOTE_URL="GitHub repository URL: "

if "%REMOTE_URL%"=="" (
    echo ERROR: No URL provided
    pause
    exit /b 1
)

:: Add remote
git remote add origin %REMOTE_URL% 2>nul
if errorlevel 1 (
    echo Remote already exists, updating...
    git remote set-url origin %REMOTE_URL%
)

:: Set main branch
echo [5/5] Setting up branch...
git branch -M main

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Make sure you've created the repository on GitHub
echo 2. Run: git push -u origin main
echo.
set /p PUSH_NOW="Push to GitHub now? (y/n): "
if /i "%PUSH_NOW%"=="y" (
    echo.
    echo Pushing to GitHub...
    git push -u origin main
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to push. Make sure:
        echo - The repository exists on GitHub
        echo - You have authentication set up
        echo - You have write access to the repository
        echo.
        echo You can push manually later with: git push -u origin main
    ) else (
        echo.
        echo SUCCESS! Your code has been pushed to GitHub!
        echo.
        echo CI/CD will automatically run on your next push.
    )
)

echo.
pause

