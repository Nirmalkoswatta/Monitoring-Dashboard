import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

// Mock axios is already set up in setupTests.js

describe('Dashboard Component', () => {
  test('renders dashboard title', () => {
    render(<Dashboard />);
    const titleElement = screen.getByText(/CI\/CD Monitoring Dashboard/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders repository input', () => {
    render(<Dashboard />);
    const repositoryInput = screen.getByPlaceholderText('owner/repo');
    expect(repositoryInput).toBeInTheDocument();
  });

  test('renders refresh button', () => {
    render(<Dashboard />);
    const refreshButton = screen.getByRole('button', { name: /🔄 Refresh/i });
    expect(refreshButton).toBeInTheDocument();
  });

  test('renders charts containers', () => {
    render(<Dashboard />);
    const lineChart = screen.getByTestId('line-chart');
    const barChart = screen.getByTestId('bar-chart');
    expect(lineChart).toBeInTheDocument();
    expect(barChart).toBeInTheDocument();
  });

  test('renders stats cards', () => {
    render(<Dashboard />);
    const totalRuns = screen.getByText('Total Runs');
    const successRate = screen.getByText('Success Rate');
    expect(totalRuns).toBeInTheDocument();
    expect(successRate).toBeInTheDocument();
  });
});
