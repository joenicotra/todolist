import { render, screen } from '@testing-library/react';
import App from './App';

test('renders task management interface', () => {
  render(<App />);
  const inboxSidebarItem = screen.getByTestId('sidebar-item-inbox');
  expect(inboxSidebarItem).toBeInTheDocument();
  const todayElement = screen.getByTestId('sidebar-item-today');
  expect(todayElement).toBeInTheDocument();
  const upcomingElement = screen.getByTestId('sidebar-item-upcoming');
  expect(upcomingElement).toBeInTheDocument();
});
