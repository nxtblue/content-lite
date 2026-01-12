# content-lite

A lightweight, type-safe content loader for static sites using JSON collections and Markdown files with frontmatter. A minimal alternative to Contentlayer and traditional CMS tools.

**JSON and Markdown work independently by default.** You can use JSON collections, Markdown collections with frontmatter, or optionally link them together for advanced use cases.

## Problem Statement

Static site generators and build tools often need a way to load and validate content from JSON files or Markdown files. While solutions like Contentlayer exist, they often come with:

- Heavy framework coupling (Next.js, Astro, etc.)
- Runtime watchers and CLI tools
- Complex build-time dependencies
- Large dependency trees

**content-lite** solves this by providing a simple, zero-runtime-overhead solution that works anywhere Node.js runs.

## Why Not CMS / Contentlayer?

- **No framework coupling**: Works with any build tool or framework
- **No runtime overhead**: Content is loaded synchronously at build/import time
- **Minimal dependencies**: Only Node.js built-ins and gray-matter, with optional Zod for validation
- **Universal compatibility**: Works in Cloudflare Pages, GitHub/GitLab Pages, Vite, Next.js, and more
- **Type-safe**: Full TypeScript support with optional runtime validation
- **Fail fast**: Errors are thrown at build time, not runtime
- **Git is the CMS**: Content lives in your repository, version controlled and human-editable

## Installation

```bash
npm install content-lite
```

If you want to use Zod validation (optional):

```bash
npm install content-lite zod
```

## Basic Usage

### JSON Collections

```typescript
import { defineCollection } from 'content-lite';

// Define a collection from a JSON file
const posts = defineCollection({
  path: './content/posts.json',
});

// Use the collection
const allPosts = posts.all();
const post = posts.getById('my-post-id');
```

### Markdown Collections

```typescript
import { defineCollection } from 'content-lite';

// Define a collection from a directory of Markdown files
const posts = defineCollection({
  path: './content/posts', // Directory containing .md files
  format: 'md', // Optional: inferred from path if not provided
});

// Each .md file becomes one item with frontmatter + body
const allPosts = posts.all();
const post = posts.getById('my-post-id');
```

## Recommended Usage Patterns

content-lite supports three independent patterns. Choose the one that best fits your needs:

### Pattern 1: JSON Collections (Standalone)

Use JSON collections when:
- You prefer structured data in JSON format
- You want all content and metadata in one file
- You need programmatic content generation
- You're building APIs or data-driven sites

JSON collections are completely standalone and work independently of Markdown collections.

### Pattern 2: Markdown Collections with Frontmatter (Standalone)

Use Markdown collections when:
- You prefer writing content in Markdown
- You want to keep content and metadata together in each file
- You're building blogs, documentation, or content-heavy sites
- You want a file-per-item structure

Markdown frontmatter collections are a valid standalone pattern. Each `.md` file contains frontmatter (YAML metadata) and body content, and works independently of JSON collections.

### Pattern 3: JSON → Markdown Linking (Optional Advanced Pattern)

This is an **optional advanced pattern** that combines JSON and Markdown. Use it when:
- You want JSON to be the source of truth for metadata
- You need to keep long-form content in separate Markdown files
- You're building product catalogs or structured content with rich descriptions

