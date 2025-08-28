# Publishing to NPM

This document explains how to publish the `@aexoo-ai/spark-id` package to npm using GitHub Actions.

## Overview

The project uses GitHub Actions to automatically publish to npm when a new version tag is pushed. This ensures consistent, automated releases with proper testing and building.

**Note**: This project uses `pnpm` as the package manager. The `pnpm-lock.yaml` file is committed to the repository to ensure reproducible builds.

## Prerequisites

### 1. NPM Account Setup

1. **Create an NPM account** (if you don't have one):
   - Go to [npmjs.com](https://www.npmjs.com)
   - Sign up for a free account

2. **Create an NPM Classic Token**:
   - Go to npmjs.com → Profile → Access Tokens
   - Click "Generate New Token" → Select "Classic Token"
   - Choose "Automation" token type
   - Copy the generated token (you'll need this for GitHub secrets)

### 2. GitHub Repository Setup

1. **Add NPM Token to GitHub Secrets**:
   - Go to your repository: https://github.com/aexoo-ai/spark-id
   - Click "Settings" → "Secrets and variables" → "Actions"
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Paste your NPM access token
   - Click "Add secret"

## Publishing Process

### Step 1: Prepare Your Changes

1. **Make your code changes**
2. **Update version in package.json** (if needed):

   ```bash
   # For bug fixes (1.0.0 → 1.0.1)
   pnpm version patch

   # For new features (1.0.0 → 1.1.0)
   pnpm version minor

   # For breaking changes (1.0.0 → 2.0.0)
   pnpm version major
   ```

### Step 2: Commit and Push

```bash
# Commit your changes
git add .
git commit -m "Add new feature"

# Push changes and tags
git push origin main
git push --tags
```

### Step 3: Automatic Publishing

The GitHub Action will automatically:

1. **Trigger** when a tag starting with 'v' is pushed
2. **Run tests** to ensure code quality
3. **Build the package** using TypeScript
4. **Publish to npm** with the new version

## GitHub Actions Workflows

### publish-npm.yml

- **Trigger**: Pushes to tags matching `v*`
- **Actions**:
  - Sets up Node.js 18
  - Installs dependencies
  - Runs tests
  - Builds the package
  - Publishes to npm (with `--no-git-checks` to handle detached HEAD state)

### ci.yml

- **Trigger**: Pushes to main branch and pull requests
- **Actions**:
  - Runs linting
  - Runs tests
  - Builds the package
  - Ensures code quality before merging

## Version Management

### Semantic Versioning

- **Patch** (1.0.0 → 1.0.1): Bug fixes
- **Minor** (1.0.0 → 1.1.0): New features (backward compatible)
- **Major** (1.0.0 → 2.0.0): Breaking changes

### Using pnpm version

```bash
# Automatically updates package.json and creates git tag
pnpm version patch
pnpm version minor
pnpm version major
```

## Troubleshooting

### Common Issues

1. **NPM Token Issues**:
   - Ensure the token is a Classic Token (not Granular)
   - Verify the token has publish permissions
   - Check that the secret is named exactly `NPM_TOKEN`

2. **Build Failures**:
   - Check that all tests pass locally: `pnpm test`
   - Ensure TypeScript compilation works: `pnpm build`
   - Verify all dependencies are in package.json

3. **Publishing Failures**:
   - Check if the version already exists on npm
   - Verify you have publish permissions for the package
   - Ensure the package name in package.json matches npm registry
   - **Git branch issues**: If you see `ERR_PNPM_GIT_UNKNOWN_BRANCH`, the workflow uses `--no-git-checks` to handle detached HEAD state when publishing from tags

### Manual Publishing (if needed)

If you need to publish manually:

```bash
# Login to npm
pnpm login

# Build and test
pnpm build
pnpm test

# Publish
pnpm publish
```

## Best Practices

1. **Always test locally** before pushing:

   ```bash
   pnpm test
   pnpm build
   ```

2. **Use semantic versioning** appropriately

3. **Write meaningful commit messages**

4. **Check the GitHub Actions logs** if publishing fails

5. **Keep the NPM token secure** and rotate it periodically

## Monitoring

- **GitHub Actions**: Check the Actions tab in your repository
- **NPM Registry**: Verify the package appears at https://www.npmjs.com/package/@aexoo-ai/spark-id
- **Package Downloads**: Monitor usage through npm analytics

## Security Notes

- Never commit the NPM token to the repository
- Use GitHub secrets for sensitive information
- Regularly rotate your NPM tokens
- Review GitHub Actions logs for any security issues
