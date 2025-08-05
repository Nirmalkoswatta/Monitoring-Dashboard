#!/bin/bash

echo "🚀 Building CI/CD Monitoring Dashboard for Netlify..."

# Navigate to frontend directory
cd ci-cd-dashboard

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building application..."
npm run build

echo "✅ Build complete! The 'build' directory is ready for deployment."
echo "📁 Build output is in: ci-cd-dashboard/build"
echo ""
echo "🌐 To deploy to Netlify:"
echo "1. Go to https://app.netlify.com"
echo "2. Drag and drop the 'build' folder, or"
echo "3. Connect your GitHub repository for automatic deployments"
