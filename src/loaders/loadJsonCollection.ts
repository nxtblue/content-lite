import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { ContentError } from '../errors.js';
import { loadMarkdownFile } from './loadMarkdownFile.js';

/**
 * Synchronously loads and parses a JSON file
 * Throws ContentError if file cannot be read or parsed
 */
function loadJson<T = unknown>(filePath: string): T {
  let resolvedPath: string;
  let fileContent: string;

  try {
    resolvedPath = resolve(filePath);
  } catch (error) {
    throw new ContentError(
      `Failed to resolve file path: ${filePath}`,
      filePath
    );
  }

  try {
    fileContent = readFileSync(resolvedPath, 'utf-8');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new ContentError(
      `Failed to read file: ${errorMessage}`,
      resolvedPath
    );
  }

  try {
    const parsed = JSON.parse(fileContent);
    return parsed as T;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid JSON';
    throw new ContentError(
      `Failed to parse JSON: ${errorMessage}`,
      resolvedPath
    );
  }
}

/**
 * Loads a JSON file and ensures it contains an array
 * 
 * This function is used for standalone JSON collections. JSON collections work
 * independently from Markdown collections by default.
 * 
 * **When to use:**
 * - Preferring structured data in JSON format
 * - Wanting all content and metadata in one file
 * - Building APIs or data-driven sites
 * - Need programmatic content generation
 * 
 * **Optional JSON → Markdown linking:**
 * If items have a `contentPath` property, the referenced Markdown file is loaded
 * and merged as a `body` property. This is an optional advanced pattern - JSON
 * collections work perfectly fine without it. Paths are resolved relative to the
 * JSON file's directory.
 * 
 * **Note:** JSON collections are standalone by default. The `contentPath` linking
 * is optional and only needed for advanced use cases where you want JSON metadata
 * with separate Markdown content files.
 * 
 * @param filePath - Path to JSON file containing an array
 * @returns Array of items from the JSON file, with optional `body` property from linked MD files
 * @throws ContentError if the JSON is not an array or if referenced Markdown files are missing
 */
export function loadJsonCollection<T = unknown>(filePath: string): T[] {
  const data = loadJson<unknown>(filePath);

  if (!Array.isArray(data)) {
    throw new ContentError(
      `Expected JSON file to contain an array, got ${typeof data}`,
      filePath
    );
  }

  // Resolve JSON file's directory for relative path resolution
  const jsonDir = dirname(resolve(filePath));

  // Process each item and merge Markdown content if contentPath exists
  const items: T[] = [];
  
  for (let i = 0; i < data.length; i++) {
    const item = data[i] as Record<string, unknown>;
    
    // Check if item has a contentPath property
    if (item && typeof item === 'object' && 'contentPath' in item) {
      const contentPath = item.contentPath;
      
      if (typeof contentPath === 'string' && contentPath.trim() !== '') {
        try {
          // Resolve path relative to JSON file's directory
          const mdFilePath = resolve(jsonDir, contentPath);
          
          // Load the Markdown file content
          const markdownContent = loadMarkdownFile(mdFilePath);
          
          // Merge the body property into the item
          items.push({
            ...item,
            body: markdownContent,
          } as T);
        } catch (error) {
          // Re-throw with additional context about which JSON item failed
          if (error instanceof ContentError) {
            throw new ContentError(
              `Failed to load markdown content for item at index ${i}: ${error.message}`,
              filePath,
              i
            );
          }
          throw error;
        }
      } else {
        // contentPath exists but is not a valid string, include item as-is
        items.push(item as T);
      }
    } else {
      // No contentPath, include item as-is (backward compatible)
      items.push(item as T);
    }
  }

  return items;
}
