import React, { useState } from 'react';
import axios from 'axios';
import Icon from './Icons';

const NotificationCenter = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Dynamic API base URL - supports both local development and production
  const API_BASE = process.env.REACT_APP_API_URL ||
                  (window.location.hostname === 'localhost'
                    ? 'http://localhost:5000/api'
                    : null);

  const sendSlackNotification = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (!API_BASE) {
      setResult({
        type: 'error',
        message: 'Slack notifications require a backend API. Please set REACT_APP_API_URL environment variable.'
      });
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/notify-slack`, { message });
      setResult({ type: 'success', message: 'Notification sent successfully!' });
      setMessage('');
    } catch (error) {
      setResult({
        type: 'error',
        message: error.response?.data?.error || 'Failed to send notification. Backend API may not be available.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card panel notify" style={{ '--i': 7 }}>
      <h2 className="panel__title"><Icon name="bell" size={16} /> Notification Center</h2>

      <form className="notify__form" onSubmit={sendSlackNotification}>
        <label htmlFor="notify-message" className="field__label">
          Send Test Notification to Slack
        </label>
        <textarea
          id="notify-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your notification message..."
          className="input input--area"
          maxLength={500}
          rows={4}
        />
        <span className="notify__count muted">{message.length}/500</span>

        <button
          type="submit"
          disabled={loading || !message.trim()}
          aria-busy={loading}
          className="btn btn--primary btn--block"
        >
          <Icon name={loading ? 'running' : 'send'} size={16} className={loading ? 'spin' : ''} />
          {loading ? 'Sending…' : 'Send Notification'}
        </button>
      </form>

      <div aria-live="polite">
        {result && (
          <div className={`toast toast--${result.type}`}>
            <Icon name={result.type === 'success' ? 'success' : 'alert'} size={16} />
            {result.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
