import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Task } from './Task';

describe('Task Component', () => {
  const mockProps = {
    id: 'test-task-1',
    title: 'Test Task',
    completed: false,
    onToggle: jest.fn(),
    onUpdate: jest.fn(),
    notes: 'Test notes'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('renders task with title and notes', () => {
    render(<Task {...mockProps} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test notes')).toBeInTheDocument();
  });

  it('calls onToggle after animation delay when completing task', () => {
    render(<Task {...mockProps} />);
    
    const checkbox = screen.getByRole('button');
    fireEvent.click(checkbox);
    
    // Should not be called immediately
    expect(mockProps.onToggle).not.toHaveBeenCalled();
    
    // Fast forward 3 seconds for completion delay
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    // Fast forward 300ms for fade out animation
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(mockProps.onToggle).toHaveBeenCalledWith('test-task-1');
  });

  it('calls onToggle immediately when uncompleting task', () => {
    render(<Task {...mockProps} completed={true} />);
    
    const checkbox = screen.getByRole('button');
    fireEvent.click(checkbox);
    
    expect(mockProps.onToggle).toHaveBeenCalledWith('test-task-1');
  });

  it('shows completed state with strikethrough', () => {
    render(<Task {...mockProps} completed={true} />);
    
    const title = screen.getByText('Test Task');
    expect(title).toHaveClass('line-through');
    expect(title).toHaveClass('text-gray-400');
  });

  it('shows completion animation states when completing task', () => {
    render(<Task {...mockProps} />);
    
    const checkbox = screen.getByRole('button');
    const title = screen.getByText('Test Task');
    
    // Initially not completing
    expect(title).not.toHaveClass('line-through');
    expect(title).not.toHaveClass('text-gray-400');
    
    // Click to start completion
    fireEvent.click(checkbox);
    
    // Should immediately show completion styling
    expect(title).toHaveClass('line-through');
    expect(title).toHaveClass('text-gray-400');
    
    // Fast forward to fade out animation
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    // Should show fade out state - need to get the parent container
    const parentContainer = title.closest('.flex.items-start.gap-3');
    expect(parentContainer).toHaveClass('opacity-0');
  });

  it('allows title editing when clicked', () => {
    render(<Task {...mockProps} />);
    
    const title = screen.getByText('Test Task');
    fireEvent.click(title);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Test Task');
  });

  it('saves title changes on blur', () => {
    render(<Task {...mockProps} />);
    
    const title = screen.getByText('Test Task');
    fireEvent.click(title);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Updated Task' } });
    fireEvent.blur(input);
    
    expect(mockProps.onUpdate).toHaveBeenCalledWith('test-task-1', { title: 'Updated Task' });
  });

  it('saves title changes on Enter key', () => {
    render(<Task {...mockProps} />);
    
    const title = screen.getByText('Test Task');
    fireEvent.click(title);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Updated Task' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(mockProps.onUpdate).toHaveBeenCalledWith('test-task-1', { title: 'Updated Task' });
  });

  it('cancels editing on Escape key', () => {
    render(<Task {...mockProps} />);
    
    const title = screen.getByText('Test Task');
    fireEvent.click(title);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Updated Task' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    
    expect(mockProps.onUpdate).not.toHaveBeenCalled();
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('renders without notes when not provided', () => {
    const propsWithoutNotes = { ...mockProps, notes: undefined };
    render(<Task {...propsWithoutNotes} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('Test notes')).not.toBeInTheDocument();
  });
});