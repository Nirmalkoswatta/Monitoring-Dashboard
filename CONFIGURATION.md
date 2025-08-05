# Configuration Guide

## Environment Variables Setup

### For Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the values in `.env.local`:
   - `REACT_APP_GITHUB_TOKEN`: Your GitHub personal access token
   - `REACT_APP_API_URL`: Leave as default for local development

### For Production Deployment

1. **Netlify Configuration**:
   - Go to your Netlify site settings
   - Navigate to "Environment variables"
   - Add the following variables:
     - `REACT_APP_GITHUB_TOKEN`: Your GitHub personal access token
     - `REACT_APP_API_URL`: Your backend API URL (if different from default)

2. **GitHub Token Setup**:
   - Go to [GitHub Settings > Personal Access Tokens](https://github.com/settings/personal-access-tokens)
   - Generate a new token with these permissions:
     - `repo` (if accessing private repositories)
     - `workflow` (to read GitHub Actions data)
   - Copy the token and add it to your environment variables

### Testing Configuration

To test if your configuration is working:

1. **Local Testing**:
   ```bash
   npm start
   ```

2. **Production Testing**:
   - Deploy to Netlify
   - Check the browser console for any API errors
   - Verify the connection status in the dashboard header

### API Fallback

The dashboard supports two modes:
- **Backend API**: Uses your Node.js backend (recommended)
- **Direct GitHub API**: Falls back to direct GitHub API calls

The dashboard will automatically detect which mode to use based on availability.
