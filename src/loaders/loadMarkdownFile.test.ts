import { describe, it, expect } from 'vitest';
import { loadMarkdownFile } from './loadMarkdownFile.js';
import { ContentError } from '../errors.js';

describe('loadMarkdownFile', () => {
  it('should load a Markdown file as raw string', () => {
    const content = loadMarkdownFile('./test-fixtures/products/aluminium-door.md');
    expect(typeof content).toBe('string');
    expect(content).toContain('Aluminium Door');
    expect(content).toContain('Durability');
  });

  it('should return entire file content including frontmatter if present', () => {
    const content = loadMarkdownFile('./test-fixtures/posts/post-1.md');
    expect(typeof content).toBe('string');
    expect(content.length).toBeGreaterThan(0);
  });

  it('should throw ContentError for non-existent file', () => {
    expect(() => {
      loadMarkdownFile('./test-fixtures/non-existent.md');
    }).toThrow(ContentError);
  });
});
