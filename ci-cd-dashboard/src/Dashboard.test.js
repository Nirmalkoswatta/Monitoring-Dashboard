import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard';

// Mock axios is already set up in setupTests.js

describe('Dashboard Component', () => {
  test('renders dashboard title', () => {
    render(<Dashboard />);
    const titleElement = screen.getByText(/CI\/CD Monitoring Dashboard/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders repository input with correct placeholder', () => {
    render(<Dashboard />);
    const repositoryInput = screen.getByPlaceholderText(/owner\/repo \(e\.g\., facebook\/react\)/i);
    expect(repositoryInput).toBeInTheDocument();
  });

  test('renders refresh button', () => {
    render(<Dashboard />);
    const refreshButton = screen.getByRole('button', { name: /Refresh/i });
    expect(refreshButton).toBeInTheDocument();
  });

  test('renders load button', () => {
    render(<Dashboard />);
    const loadButton = screen.getByRole('button', { name: /Load/i });
    expect(loadButton).toBeInTheDocument();
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
    const activeWorkflows = screen.getByText('Active Workflows');
    const lastRun = screen.getByText('Last Run');
    expect(totalRuns).toBeInTheDocument();
    expect(successRate).toBeInTheDocument();
    expect(activeWorkflows).toBeInTheDocument();
    expect(lastRun).toBeInTheDocument();
  });

  test('renders refresh interval selector', () => {
    render(<Dashboard />);
    const refreshSelect = screen.getByDisplayValue('30s');
    expect(refreshSelect).toBeInTheDocument();
  });

  test('handles repository input change', () => {
    render(<Dashboard />);
    const repositoryInput = screen.getByPlaceholderText(/owner\/repo \(e\.g\., facebook\/react\)/i);
    
    fireEvent.change(repositoryInput, { target: { value: 'microsoft/vscode' } });
    expect(repositoryInput.value).toBe('microsoft/vscode');
  });

  test('shows loading state initially', () => {
    render(<Dashboard />);
    const loadingElement = screen.getByText(/Loading workflow runs/i);
    expect(loadingElement).toBeInTheDocument();
  });

  test('renders footer with creator name', () => {
    render(<Dashboard />);
    // Since Dashboard includes NotificationCenter, there will be multiple footers
    const footers = screen.getAllByText(/Created with ❤️ by/i);
    const creatorNames = screen.getAllByText(/Nirmal Koswatta/i);
    expect(footers.length).toBeGreaterThanOrEqual(1);
    expect(creatorNames.length).toBeGreaterThanOrEqual(1);
  });

  test('handles refresh interval change', () => {
    render(<Dashboard />);
    const refreshSelect = screen.getByDisplayValue('30s');
    
    fireEvent.change(refreshSelect, { target: { value: '60' } });
    expect(refreshSelect.value).toBe('60');
  });

  test('validates repository input format', () => {
    render(<Dashboard />);
    const repositoryInput = screen.getByPlaceholderText(/owner\/repo \(e\.g\., facebook\/react\)/i);
    const loadButton = screen.getByRole('button', { name: /Load/i });
    
    // Invalid format should disable button
    fireEvent.change(repositoryInput, { target: { value: 'invalid-repo' } });
    expect(loadButton).toBeDisabled();
    
    // Valid format should enable button
    fireEvent.change(repositoryInput, { target: { value: 'owner/repo' } });
    expect(loadButton).not.toBeDisabled();
  });

  test('shows API connection status', () => {
    render(<Dashboard />);
    // Should show either backend or direct API status
    const apiStatus = screen.getByText(/Backend API: Active|Direct GitHub API/i);
    expect(apiStatus).toBeInTheDocument();
  });
});
