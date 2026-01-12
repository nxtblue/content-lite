import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ContentError } from '../errors.js';

/**
 * Loads a single Markdown file as raw string content
 * 
 * This function is primarily used internally for the optional JSON → Markdown
 * linking pattern (when JSON items have a `contentPath` field). It can also
 * be used standalone to load individual Markdown files without frontmatter parsing.
 * 
 * **When to use:**
 * - Loading Markdown files referenced by JSON collections (via `contentPath`)
 * - Loading standalone Markdown files without frontmatter
 * - Internal use by loadJsonCollection for optional JSON → MD linking
 * 
 * **Note:** For Markdown collections with frontmatter, use `loadMarkdownCollection`
 * instead. JSON → Markdown linking is an optional advanced pattern.
 * 
 * @param filePath - Path to the Markdown file (relative or absolute)
 * @returns Raw markdown content as string (no frontmatter parsing)
 * @throws ContentError if file cannot be read or doesn't exist
 */
export function loadMarkdownFile(filePath: string): string {
  let resolvedPath: string;

  try {
    resolvedPath = resolve(filePath);
  } catch (error) {
    throw new ContentError(
      `Failed to resolve markdown file path: ${filePath}`,
      filePath
    );
  }

  try {
    const fileContent = readFileSync(resolvedPath, 'utf-8');
    return fileContent;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    // Check if it's a "file not found" error
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      throw new ContentError(
        `Markdown file not found: ${filePath}`,
        resolvedPath
      );
    }
    throw new ContentError(
      `Failed to read markdown file: ${errorMessage}`,
      resolvedPath
    );
  }
}
