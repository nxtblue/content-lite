# Publishing Guide

This guide explains how to publish content-lite to npm.

## Prerequisites

1. **npm account**: Create an account at [npmjs.com](https://www.npmjs.com/)
2. **Two-Factor Authentication (2FA)**: Enable 2FA on your npm account (required for publishing)
   - Go to npmjs.com → Account Settings → Security → Enable 2FA
   - Use an authenticator app (Google Authenticator, Authy, etc.)
   - Alternative: Use a Granular Access Token with bypass 2FA enabled (see Troubleshooting)
3. **Login**: Run `npm login` to authenticate
4. **Version**: Update version in `package.json` (follow [semver](https://semver.org/))

## Pre-Publishing Checklist

Before publishing, ensure:

- [ ] All tests pass: `npm test`
- [ ] Code builds successfully: `npm run build`
- [ ] Version number is updated in `package.json`
- [ ] `README.md` is up to date
- [ ] `package.json` has correct:
  - `name`: **Recommended**: `@nxtblue/content-lite` (scoped package) or `content-lite` (unscoped)
    - **Scoped packages** (`@nxtblue/content-lite`) are recommended because:
      - Namespace protection: Ensures the name is available under your organization
      - Professional appearance: Shows it's part of an organization/team
      - Easier to manage multiple packages under the same scope
      - Less likely to have naming conflicts
      - Better for organizations and teams
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

#### Scoped package (recommended, e.g., `@nxtblue/content-lite`):
```bash
npm publish --access public
```
**Note**: Scoped packages require the `--access public` flag to make them publicly available. Without this flag, scoped packages are private by default.

#### Dry run (test without publishing):
```bash
npm publish --dry-run
```

### 5. Verify publication

Check your package on npm:
```
https://www.npmjs.com/package/@nxtblue/content-lite
```
(For unscoped packages, use: `https://www.npmjs.com/package/content-lite`)

## Version Management

Follow [Semantic Versioning (Semver)](https://semver.org/) strictly:

### Version Format: `MAJOR.MINOR.PATCH` (e.g., `1.2.3`)

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes that are not backward compatible
  - API changes that break existing code
  - Removing features or functions
  - Changing function signatures in incompatible ways
  
- **MINOR** (1.0.0 → 1.1.0): New features that are backward compatible
  - Adding new functions or methods
  - Adding new optional parameters
  - Adding new features without breaking existing functionality
  
- **PATCH** (1.0.0 → 1.0.1): Bug fixes that are backward compatible
  - Fixing bugs
  - Performance improvements
  - Documentation updates
  - Internal refactoring

### Pre-1.0.0 Versions (0.x.y)

For versions before 1.0.0 (like `0.1.0`), the rules are slightly different:
- **0.MINOR.PATCH**: MINOR version increments can include breaking changes
- **0.0.PATCH**: PATCH version increments are for bug fixes only
- **Moving to 1.0.0**: Indicates the API is stable and production-ready

### Update version:

```bash
# Patch version (1.0.0 → 1.0.1 or 0.1.0 → 0.1.1)
npm version patch

# Minor version (1.0.0 → 1.1.0 or 0.1.0 → 0.2.0)
npm version minor

# Major version (1.0.0 → 2.0.0 or 0.1.0 → 1.0.0)
npm version major
```

**Note**: For pre-1.0.0 versions, `npm version major` will bump from `0.1.0` to `1.0.0`, indicating the package is stable and production-ready.

This automatically:
- Updates `package.json` version
- Creates a git tag (e.g., `v1.0.0`)
- Commits the change

### Version Best Practices

1. **Always use semver**: Never skip versions or use non-standard formats
2. **Tag releases**: Git tags are automatically created with `npm version`
3. **Changelog**: Document what changed in each version
4. **Breaking changes**: Always increment MAJOR version for breaking changes
5. **Pre-1.0.0**: Use `0.x.y` for initial development, move to `1.0.0` when stable

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
- Use a scoped package: `@nxtblue/content-lite` (recommended)
- Or choose a different unscoped name

### "You must verify your email"
- Verify your email on npmjs.com

### "Insufficient permissions"
- Check you're logged in: `npm whoami`
- For scoped packages, ensure you own the scope

### "403 Forbidden - Two-factor authentication required"
This error occurs when npm requires 2FA for publishing packages. You have two options:

**Option 1: Enable 2FA on your npm account (Recommended)**
1. Go to [npmjs.com](https://www.npmjs.com/) and log in
2. Navigate to your account settings → Security
3. Enable Two-Factor Authentication (2FA)
4. Use an authenticator app (Google Authenticator, Authy, etc.) to set it up
5. When publishing, you'll be prompted for the 2FA code

**Option 2: Use a Granular Access Token with bypass 2FA**
1. Go to [npmjs.com](https://www.npmjs.com/) → Account Settings → Access Tokens
2. Create a new "Granular Access Token"
3. Set permissions to allow publishing
4. Enable "Bypass 2FA" option (if available for your account type)
5. Use the token: `npm login --auth-type=legacy` and paste the token when prompted
   - Or set it in `.npmrc`: `//registry.npmjs.org/:_authToken=YOUR_TOKEN_HERE`

**Note**: npm requires 2FA for publishing to enhance security. Enabling 2FA is the recommended approach.

### "Package not found after publishing"
- Wait a few minutes for npm to index
- Check the exact package name matches

## Unpublishing (Emergency Only)

⚠️ **Warning**: Only unpublish within 72 hours of publishing, and only if absolutely necessary.

```bash
npm unpublish @nxtblue/content-lite@1.0.0
```

Or unpublish all versions (not recommended):
```bash
npm unpublish @nxtblue/content-lite --force
```
(For unscoped packages, use: `content-lite` instead)

## Best Practices

1. **Test before publishing**: Always run `npm test` and `npm run build`
2. **Use semantic versioning**: Follow semver strictly - never skip versions or use non-standard formats
3. **Write changelog**: Document changes in README or CHANGELOG.md for each version
4. **Tag releases**: Git tags are automatically created with `npm version` commands
5. **Don't unpublish**: Once published, prefer deprecating over unpublishing
6. **Version format**: Always use `MAJOR.MINOR.PATCH` format (e.g., `1.2.3`, not `1.2` or `v1.2.3`)
7. **Breaking changes**: Always increment MAJOR version, even if it's a small breaking change
8. **Pre-1.0.0**: Use `0.x.y` for initial development; move to `1.0.0` when API is stable