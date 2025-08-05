const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!', timestamp: new Date().toISOString() });
});

// GitHub Actions Status endpoint
app.get('/api/github-status', async (req, res) => {
  try {
    const { owner, repo } = req.query;
    
    if (!owner || !repo) {
      return res.status(400).json({ 
        error: 'Missing required parameters: owner and repo' 
      });
    }

    const result = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/actions/runs`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'CI-CD-Dashboard'
        }
      }
    );

    const statusList = result.data.workflow_runs.slice(0, 10).map(run => ({
      id: run.id,
      name: run.name || 'Unnamed Workflow',
      status: run.status,
      conclusion: run.conclusion,
      created_at: run.created_at,
      updated_at: run.updated_at,
      head_branch: run.head_branch,
      head_sha: run.head_sha.substring(0, 7),
      event: run.event,
      workflow_id: run.workflow_id,
      html_url: run.html_url
    }));

    res.json({
      repository: `${owner}/${repo}`,
      runs: statusList,
      total_count: result.data.total_count
    });
  } catch (error) {
    console.error('GitHub API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      return res.status(401).json({ 
        error: 'GitHub token is invalid or missing' 
      });
    } else if (error.response?.status === 404) {
      return res.status(404).json({ 
        error: 'Repository not found or no access' 
      });
    } else if (error.response?.status === 403) {
      return res.status(403).json({ 
        error: 'API rate limit exceeded or insufficient permissions' 
      });
    }
    
    res.status(500).json({ 
      error: 'Error fetching GitHub status',
      details: error.message
    });
  }
});

// Get repository workflow details
app.get('/api/github-workflows', async (req, res) => {
  try {
    const { owner, repo } = req.query;
    
    if (!owner || !repo) {
      return res.status(400).json({ 
        error: 'Missing required parameters: owner and repo' 
      });
    }

    const result = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'CI-CD-Dashboard'
        }
      }
    );

    const workflows = result.data.workflows.map(workflow => ({
      id: workflow.id,
      name: workflow.name,
      path: workflow.path,
      state: workflow.state,
      created_at: workflow.created_at,
      updated_at: workflow.updated_at,
      html_url: workflow.html_url
    }));

    res.json({
      repository: `${owner}/${repo}`,
      workflows: workflows,
      total_count: result.data.total_count
    });
  } catch (error) {
    console.error('GitHub Workflows API Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Error fetching GitHub workflows',
      details: error.message
    });
  }
});

// Slack notification endpoint (for testing)
app.post('/api/notify-slack', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!process.env.SLACK_WEBHOOK_URL) {
      return res.status(400).json({ 
        error: 'Slack webhook URL not configured' 
      });
    }

    await axios.post(process.env.SLACK_WEBHOOK_URL, {
      text: message || "🔔 CI/CD Dashboard Notification",
    });

    res.json({ success: true, message: 'Notification sent to Slack' });
  } catch (error) {
    console.error('Slack notification error:', error.message);
    res.status(500).json({ 
      error: 'Error sending Slack notification',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 CI/CD Monitoring Dashboard API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 GitHub Status: http://localhost:${PORT}/api/github-status?owner=USERNAME&repo=REPONAME`);
});
