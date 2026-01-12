import { describe, it, expect } from 'vitest';
import { loadMarkdownCollection } from './loadMarkdownCollection.js';
import { ContentError } from '../errors.js';

describe('loadMarkdownCollection', () => {
  it('should load Markdown files from directory', () => {
    const items = loadMarkdownCollection('./test-fixtures/posts');
    expect(items.length).toBeGreaterThan(0);
    expect(items[0]).toHaveProperty('id');
    expect(items[0]).toHaveProperty('body');
  });

  it('should parse frontmatter and body', () => {
    const items = loadMarkdownCollection('./test-fixtures/posts');
    const post = items.find((item: any) => item.id === 'post-1');
    expect(post).toBeDefined();
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('body');
    expect(typeof post?.body).toBe('string');
    expect(post?.body).toContain('# My First Post');
  });

  it('should throw ContentError for non-existent directory', () => {
    expect(() => {
      loadMarkdownCollection('./test-fixtures/non-existent');
    }).toThrow(ContentError);
  });

  it('should throw ContentError if path is not a directory', () => {
    expect(() => {
      loadMarkdownCollection('./test-fixtures/posts.json');
    }).toThrow(ContentError);
  });

  it('should throw ContentError if directory has no .md files', () => {
    expect(() => {
      loadMarkdownCollection('./test-fixtures/empty-dir');
    }).toThrow(ContentError);
    
    try {
      loadMarkdownCollection('./test-fixtures/empty-dir');
    } catch (error) {
      expect(error).toBeInstanceOf(ContentError);
      if (error instanceof ContentError) {
        expect(error.message).toContain('No .md files found in directory');
      }
    }
  });

  it('should throw ContentError for invalid frontmatter', () => {
    expect(() => {
      loadMarkdownCollection('./test-fixtures/invalid-frontmatter-dir');
    }).toThrow(ContentError);
    
    try {
      loadMarkdownCollection('./test-fixtures/invalid-frontmatter-dir');
    } catch (error) {
      expect(error).toBeInstanceOf(ContentError);
      if (error instanceof ContentError) {
        expect(error.message).toContain('Failed to parse frontmatter');
      }
    }
  });
});
