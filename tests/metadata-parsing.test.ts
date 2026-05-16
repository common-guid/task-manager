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

  it('should handle keys with numbers, dashes and underscores', () => {
    const text = 'Key-1:: Val1\nKey_2:: Val2';
    const metadata = extractInlineMetadata(text);
    expect(metadata).toEqual({
      'Key-1': 'Val1',
      'Key_2': 'Val2'
    });
  });

  it('should handle values with special characters', () => {
    const text = 'Status:: [Done] (High Priority!)';
    const metadata = extractInlineMetadata(text);
    expect(metadata).toEqual({ 'Status': '[Done] (High Priority!)' });
  });
});
