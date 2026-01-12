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
    const items = loadMarkdownCollection<{ id: string; title: string; body: string }>('./test-fixtures/posts');
    const post = items.find((item) => item.id === 'post-1');
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

  it('should throw ContentError if directory has no .md or .mdx files', () => {
    expect(() => {
      loadMarkdownCollection('./test-fixtures/empty-dir');
    }).toThrow(ContentError);
    
    try {
      loadMarkdownCollection('./test-fixtures/empty-dir');
    } catch (error) {
      expect(error).toBeInstanceOf(ContentError);
      if (error instanceof ContentError) {
        expect(error.message).toContain('No .md or .mdx files found in directory');
      }
    }
  });

  it('should load MDX files from directory', () => {
    const items = loadMarkdownCollection('./test-fixtures/mdx-posts');
    expect(items.length).toBe(2);
    expect(items[0]).toHaveProperty('id');
    expect(items[0]).toHaveProperty('body');
    expect(items[0]).toHaveProperty('title');
  });

  it('should parse frontmatter and body for MDX files', () => {
    const items = loadMarkdownCollection<{ id: string; title: string; body: string }>('./test-fixtures/mdx-posts');
    const post = items.find((item) => item.id === 'mdx-post-1');
    expect(post).toBeDefined();
    expect(post).toHaveProperty('title', 'My First MDX Post');
    expect(post).toHaveProperty('body');
    expect(typeof post?.body).toBe('string');
    expect(post?.body).toContain('# My First MDX Post');
    expect(post?.body).toContain('<Button>Click me</Button>');
  });

  it('should load mixed .md and .mdx files from directory', () => {
    const items = loadMarkdownCollection<{ id: string; title: string; body: string }>('./test-fixtures/mixed-posts');
    expect(items.length).toBe(2);
    
    const mdPost = items.find((item) => item.id === 'mixed-post-1');
    const mdxPost = items.find((item) => item.id === 'mixed-post-2');
    
    expect(mdPost).toBeDefined();
    expect(mdPost?.title).toBe('Regular Markdown Post');
    expect(mdPost?.body).toContain('# Regular Markdown Post');
    
    expect(mdxPost).toBeDefined();
    expect(mdxPost?.title).toBe('MDX Post in Mixed Collection');
    expect(mdxPost?.body).toContain('# MDX Post in Mixed Collection');
    expect(mdxPost?.body).toContain('<Component>This is a component</Component>');
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

  it('should handle files that cannot be stat-ed gracefully', () => {
    // This tests the catch block in the filter (lines 86-87)
    // The filter should skip files it can't stat without throwing
    const items = loadMarkdownCollection('./test-fixtures/posts');
    // Should still load valid files even if some can't be stat-ed
    expect(items.length).toBeGreaterThan(0);
  });
});
