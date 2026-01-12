import { describe, it, expect } from 'vitest';
import { loadJsonCollection } from './loadJsonCollection.js';
import { ContentError } from '../errors.js';

describe('loadJsonCollection', () => {
  it('should load a valid JSON collection', () => {
    const items = loadJsonCollection('./test-fixtures/posts.json');
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({
      id: 'post-1',
      title: 'My First Post',
    });
  });

  it('should throw ContentError for non-existent file', () => {
    expect(() => {
      loadJsonCollection('./test-fixtures/non-existent.json');
    }).toThrow(ContentError);
  });

  it('should throw ContentError if JSON is not an array', () => {
    expect(() => {
      loadJsonCollection('./test-fixtures/not-array.json');
    }).toThrow(ContentError);
    
    try {
      loadJsonCollection('./test-fixtures/not-array.json');
    } catch (error) {
      expect(error).toBeInstanceOf(ContentError);
      if (error instanceof ContentError) {
        expect(error.message).toContain('Expected JSON file to contain an array');
      }
    }
  });

  it('should load JSON with linked Markdown files via contentPath', () => {
    const items = loadJsonCollection('./test-fixtures/products.json');
    expect(items).toHaveLength(3);

    const productWithContent = items.find(
      (item: any) => item.id === 'product-1'
    );
    expect(productWithContent).toBeDefined();
    expect(productWithContent).toHaveProperty('body');
    expect(typeof productWithContent.body).toBe('string');
    expect(productWithContent.body).toContain('Aluminium Door');
  });

  it('should handle items without contentPath', () => {
    const items = loadJsonCollection('./test-fixtures/products.json');
    const productWithoutContent = items.find(
      (item: any) => item.id === 'product-3'
    );
    expect(productWithoutContent).toBeDefined();
    expect(productWithoutContent).not.toHaveProperty('body');
  });

  it('should throw ContentError if linked Markdown file is missing', () => {
    expect(() => {
      loadJsonCollection('./test-fixtures/missing-contentpath.json');
    }).toThrow(ContentError);
    
    try {
      loadJsonCollection('./test-fixtures/missing-contentpath.json');
    } catch (error) {
      expect(error).toBeInstanceOf(ContentError);
      if (error instanceof ContentError) {
        expect(error.message).toContain('Failed to load markdown content');
      }
    }
  });

  it('should handle invalid JSON syntax', () => {
    expect(() => {
      loadJsonCollection('./test-fixtures/invalid-json.json');
    }).toThrow(ContentError);
    
    try {
      loadJsonCollection('./test-fixtures/invalid-json.json');
    } catch (error) {
      expect(error).toBeInstanceOf(ContentError);
      if (error instanceof ContentError) {
        expect(error.message).toContain('Failed to parse JSON');
      }
    }
  });

  it('should handle contentPath that is not a valid string', () => {
    // Create a JSON file with non-string contentPath
    const items = loadJsonCollection('./test-fixtures/invalid-contentpath.json');
    // The first item has contentPath as a number, should be included as-is
    const itemWithNumberPath = items.find((item: any) => item.id === 'item-1');
    expect(itemWithNumberPath).toBeDefined();
    expect(itemWithNumberPath?.contentPath).toBe(123);
    expect(itemWithNumberPath).not.toHaveProperty('body');
    
    // The second item has empty string contentPath, should be included as-is
    const itemWithEmptyPath = items.find((item: any) => item.id === 'item-2');
    expect(itemWithEmptyPath).toBeDefined();
    expect(itemWithEmptyPath?.contentPath).toBe('');
    expect(itemWithEmptyPath).not.toHaveProperty('body');
  });
});
