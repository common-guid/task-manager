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

  it('should cover all heading levels for highlighting and clicking', () => {
    const onOpenLink = vi.fn();
    const multiLevelTasks: HeadingTask[] = [1, 2, 3, 4, 5, 6].map(level => ({
      file: `file${level}.md`,
      h1: level === 1 ? 'H1' : null,
      h2: level === 2 ? 'H2' : null,
      h3: level === 3 ? 'H3' : null,
      h4: level === 4 ? 'H4' : null,
      h5: level === 5 ? 'H5' : null,
      h6: level === 6 ? 'H6' : null,
      level,
      text: `H${level}`
    }));

    render(<TaskTable tasks={multiLevelTasks} onOpenLink={onOpenLink} />);

    [1, 2, 3, 4, 5, 6].forEach(level => {
      const headingText = `H${level}`;
      // Active heading text is now rendered inside a .level-pill <span>
      const pill = screen.getByText(headingText);
      expect(pill).toHaveClass('level-pill');
      // The parent <td> retains the 'current-level' class
      const td = pill.closest('td') as HTMLElement;
      expect(td).toHaveClass('current-level');
      // Click on the pill bubbles up to the td's onClick handler
      pill.click();
      expect(onOpenLink).toHaveBeenCalledWith(`file${level}.md`, headingText);
    });
  });

  it('should render file icon wrapper in the file cell', () => {
    render(<TaskTable tasks={tasks} />);

    const fileWrapper = screen.getByText('test.md').closest('.file-icon-wrapper');
    expect(fileWrapper).toBeInTheDocument();
    // The wrapper contains an SVG icon
    expect(fileWrapper?.querySelector('svg')).toBeInTheDocument();
  });
});
