# GitHub Setup Guide

## Step 1: Install Git

### Windows:
1. Download Git from: https://git-scm.com/download/win
2. Run the installer
3. Use default settings (or customize as needed)
4. Restart your terminal/PowerShell after installation

### Verify Installation:
```bash
git --version
```

## Step 2: Configure Git (if first time)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 3: Initialize Git Repository

Run these commands in your project directory:

```bash
# Navigate to project directory
cd C:\Users\glitched\Desktop\Projects\Browser

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Safe Browser with CI/CD setup"

# Add remote repository (replace with your actual GitHub repo URL)
git remote add origin https://github.com/glitchy1122/safe-browser.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 4: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `safe-browser`
3. Description: "A modern, secure Electron-based web browser"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 5: Push Your Code

After creating the repository on GitHub, use the commands from Step 3 to push your code.

## Continuous Integration

GitHub Actions will automatically run on every push and pull request. The CI workflow:

- ✅ Tests on Windows, macOS, and Linux
- ✅ Tests with Node.js 18.x and 20.x
- ✅ Validates code syntax
- ✅ Runs security audit

Check the "Actions" tab on GitHub to see CI results.

## Useful Git Commands

```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push

# Pull latest changes
git pull

# View commit history
git log

# Create a new branch
git checkout -b feature-name

# Switch branches
git checkout branch-name
```

