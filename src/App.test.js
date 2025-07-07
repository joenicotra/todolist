import { render, screen } from '@testing-library/react';
import App from './App';

test('renders task management interface', () => {
  render(<App />);
  const learnBasicsElement = screen.getByText(/learn the basics/i);
  expect(learnBasicsElement).toBeInTheDocument();
});
