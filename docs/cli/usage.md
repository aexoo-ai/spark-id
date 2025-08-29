# CLI Usage

Learn how to use the Spark-ID command-line interface effectively.

## Basic Commands

### Generate a Single ID

```bash
spark-id
```

**Output:**

```
ybndrfg8ejkmcpqxot1uwisza345h769
```

### Generate with Prefix

```bash
spark-id -p USER
```

**Output:**

```
USER_ybndrfg8ejkmcpqxot1uwisza345h769
```

### Generate Multiple IDs

```bash
spark-id -c 5
```

**Output:**

```
ybndrfg8ejkmcpqxot1uwisza345h769
abc123def456ghi789
xyz789uvw012mno345
pqr123stu456vwx789
def456ghi789jkl012
```

### Validate an ID

```bash
spark-id -v USER_ybndrfg8ejkmcpqxot1uwisza345h769
```

**Output:**

```
true
```

### Parse an ID

```bash
spark-id --parse USER_ybndrfg8ejkmcpqxot1uwisza345h769
```

**Output:**

```json
{
  "prefix": "USER",
  "id": "ybndrfg8ejkmcpqxot1uwisza345h769",
  "full": "USER_ybndrfg8ejkmcpqxot1uwisza345h769"
}
```

## Command Combinations

### Generate Multiple Prefixed IDs

```bash
spark-id -p USER -c 3
```

**Output:**

```
USER_ybndrfg8ejkmcpqxot1uwisza345h769
USER_abc123def456ghi789
USER_xyz789uvw012mno345
```

### JSON Output with Prefix

```bash
spark-id -p USER -f json
```

**Output:**

```json
{
  "id": "USER_ybndrfg8ejkmcpqxot1uwisza345h769",
  "prefix": "USER"
}
```

### CSV Output

```bash
spark-id -c 5 -f csv
```

**Output:**

```
ybndrfg8ejkmcpqxot1uwisza345h769,abc123def456ghi789,xyz789uvw012mno345,pqr123stu456vwx789,def456ghi789jkl012
```

## Advanced Usage Patterns

### Scripting and Automation

#### Generate IDs for Shell Scripts

```bash
#!/bin/bash

# Generate user ID
USER_ID=$(spark-id -p USER)
echo "Created user with ID: $USER_ID"

# Generate transaction ID
TXN_ID=$(spark-id -p TXN)
echo "Created transaction with ID: $TXN_ID"

# Generate multiple order IDs
ORDER_IDS=$(spark-id -p ORDER -c 3 --compact)
echo "Created orders with IDs: $ORDER_IDS"
```

#### Loop Through Generated IDs

```bash
# Generate 10 user IDs and process each
spark-id -p USER -c 10 | while read id; do
    echo "Processing user: $id"
    # Your processing logic here
done
```

#### Conditional ID Generation

```bash
# Generate different types based on condition
if [ "$1" = "user" ]; then
    spark-id -p USER
elif [ "$1" = "transaction" ]; then
    spark-id -p TXN
else
    spark-id
fi
```

### Batch Operations

#### Generate IDs for Different Entity Types

```bash
# Generate IDs for a complete system
echo "Users:"
spark-id -p USER -c 5

echo "Transactions:"
spark-id -p TXN -c 10

echo "Orders:"
spark-id -p ORDER -c 3

echo "Products:"
spark-id -p PRODUCT -c 8
```

#### Validate Multiple IDs from File

```bash
# Create a file with IDs to validate
cat > ids.txt << EOF
USER_ybndrfg8ejkmcpqxot1uwisza345h769
TXN_abc123def456ghi789
invalid-id
ORDER_xyz789uvw012mno345
EOF

# Validate each ID
while read id; do
    if spark-id -v "$id"; then
        echo "✓ $id is valid"
    else
        echo "✗ $id is invalid"
    fi
done < ids.txt
```

### Integration with Other Tools

#### Use with jq for JSON Processing

```bash
# Extract prefix from parsed ID
spark-id --parse USER_ybndrfg8ejkmcpqxot1uwisza345h769 | jq -r '.prefix'
# Output: USER

# Extract ID without prefix
spark-id --parse USER_ybndrfg8ejkmcpqxot1uwisza345h769 | jq -r '.id'
# Output: ybndrfg8ejkmcpqxot1uwisza345h769
```

#### Use with sed for Text Processing

```bash
# Add prefix to each line
spark-id -c 5 | sed 's/^/ID: /'
# Output:
# ID: ybndrfg8ejkmcpqxot1uwisza345h769
# ID: abc123def456ghi789
# ID: xyz789uvw012mno345
# ID: pqr123stu456vwx789
# ID: def456ghi789jkl012

# Replace underscores with spaces
spark-id -p USER -c 3 | sed 's/_/ /g'
# Output:
# USER ybndrfg8ejkmcpqxot1uwisza345h769
# USER abc123def456ghi789
# USER xyz789uvw012mno345
```

