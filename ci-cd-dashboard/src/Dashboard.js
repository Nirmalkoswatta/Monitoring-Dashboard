import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import NotificationCenter from './NotificationCenter';

const Dashboard = () => {
  const [buildStatus, setBuildStatus] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [repo, setRepo] = useState({ owner: 'octocat', repo: 'Hello-World' });
  const [repoInput, setRepoInput] = useState('octocat/Hello-World');
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [lastUpdated, setLastUpdated] = useState(null);

  const isValidRepo = (input) => {
    const parts = input.split('/');
    return parts.length === 2 && parts[0].trim() && parts[1].trim();
  };

  const handleRepoChange = () => {
    if (isValidRepo(repoInput)) {
      const [owner, repoName] = repoInput.split('/');
      setRepo({ owner: owner.trim(), repo: repoName.trim() });
    }
  };

  const API_BASE = 'http://localhost:5000/api';

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch workflow runs
      const statusRes = await axios.get(`${API_BASE}/github-status`, {
        params: { owner: repo.owner, repo: repo.repo }
      });
      setBuildStatus(statusRes.data.runs);

      // Fetch workflows
      const workflowRes = await axios.get(`${API_BASE}/github-workflows`, {
        params: { owner: repo.owner, repo: repo.repo }
      });
      setWorkflows(workflowRes.data.workflows);

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.error || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [repo.owner, repo.repo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const interval = setInterval(fetchData, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  const getStatusIcon = (status, conclusion) => {
    if (status === 'completed') {
      switch (conclusion) {
        case 'success': return '✅';
        case 'failure': return '❌';
        case 'cancelled': return '⚠️';
        default: return '❓';
      }
    }
    if (status === 'in_progress') return '🔄';
    if (status === 'queued') return '⏳';
    return '❓';
  };

  const getStatusColor = (status, conclusion) => {
    if (status === 'completed') {
      switch (conclusion) {
        case 'success': return 'bg-green-100 text-green-800 border-green-200';
        case 'failure': return 'bg-red-100 text-red-800 border-red-200';
        case 'cancelled': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
    if (status === 'in_progress') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (status === 'queued') return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const chartData = buildStatus.slice(0, 7).reverse().map((run, index) => ({
    name: `Run ${index + 1}`,
    success: run.conclusion === 'success' ? 1 : 0,
    failure: run.conclusion === 'failure' ? 1 : 0,
    cancelled: run.conclusion === 'cancelled' ? 1 : 0,
    timestamp: new Date(run.created_at).toLocaleDateString()
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🚀 CI/CD Monitoring Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Real-time monitoring of GitHub Actions workflows
                {repo.owner && repo.repo && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    📁 {repo.owner}/{repo.repo}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Repository:</label>
                <input
                  type="text"
                  placeholder="owner/repo (e.g., facebook/react)"
                  className={`px-3 py-1 border rounded-md text-sm ${
                    isValidRepo(repoInput) 
                      ? 'border-gray-300 focus:border-blue-500' 
                      : 'border-red-300 focus:border-red-500'
                  }`}
                  value={repoInput}
                  onChange={(e) => setRepoInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleRepoChange();
                    }
                  }}
                  onBlur={handleRepoChange}
                />
                <button
                  onClick={handleRepoChange}
                  disabled={!isValidRepo(repoInput)}
                  className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Load
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Refresh:</label>
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value={10}>10s</option>
                  <option value={30}>30s</option>
                  <option value={60}>1m</option>
                  <option value={300}>5m</option>
                </select>
              </div>
              <button
                onClick={fetchData}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                {loading ? '🔄' : '↻'} Refresh
              </button>
            </div>
          </div>
          
          {lastUpdated && (
            <p className="text-xs text-gray-500 mt-4">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-red-600 mr-2">⚠️</span>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Total Runs', value: buildStatus.length, icon: '📊' },
            { 
              label: 'Success Rate', 
              value: buildStatus.length > 0 
                ? `${Math.round((buildStatus.filter(r => r.conclusion === 'success').length / buildStatus.length) * 100)}%`
                : 'N/A',
              icon: '✅' 
            },
            { 
              label: 'Active Workflows', 
              value: workflows.filter(w => w.state === 'active').length,
              icon: '⚡' 
            },
            { 
              label: 'Last Run', 
              value: buildStatus.length > 0 
                ? new Date(buildStatus[0].created_at).toLocaleDateString()
                : 'No runs',
              icon: '🕒' 
            }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">📈 Recent Build Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="failure" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">📊 Build Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="success" fill="#10b981" />
                <Bar dataKey="failure" fill="#ef4444" />
                <Bar dataKey="cancelled" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <NotificationCenter />
        </div>

        {/* Build Status List */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">🔄 Recent Workflow Runs</h3>
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading workflow runs...</p>
            </div>
          )}
          
          {!loading && buildStatus.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No workflow runs found for this repository.</p>
            </div>
          )}

          <div className="space-y-3">
            {buildStatus.map((run) => (
              <div
                key={run.id}
                className={`border rounded-lg p-4 ${getStatusColor(run.status, run.conclusion)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{getStatusIcon(run.status, run.conclusion)}</span>
                    <div>
                      <h4 className="font-medium">{run.name}</h4>
                      <p className="text-sm opacity-75">
                        {run.head_branch} • {run.head_sha} • {run.event}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium capitalize">
                      {run.status === 'completed' ? run.conclusion : run.status}
                    </p>
                    <p className="text-xs opacity-75">
                      {new Date(run.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <div className="text-xs opacity-75">
                    Duration: {run.updated_at 
                      ? Math.round((new Date(run.updated_at) - new Date(run.created_at)) / 1000 / 60) 
                      : 'N/A'} min
                  </div>
                  <a
                    href={run.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline hover:no-underline"
                  >
                    View on GitHub →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
