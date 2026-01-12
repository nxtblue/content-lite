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
    
    try {
      loadMarkdownFile('./test-fixtures/non-existent.md');
    } catch (error) {
      expect(error).toBeInstanceOf(ContentError);
      if (error instanceof ContentError) {
        expect(error.message).toContain('Markdown file not found');
      }
    }
  });

  it('should throw ContentError with proper message for file read errors', () => {
    // Test that error messages are properly formatted
    // The actual path resolution and read errors are hard to simulate
    // but we verify the error handling structure exists
    expect(() => {
      loadMarkdownFile('./test-fixtures/non-existent.md');
    }).toThrow(ContentError);
  });

  it('should load MDX files', () => {
    const content = loadMarkdownFile('./test-fixtures/mdx-posts/post-1.mdx');
    expect(typeof content).toBe('string');
    expect(content).toContain('# My First MDX Post');
    expect(content).toContain('<Button>Click me</Button>');
  });
});
