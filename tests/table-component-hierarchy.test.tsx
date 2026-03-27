import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { TaskTable } from '../src/components/TaskTable';
import { HeadingTask, HeadingLevel } from '../src/types';

describe('TaskTable Component Hierarchy', () => {
  const emptyLevel: HeadingLevel = { id: null, text: null, tags: [] };
  const tasks: HeadingTask[] = [
    {
      id: 'p1',
      file: 'test.md',
      h1: { id: 'p1', text: 'Project', tags: [] },
      h2: emptyLevel,
      h3: emptyLevel,
      h4: emptyLevel,
      h5: emptyLevel,
      h6: emptyLevel,
      level: 1,
      text: 'Project',
      tags: [],
      hasChildren: true
    },
    {
      id: 't1',
      file: 'test.md',
      h1: { id: 'p1', text: 'Project', tags: [] },
      h2: { id: 't1', text: 'Task 1', tags: [] },
      h3: emptyLevel,
      h4: emptyLevel,
      h5: emptyLevel,
      h6: emptyLevel,
      level: 2,
      text: 'Task 1',
      tags: [],
      hasChildren: false
    }
  ];

  it('should render a toggle button in the file column when hasChildren is true', () => {
    render(<TaskTable tasks={tasks} />);
    
    // Find the 'test.md' cell (file column)
    const fileCells = screen.getAllByText('test.md');
    // The first row has children, the second doesn't.
    
    const firstRowFileCell = fileCells[0].closest('td');
    expect(firstRowFileCell?.querySelector('.tm-toggle')).toBeInTheDocument();
    expect(firstRowFileCell?.querySelector('.tm-file-icon')).not.toBeInTheDocument();

    const secondRowFileCell = fileCells[1].closest('td');
    expect(secondRowFileCell?.querySelector('.tm-toggle')).not.toBeInTheDocument();
    expect(secondRowFileCell?.querySelector('.tm-file-icon')).toBeInTheDocument();

    // Verify heading columns do not have toggle buttons
    const projectPills = screen.getAllByText('Project');
    const primaryProjectPill = projectPills.find(el => el.classList.contains('tm-level-pill'));
    const projectCell = primaryProjectPill?.closest('.tm-cell-content');
    expect(projectCell?.querySelector('.tm-toggle')).not.toBeInTheDocument();
  });

  it('should collapse children when toggle is clicked', () => {
    render(<TaskTable tasks={tasks} />);
    
    // Check initial state
    expect(screen.getByText('Task 1')).toBeInTheDocument();

    // Click the toggle on Project
    const toggleButtons = screen.getAllByRole('button');
    fireEvent.click(toggleButtons[0]);

    // Task 1 should be gone
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();

    // Click again to expand
    fireEvent.click(toggleButtons[0]);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
  });

  it('should handle multi-level collapse', () => {
    const multiTasks: HeadingTask[] = [
        { ...tasks[0] },
        { ...tasks[1] },
        {
            id: 's1',
            file: 'test.md',
            h1: { id: 'p1', text: 'Project', tags: [] },
            h2: { id: 't1', text: 'Task 1', tags: [] },
            h3: { id: 's1', text: 'Subtask 1.1', tags: [] },
            h4: emptyLevel,
            h5: emptyLevel,
            h6: emptyLevel,
            level: 3,
            text: 'Subtask 1.1',
            tags: [],
            hasChildren: false
        }
    ];
    // Update Task 1 to have children
    multiTasks[1].hasChildren = true;

    render(<TaskTable tasks={multiTasks} />);

    expect(screen.getByText('Subtask 1.1')).toBeInTheDocument();

    // Toggles are on Project and Task 1
    const toggleButtons = screen.getAllByRole('button');
    expect(toggleButtons).toHaveLength(2);

    // Collapse Task 1 (the second toggle button)
    fireEvent.click(toggleButtons[1]);

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.queryByText('Subtask 1.1')).not.toBeInTheDocument();

    // Expand Task 1
    fireEvent.click(toggleButtons[1]);
    expect(screen.getByText('Subtask 1.1')).toBeInTheDocument();

    // Collapse Project (the first toggle button)
    fireEvent.click(toggleButtons[0]);
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Subtask 1.1')).not.toBeInTheDocument();
  });
});
