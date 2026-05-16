import { describe, it, expect } from 'vitest';
import { extractInlineMetadata } from '../src/mapper';

describe('extractInlineMetadata', () => {
  it('should extract a single inline field', () => {
    const text = 'Status:: In Progress';
    const metadata = extractInlineMetadata(text);
    expect(metadata).toEqual({ 'Status': 'In Progress' });
  });

  it('should extract multiple inline fields', () => {
    const text = 'Status:: Completed\nDue:: 2026-05-20\nPriority:: High';
    const metadata = extractInlineMetadata(text);
    expect(metadata).toEqual({
      'Status': 'Completed',
      'Due': '2026-05-20',
      'Priority': 'High'
    });
  });

  it('should ignore lines without double colons', () => {
    const text = 'This is just some text\nKey: Value\nOther:: Field';
    const metadata = extractInlineMetadata(text);
    expect(metadata).toEqual({ 'Other': 'Field' });
  });

  it('should handle extra whitespace', () => {
    const text = '  Key  ::   Value  ';
    const metadata = extractInlineMetadata(text);
    expect(metadata).toEqual({ 'Key': 'Value' });
  });
});
