import type { ZodSchema } from 'zod';
import { ContentError } from './errors.js';

/**
 * Validates an array of items against a Zod schema
 * Throws ContentError for each invalid item with descriptive messages
 */
export function validateItems<T>(
  items: unknown[],
  schema: ZodSchema<T>,
  filePath: string
): T[] {
  const validated: T[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const result = schema.safeParse(item);

    if (!result.success) {
      const errors = result.error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');

      throw new ContentError(
        `Validation failed: ${errors}`,
        filePath,
        i
      );
    }

    validated.push(result.data);
  }

  return validated;
}
