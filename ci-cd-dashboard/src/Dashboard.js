import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import NotificationCenter from './NotificationCenter';
import Icon from './Icons';

// Hex mirrors of the SCSS status tokens — recharts SVG attributes can't read CSS vars.
const CHART = { success: '#34d399', failure: '#f87171', cancelled: '#fbbf24', line: '#60a5fa', grid: '#1f2a3c', axis: '#8b98ad' };

const STATES = {
  success: { label: 'Success', icon: 'success' },
  failure: { label: 'Failed', icon: 'failure' },
  cancelled: { label: 'Cancelled', icon: 'cancelled' },
  running: { label: 'Running', icon: 'running' },
  queued: { label: 'Queued', icon: 'queued' },
  neutral: { label: 'Other', icon: 'cancelled' },
};

export const runState = (run) => {
  if (run.status === 'in_progress') return 'running';
  if (run.status === 'queued' || run.status === 'waiting' || run.status === 'pending') return 'queued';
  if (run.status === 'completed') {
    if (run.conclusion === 'success') return 'success';
    if (run.conclusion === 'failure' || run.conclusion === 'timed_out') return 'failure';
    if (run.conclusion === 'cancelled') return 'cancelled';
  }
  return 'neutral';
};

const durationSec = (run) =>
  run.status === 'completed' && run.updated_at
    ? Math.max(0, (new Date(run.updated_at) - new Date(run.run_started_at || run.created_at)) / 1000)
    : null;

export const formatDuration = (sec) => {
  if (sec == null) return '—';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.round(sec % 60);
  if (h) return `${h}h ${m}m`;
  return m ? `${m}m ${s}s` : `${s}s`;
};

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
export const timeAgo = (date) => {
  const sec = (new Date(date) - Date.now()) / 1000;
  const units = [['day', 86400], ['hour', 3600], ['minute', 60]];
  for (const [unit, size] of units) if (Math.abs(sec) >= size) return rtf.format(Math.round(sec / size), unit);
  return 'just now';
};

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'success', label: 'Success' },
  { key: 'failure', label: 'Failed' },
  { key: 'running', label: 'Running' },
];

const StatusBadge = ({ state }) => (
  <span className={`badge badge--${state}`}>
    <Icon name={STATES[state].icon} size={14} className={state === 'running' ? 'spin' : ''} />
    {STATES[state].label}
  </span>
);

