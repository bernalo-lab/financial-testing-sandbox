import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app heading', () => {
  const { getByText } = render(<App />);
  const heading = getByText(/Financial Testing Sandbox/i);
  expect(heading).toBeInTheDocument();
});
