# 🚀 CI/CD Monitoring Dashboard

A beautiful, real-time monitoring dashboard for GitHub Actions and CI/CD pipelines built with React and Node.js.

![Dashboard Preview](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/React-18+-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-Supported-orange)

## ✨ Features

- **Real-time Monitoring**: Live updates of GitHub Actions workflow status
- **Beautiful UI**: Modern dashboard with Tailwind CSS styling
- **Interactive Charts**: Visual representation of build trends and statistics
- **Repository Switching**: Monitor multiple repositories dynamically
- **Auto-refresh**: Configurable refresh intervals (10s to 5m)
- **Responsive Design**: Works perfectly on desktop and mobile
- **API Integration**: Secure backend API for GitHub data fetching
- **Notification Support**: Slack webhook integration for alerts

## 🛠️ Tech Stack

### Frontend
- **React 18+** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Interactive data visualization
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **GitHub API** - CI/CD data source
- **CORS** - Cross-origin resource sharing

### CI/CD
- **GitHub Actions** - Automated workflows
- **Deployment Ready** - Netlify & Render compatible

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- GitHub personal access token
- Git repository with GitHub Actions

### 1. Clone Repository
\`\`\`bash
git clone https://github.com/Nirmalkoswatta/Monitoring-Dashboard.git
cd Monitoring-Dashboard
\`\`\`

### 2. Setup Backend
\`\`\`bash
cd backend
npm install
\`\`\`

Create \`.env\` file:
\`\`\`env
GITHUB_TOKEN=your_github_personal_access_token_here
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
PORT=5000
\`\`\`

Start backend server:
\`\`\`bash
npm start
# or for development
npm run dev
\`\`\`

### 3. Setup Frontend
\`\`\`bash
cd ../ci-cd-dashboard
npm install
npm start
\`\`\`

### 4. Access Dashboard
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/health

## 🔧 Configuration

### GitHub Token Setup
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with scopes:
   - `repo` - Repository access
   - `workflow` - GitHub Actions workflow access
3. Copy token to `.env` file

### Slack Integration (Optional)
1. Create Slack webhook: https://api.slack.com/messaging/webhooks
2. Add webhook URL to `.env` file
3. Test notifications via API endpoint

## 📊 API Endpoints

### Health Check
\`\`\`http
GET /api/health
\`\`\`

### GitHub Workflow Runs
\`\`\`http
GET /api/github-status?owner=USERNAME&repo=REPONAME
\`\`\`

### GitHub Workflows
\`\`\`http
GET /api/github-workflows?owner=USERNAME&repo=REPONAME
\`\`\`

### Slack Notifications
\`\`\`http
POST /api/notify-slack
Content-Type: application/json

{
  "message": "Your notification message"
}
\`\`\`

## 🎨 Dashboard Features

### Real-time Stats
- Total workflow runs
- Success rate percentage
- Active workflows count
- Last run timestamp

### Interactive Charts
- **Line Chart**: Build trends over time
- **Bar Chart**: Status distribution
- **Responsive**: Adapts to screen size

### Workflow List
- Live status indicators
- Branch and commit information
- Duration calculations
- Direct GitHub links

### Customization
- Repository switching
- Refresh interval control
- Real-time updates
- Error handling

## 🚢 Deployment

### Frontend (Netlify)
1. Build the project: \`npm run build\`
2. Deploy \`build\` folder to Netlify
3. Set environment variables if needed

### Backend (Render)
1. Connect GitHub repository
2. Set build command: \`npm install\`
3. Set start command: \`npm start\`
4. Add environment variables

### Environment Variables for Production
\`\`\`env
GITHUB_TOKEN=your_production_token
SLACK_WEBHOOK_URL=your_slack_webhook
PORT=5000
NODE_ENV=production
\`\`\`

## 🔒 Security

- GitHub tokens are stored securely in environment variables
- CORS properly configured for cross-origin requests
- API rate limiting considerations
- No sensitive data in frontend code

## 📈 Monitoring Multiple Repositories

The dashboard supports monitoring multiple repositories:
1. Enter \`owner/repo\` in the repository input
2. Dashboard automatically fetches new data
3. Bookmarks for quick switching between projects

## 🛡️ Error Handling

- **401 Unauthorized**: Invalid GitHub token
- **404 Not Found**: Repository doesn't exist
- **403 Forbidden**: Rate limit exceeded
- **Network Errors**: Connection issues
- **Invalid Input**: Missing owner/repo parameters

## 🔄 Auto-refresh

Configurable refresh intervals:
- 10 seconds - For active development
- 30 seconds - Default setting
- 1 minute - Regular monitoring
- 5 minutes - Background monitoring

## 🎯 Future Enhancements

- [ ] **Jenkins Integration**: Support for Jenkins CI/CD
- [ ] **Multiple VCS**: GitLab, Bitbucket support
- [ ] **Advanced Notifications**: Email, Teams, Discord
- [ ] **User Authentication**: Login system
- [ ] **Dashboard Sharing**: Public dashboard URLs
- [ ] **Historical Data**: Long-term trend analysis
- [ ] **Dark Mode**: Theme switching
- [ ] **Docker Support**: Containerized deployment
- [ ] **Metrics Export**: Prometheus/Grafana integration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: \`git checkout -b feature/amazing-feature\`
3. Commit changes: \`git commit -m 'Add amazing feature'\`
4. Push to branch: \`git push origin feature/amazing-feature\`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@monitoring-dashboard.com
- 🐛 Issues: [GitHub Issues](https://github.com/Nirmalkoswatta/Monitoring-Dashboard/issues)
- 📖 Documentation: [Wiki](https://github.com/Nirmalkoswatta/Monitoring-Dashboard/wiki)

## 🙏 Acknowledgments

- GitHub API for workflow data
- React community for amazing tools
- Tailwind CSS for beautiful styling
- Recharts for data visualization

---

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by [Nirmal Koswatta](https://github.com/Nirmalkoswatta)
