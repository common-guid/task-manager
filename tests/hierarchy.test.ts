import { describe, it, expect } from 'vitest';
import { mapHeadingsToTasks } from '../src/mapper';

describe('Heading Hierarchy Mapping', () => {
  it('should assign unique IDs and detect children', () => {
    const fileName = 'nesting.md';
    const headings = [
      { heading: 'Project', level: 1, position: { start: { line: 0 } } },
      { heading: 'Task 1', level: 2, position: { start: { line: 5 } } },
      { heading: 'Subtask 1.1', level: 3, position: { start: { line: 10 } } },
      { heading: 'Task 2', level: 2, position: { start: { line: 15 } } },
    ] as any[];

    const tasks = mapHeadingsToTasks(fileName, '', headings);

    expect(tasks).toHaveLength(4);

    // Project (H1)
    expect(tasks[0].id).toBe('nesting.md:0');
    expect(tasks[0].hasChildren).toBe(true); // Followed by H2
    expect(tasks[0].h1.id).toBe('nesting.md:0');

    // Task 1 (H2)
    expect(tasks[1].id).toBe('nesting.md:1');
    expect(tasks[1].hasChildren).toBe(true); // Followed by H3
    expect(tasks[1].h1.id).toBe('nesting.md:0');
    expect(tasks[1].h2.id).toBe('nesting.md:1');

    // Subtask 1.1 (H3)
    expect(tasks[2].id).toBe('nesting.md:2');
    expect(tasks[2].hasChildren).toBe(false); // Followed by H2 (level decrease)
    expect(tasks[2].h1.id).toBe('nesting.md:0');
    expect(tasks[2].h2.id).toBe('nesting.md:1');
    expect(tasks[2].h3.id).toBe('nesting.md:2');

    // Task 2 (H2)
    expect(tasks[3].id).toBe('nesting.md:3');
    expect(tasks[3].hasChildren).toBe(false); // Last heading
    expect(tasks[3].h1.id).toBe('nesting.md:0');
    expect(tasks[3].h2.id).toBe('nesting.md:3');
  });

  it('should correctly propagate parent IDs to children', () => {
    const fileName = 'parents.md';
    const headings = [
        { heading: 'Root', level: 1, position: { start: { line: 0 } } },
        { heading: 'Middle', level: 2, position: { start: { line: 5 } } },
        { heading: 'Leaf', level: 3, position: { start: { line: 10 } } },
    ] as any[];

    const tasks = mapHeadingsToTasks(fileName, '', headings);

    // Leaf should have Root and Middle as parents
    expect(tasks[2].h1.id).toBe('parents.md:0');
    expect(tasks[2].h2.id).toBe('parents.md:1');
    expect(tasks[2].h3.id).toBe('parents.md:2');
  });
});
