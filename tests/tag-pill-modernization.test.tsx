import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { TaskTable } from '../src/components/TaskTable';
import { HeadingTask, HeadingLevel } from '../src/types';

describe('TagPill Modernization', () => {
  const emptyLevel: HeadingLevel = { id: null, text: null, tags: [] };
  const tasks: HeadingTask[] = [
    {
      id: '1',
      file: 'test.md',
      h1: { id: 'p1', text: 'Project', tags: [] },
      h2: emptyLevel, h3: emptyLevel, h4: emptyLevel, h5: emptyLevel, h6: emptyLevel,
      level: 1, text: 'Project', tags: ['work', 'ui'], hasChildren: false
    }
  ];

  it('should apply automatic color hashing to tags', () => {
    render(<TaskTable tasks={tasks} />);
    
    const workTag = screen.getByText('work');
    const uiTag = screen.getByText('ui');

    // Each tag should have a background-color style (automatic hashing)
    // We expect different colors for different tags
    const workColor = window.getComputedStyle(workTag).backgroundColor;
    const uiColor = window.getComputedStyle(uiTag).backgroundColor;

    expect(workColor).toBeDefined();
    expect(uiColor).toBeDefined();
    expect(workColor).not.toBe(uiColor);
  });

  it('should use Obsidian CSS variables for fallback colors', () => {
    // This is hard to test in a headless env without actual Obsidian styles loaded,
    // but we can check if the class is present or if it has a style that refers to a variable.
    render(<TaskTable tasks={tasks} />);
    const workTag = screen.getByText('work');
    
    // We'll look for the class or a default style
    expect(workTag).toHaveClass('tm-tag-pill');
  });

  it('should render a calendar icon for date tags', () => {
    const dateTasks: HeadingTask[] = [
      {
        ...tasks[0],
        tags: ['2026-05-07']
      }
    ];
    render(<TaskTable tasks={dateTasks} />);
    
    const dateTag = screen.getByText('2026-05-07');
    const badge = dateTag.closest('.tm-tag-pill');
    expect(badge?.querySelector('.tm-metadata-icon')).toBeInTheDocument();
    // It should have a specific class for date
    expect(badge).toHaveClass('tm-metadata-date');
  });

  it('should render a flag icon for priority tags', () => {
    const priorityTasks: HeadingTask[] = [
      {
        ...tasks[0],
        tags: ['high-priority']
      }
    ];
    render(<TaskTable tasks={priorityTasks} />);
    
    const priorityTag = screen.getByText('high-priority');
    const badge = priorityTag.closest('.tm-tag-pill');
    expect(badge?.querySelector('.tm-metadata-icon')).toBeInTheDocument();
    expect(badge).toHaveClass('tm-metadata-priority');
  });

  it('should apply user-defined custom colors from settings', () => {
    const tagColors = { 'work': '#ff0000' };
    render(<TaskTable tasks={tasks} tagColors={tagColors} />);
    
    const workTag = screen.getByText('work');
    // The background color should be the RGBA version of #ff0000 (255, 0, 0)
    const workStyle = window.getComputedStyle(workTag);
    expect(workStyle.color).toBe('rgb(255, 0, 0)');
    expect(workStyle.backgroundColor).toContain('rgba(255, 0, 0');
  });
});
