# Spark-ID CLI Usage Guide

**Internal Documentation for Developers**

The `@aexoo-ai/spark-id` package includes a command-line interface (CLI) for generating and validating IDs directly from your terminal. This guide is intended for developers and maintainers working with the project.

## Quick Start

### Method 1: Using npx (Recommended)

```bash
# Generate a single ID
npx @aexoo-ai/spark-id

# Generate ID with prefix
npx @aexoo-ai/spark-id -p USER

# Generate multiple IDs
npx @aexoo-ai/spark-id -c 5

# Validate an ID
npx @aexoo-ai/spark-id -v USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769
```

### Method 2: Using pnpm script (Workspace-friendly)

```bash
# Generate a single ID
pnpm spark-id

# Generate ID with prefix
pnpm spark-id -p USER

# Generate multiple IDs
pnpm spark-id -c 5

# Validate an ID
pnpm spark-id -v USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769
```

### Method 3: Direct binary path

```bash
# From project root (in development)
node dist/cli.cjs

# With options
node dist/cli.cjs -p TXN -c 3

# When installed as a package
./node_modules/.bin/spark-id

# With options
./node_modules/.bin/spark-id -p TXN -c 3
```

### Method 4: Global installation

```bash
# Install globally
pnpm add -g @aexoo-ai/spark-id

# Use from anywhere
spark-id -p USER -c 2
```

## CLI Options

| Option       | Short | Description                             | Example               |
| ------------ | ----- | --------------------------------------- | --------------------- |
| `--prefix`   | `-p`  | Add prefix to generated IDs             | `-p USER`             |
| `--count`    | `-c`  | Generate multiple IDs                   | `-c 5`                |
| `--validate` | `-v`  | Validate if an ID is properly formatted | `-v USER_ABC123`      |
| `--parse`    |       | Parse an ID and show its components     | `--parse USER_ABC123` |
| `--format`   | `-f`  | Output format: json, text, csv          | `-f json`             |
| `--examples` | `-e`  | Show usage examples                     | `-e`                  |
| `--help`     | `-h`  | Show help message                       | `-h`                  |

## Examples

### Basic Usage

```bash
# Generate a single ID
$ spark-id
YBNDRFG8EJKMCPQXOT1UWISZA345H769

# Generate ID with prefix
$ spark-id -p USER
USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769

# Generate multiple IDs
$ spark-id -c 3
YBNDRFG8EJKMCPQXOT1UWISZA345H769
ABC123DEF456GHI789
XYZ789UVW012MNO345
```

### Advanced Usage

```bash
# Multiple IDs with prefix in JSON format
$ spark-id -p TXN -c 2 -f json
[
  "TXN_YBNDRFG8EJKMCPQXOT1UWISZA345H769",
  "TXN_ABC123DEF456GHI789"
]

# Validate an ID
$ spark-id -v USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769
true

# Parse an ID to see its components
$ spark-id --parse USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769
{
  "prefix": "USER",
  "id": "YBNDRFG8EJKMCPQXOT1UWISZA345H769",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "random": "ABC123DEF456"
}
```

### CSV Output

```bash
$ spark-id -p ORDER -c 3 -f csv
ORDER_YBNDRFG8EJKMCPQXOT1UWISZA345H769
ORDER_ABC123DEF456GHI789
ORDER_XYZ789UVW012MNO345
```

## Troubleshooting

### "spark-id command not found"

This is common in pnpm workspaces. Use one of these solutions:

1. **Use npx** (recommended):

   ```bash
   npx @aexoo-ai/spark-id
   ```

2. **Use the pnpm script**:

   ```bash
   pnpm spark-id
   ```

3. **Use the full path**:

   ```bash
   ./node_modules/.bin/spark-id
   ```

4. **Install globally**:
   ```bash
   pnpm add -g @aexoo-ai/spark-id
   ```

### Permission Issues

If you get permission errors when using the direct binary path:

```bash
chmod +x ./node_modules/.bin/spark-id
```

## Exit Codes

- `0`: Success
- `1`: Error or validation failed

## Integration Examples

### In Shell Scripts

```bash
#!/bin/bash
# Generate a user ID
USER_ID=$(spark-id -p USER)
echo "Generated user ID: $USER_ID"

# Generate multiple transaction IDs
spark-id -p TXN -c 10 -f csv > transactions.txt
```

### In Package.json Scripts

```json
{
  "scripts": {
    "generate-test-ids": "spark-id -p TEST -c 100 -f json > test-ids.json",
    "validate-ids": "spark-id -v $ID_TO_VALIDATE"
  }
}
```

### In CI/CD Pipelines

```yaml
# GitHub Actions example
- name: Generate deployment ID
  run: |
    DEPLOY_ID=$(spark-id -p DEPLOY)
    echo "DEPLOY_ID=$DEPLOY_ID" >> $GITHUB_ENV
```

## Why These Methods Work

The CLI is properly configured in the package.json with:

```json
"bin": {
  "spark-id": "dist/cli.cjs"
}
```

The CLI uses the CommonJS version (`dist/cli.cjs`) for better compatibility across different Node.js environments. The CLI file starts with the shebang `#!/usr/bin/env node`, making it executable. The different access methods address various environment constraints:

- **npx**: Downloads and runs the latest version
- **pnpm script**: Works within the current workspace
- **Direct path**: Bypasses PATH issues
- **Global install**: Makes it available system-wide

---

**Note:** For public user documentation, see the `docs/` directory which contains the VitePress site with comprehensive CLI documentation for end users.
