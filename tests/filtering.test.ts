import { describe, it, expect } from 'vitest';
import { filterTasks } from '../src/mapper';
import { HeadingTask } from '../src/types';

describe('Task Filtering', () => {
  const mockTasks: Partial<HeadingTask>[] = [
    { id: '1', text: 'Active Task', metadata: {}, tags: [] },
    { id: '2', text: '- [ ] Active Markdown Task', metadata: {}, tags: [] },
    { id: '3', text: '- [x] Completed Markdown Task', metadata: {}, tags: [] },
    { id: '3b', text: '- [X] Uppercase Completed Task', metadata: {}, tags: [] },
    { id: '4', text: 'Done Metadata Task', metadata: { 'Status': 'Done' }, tags: [] },
    { id: '4b', text: 'done Metadata Task', metadata: { 'Status': 'done' }, tags: [] },
    { id: '5', text: 'Completed Metadata Task', metadata: { 'Status': 'Completed' }, tags: [] },
    { id: '5b', text: 'completed Metadata Task', metadata: { 'Status': 'completed' }, tags: [] },
    { id: '6', text: 'Partially done task', metadata: { 'Status': 'In Progress' }, tags: [] },
  ];

  it('should return all tasks when hideCompleted is false', () => {
    const result = filterTasks(mockTasks as HeadingTask[], false);
    expect(result).toHaveLength(9);
  });

  it('should filter out completed markdown tasks when hideCompleted is true', () => {
    const result = filterTasks(mockTasks as HeadingTask[], true);
    const ids = result.map(t => t.id);
    expect(ids).toContain('1');
    expect(ids).toContain('2');
    expect(ids).not.toContain('3');
    expect(ids).not.toContain('3b');
  });

  it('should filter out tasks with Status: Done or Completed when hideCompleted is true', () => {
    const result = filterTasks(mockTasks as HeadingTask[], true);
    const ids = result.map(t => t.id);
    expect(ids).not.toContain('4');
    expect(ids).not.toContain('4b');
    expect(ids).not.toContain('5');
    expect(ids).not.toContain('5b');
    expect(ids).toContain('6');
  });
});
