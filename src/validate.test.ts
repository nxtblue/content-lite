import { describe, it, expect } from 'vitest';
import { validateItems } from './validate.js';
import { ContentError } from './errors.js';
import { z } from 'zod';

describe('validateItems', () => {
  const schema = z.object({
    id: z.string(),
    title: z.string(),
    published: z.boolean(),
  });

  it('should validate valid items', () => {
    const items = [
      { id: '1', title: 'Post 1', published: true },
      { id: '2', title: 'Post 2', published: false },
    ];

    const validated = validateItems(items, schema, '/test.json');
    expect(validated).toHaveLength(2);
    expect(validated[0].id).toBe('1');
  });

  it('should throw ContentError for invalid items', () => {
    const items = [
      { id: '1', title: 'Post 1', published: true },
      { id: '2' }, // Missing title and published
    ];

    expect(() => {
      validateItems(items, schema, '/test.json');
    }).toThrow(ContentError);
  });

  it('should include item index in error', () => {
    const items = [
      { id: '1', title: 'Post 1', published: true },
      { id: '2' }, // Invalid
    ];

    try {
      validateItems(items, schema, '/test.json');
      expect.fail('Should have thrown ContentError');
    } catch (error) {
      if (error instanceof ContentError) {
        expect(error.itemIndex).toBe(1);
        expect(error.filePath).toBe('/test.json');
      }
    }
  });
});
