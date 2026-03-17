import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { TaskTable } from '../src/components/TaskTable';
import { HeadingTask } from '../src/types';

describe('TaskTable Component', () => {
  const emptyLevel = { text: null, tags: [] };
  const tasks: HeadingTask[] = [
    {
      file: 'test.md',
      h1: { text: 'Phase 1', tags: ['urgent'] },
      h2: { text: 'Task A', tags: [] },
      h3: emptyLevel,
      h4: emptyLevel,
      h5: emptyLevel,
      h6: emptyLevel,
      level: 2,
      text: 'Task A',
      tags: []
    }
  ];

  it('should render a table with correct columns', () => {
    render(<TaskTable tasks={tasks} />);
    
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('file')).toBeInTheDocument();
    expect(screen.getByText('h1')).toBeInTheDocument();
    expect(screen.getByText('h2')).toBeInTheDocument();
  });

  it('should render task data in rows, including tags', () => {
    render(<TaskTable tasks={tasks} />);
    
    expect(screen.getByText('test.md')).toBeInTheDocument();
    expect(screen.getByText('Phase 1')).toBeInTheDocument();
    expect(screen.getByText('Task A')).toBeInTheDocument();
    
    // 'urgent' is in H1, but this row's active level is H2.
    // So 'urgent' should be a .heading-tag, not a .tag-pill.
    const urgentTag = screen.getByText('urgent');
    expect(urgentTag).toHaveClass('heading-tag');
    expect(urgentTag).not.toHaveClass('tag-pill');
  });

  it('should render active level tags as pills', () => {
    const activeTasks: HeadingTask[] = [
      {
        ...tasks[0],
        h2: { text: 'Task A', tags: ['active-tag'] },
        level: 2
      }
    ];
    render(<TaskTable tasks={activeTasks} />);
    
    const activeTag = screen.getByText('active-tag');
    expect(activeTag).toHaveClass('tag-pill');
    expect(activeTag).not.toHaveClass('heading-tag');
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
    const multiLevelTasks: HeadingTask[] = [1, 2, 3, 4, 5, 6].map(level => {
      const hLevel = { text: `H${level}`, tags: [] };
      return {
        file: `file${level}.md`,
        h1: level === 1 ? hLevel : emptyLevel,
        h2: level === 2 ? hLevel : emptyLevel,
        h3: level === 3 ? hLevel : emptyLevel,
        h4: level === 4 ? hLevel : emptyLevel,
        h5: level === 5 ? hLevel : emptyLevel,
        h6: level === 6 ? hLevel : emptyLevel,
        level,
        text: `H${level}`,
        tags: []
      };
    });

    render(<TaskTable tasks={multiLevelTasks} onOpenLink={onOpenLink} />);

    [1, 2, 3, 4, 5, 6].forEach(level => {
      const headingText = `H${level}`;
      const pill = screen.getByText(headingText);
      expect(pill).toHaveClass('level-pill');
      pill.click();
      expect(onOpenLink).toHaveBeenCalledWith(`file${level}.md`, headingText);
    });
  });
});
