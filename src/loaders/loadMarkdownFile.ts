import { readFileSync } from 'fs';
import { resolve } from 'path';
import { ContentError } from '../errors.js';

/**
 * Loads a single Markdown or MDX file as raw string content
 * 
 * This function is primarily used internally for the optional JSON → Markdown/MDX
 * linking pattern (when JSON items have a `contentPath` field). It can also
 * be used standalone to load individual Markdown/MDX files without frontmatter parsing.
 * 
 * MDX files are treated as raw Markdown. No compilation occurs.
 * 
 * **When to use:**
 * - Loading Markdown/MDX files referenced by JSON collections (via `contentPath`)
 * - Loading standalone Markdown/MDX files without frontmatter
 * - Internal use by loadJsonCollection for optional JSON → MD/MDX linking
 * 
 * **Note:** For Markdown/MDX collections with frontmatter, use `loadMarkdownCollection`
 * instead. JSON → Markdown/MDX linking is an optional advanced pattern.
 * 
 * @param filePath - Path to the Markdown or MDX file (relative or absolute)
 * @returns Raw markdown/MDX content as string (no frontmatter parsing, no MDX compilation)
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
