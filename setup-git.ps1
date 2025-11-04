# Safe Browser - Git Setup Script (PowerShell)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Safe Browser - Git Repository Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is installed
try {
    $gitVersion = git --version 2>&1
    Write-Host "Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Git is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "Then run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Check if already a git repository
if (Test-Path .git) {
    Write-Host "Warning: This directory is already a git repository." -ForegroundColor Yellow
    $continue = Read-Host "Do you want to continue? (y/n)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 0
    }
    Write-Host ""
}

# Initialize git repository
Write-Host "[1/5] Initializing git repository..." -ForegroundColor Cyan
git init
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to initialize git repository" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Add all files
Write-Host "[2/5] Adding files..." -ForegroundColor Cyan
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to add files" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Create initial commit
Write-Host "[3/5] Creating initial commit..." -ForegroundColor Cyan
git commit -m "Initial commit: Safe Browser with CI/CD setup"
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to create commit" -ForegroundColor Yellow
    Write-Host "Note: If this is not your first commit, this is normal." -ForegroundColor Yellow
}

# Ask for remote URL
Write-Host ""
Write-Host "[4/5] Setting up remote repository..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Please enter your GitHub repository URL:" -ForegroundColor Yellow
Write-Host "Example: https://github.com/glitchy1122/safe-browser.git" -ForegroundColor Gray
Write-Host ""
$remoteUrl = Read-Host "GitHub repository URL"

if ([string]::IsNullOrWhiteSpace($remoteUrl)) {
    Write-Host "ERROR: No URL provided" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Add remote
try {
    git remote add origin $remoteUrl 2>&1 | Out-Null
} catch {
    Write-Host "Remote already exists, updating..." -ForegroundColor Yellow
    git remote set-url origin $remoteUrl
}

# Set main branch
Write-Host "[5/5] Setting up branch..." -ForegroundColor Cyan
git branch -M main

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Make sure you've created the repository on GitHub"
Write-Host "2. Run: git push -u origin main"
Write-Host ""

$pushNow = Read-Host "Push to GitHub now? (y/n)"
if ($pushNow -eq "y" -or $pushNow -eq "Y") {
    Write-Host ""
    Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
    git push -u origin main
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "ERROR: Failed to push. Make sure:" -ForegroundColor Red
        Write-Host "- The repository exists on GitHub"
        Write-Host "- You have authentication set up"
        Write-Host "- You have write access to the repository"
        Write-Host ""
        Write-Host "You can push manually later with: git push -u origin main" -ForegroundColor Yellow
    } else {
        Write-Host ""
        Write-Host "SUCCESS! Your code has been pushed to GitHub!" -ForegroundColor Green
        Write-Host ""
        Write-Host "CI/CD will automatically run on your next push." -ForegroundColor Cyan
    }
}

Write-Host ""
Read-Host "Press Enter to exit"

