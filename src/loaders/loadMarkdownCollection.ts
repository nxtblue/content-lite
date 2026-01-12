import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join, extname } from 'node:path';
import matter from 'gray-matter';
import { ContentError } from '../errors.js';

/**
 * Loads a Markdown collection from a directory
 * 
 * This function is used for standalone Markdown collections with frontmatter.
 * It works independently from JSON collections and is the primary pattern for
 * Markdown-based content.
 * 
 * Scans the directory for .md files and parses each file's frontmatter and content.
 * Each .md file becomes one item in the collection with:
 * - All frontmatter fields as properties
 * - A `body` property containing the raw markdown content (without frontmatter)
 * 
 * **When to use:**
 * - Building blogs, documentation, or content-heavy sites
 * - Preferring Markdown for content authoring
 * - Wanting a file-per-item structure with metadata in frontmatter
 * 
 * **Note:** This is independent from JSON collections. Markdown frontmatter
 * collections are a valid standalone pattern.
 * 
 * @param dirPath - Path to directory containing .md files
 * @returns Array of items, one per .md file
 * @throws ContentError if directory cannot be read or files cannot be parsed
 */
export function loadMarkdownCollection<T = unknown>(dirPath: string): T[] {
  let resolvedPath: string;

  try {
    resolvedPath = resolve(dirPath);
  } catch (error) {
    throw new ContentError(
      `Failed to resolve directory path: ${dirPath}`,
      dirPath
    );
  }

  // Check if path exists and is a directory
  let stats;
  try {
    stats = statSync(resolvedPath);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new ContentError(
      `Failed to access directory: ${errorMessage}`,
      resolvedPath
    );
  }

  if (!stats.isDirectory()) {
    throw new ContentError(
      `Path is not a directory: ${resolvedPath}`,
      resolvedPath
    );
  }

  // Read directory contents
  let files: string[];
  try {
    files = readdirSync(resolvedPath);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new ContentError(
      `Failed to read directory: ${errorMessage}`,
      resolvedPath
    );
  }

  // Filter for .md files only
  const mdFiles = files.filter((file) => {
    const filePath = join(resolvedPath, file);
    try {
      const fileStats = statSync(filePath);
      return fileStats.isFile() && extname(file).toLowerCase() === '.md';
    } catch {
      // Skip files we can't stat
      return false;
    }
  });

  if (mdFiles.length === 0) {
    throw new ContentError(
      `No .md files found in directory: ${resolvedPath}`,
      resolvedPath
    );
  }

  // Load and parse each markdown file
  const items: T[] = [];

  for (const file of mdFiles) {
    const filePath = join(resolvedPath, file);

    let fileContent: string;
    try {
      fileContent = readFileSync(filePath, 'utf-8');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new ContentError(
        `Failed to read file: ${errorMessage}`,
        filePath
      );
    }

    let parsed;
    try {
      // Frontmatter-based Markdown is an alternative pattern.
      parsed = matter(fileContent);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid frontmatter';
      throw new ContentError(
        `Failed to parse frontmatter: ${errorMessage}`,
        filePath
      );
    }

    // Combine frontmatter data with body
    // Frontmatter is parsed as an object, body is the markdown content
    const item = {
      ...parsed.data,
      body: parsed.content,
    } as T;

    items.push(item);
  }

  return items;
}
