import { describe, it, expect } from 'vitest';
import { mapHeadingsToTasks } from '../src/mapper';
import { HeadingTask } from '../src/types';

describe('Heading Mapper', () => {
  it('should map a flat list of headings to hierarchical tasks', () => {
    const fileName = 'project.md';
    const headings = [
      { heading: 'Phase 1', level: 1 },
      { heading: 'Setup', level: 2 },
      { heading: 'Install Deps', level: 3 },
      { heading: 'Phase 2', level: 1 },
      { heading: 'Implementation', level: 2 },
    ] as any[];

    const tasks = mapHeadingsToTasks(fileName, headings);

    expect(tasks).toHaveLength(5);

    // Phase 1 (H1)
    expect(tasks[0]).toMatchObject({
      file: fileName,
      h1: 'Phase 1',
      h2: null,
      level: 1,
      text: 'Phase 1'
    });

    // Setup (H2 under Phase 1)
    expect(tasks[1]).toMatchObject({
      file: fileName,
      h1: 'Phase 1',
      h2: 'Setup',
      h3: null,
      level: 2,
      text: 'Setup'
    });

    // Install Deps (H3 under Setup)
    expect(tasks[2]).toMatchObject({
      file: fileName,
      h1: 'Phase 1',
      h2: 'Setup',
      h3: 'Install Deps',
      level: 3,
      text: 'Install Deps'
    });

    // Phase 2 (H1 - resets hierarchy)
    expect(tasks[3]).toMatchObject({
      file: fileName,
      h1: 'Phase 2',
      h2: null,
      level: 1,
      text: 'Phase 2'
    });
  });

  it('should handle skipped levels gracefully', () => {
    const fileName = 'skipped.md';
    const headings = [
      { heading: 'Root', level: 1 },
      { heading: 'Deep Child', level: 4 },
    ] as any[];

    const tasks = mapHeadingsToTasks(fileName, headings);

    expect(tasks[1]).toMatchObject({
      h1: 'Root',
      h2: null,
      h3: null,
      h4: 'Deep Child',
      level: 4
    });
  });

  it('should handle hierarchy reset when moving to a higher level', () => {
    const fileName = 'reset.md';
    const headings = [
      { heading: 'Part 1', level: 1 },
      { heading: 'Sec 1.1', level: 2 },
      { heading: 'Part 2', level: 1 },
    ] as any[];

    const tasks = mapHeadingsToTasks(fileName, headings);

    expect(tasks[2]).toMatchObject({
      h1: 'Part 2',
      h2: null,
      level: 1
    });
  });

  it('should handle multiple nested siblings', () => {
    const fileName = 'siblings.md';
    const headings = [
      { heading: 'H1', level: 1 },
      { heading: 'H2-A', level: 2 },
      { heading: 'H2-B', level: 2 },
    ] as any[];

    const tasks = mapHeadingsToTasks(fileName, headings);

    expect(tasks[1].h2).toBe('H2-A');
    expect(tasks[2].h2).toBe('H2-B');
    expect(tasks[2].h1).toBe('H1');
  });
});
