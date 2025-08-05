import React from 'react';
import { render, screen } from '@testing-library/react';
import NotificationCenter from './NotificationCenter';

describe('NotificationCenter Component', () => {
  test('renders notification center title', () => {
    render(<NotificationCenter notifications={[]} />);
    const element = screen.getByText(/Notification Center/i);
    expect(element).toBeInTheDocument();
  });

  test('renders send notification button', () => {
    render(<NotificationCenter notifications={[]} />);
    const button = screen.getByText(/Send Notification/i);
    expect(button).toBeInTheDocument();
  });

  test('renders notification textarea', () => {
    render(<NotificationCenter notifications={[]} />);
    const textarea = screen.getByPlaceholderText(/Enter your notification message/i);
    expect(textarea).toBeInTheDocument();
  });
});
