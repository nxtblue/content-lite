import type { ZodSchema } from 'zod';

/**
 * Configuration options for defining a content collection
 */
export interface CollectionConfig<T> {
  /**
   * Path to the content source:
   * - For JSON: path to a JSON file containing an array
   * - For Markdown: path to a directory containing .md files
   * Can be relative to the current working directory or absolute
   */
  path: string;

  /**
   * Content format: "json" for JSON files, "md" for Markdown files
   * If not provided, format is inferred from the path:
   * - Paths ending in .json → "json"
   * - Otherwise → "md"
   */
  format?: 'json' | 'md';

  /**
   * Optional Zod schema for validating each item in the collection
   * For JSON: validates each array item
   * For Markdown: validates frontmatter only (body is always included as string)
   * If provided, each item will be validated against this schema
   */
  schema?: ZodSchema<T>;

  /**
   * Optional transform function to modify the items after validation
   * Applied to the entire array after all items have been validated
   */
  transform?: (items: T[]) => T[];
}

/**
 * Collection instance returned by defineCollection
 */
export interface Collection<T> {
  /**
   * Returns all items in the collection
   */
  all(): T[];

  /**
   * Returns a single item by its id field, or undefined if not found
   * Assumes items have an 'id' field of type string
   */
  getById(id: string): T | undefined;
}
