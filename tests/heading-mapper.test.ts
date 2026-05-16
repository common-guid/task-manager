import { describe, it, expect } from 'vitest';
import { mapHeadingsToTasks, extractTagsFromText } from '../src/mapper';

describe('Tag Extraction from Text', () => {
  it('should extract tags and clean heading text', () => {
    const { text, tags } = extractTagsFromText('Phase 1 #urgent #work');
    expect(text).toBe('Phase 1');
    expect(tags).toEqual(['urgent', 'work']);
  });

  it('should handle no tags', () => {
    const { text, tags } = extractTagsFromText('Phase 1');
    expect(text).toBe('Phase 1');
    expect(tags).toEqual([]);
  });
});

describe('Heading Mapper with Position-based Tags', () => {
  it('should correlate tags below headings', () => {
    const fileName = 'project.md';
    const headings = [
      { heading: 'H1', level: 1, position: { start: { line: 0 } } },
      { heading: 'H2', level: 2, position: { start: { line: 10 } } },
      { heading: 'H3', level: 3, position: { start: { line: 20 } } },
    ] as any[];
    
    const tags = [
      { tag: '#tag1', position: { start: { line: 1 } } },  // belongs to H1
      { tag: '#tag2', position: { start: { line: 11 } } }, // belongs to H2
      { tag: '#tag3', position: { start: { line: 21 } } }, // belongs to H3
    ] as any[];

    const tasks = mapHeadingsToTasks(fileName, '', headings, tags);

    expect(tasks).toHaveLength(3);

    // H1 task
    expect(tasks[0].h1.tags).toContain('tag1');
    expect(tasks[0].h1.text).toBe('H1');

    // H2 task
    expect(tasks[1].h1.tags).toContain('tag1');
    expect(tasks[1].h2.tags).toContain('tag2');
    expect(tasks[1].h2.text).toBe('H2');

    // H3 task
    expect(tasks[2].h2.tags).toContain('tag2');
    expect(tasks[2].h3.tags).toContain('tag3');
    expect(tasks[2].h3.text).toBe('H3');
  });

  it('should respect heading level for tag boundaries', () => {
    const fileName = 'boundaries.md';
    const headings = [
      { heading: 'Top', level: 1, position: { start: { line: 0 } } },
      { heading: 'Sub1', level: 2, position: { start: { line: 5 } } },
      { heading: 'Sub2', level: 2, position: { start: { line: 10 } } },
    ] as any[];

    const tags = [
      { tag: '#t1', position: { start: { line: 6 } } }, // belongs to Sub1
    ] as any[];

    const tasks = mapHeadingsToTasks(fileName, '', headings, tags);

    expect(tasks[1].h2.tags).toContain('t1');
    expect(tasks[2].h2.tags).not.toContain('t1');
  });

  it('should not bubble up tags to parents', () => {
    const fileName = 'no-bubble.md';
    const headings = [
      { heading: 'H1', level: 1, position: { start: { line: 0 } } },
      { heading: 'H2', level: 2, position: { start: { line: 5 } } },
    ] as any[];

    const tags = [
      { tag: '#t2', position: { start: { line: 6 } } }, // belongs to H2
    ] as any[];

    const tasks = mapHeadingsToTasks(fileName, '', headings, tags);

    expect(tasks[0].h1.tags).not.toContain('t2'); // H1 should NOT have the tag that is under H2
    expect(tasks[1].h2.tags).toContain('t2');
  });
});

describe('Heading Mapper with Metadata', () => {
  it('should extract metadata from section content', () => {
    const fileName = 'metadata.md';
    const content = `
# H1
Status:: In Progress
Priority:: High

## H2
Status:: Completed
`;
    const headings = [
      { heading: 'H1', level: 1, position: { start: { line: 1 }, end: { line: 1 } } },
      { heading: 'H2', level: 2, position: { start: { line: 5 }, end: { line: 5 } } },
    ] as any[];

    const tasks = mapHeadingsToTasks(fileName, content, headings);

    expect(tasks).toHaveLength(2);
    expect(tasks[0].metadata).toEqual({ 'Status': 'In Progress', 'Priority': 'High' });
    expect(tasks[1].metadata).toEqual({ 'Status': 'Completed' });
  });
});
