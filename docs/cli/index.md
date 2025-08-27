# Command Line Interface

Spark-ID provides a powerful command-line interface for generating and validating IDs directly from your terminal.

## Overview

The `spark-id` CLI tool allows you to:

- ✅ Generate single or multiple IDs
- ✅ Add prefixes to generated IDs
- ✅ Validate existing IDs
- ✅ Parse and display ID components
- ✅ Use in scripts and automation
- ✅ Pipe output to other commands

## Quick Start

```bash
# Generate a single ID
spark-id

# Generate with prefix
spark-id -p USER

# Generate multiple IDs
spark-id -c 5

# Validate an ID
spark-id -v USER_ybndrfg8ejkmcpqxot1uwisza345h769
```

## Installation

### Global Installation

```bash
npm install -g @aexoo-ai/spark-id
```

### Using npx (No Installation Required)

```bash
npx @aexoo-ai/spark-id
```

### Local Installation

```bash
npm install @aexoo-ai/spark-id
npx spark-id
```

## Basic Usage

### Generate IDs

```bash
# Simple ID generation
spark-id
# Output: ybndrfg8ejkmcpqxot1uwisza345h769

# With prefix
spark-id -p USER
# Output: USER_ybndrfg8ejkmcpqxot1uwisza345h769

# Multiple IDs
spark-id -c 3
# Output:
# ybndrfg8ejkmcpqxot1uwisza345h769
# abc123def456ghi789
# xyz789uvw012mno345
```

### Validation

```bash
# Validate a single ID
spark-id -v USER_ybndrfg8ejkmcpqxot1uwisza345h769
# Output: true

# Validate invalid ID
spark-id -v invalid-id
# Output: false
```

### Parsing

```bash
# Parse an ID to see its components
spark-id --parse USER_ybndrfg8ejkmcpqxot1uwisza345h769
# Output:
# {
#   "prefix": "USER",
#   "id": "ybndrfg8ejkmcpqxot1uwisza345h769",
#   "full": "USER_ybndrfg8ejkmcpqxot1uwisza345h769"
# }
```

## Advanced Usage

### Scripting and Automation

```bash
# Generate IDs for a script
for i in {1..10}; do
  echo "ID $i: $(spark-id -p USER)"
done

# Use in shell scripts
USER_ID=$(spark-id -p USER)
echo "Created user with ID: $USER_ID"

# Pipe to other commands
spark-id -c 100 | grep "USER_" | head -10
```

### Batch Operations

```bash
# Generate IDs for different entity types
spark-id -p USER -c 5
spark-id -p TXN -c 10
spark-id -p ORDER -c 3

# Validate multiple IDs from a file
cat ids.txt | xargs -I {} spark-id -v {}
```

### Integration with Other Tools

```bash
# Use with jq for JSON processing
spark-id --parse USER_ybndrfg8ejkmcpqxot1uwisza345h769 | jq '.prefix'

# Use with sed for text processing
spark-id -c 5 | sed 's/^/ID: /'

# Use with awk for data analysis
spark-id -p USER -c 100 | awk '{print length($0)}'
```

## Output Formats

### Default Output

```bash
spark-id
# ybndrfg8ejkmcpqxot1uwisza345h769
```

### JSON Output

```bash
spark-id --json
# {"id": "ybndrfg8ejkmcpqxot1uwisza345h769"}

spark-id -p USER --json
# {"id": "USER_ybndrfg8ejkmcpqxot1uwisza345h769", "prefix": "USER"}
```

### Compact Output

```bash
spark-id -c 5 --compact
# ybndrfg8ejkmcpqxot1uwisza345h769,abc123def456ghi789,xyz789uvw012mno345,pqr123stu456vwx789,def456ghi789jkl012
```

## Error Handling

### Invalid Arguments

```bash
spark-id --invalid-flag
# Error: Unknown option: --invalid-flag
# Usage: spark-id [options]

spark-id -c -5
# Error: Count must be a positive integer
```

### Invalid IDs

```bash
spark-id -v invalid-id
# false

spark-id --parse invalid-id
# Error: Invalid ID format: invalid-id
```

### Exit Codes

- `0`: Success
- `1`: General error
- `2`: Invalid arguments
- `3`: Validation failed

## Performance

### Generation Speed

```bash
# Test generation speed
time spark-id -c 1000 > /dev/null
# real    0m0.123s
# user    0m0.098s
# sys     0m0.025s
```

### Memory Usage

The CLI is optimized for minimal memory usage:

```bash
# Monitor memory usage
/usr/bin/time -v spark-id -c 10000 > /dev/null
# Maximum resident set size (kbytes): 2048
```

## Examples

### Development Workflow

```bash
# Generate test data
echo "Test Users:" > test-data.txt
spark-id -p USER -c 10 >> test-data.txt
echo "Test Transactions:" >> test-data.txt
spark-id -p TXN -c 20 >> test-data.txt
```

### Database Seeding

```bash
# Generate SQL insert statements
spark-id -p USER -c 5 | awk '{print "INSERT INTO users (id) VALUES ('\''" $0 "'\'');"}'
```

### API Testing

```bash
# Generate test IDs for API calls
curl -X GET "http://api.example.com/users/$(spark-id -p USER)"
```

## Related

- [Installation](/cli/installation) - Detailed installation guide
- [Usage](/cli/usage) - Complete usage documentation
- [Options](/cli/options) - All available command-line options
- [API Reference](/api/) - Programmatic API documentation
