import { extname } from 'node:path';
import type { Collection, CollectionConfig } from './types.js';
import { loadJsonCollection } from './loaders/loadJsonCollection.js';
import { loadMarkdownCollection } from './loaders/loadMarkdownCollection.js';
import { validateItems } from './validate.js';

/**
 * Defines a content collection from a JSON file or Markdown directory
 * 
 * This function loads content synchronously at import/build time,
 * validates items if a schema is provided, and applies transformations.
 * 
 * Format is inferred from the path if not explicitly provided:
 * - Paths ending in .json → "json"
 * - Otherwise → "md"
 * 
 * For JSON: loads an array from a single JSON file
 * For Markdown: loads all .md files from a directory, each file becomes one item
 * 
 * @param config - Collection configuration
 * @returns A collection instance with all() and getById() methods
 */
export function defineCollection<T extends { id?: string }>(
  config: CollectionConfig<T>
): Collection<T> {
  const { path, schema, transform } = config;

  // Infer format if not provided
  const format = config.format ?? (extname(path).toLowerCase() === '.json' ? 'json' : 'md');

  // Load items based on format
  let items: T[];
  if (format === 'json') {
    items = loadJsonCollection<T>(path);
  } else {
    items = loadMarkdownCollection<T>(path);
  }

  // Validate if schema is provided
  // For Markdown, schema validates frontmatter only (body is always included)
  if (schema) {
    items = validateItems(items, schema, path);
  }

  // Apply transform if provided
  if (transform) {
    items = transform(items);
  }

  // Create collection instance
  return {
    all(): T[] {
      return items;
    },

    getById(id: string): T | undefined {
      return items.find((item) => item.id === id);
    },
  };
}
