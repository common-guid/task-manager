import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { TaskTable } from '../src/components/TaskTable';
import { HeadingTask, HeadingLevel } from '../src/types';

describe('TaskTable Grouping & Indentation', () => {
  const emptyLevel: HeadingLevel = { id: null, text: null, tags: [] };
  const tasks: HeadingTask[] = [
    {
      id: 'f1h1',
      file: 'file1.md',
      h1: { id: 'f1h1', text: 'Heading 1', tags: [] },
      h2: emptyLevel, h3: emptyLevel, h4: emptyLevel, h5: emptyLevel, h6: emptyLevel,
      level: 1, text: 'Heading 1', tags: [], hasChildren: false, metadata: {}
    },
    {
      id: 'f1h2',
      file: 'file1.md',
      h1: { id: 'f1h1', text: 'Heading 1', tags: [] },
      h2: { id: 'f1h2', text: 'Heading 2', tags: [] },
      h3: emptyLevel, h4: emptyLevel, h5: emptyLevel, h6: emptyLevel,
      level: 2, text: 'Heading 2', tags: [], hasChildren: false, metadata: {}
    },
    {
      id: 'f2h1',
      file: 'file2.md',
      h1: { id: 'f2h1', text: 'Another file', tags: [] },
      h2: emptyLevel, h3: emptyLevel, h4: emptyLevel, h5: emptyLevel, h6: emptyLevel,
      level: 1, text: 'Another file', tags: [], hasChildren: false, metadata: {}
    }
  ];

  it('should render file headers only once per group', () => {
    render(<TaskTable tasks={tasks} />);
    
    // File headers should be rendered. 
    // In the new design, we expect 'file1.md' to appear once as a header,
    // and 'file2.md' to appear once as a header.
    const file1Headers = screen.getAllByText('file1.md');
    const file2Headers = screen.getAllByText('file2.md');

    expect(file1Headers).toHaveLength(1);
    expect(file2Headers).toHaveLength(1);
  });

  it('should not have h1-h6 columns', () => {
    render(<TaskTable tasks={tasks} />);
    
    expect(screen.queryByText('h1')).not.toBeInTheDocument();
    expect(screen.queryByText('h2')).not.toBeInTheDocument();
    expect(screen.queryByText('h3')).not.toBeInTheDocument();
  });

  it('should apply indentation based on level', () => {
    const { container } = render(<TaskTable tasks={tasks} />);
    
    // Heading 1 (level 1) should have 0px or some base indentation
    // Heading 2 (level 2) should have 20px indentation
    const h1Row = screen.getByText('Heading 1').closest('.tm-row');
    const h2Row = screen.getByText('Heading 2').closest('.tm-row');

    // We'll check for a style attribute or a specific class
    // For now, let's assume we use padding-left for indentation
    const h1Content = screen.getByText('Heading 1').closest('.tm-cell-content');
    const h2Content = screen.getByText('Heading 2').closest('.tm-cell-content');

    // This might fail if we haven't implemented it yet, which is the point of TDD.
    expect(h1Content).toHaveStyle({ paddingLeft: '0px' });
    expect(h2Content).toHaveStyle({ paddingLeft: '20px' });
  });
});
