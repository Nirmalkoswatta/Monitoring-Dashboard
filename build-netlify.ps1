Write-Host "🚀 Building CI/CD Monitoring Dashboard for Netlify..." -ForegroundColor Green

# Navigate to frontend directory
Set-Location "ci-cd-dashboard"

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm ci

# Build the application
Write-Host "🔨 Building application..." -ForegroundColor Yellow
npm run build

Write-Host "✅ Build complete! The 'build' directory is ready for deployment." -ForegroundColor Green
Write-Host "📁 Build output is in: ci-cd-dashboard/build" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 To deploy to Netlify:" -ForegroundColor Magenta
Write-Host "1. Go to https://app.netlify.com" -ForegroundColor White
Write-Host "2. Drag and drop the 'build' folder, or" -ForegroundColor White
Write-Host "3. Connect your GitHub repository for automatic deployments" -ForegroundColor White

# Return to original directory
Set-Location ".."
