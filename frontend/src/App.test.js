import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome heading', () => {
  render(<App />);
  const heading = screen.getByText(/Welcome to the Sandbox Frontend/i);
  expect(heading).toBeInTheDocument();
});
