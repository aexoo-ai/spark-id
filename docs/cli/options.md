# CLI Options

Complete reference for all command-line options available in the Spark-ID CLI.

## Command Syntax

```bash
spark-id [options] [id]
```

## Options Reference

### `-p, --prefix <prefix>`

Add a prefix to generated IDs.

**Type:** `string`  
**Default:** `undefined`

**Examples:**

```bash
spark-id -p USER
# Output: USER_ybndrfg8ejkmcpqxot1uwisza345h769

spark-id --prefix TXN
# Output: TXN_ybndrfg8ejkmcpqxot1uwisza345h769
```

**Validation:**

- Must contain only alphanumeric characters and underscores
- Cannot be empty
- Cannot contain spaces or special characters

### `-c, --count <number>`

Generate multiple IDs.

**Type:** `number`  
**Default:** `1`  
**Range:** `1` to `10000`

**Examples:**

```bash
spark-id -c 5
# Output: 5 IDs, one per line

spark-id --count 10
# Output: 10 IDs, one per line
```

**Error Cases:**

```bash
spark-id -c 0
# Error: Count must be a positive integer

spark-id -c 10001
# Error: Count must be between 1 and 10000
```

### `-v, --validate <id>`

Validate an existing ID.

**Type:** `string`  
**Returns:** `true` or `false`

**Examples:**

```bash
spark-id -v USER_ybndrfg8ejkmcpqxot1uwisza345h769
# Output: true

spark-id --validate invalid-id
# Output: false
```

### `--parse <id>`

Parse an ID and display its components.

**Type:** `string`  
**Returns:** JSON object

**Examples:**

```bash
spark-id --parse USER_ybndrfg8ejkmcpqxot1uwisza345h769
# Output:
# {
#   "prefix": "USER",
#   "id": "ybndrfg8ejkmcpqxot1uwisza345h769",
#   "full": "USER_ybndrfg8ejkmcpqxot1uwisza345h769"
# }

spark-id --parse ybndrfg8ejkmcpqxot1uwisza345h769
# Output:
# {
#   "id": "ybndrfg8ejkmcpqxot1uwisza345h769",
#   "full": "ybndrfg8ejkmcpqxot1uwisza345h769"
# }
```

**Error Cases:**

```bash
spark-id --parse invalid-id
# Error: Invalid ID format: invalid-id
```

### `--json`

Output in JSON format.

**Type:** `boolean`  
**Default:** `false`

**Examples:**

```bash
spark-id --json
# Output: {"id": "ybndrfg8ejkmcpqxot1uwisza345h769"}

spark-id -p USER --json
# Output: {"id": "USER_ybndrfg8ejkmcpqxot1uwisza345h769", "prefix": "USER"}

spark-id -c 3 --json
# Output: [
#   {"id": "ybndrfg8ejkmcpqxot1uwisza345h769"},
#   {"id": "abc123def456ghi789"},
#   {"id": "xyz789uvw012mno345"}
# ]
```

### `--compact`

Output multiple IDs in compact format (comma-separated).

**Type:** `boolean`  
**Default:** `false`

**Examples:**

```bash
spark-id -c 5 --compact
# Output: ybndrfg8ejkmcpqxot1uwisza345h769,abc123def456ghi789,xyz789uvw012mno345,pqr123stu456vwx789,def456ghi789jkl012

spark-id -p USER -c 3 --compact
# Output: USER_ybndrfg8ejkmcpqxot1uwisza345h769,USER_abc123def456ghi789,USER_xyz789uvw012mno345
```

### `--version`

Display version information.

**Type:** `boolean`

**Example:**

```bash
spark-id --version
# Output: 1.0.0
```

### `-h, --help`

Display help information.

**Type:** `boolean`

**Example:**

```bash
spark-id --help
# Output: Complete help text with all options
```

## Option Combinations

### Valid Combinations

```bash
# Generate multiple prefixed IDs
spark-id -p USER -c 5

# Generate multiple IDs with JSON output
spark-id -c 3 --json

# Generate multiple prefixed IDs with compact output
spark-id -p TXN -c 10 --compact

# Generate multiple IDs with JSON and compact output
spark-id -c 5 --json --compact
```

