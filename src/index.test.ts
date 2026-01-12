import { describe, it, expect } from 'vitest';
import { defineCollection, ContentError } from './index.js';
import type { Collection, CollectionConfig } from './index.js';

describe('index exports', () => {
  it('should export defineCollection', () => {
    expect(typeof defineCollection).toBe('function');
  });

  it('should export ContentError', () => {
    expect(ContentError).toBeDefined();
    expect(typeof ContentError).toBe('function');
  });

  it('should export Collection type', () => {
    // Type-only export, verify it's available at compile time
    const collection: Collection<{ id: string }> = {
      all: () => [],
      getById: () => undefined,
    };
    expect(collection).toBeDefined();
  });

  it('should export CollectionConfig type', () => {
    // Type-only export, verify it's available at compile time
    const config: CollectionConfig<{ id: string }> = {
      path: './test-fixtures/posts.json',
    };
    expect(config).toBeDefined();
  });

  it('should allow using defineCollection from index', () => {
    const collection = defineCollection({
      path: './test-fixtures/posts.json',
    });
    expect(collection).toBeDefined();
    expect(typeof collection.all).toBe('function');
    expect(typeof collection.getById).toBe('function');
  });
});
