import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NotificationCenter from './NotificationCenter';

describe('NotificationCenter Component', () => {
  test('renders notification center title', () => {
    render(<NotificationCenter />);
    const element = screen.getByText('Notification Center');
    expect(element).toBeInTheDocument();
  });

  test('renders send notification button', () => {
    render(<NotificationCenter />);
    const button = screen.getByRole('button', { name: /Send Notification/i });
    expect(button).toBeInTheDocument();
  });

  test('renders notification textarea', () => {
    render(<NotificationCenter />);
    const textarea = screen.getByPlaceholderText(/Enter your notification message.../i);
    expect(textarea).toBeInTheDocument();
  });

  test('handles message input change', () => {
    render(<NotificationCenter />);
    const textarea = screen.getByPlaceholderText(/Enter your notification message.../i);
    
    fireEvent.change(textarea, { target: { value: 'Test notification' } });
    expect(textarea.value).toBe('Test notification');
  });

  test('button is disabled when message is empty', () => {
    render(<NotificationCenter />);
    const button = screen.getByRole('button', { name: /Send Notification/i });
    const textarea = screen.getByPlaceholderText(/Enter your notification message.../i);
    
    // Button should be disabled with empty message
    expect(button).toBeDisabled();
    
    // Button should be enabled with message
    fireEvent.change(textarea, { target: { value: 'Test message' } });
    expect(button).not.toBeDisabled();
  });

  test('renders footer with creator name', () => {
    render(<NotificationCenter />);
    const footer = screen.getByText(/Created with ❤️ by/i);
    const creatorName = screen.getByText(/Nirmal Koswatta/i);
    expect(footer).toBeInTheDocument();
    expect(creatorName).toBeInTheDocument();
  });

  test('renders slack notification label', () => {
    render(<NotificationCenter />);
    const label = screen.getByText(/Send Test Notification to Slack/i);
    expect(label).toBeInTheDocument();
  });
});
