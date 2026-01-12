# Publishing Guide

This guide explains how to publish content-lite to npm.

## Prerequisites

1. **npm account**: Create an account at [npmjs.com](https://www.npmjs.com/)
2. **Login**: Run `npm login` to authenticate
3. **Version**: Update version in `package.json` (follow [semver](https://semver.org/))

## Pre-Publishing Checklist

Before publishing, ensure:

- [ ] All tests pass: `npm test`
- [ ] Code builds successfully: `npm run build`
- [ ] Version number is updated in `package.json`
- [ ] `README.md` is up to date
- [ ] `package.json` has correct:
  - `name`: `content-lite` (or your scoped name like `@yourname/content-lite`)
  - `version`: Follow semver (e.g., `1.0.0`, `1.0.1`, `1.1.0`)
  - `author`: Your name/email (if not already set)
  - `repository`: GitHub/GitLab URL (optional but recommended)
  - `homepage`: Project homepage (optional)
  - `bugs`: Issues URL (optional)

## Publishing Steps

### 1. Build the project
```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### 2. Run tests
```bash
npm test
```

Ensure all tests pass before publishing.

### 3. Check what will be published
```bash
npm pack --dry-run
```

This shows what files will be included in the package. Only files in `dist/` and `README.md` should be included (thanks to `.npmignore`).

### 4. Publish to npm

#### First time (public package):
```bash
npm publish
```

#### Scoped package (if using `@yourname/content-lite`):
```bash
npm publish --access public
```

#### Dry run (test without publishing):
```bash
npm publish --dry-run
```

### 5. Verify publication

Check your package on npm:
```
https://www.npmjs.com/package/content-lite
```

## Version Management

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features (backward compatible)
- **PATCH** (1.0.0 → 1.0.1): Bug fixes (backward compatible)

### Update version:

```bash
# Patch version (1.0.0 → 1.0.1)
npm version patch

# Minor version (1.0.0 → 1.1.0)
npm version minor

# Major version (1.0.0 → 2.0.0)
npm version major
```

This automatically:
- Updates `package.json` version
- Creates a git tag
- Commits the change

Then publish:
```bash
npm publish
```

## Updating package.json

Before first publish, you may want to add:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/content-lite.git"
  },
  "homepage": "https://github.com/yourusername/content-lite#readme",
  "bugs": {
    "url": "https://github.com/yourusername/content-lite/issues"
  }
}
```

## Troubleshooting

### "Package name already taken"
- Choose a different name or use a scoped package: `@yourname/content-lite`

### "You must verify your email"
- Verify your email on npmjs.com

### "Insufficient permissions"
- Check you're logged in: `npm whoami`
- For scoped packages, ensure you own the scope

### "Package not found after publishing"
- Wait a few minutes for npm to index
- Check the exact package name matches

## Unpublishing (Emergency Only)

⚠️ **Warning**: Only unpublish within 72 hours of publishing, and only if absolutely necessary.

```bash
npm unpublish content-lite@1.0.0
```

Or unpublish all versions (not recommended):
```bash
npm unpublish content-lite --force
```

## Best Practices

1. **Test before publishing**: Always run `npm test` and `npm run build`
2. **Use semantic versioning**: Follow semver strictly
3. **Write changelog**: Document changes in README or CHANGELOG.md
4. **Tag releases**: Use git tags for versions
5. **Don't unpublish**: Once published, prefer deprecating over unpublishing
