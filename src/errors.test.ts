import { describe, it, expect } from 'vitest';
import { ContentError } from './errors.js';

describe('ContentError', () => {
  it('should create error with message', () => {
    const error = new ContentError('Test error');
    expect(error.message).toBe('Test error');
    expect(error.name).toBe('ContentError');
  });

  it('should create error with filePath', () => {
    const error = new ContentError('Test error', '/path/to/file.json');
    expect(error.filePath).toBe('/path/to/file.json');
  });

  it('should create error with itemIndex', () => {
    const error = new ContentError('Test error', '/path/to/file.json', 5);
    expect(error.itemIndex).toBe(5);
  });

  it('should format error message with toString', () => {
    const error = new ContentError('Validation failed', '/path/to/file.json', 2);
    const message = error.toString();
    expect(message).toContain('Validation failed');
    expect(message).toContain('/path/to/file.json');
    expect(message).toContain('2');
  });
});
