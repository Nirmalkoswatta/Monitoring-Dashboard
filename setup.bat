@echo off
echo.
echo ===============================================
echo  CI/CD Monitoring Dashboard - Quick Setup
echo ===============================================
echo.
echo This will help you configure your GitHub token.
echo.
echo Step 1: Get your GitHub Personal Access Token
echo -------------------------------------------
echo 1. Go to: https://github.com/settings/tokens
echo 2. Click "Generate new token (classic)"
echo 3. Name: "CI/CD Dashboard"
echo 4. Select scopes: repo, workflow
echo 5. Generate and copy the token
echo.
set /p TOKEN="Enter your GitHub token (starts with ghp_ or github_pat_): "

if "%TOKEN%"=="" (
    echo Error: No token provided
    pause
    exit /b 1
)

echo.
echo Updating configuration...

cd backend
powershell -Command "(Get-Content .env) -replace 'GITHUB_TOKEN=your_github_personal_access_token_here', 'GITHUB_TOKEN=%TOKEN%' | Set-Content .env"

echo.
echo ✅ Configuration updated!
echo.
echo Now you can:
echo - Start both services: npm start
echo - Start backend only: npm run start:backend  
echo - Start frontend only: npm run start:frontend
echo.
echo Dashboard will be available at: http://localhost:3000
echo API will be available at: http://localhost:5000
echo.
pause
