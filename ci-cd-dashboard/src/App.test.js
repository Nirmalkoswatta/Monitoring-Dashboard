import { render, screen } from '@testing-library/react';
import App from './App';

test('renders dashboard component', () => {
  render(<App />);
  const dashboardTitle = screen.getByText(/CI\/CD Monitoring Dashboard/i);
  expect(dashboardTitle).toBeInTheDocument();
});