### Invalid Combinations

```bash
# Cannot validate and generate at the same time
spark-id -v USER_123 -c 5
# Error: Cannot use --validate with --count

# Cannot parse and generate at the same time
spark-id --parse USER_123 -p USER
# Error: Cannot use --parse with --prefix

# Cannot validate and parse at the same time
spark-id -v USER_123 --parse USER_123
# Error: Cannot use --validate with --parse
```

## Positional Arguments

### ID Argument

When using `--validate` or `--parse`, you can provide the ID as a positional argument:

```bash
# These are equivalent
spark-id -v USER_ybndrfg8ejkmcpqxot1uwisza345h769
spark-id -v USER_ybndrfg8ejkmcpqxot1uwisza345h769

# These are equivalent
spark-id --parse USER_ybndrfg8ejkmcpqxot1uwisza345h769
spark-id --parse USER_ybndrfg8ejkmcpqxot1uwisza345h769
```

## Environment Variables

### `SPARK_ID_PREFIX`

Set a default prefix for all generated IDs.

**Example:**

```bash
export SPARK_ID_PREFIX=USER
spark-id
# Output: USER_ybndrfg8ejkmcpqxot1uwisza345h769

spark-id -p TXN
# Output: TXN_ybndrfg8ejkmcpqxot1uwisza345h769 (overrides environment)
```

### `SPARK_ID_COUNT`

Set a default count for ID generation.

**Example:**

```bash
export SPARK_ID_COUNT=5
spark-id
# Output: 5 IDs

spark-id -c 3
# Output: 3 IDs (overrides environment)
```

## Exit Codes

| Code | Description              |
| ---- | ------------------------ |
| `0`  | Success                  |
| `1`  | General error            |
| `2`  | Invalid arguments        |
| `3`  | Validation/parsing error |

**Examples:**

```bash
# Success
spark-id
echo $?  # 0

# Invalid arguments
spark-id --invalid-flag
echo $?  # 2

# Parse error
spark-id --parse invalid-id
echo $?  # 3
```

## Performance Considerations

### Large Count Values

```bash
# Efficient for large counts
spark-id -c 1000
# Memory usage: ~15KB

# Very large counts
spark-id -c 10000
# Memory usage: ~150KB

# Maximum recommended
spark-id -c 10000
# Beyond this, consider using the programmatic API
```

### Output Format Performance

```bash
# Fastest: Default output
time spark-id -c 1000 > /dev/null
# ~0.1s

# Slower: JSON output
time spark-id -c 1000 --json > /dev/null
# ~0.15s

# Slowest: Compact output
time spark-id -c 1000 --compact > /dev/null
# ~0.2s
```

## Examples by Use Case

### Development

```bash
# Generate test data
spark-id -p USER -c 10 > test-users.txt
spark-id -p TXN -c 20 > test-transactions.txt

# Quick validation
spark-id -v USER_ybndrfg8ejkmcpqxot1uwisza345h769
```

### Scripting

```bash
# Generate IDs for shell scripts
USER_ID=$(spark-id -p USER)
TXN_ID=$(spark-id -p TXN)

# Batch processing
spark-id -p ORDER -c 100 | while read id; do
    echo "Processing order: $id"
done
```

### API Testing

```bash
# Generate test IDs
spark-id -p USER -c 5 --json > test-users.json

# Use in API calls
curl -X GET "http://api.example.com/users/$(spark-id -p USER)"
```

### Database Operations

```bash
# Generate SQL insert statements
spark-id -p USER -c 5 | awk '{print "INSERT INTO users (id) VALUES ('\''" $0 "'\'');"}'

# Generate bulk insert data
spark-id -p PRODUCT -c 1000 --compact > products.csv
```

## Related

- [CLI Overview](/cli/) - Command-line interface overview
- [Installation](/cli/installation) - Installation guide
- [Usage](/cli/usage) - Usage examples
- [API Reference](/api/) - Programmatic API documentation
