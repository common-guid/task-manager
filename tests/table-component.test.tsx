import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { TaskTable } from '../src/components/TaskTable';
import { HeadingTask } from '../src/types';

describe('TaskTable Component', () => {
  const tasks: HeadingTask[] = [
    {
      file: 'test.md',
      h1: 'Phase 1',
      h2: 'Task A',
      h3: null,
      h4: null,
      h5: null,
      h6: null,
      level: 2,
      text: 'Task A'
    }
  ];

  it('should render a table with correct columns', () => {
    render(<TaskTable tasks={tasks} />);
    
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('file')).toBeInTheDocument();
    expect(screen.getByText('h1')).toBeInTheDocument();
    expect(screen.getByText('h2')).toBeInTheDocument();
    expect(screen.getByText('h6')).toBeInTheDocument();
  });

  it('should render task data in rows', () => {
    render(<TaskTable tasks={tasks} />);
    
    expect(screen.getByText('test.md')).toBeInTheDocument();
    expect(screen.getByText('Phase 1')).toBeInTheDocument();
    expect(screen.getByText('Task A')).toBeInTheDocument();
  });

  it('should call onOpenLink when a link is clicked', () => {
    const onOpenLink = vi.fn();
    render(<TaskTable tasks={tasks} onOpenLink={onOpenLink} />);
    
    const fileLink = screen.getByText('test.md');
    fileLink.click();
    expect(onOpenLink).toHaveBeenCalledWith('test.md', '');

    const taskLink = screen.getByText('Task A');
    taskLink.click();
    expect(onOpenLink).toHaveBeenCalledWith('test.md', 'Task A');
  });
});
