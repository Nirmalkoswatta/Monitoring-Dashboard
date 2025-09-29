# 🚀 CI/CD Monitoring Dashboard - Setup Instructions

## Quick Setup Guide

### 1. Install Dependencies

```bash
# Install all dependencies at once
npm run install-all

# Or install individually:
npm install                    # Root dependencies
cd ci-cd-dashboard && npm install  # Frontend
cd ../backend && npm install       # Backend
```

### 2. Configure Environment

Copy the example environment file:

```bash
cd backend
cp .env .env.local
```

Edit `backend/.env` with your GitHub token:

```env
GITHUB_TOKEN=ghp_your_github_personal_access_token_here
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
PORT=5000
```

### 3. Get GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes:
   - ✅ `repo` - Full control of private repositories
   - ✅ `workflow` - Update GitHub Action workflows
4. Copy the token and paste it in your `.env` file

### 4. Start the Application

```bash
# Start both frontend and backend together
npm start

# Or start individually:
npm run start:backend   # Backend only (port 5000)
npm run start:frontend  # Frontend only (port 3000)
```

### 5. Access the Dashboard

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/health

## Testing the Setup

### 1. Test Backend API

```bash
# Health check
curl http://localhost:5000/api/health

# Test GitHub API (replace with your repo)
curl "http://localhost:5000/api/github-status?owner=octocat&repo=Hello-World"
```

### 2. Test Frontend

1. Open http://localhost:3000
2. Change repository to your own repo
3. Check if workflow data loads
4. Try different refresh intervals

### 3. Test Slack Notifications (Optional)

1. Set up Slack webhook URL in `.env`
2. Use the notification center in the dashboard
3. Send a test message

## Repository Examples to Try

Since you might not have workflows set up yet, try these public repositories:

1. **Facebook React**: `facebook/react`
2. **Microsoft VS Code**: `microsoft/vscode`
3. **Vercel Next.js**: `vercel/next.js`
4. **Your own repository** (once you push with the included workflow)

## Common Issues & Solutions

### ❌ "GitHub token is invalid or missing"

- Check your token in `.env` file
- Ensure token has `repo` and `workflow` scopes
- Token should start with `ghp_` or `github_pat_`

### ❌ "Repository not found or no access"

- Check repository owner/name spelling
- Ensure repository exists and is accessible
- Try with a public repository first

### ❌ "API rate limit exceeded"

- GitHub API has rate limits (5000 requests/hour for authenticated users)
- Increase refresh interval
- Check if token is properly set

### ❌ Frontend can't connect to backend

- Ensure backend is running on port 5000
- Check console for CORS errors
- Try restarting both services

### ❌ No workflow runs showing

- Repository might not have GitHub Actions enabled
- Push some code to trigger the included workflow
- Check if workflows exist in `.github/workflows/`

## Development Tips

### Hot Reload Development

```bash
# For backend with nodemon (install globally: npm i -g nodemon)
cd backend && npm run dev

# Frontend already has hot reload with npm start
```

### Project Structure

```
Monitoring Dashboard/
├── ci-cd-dashboard/         # React frontend
├── backend/                 # Node.js API
├── .github/workflows/       # GitHub Actions
├── package.json            # Root package file
└── README.md              # Documentation
```

### Making Changes

- **Frontend**: Edit files in `ci-cd-dashboard/src/`
- **Backend**: Edit files in `backend/`
- **Styling**: Use Tailwind CSS classes
- **API**: Add endpoints in `backend/server.js`

## Next Steps

1. **Push to GitHub**: Commit and push your code to trigger workflows
2. **Add Real Data**: Monitor your own repositories
3. **Customize**: Modify colors, add features, etc.
4. **Deploy**: Use Netlify (frontend) and Render (backend)
5. **Scale**: Add more notification channels, Jenkins support

Happy monitoring! 🎉