#### Use with awk for Data Analysis

```bash
# Count characters in each ID
spark-id -c 10 | awk '{print length($0)}'
# Output: 15 (for each ID)

# Filter IDs by length
spark-id -c 20 | awk 'length($0) == 15 {print $0}'
# Output: All IDs that are exactly 15 characters
```

## Output Formats

### Default Format

```bash
spark-id
# ybndrfg8ejkmcpqxot1uwisza345h769
```

### JSON Format

```bash
# Simple ID
spark-id --json
# {"id": "ybndrfg8ejkmcpqxot1uwisza345h769"}

# With prefix
spark-id -p USER --json
# {"id": "USER_ybndrfg8ejkmcpqxot1uwisza345h769", "prefix": "USER"}

# Multiple IDs
spark-id -c 3 --json
# [
#   {"id": "ybndrfg8ejkmcpqxot1uwisza345h769"},
#   {"id": "abc123def456ghi789"},
#   {"id": "xyz789uvw012mno345"}
# ]
```

### CSV Output

```bash
# Single ID
spark-id -f csv
# ybndrfg8ejkmcpqxot1uwisza345h769

# Multiple IDs
spark-id -c 5 -f csv
# ybndrfg8ejkmcpqxot1uwisza345h769,abc123def456ghi789,xyz789uvw012mno345,pqr123stu456vwx789,def456ghi789jkl012
```

## Error Handling

### Invalid Arguments

```bash
# Invalid count
spark-id -c -5
# Error: Count must be a positive integer

# Invalid prefix
spark-id -p "INVALID PREFIX"
# Error: Prefix contains invalid characters

# Unknown option
spark-id --unknown-flag
# Error: Unknown option: --unknown-flag
```

### Invalid IDs for Validation

```bash
# Validate invalid ID
spark-id -v invalid-id
# false

# Parse invalid ID
spark-id --parse invalid-id
# Error: Invalid ID format: invalid-id
```

### Exit Codes

```bash
# Success
spark-id
echo $?
# 0

# Invalid arguments
spark-id --invalid-flag
echo $?
# 2

# Validation failed
spark-id -v invalid-id
echo $?
# 0 (false is valid output)

# Parse error
spark-id --parse invalid-id
echo $?
# 3
```

## Performance Tips

### Efficient Generation

```bash
# Generate large batches efficiently
spark-id -c 1000 > ids.txt

# Use compact format for large outputs
spark-id -c 10000 --compact > ids.csv
```

### Memory Usage

```bash
# Monitor memory usage for large operations
/usr/bin/time -v spark-id -c 100000 > /dev/null
```

### Speed Testing

```bash
# Test generation speed
time spark-id -c 1000 > /dev/null
```

## Real-World Examples

### Development Workflow

```bash
#!/bin/bash

# Generate test data for development
echo "=== Test Data Generation ==="

echo "Users:"
spark-id -p USER -c 5

echo "Transactions:"
spark-id -p TXN -c 10

echo "Orders:"
spark-id -p ORDER -c 3

echo "Products:"
spark-id -p PRODUCT -c 8
```

### Database Seeding

```bash
#!/bin/bash

# Generate SQL insert statements
echo "INSERT INTO users (id, name, email) VALUES"
spark-id -p USER -c 5 | while read id; do
    echo "  ('$id', 'User $id', 'user@example.com'),"
done
echo ";"
```

### API Testing

```bash
#!/bin/bash

# Generate test IDs for API calls
USER_ID=$(spark-id -p USER)
TXN_ID=$(spark-id -p TXN)

echo "Testing API with IDs:"
echo "User ID: $USER_ID"
echo "Transaction ID: $TXN_ID"

# Make API calls
curl -X GET "http://api.example.com/users/$USER_ID"
curl -X POST "http://api.example.com/transactions" \
  -H "Content-Type: application/json" \
  -d "{\"id\": \"$TXN_ID\", \"amount\": 100.50}"
```

### Log Analysis

```bash
#!/bin/bash

# Generate IDs and analyze patterns
echo "=== ID Pattern Analysis ==="

# Generate IDs and count by prefix
spark-id -p USER -c 50 > user_ids.txt
spark-id -p TXN -c 50 > txn_ids.txt

echo "User IDs generated: $(wc -l < user_ids.txt)"
echo "Transaction IDs generated: $(wc -l < txn_ids.txt)"

# Check for duplicates (should be none)
echo "Duplicate user IDs: $(sort user_ids.txt | uniq -d | wc -l)"
echo "Duplicate transaction IDs: $(sort txn_ids.txt | uniq -d | wc -l)"
```

## Related

- [CLI Overview](/cli/) - Command-line interface overview
- [Installation](/cli/installation) - Installation guide
- [Options](/cli/options) - All available options
- [API Reference](/api/) - Programmatic API documentation