const Dashboard = () => {
  const [buildStatus, setBuildStatus] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [repo, setRepo] = useState({ owner: 'octocat', repo: 'Hello-World' });
  const [repoInput, setRepoInput] = useState('octocat/Hello-World');
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [apiMode, setApiMode] = useState('backend'); // 'backend' or 'direct'
  const [filter, setFilter] = useState('all');

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

  // Dynamic API base URL - supports both local development and production
  const API_BASE = process.env.REACT_APP_API_URL ||
                  (window.location.hostname === 'localhost'
                    ? 'http://localhost:5000/api'
                    : 'https://api.github.com');

  const GITHUB_API_BASE = 'https://api.github.com';
  const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let statusData = null;
      let workflowData = null;

      // Try backend API first (if available)
      if (API_BASE.includes('localhost:5000')) {
        try {
          const statusRes = await axios.get(`${API_BASE}/github-status`, {
            params: { owner: repo.owner, repo: repo.repo }
          });
          statusData = statusRes.data.runs;

          const workflowRes = await axios.get(`${API_BASE}/github-workflows`, {
            params: { owner: repo.owner, repo: repo.repo }
          });
          workflowData = workflowRes.data.workflows;
          setApiMode('backend');
        } catch (backendError) {
          console.warn('Backend API not available, falling back to GitHub API');
          setApiMode('direct');
        }
      }

      // Fallback to direct GitHub API calls
      if (!statusData || !workflowData) {
        const headers = {};
        if (GITHUB_TOKEN) {
          headers.Authorization = `token ${GITHUB_TOKEN}`;
        }

        try {
          const runsResponse = await axios.get(
            `${GITHUB_API_BASE}/repos/${repo.owner}/${repo.repo}/actions/runs`,
            { headers, params: { per_page: 30 } }
          );
          statusData = runsResponse.data.workflow_runs || [];

          const workflowsResponse = await axios.get(
            `${GITHUB_API_BASE}/repos/${repo.owner}/${repo.repo}/actions/workflows`,
            { headers }
          );
          workflowData = workflowsResponse.data.workflows || [];
          setApiMode('direct');
        } catch (githubError) {
          if (githubError.response?.status === 404) {
            throw new Error(`Repository "${repo.owner}/${repo.repo}" not found or not accessible`);
          } else if (githubError.response?.status === 403) {
            throw new Error('GitHub API rate limit exceeded or insufficient permissions');
          } else {
            throw new Error(`GitHub API error: ${githubError.message}`);
          }
        }
      }

      setBuildStatus(statusData || []);
      setWorkflows(workflowData || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [repo.owner, repo.repo, API_BASE, GITHUB_TOKEN]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Skip polls while the tab is hidden — saves GitHub rate limit.
    const interval = setInterval(() => { if (!document.hidden) fetchData(); }, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  // Derived metrics
  const completed = buildStatus.filter((r) => r.status === 'completed');
  const successCount = completed.filter((r) => r.conclusion === 'success').length;
  const durations = completed.map(durationSec).filter((d) => d != null);
  // Median, not mean: updated_at moves on re-runs, so one stale run would skew an average.
  const sorted = [...durations].sort((a, b) => a - b);
  const medianDuration = sorted.length ? sorted[Math.floor(sorted.length / 2)] : null;

  const stats = [
    { label: 'Total Runs', value: buildStatus.length, icon: 'activity', tone: 'info' },
    {
      label: 'Success Rate',
      value: completed.length ? `${Math.round((successCount / completed.length) * 100)}%` : 'N/A',
      icon: 'success',
      tone: 'success',
    },
    { label: 'Median Duration', value: formatDuration(medianDuration), icon: 'queued', tone: 'warn' },
    { label: 'Active Workflows', value: workflows.filter((w) => w.state === 'active').length, icon: 'zap', tone: 'violet' },
    { label: 'Last Run', value: buildStatus.length ? timeAgo(buildStatus[0].created_at) : 'No runs', icon: 'refresh', tone: 'info' },
  ];

  // Outcomes per day (stacked) and duration per run — both oldest → newest.
  const byDay = {};
  [...buildStatus].reverse().forEach((run) => {
    const day = new Date(run.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    byDay[day] = byDay[day] || { day, success: 0, failure: 0, cancelled: 0 };
    const s = runState(run);
    if (byDay[day][s] !== undefined) byDay[day][s] += 1;
  });
  const outcomeData = Object.values(byDay);
  const durationData = [...completed].reverse().map((run) => ({
    name: new Date(run.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    minutes: +((durationSec(run) || 0) / 60).toFixed(1),
  }));

  const visibleRuns = filter === 'all' ? buildStatus : buildStatus.filter((r) => runState(r) === filter);
  const initialLoad = loading && buildStatus.length === 0;

  const tooltipStyle = { background: '#111827', border: '1px solid #243049', borderRadius: 10, color: '#e6ebf3' };

  return (
    <div className="app">
      <div className="app__glow" aria-hidden="true" />

      <header className="topbar">
        <div className="topbar__inner">
          <div className="brand">
            <span className="brand__mark"><Icon name="activity" size={20} /></span>
            <div>
              <h1 className="brand__title">CI/CD Monitoring Dashboard</h1>
              <div className="brand__meta">
                <span className="chip chip--repo"><Icon name="branch" size={12} />{repo.owner}/{repo.repo}</span>
                {apiMode === 'backend' ? (
                  <span className="chip chip--ok"><span className="pulse-dot" />Backend API: Active</span>
                ) : (
                  <span className="chip chip--warn">Direct GitHub API</span>
                )}
              </div>
            </div>
          </div>

          <form
            className="controls"
            onSubmit={(e) => { e.preventDefault(); handleRepoChange(); }}
          >
            <div className="field">
              <label htmlFor="repo-input" className="field__label">Repository</label>
              <div className="field__row">
                <input
                  id="repo-input"
                  type="text"
                  placeholder="owner/repo (e.g., facebook/react)"
                  className={`input ${isValidRepo(repoInput) ? '' : 'input--invalid'}`}
                  aria-invalid={!isValidRepo(repoInput)}
                  value={repoInput}
                  onChange={(e) => setRepoInput(e.target.value)}
                  onBlur={handleRepoChange}
                />
                <button type="submit" className="btn btn--primary" disabled={!isValidRepo(repoInput)}>
                  Load
                </button>
              </div>
            </div>
            <div className="field">
              <label htmlFor="refresh-select" className="field__label">Auto-refresh</label>
              <select
                id="refresh-select"
                className="input"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
              >
                <option value={10}>10s</option>
                <option value={30}>30s</option>
                <option value={60}>1m</option>
                <option value={300}>5m</option>
              </select>
            </div>
            <button
              type="button"
              onClick={fetchData}
              disabled={loading}
              aria-busy={loading}
              className="btn btn--ghost btn--refresh"
            >
              <Icon name="refresh" size={16} className={loading ? 'spin' : ''} />
              {loading ? 'Refreshing' : 'Refresh'}
            </button>
          </form>
        </div>
      </header>

      <main className="container">
        {lastUpdated && (
          <p className="updated" aria-live="polite">Last updated {lastUpdated.toLocaleTimeString()}</p>
        )}

        {error && (
          <div className="alert" role="alert">
            <Icon name="alert" size={20} />
            <div>
              <p className="alert__title">Connection Error</p>
              <p>{error}</p>
              <ul className="alert__list">
                <li>Check the repository “{repo.owner}/{repo.repo}” exists and is public</li>
                <li>Check the backend is running, or that the GitHub API is reachable</li>
                {!GITHUB_TOKEN && <li>Unauthenticated requests are limited to 60/hour per IP</li>}
              </ul>
            </div>
          </div>
        )}

        <section className="stats" aria-label="Summary">
          {stats.map((stat, i) => (
            <div key={stat.label} className={`card card--tilt stat stat--${stat.tone}`} style={{ '--i': i }}>
              <div className="stat__icon"><Icon name={stat.icon} size={18} /></div>
              <p className="stat__label">{stat.label}</p>
              <p className="stat__value">{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="panels">
          <div className="card panel" style={{ '--i': 5 }}>
            <h2 className="panel__title">Outcomes per day</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={outcomeData}>
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="day" stroke={CHART.axis} tickLine={false} fontSize={12} />
                <YAxis allowDecimals={false} stroke={CHART.axis} tickLine={false} fontSize={12} width={28} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(96,165,250,0.08)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="success" name="Success" stackId="a" fill={CHART.success} />
                <Bar dataKey="failure" name="Failed" stackId="a" fill={CHART.failure} />
                <Bar dataKey="cancelled" name="Cancelled" stackId="a" fill={CHART.cancelled} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card panel" style={{ '--i': 6 }}>
            <h2 className="panel__title">Run duration (min)</h2>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={durationData}>
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="name" stroke={CHART.axis} tickLine={false} fontSize={12} />
                <YAxis stroke={CHART.axis} tickLine={false} fontSize={12} width={44} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="minutes" name="Minutes" stroke={CHART.line} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <NotificationCenter />
        </section>

        <section className="card runs" style={{ '--i': 8 }} aria-labelledby="runs-title">
          <div className="runs__head">
            <h2 id="runs-title" className="panel__title">Recent workflow runs</h2>
            <div className="segmented" role="group" aria-label="Filter runs by status">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={`segmented__btn ${filter === f.key ? 'is-active' : ''}`}
                  aria-pressed={filter === f.key}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {initialLoad && (
            <div className="skeleton-list" aria-live="polite">
              {[0, 1, 2, 3].map((n) => <div key={n} className="skeleton" aria-hidden="true" />)}
              <p className="muted">Loading workflow runs...</p>
            </div>
          )}

          {!initialLoad && visibleRuns.length === 0 && (
            <div className="empty">
              <Icon name="activity" size={28} />
              <p>{buildStatus.length ? 'No runs match this filter.' : 'No workflow runs found for this repository.'}</p>
            </div>
          )}

          <ul className="run-list">
            {visibleRuns.map((run, i) => {
              const state = runState(run);
              return (
                <li key={run.id} className={`run run--${state}`} style={{ '--i': i }}>
                  <span className="run__rail" aria-hidden="true" />
                  <div className="run__main">
                    <div className="run__title">
                      <span className="run__name">{run.display_title || run.name}</span>
                      <StatusBadge state={state} />
                    </div>
                    <div className="run__meta">
                      <span>{run.name}{run.run_number ? ` #${run.run_number}` : ''}</span>
                      <span className="chip"><Icon name="branch" size={12} />{run.head_branch}</span>
                      <span className="mono"><Icon name="commit" size={12} />{run.head_sha?.slice(0, 7)}</span>
                      <span>{run.event}</span>
                      {run.actor?.login && <span>by {run.actor.login}</span>}
                    </div>
                  </div>
                  <div className="run__side">
                    <span className="run__time" title={new Date(run.created_at).toLocaleString()}>{timeAgo(run.created_at)}</span>
                    <span className="muted">{state === 'running' ? 'In progress' : formatDuration(durationSec(run))}</span>
                    <a href={run.html_url} target="_blank" rel="noopener noreferrer" className="link">
                      View on GitHub <Icon name="external" size={12} />
                      <span className="sr-only"> (opens in new tab)</span>
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <footer className="footer">
          <p>Created with ❤️ by <span className="footer__name">Nirmal Koswatta</span></p>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
