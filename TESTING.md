# Testing Guide

This guide explains how to test the content-lite library.

## Setup

First, install dependencies:

```bash
npm install
```

## Running Tests

### Run all tests once:
```bash
npm test
```

### Run tests in watch mode (for development):
```bash
npm run test:watch
```

### Run tests with coverage:
```bash
npm run test:coverage
```

This will generate a coverage report showing which parts of the code are tested.

## Test Structure

Tests are located alongside source files with `.test.ts` extension:
- `src/defineCollection.test.ts` - Tests for the main collection API
- `src/loaders/loadJsonCollection.test.ts` - Tests for JSON loading
- `src/loaders/loadMarkdownCollection.test.ts` - Tests for Markdown loading
- `src/loaders/loadMarkdownFile.test.ts` - Tests for single file loading
- `src/errors.test.ts` - Tests for error handling
- `src/validate.test.ts` - Tests for validation

## Test Fixtures

Test fixtures are in the `test-fixtures/` directory:
- `posts.json` - Sample JSON collection
- `posts/` - Sample Markdown collection with frontmatter
- `products.json` - JSON collection with linked Markdown files
- `products/` - Markdown files linked from JSON

## Writing New Tests

When adding new features, add corresponding tests:

1. Create a test file: `src/your-feature.test.ts`
2. Import from Vitest: `import { describe, it, expect } from 'vitest'`
3. Write test cases covering:
   - Happy path (normal usage)
   - Error cases (invalid input, missing files, etc.)
   - Edge cases (empty collections, special characters, etc.)

Example:
```typescript
import { describe, it, expect } from 'vitest';
import { yourFunction } from './your-feature.js';

describe('yourFunction', () => {
  it('should work correctly', () => {
    const result = yourFunction('input');
    expect(result).toBe('expected');
  });
});
```

## Coverage Goals

Aim for:
- 80%+ line coverage
- 100% coverage for critical error paths
- Tests for all public APIs
