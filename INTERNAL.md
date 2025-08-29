# Internal Documentation Guide

This document explains how to maintain and update the Spark-ID documentation.

## Overview

The documentation is built with [VitePress](https://vitepress.dev/) and includes:

- **Automated updates**: AI-powered documentation updates using Cursor CLI
- **Theme-aware assets**: Logos and styling that adapt to light/dark themes
- **Link validation**: Automated checking for broken links
- **Configuration system**: Comprehensive documentation of all features

## Quick Start

### Development Server

```bash
pnpm docs:dev
```

Access at: http://localhost:5173/spark-id/

### Build Documentation

```bash
pnpm docs:build
```

### Check for Broken Links

```bash
pnpm docs:check
```

## Automated Documentation Updates

### Using the Update Script

The `update-docs.sh` script automatically analyzes code changes and updates documentation:

```bash
pnpm update-docs
```

**What it does:**

1. Compares current branch to `main`
2. Analyzes changes in source files
3. Updates relevant documentation files
4. Maintains consistency across all docs

**When to use:**

- After adding new features
- After changing API signatures
- After updating configuration options
- After modifying CLI functionality

### Manual Updates

If you need to update specific sections manually:

1. **API Documentation**: Update files in `docs/api/`
2. **Examples**: Modify files in `docs/examples/`
3. **Guides**: Edit files in `docs/guide/`
4. **CLI Documentation**: Update files in `docs/cli/`

## Documentation Structure

```
docs/
├── .vitepress/
│   └── config.ts          # VitePress configuration
├── public/
│   ├── logo.svg           # Light theme logo
│   └── logo-dark.svg      # Dark theme logo
├── api/                   # API reference
├── examples/              # Usage examples
├── guide/                 # User guides
├── cli/                   # CLI documentation
└── index.md              # Homepage
```

## Configuration System Documentation

The configuration system is documented in `docs/guide/configuration.md` and includes:

- **Global configuration**: `configure()`, `getConfig()`, `resetConfig()`
- **Per-call overrides**: Passing config to individual functions
- **All options**: `alphabet`, `entropyBits`, `length`, `maxPrefixLength`, `separator`, `case`, etc.

### Default Values

```typescript
const DEFAULT_CONFIG = {
  alphabet: 'YBNDRFG8EJKMCPQXOT1UWISZA345H769',
  entropyBits: 72,
  length: 12,
  maxPrefixLength: 20,
  separator: '_',
  case: 'upper',
  encoding: 'base32',
  timestamp: false,
  machineId: undefined,
};
```

## Theme-Aware Assets

### Logo Management

The logo automatically adapts to themes:

- **Light theme**: `docs/public/logo.svg` (black)
- **Dark theme**: `docs/public/logo-dark.svg` (white)

To update logos:

1. Replace the SVG files in `docs/public/`
2. Ensure both light and dark versions exist
3. Test with `pnpm docs:dev` and switch themes

### CSS Variables

VitePress uses CSS variables for theming:

- `--vp-c-text-1`: Primary text color
- `--vp-c-text-2`: Secondary text color
- `--vp-c-brand`: Brand color
- `--vp-c-bg`: Background color

## Link Validation

### Automatic Checking

The build process includes link validation:

```bash
pnpm docs:check  # Dry-run build with link checking
```

### Manual Link Checking

For comprehensive link validation:

```bash
# Install link checker
npm install -g markdown-link-check

# Check all markdown files
find docs/ -name "*.md" -exec markdown-link-check {} \;
```

### Common Link Issues

1. **Missing base path**: Links should include `/spark-id/` prefix
2. **Broken internal links**: Ensure all referenced files exist
3. **External links**: Verify external URLs are accessible

## Content Guidelines

### Code Examples

- Use uppercase IDs by default (matches library defaults)
- Include both simple and prefixed examples
- Show configuration usage where relevant
- Use TypeScript for type safety examples

### API Documentation

- Document all public functions and classes
- Include parameter types and return values
- Provide usage examples
- Document error conditions

### Examples

- Cover common use cases
- Include database integration examples
- Show CLI usage patterns
- Demonstrate configuration options

## Deployment

### GitHub Pages

The documentation is automatically deployed to GitHub Pages when changes are pushed to `main`.

### Local Testing

Before deploying:

1. Run `pnpm docs:build`
2. Test locally with `pnpm docs:preview`
3. Check for broken links with `pnpm docs:check`
4. Verify all examples work correctly

## Troubleshooting

### Common Issues

1. **Logo not changing with theme**: Ensure both `logo.svg` and `logo-dark.svg` exist
2. **Broken links**: Run `pnpm docs:check` to identify issues
3. **Build failures**: Check for syntax errors in markdown files
4. **Missing updates**: Run `pnpm update-docs` after code changes

### Development Tips

1. **Hot reload**: Use `pnpm docs:dev` for live preview
2. **Incremental updates**: The update script only modifies relevant files
3. **Consistency**: The automated script maintains consistent formatting
4. **Version control**: Always commit documentation changes with code changes

## Maintenance Tasks

### Regular Checks

- [ ] Run `pnpm docs:check` weekly
- [ ] Test examples with latest library version
- [ ] Update configuration documentation when defaults change
- [ ] Verify external links are still valid

### After Releases

- [ ] Update version numbers in examples
- [ ] Review and update changelog
- [ ] Test all code examples
- [ ] Verify API documentation is current

## Contributing

When contributing to documentation:

1. Follow the existing style and structure
2. Use the automated update script when possible
3. Test your changes locally
4. Include examples for new features
5. Update related sections (API, examples, guides)

## Resources

- [VitePress Documentation](https://vitepress.dev/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Cursor CLI Documentation](https://docs.cursor.com/en/cli/)
- [GitHub Pages](https://pages.github.com/)