See the [Optional Advanced Pattern: JSON → Markdown](#optional-advanced-pattern-json--markdown) section below for details.

## Usage with Zod

Add runtime validation with Zod schemas:

### JSON Collections

```typescript
import { defineCollection } from 'content-lite';
import { z } from 'zod';

const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  published: z.boolean(),
  tags: z.array(z.string()),
});

const posts = defineCollection({
  path: './content/posts.json',
  schema: postSchema,
});

// All items are validated at build time
// Invalid items will throw a ContentError
const allPosts = posts.all();
```

### Markdown Collections

For Markdown files, the schema validates frontmatter only. The `body` field (raw markdown content) is always included automatically:

```typescript
import { defineCollection } from 'content-lite';
import { z } from 'zod';

const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  published: z.boolean(),
  tags: z.array(z.string()),
  body: z.string(), // Markdown content (always included)
});

const posts = defineCollection({
  path: './content/posts', // Directory with .md files
  format: 'md',
  schema: postSchema,
});

// Frontmatter is validated, body is always included
const allPosts = posts.all();
```

## Usage without Zod

You can use content-lite without Zod for type-only validation:

```typescript
import { defineCollection } from 'content-lite';

interface Post {
  id: string;
  title: string;
  content: string;
}

const posts = defineCollection<Post>({
  path: './content/posts.json',
});

// TypeScript will enforce types, but no runtime validation
const allPosts = posts.all();
```

## JSON Collections

### Example JSON Structure

Your JSON file should contain an array of objects:

```json
[
  {
    "id": "post-1",
    "title": "My First Post",
    "content": "This is the content...",
    "published": true,
    "tags": ["tech", "javascript"]
  },
  {
    "id": "post-2",
    "title": "My Second Post",
    "content": "More content...",
    "published": false,
    "tags": ["design"]
  }
]
```

## Optional Advanced Pattern: JSON → Markdown

> **Note:** This is an **optional advanced pattern**. JSON and Markdown collections work independently by default. You only need this pattern if you want to link JSON metadata to Markdown content files.

You can link Markdown files to JSON items using a `contentPath` field. This is useful when you want JSON to be the source of truth for metadata, while keeping long-form content in separate Markdown files.

**content/products.json:**
```json
[
  {
    "id": "aluminium-door",
    "name": "Aluminium Door",
    "price": 12000,
    "published": true,
    "order": 1,
    "contentPath": "content/products/aluminium-door.md"
  },
  {
    "id": "wooden-door",
    "name": "Wooden Door",
    "price": 15000,
    "published": true,
    "order": 2,
    "contentPath": "content/products/wooden-door.md"
  }
]
```

**content/products/aluminium-door.md:**
```markdown
# Aluminium Door Specifications

Our premium aluminium doors feature:

- **Durability**: Weather-resistant construction
- **Security**: Multi-point locking system
- **Design**: Modern, sleek appearance

Perfect for both residential and commercial applications.
```

**Note:** When using `contentPath`, the Markdown file should contain **only body content** (no frontmatter). The `contentPath` is resolved relative to the JSON file's directory.

The loaded items will have all JSON properties plus a `body` property containing the Markdown content:

```typescript
import { defineCollection } from 'content-lite';
import { z } from 'zod';

const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  published: z.boolean(),
  order: z.number(),
  contentPath: z.string().optional(),
  body: z.string().optional(), // Added automatically when contentPath is present
});

const products = defineCollection({
  path: './content/products.json',
  schema: productSchema,
});

const allProducts = products.all();
// Each product with contentPath will have a body property with the MD content
```

**Path Resolution:**
- `contentPath` is resolved relative to the JSON file's directory
- If `products.json` is at `./content/products.json`
- And `contentPath` is `"content/products/aluminium-door.md"`
- The resolved path will be relative to `./content/` directory

**Error Handling:**
- If a referenced Markdown file is missing, the build will fail with a clear error message
- The error includes both the JSON file path and the missing Markdown file path

## Markdown Collections

Markdown collections with frontmatter are a **valid standalone pattern**. Each Markdown file contains frontmatter (YAML metadata) and body content, and works independently of JSON collections.

### Example Markdown Structure

Create a directory (e.g., `content/posts/`) and add `.md` files with frontmatter:

**content/posts/getting-started.md:**
```markdown
---
id: getting-started-with-typescript
title: Getting Started with TypeScript
slug: getting-started-with-typescript
published: true
publishedAt: 2024-01-15
author: John Doe
tags:
  - typescript
  - javascript
  - programming
category: tutorial
---

# Getting Started with TypeScript

TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.

## Why TypeScript?

TypeScript adds static type checking to JavaScript, helping catch errors before runtime.
```

**content/posts/building-static-sites.md:**
```markdown
---
id: building-static-sites
title: Building Modern Static Sites
slug: building-static-sites
published: true
publishedAt: 2024-01-20
author: Jane Smith
tags:
  - static-sites
  - web-development
category: guide
---

# Building Modern Static Sites

Static site generators have revolutionized web development...
```

Each `.md` file becomes one item in the collection. The frontmatter (YAML between `---`) becomes properties, and the markdown content becomes the `body` property.

### Using Markdown Collections

```typescript
import { defineCollection } from 'content-lite';
import { z } from 'zod';

const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  published: z.boolean(),
  publishedAt: z.string(),
  author: z.string(),
  tags: z.array(z.string()),
  category: z.string(),
  body: z.string(), // Raw markdown content
});

const posts = defineCollection({
  path: './content/posts', // Directory path
  format: 'md', // Optional: auto-inferred if path doesn't end in .json
  schema: postSchema,
});

// Get all posts
const allPosts = posts.all();

// Each post has frontmatter fields + body
allPosts.forEach((post) => {
  console.log(post.title); // From frontmatter
  console.log(post.body);  // Raw markdown content
});
```

## Creating Blog Posts

Here's a complete guide on how to create and manage blog posts with content-lite:

### Step 1: Create Your Content File

Create a JSON file (e.g., `content/posts.json`) with your blog posts:

```json
[
  {
    "id": "getting-started-with-typescript",
    "title": "Getting Started with TypeScript",
    "slug": "getting-started-with-typescript",
    "content": "TypeScript is a typed superset of JavaScript...",
    "excerpt": "Learn the basics of TypeScript in this comprehensive guide.",
    "published": true,
    "publishedAt": "2024-01-15",
    "author": "John Doe",
    "tags": ["typescript", "javascript", "programming"],
    "category": "tutorial"
  },
  {
    "id": "building-static-sites",
    "title": "Building Modern Static Sites",
    "slug": "building-static-sites",
    "content": "Static site generators have revolutionized web development...",
    "excerpt": "Explore the benefits of static site generation.",
    "published": true,
    "publishedAt": "2024-01-20",
    "author": "Jane Smith",
    "tags": ["static-sites", "web-development"],
    "category": "guide"
  },
  {
    "id": "draft-post",
    "title": "Draft Post",
    "slug": "draft-post",
    "content": "This is a work in progress...",
    "excerpt": "Coming soon.",
    "published": false,
    "publishedAt": "2024-02-01",
    "author": "John Doe",
    "tags": ["draft"],
    "category": "tutorial"
  }
]
```

### Step 2: Define Your Schema (Optional but Recommended)

Create a schema file (e.g., `src/schemas.ts`):

```typescript
import { z } from 'zod';

export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  excerpt: z.string(),
  published: z.boolean(),
  publishedAt: z.string(),
  author: z.string(),
  tags: z.array(z.string()),
  category: z.string(),
});

export type Post = z.infer<typeof postSchema>;
```

### Step 3: Set Up Your Collection

Create a content file (e.g., `src/content.ts`):

```typescript
import { defineCollection } from 'content-lite';
import { postSchema, type Post } from './schemas.js';

export const posts = defineCollection<Post>({
  path: './content/posts.json',
  schema: postSchema,
  transform: (items) => {
    // Filter out unpublished posts and sort by date
    return items
      .filter((post) => post.published)
      .sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
  },
});
```

### Step 4: Use in Your Application

Now you can use your posts collection anywhere in your app:

```typescript
import { posts } from './content.js';

// Get all published posts (already filtered and sorted)
const allPosts = posts.all();

// Get a specific post by ID
const post = posts.getById('getting-started-with-typescript');

// Example: Generate a blog index page
function BlogIndex() {
  const allPosts = posts.all();
  
  return (
    <div>
      <h1>Blog Posts</h1>
      {allPosts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
          <p>Published: {post.publishedAt}</p>
          <p>Tags: {post.tags.join(', ')}</p>
          <a href={`/blog/${post.slug}`}>Read more</a>
        </article>
      ))}
    </div>
  );
}

// Example: Generate a single post page
function BlogPost({ slug }: { slug: string }) {
  const post = posts.all().find((p) => p.slug === slug);
  
  if (!post) {
    return <div>Post not found</div>;
  }
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>By {post.author} on {post.publishedAt}</p>
      <div>{post.content}</div>
      <div>
        <strong>Tags:</strong> {post.tags.join(', ')}
      </div>
    </article>
  );
}
```

### Step 5: Adding New Posts

To add a new blog post, simply edit your `content/posts.json` file:

```json
[
  // ... existing posts ...
  {
    "id": "new-post-id",
    "title": "My New Post",
    "slug": "my-new-post",
    "content": "Content here...",
    "excerpt": "Short description",
    "published": true,
    "publishedAt": "2024-02-15",
    "author": "John Doe",
    "tags": ["new", "example"],
    "category": "tutorial"
  }
]
```

The next time you build your site, the new post will be automatically included and validated.

### Tips for Managing Blog Posts

- **Use unique IDs**: Each post should have a unique `id` field
- **Validate early**: Use Zod schemas to catch errors at build time
- **Transform for filtering**: Use the `transform` function to filter unpublished posts or apply sorting
- **Keep JSON valid**: Use a JSON linter or editor with validation to avoid syntax errors
- **Version control**: Commit your `content/posts.json` file to git for version tracking

## Transform Function

You can transform items after validation:

```typescript
const posts = defineCollection({
  path: './content/posts.json',
  schema: postSchema,
  transform: (items) => {
    // Sort by title, filter published, etc.
    return items
      .filter((post) => post.published)
      .sort((a, b) => a.title.localeCompare(b.title));
  },
});
```

## Error Handling

content-lite throws `ContentError` for all failures:

```typescript
import { defineCollection, ContentError } from 'content-lite';

try {
  const posts = defineCollection({
    path: './content/posts.json',
    schema: postSchema,
  });
} catch (error) {
  if (error instanceof ContentError) {
    console.error(error.toString());
    // Output:
    // Validation failed: title: Required
    //   File: /path/to/content/posts.json
    //   Item index: 2
  }
}
```

## Design Philosophy

1. **Git is the CMS**: Content lives in your repository, version controlled and human-editable
2. **Build-time only**: All loading happens synchronously at import/build time, zero runtime APIs
3. **Zero infrastructure**: No servers, databases, or external services needed
4. **No framework coupling**: Works with any build tool or framework
5. **Simplicity**: Minimal API surface, no magic, no watchers, no CLI
6. **Type Safety**: Full TypeScript support with optional runtime validation
7. **Fail Fast**: Errors are thrown immediately at build time, making debugging easy
8. **No Global State**: Each collection is independent

## What This Library Does NOT Do

content-lite is intentionally minimal and focused. It does NOT provide:

- **No CMS functionality**: This is not a content management system. Content lives in your repository as files.
- **No runtime APIs**: All content loading happens at build/import time. There are no runtime APIs to query or fetch content.
- **No database**: Content is stored in files (JSON or Markdown), not in a database.
- **No file watchers**: Content is loaded once at build time. There are no file system watchers or hot-reload capabilities.
- **No framework-specific integrations**: Works with any build tool or framework, but doesn't provide special integrations for Next.js, Astro, etc.

These limitations are by design to keep the library lightweight, focused, and compatible with static site generators and build-time workflows.

## API Reference

### `defineCollection<T>(config)`

Defines a content collection from a JSON file or Markdown directory.

**Parameters:**
- `config.path` (string): 
  - For JSON: Path to JSON file containing an array (relative or absolute)
  - For Markdown: Path to directory containing `.md` files (relative or absolute)
- `config.format` (`"json" | "md"`, optional): Content format. If not provided, inferred from path:
  - Paths ending in `.json` → `"json"`
  - Otherwise → `"md"`
- `config.schema` (ZodSchema<T>, optional): Zod schema for validation
  - For JSON: Validates each array item
  - For Markdown: Validates frontmatter only (body is always included as string)
- `config.transform` ((items: T[]) => T[], optional): Transform function applied after validation

**Returns:** `Collection<T>` with:
- `all()`: Returns all items as an array
- `getById(id: string)`: Returns item by id or undefined

**Format Inference:**
```typescript
// Format inferred as "json"
const posts = defineCollection({ path: './content/posts.json' });

// Format inferred as "md"
const posts = defineCollection({ path: './content/posts' });

// Format explicitly set
const posts = defineCollection({ 
  path: './content/posts', 
  format: 'md' 
});
```

### `ContentError`

Custom error class for content loading and validation errors.

**Properties:**
- `message`: Error message
- `filePath`: Path to the file that caused the error
- `itemIndex`: Index of the item that caused the error (for JSON collections) or filename (for Markdown collections)

## Limitations

content-lite is intentionally minimal and has the following limitations:

- **No Markdown rendering**: Returns raw markdown strings, no HTML conversion
- **No MDX support**: Only standard Markdown files are supported
- **No file watchers**: Content is loaded once at build/import time
- **No CLI tools**: No command-line interface or dev server
- **No plugins**: No plugin system or extensibility hooks
- **No framework integrations**: No special integrations for Next.js, Astro, etc.
- **Synchronous only**: All file operations are synchronous (build-time only)
- **Node.js only**: Requires Node.js filesystem APIs (won't work in browsers)
- **No nested directories for Markdown**: Only scans the specified directory, not subdirectories
- **Frontmatter validation only**: For Markdown, only frontmatter is validated, not the body content

These limitations are by design to keep the library lightweight and focused.

## License

MIT
