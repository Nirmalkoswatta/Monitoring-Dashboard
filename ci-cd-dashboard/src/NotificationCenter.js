import React, { useState } from 'react';
import axios from 'axios';

const NotificationCenter = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const sendSlackNotification = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/notify-slack', {
        message: message
      });
      setResult({ type: 'success', message: 'Notification sent successfully!' });
      setMessage('');
    } catch (error) {
      setResult({ 
        type: 'error', 
        message: error.response?.data?.error || 'Failed to send notification' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">🔔 Notification Center</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Send Test Notification to Slack
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your notification message..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        
        <button
          onClick={sendSlackNotification}
          disabled={loading || !message.trim()}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '🔄 Sending...' : '📤 Send Notification'}
        </button>
        
        {result && (
          <div className={`p-3 rounded-md ${
            result.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {result.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
