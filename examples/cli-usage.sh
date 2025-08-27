#!/bin/bash

echo "=== CLI Usage Examples ==="
echo

# Build the project first
echo "Building project..."
npm run build
echo

# Basic usage
echo "1. Generate a single ID:"
node dist/cli.js
echo

# Generate with prefix
echo "2. Generate ID with USER prefix:"
node dist/cli.js -p USER
echo

# Generate multiple IDs
echo "3. Generate 5 IDs:"
node dist/cli.js -c 5
echo

# Generate multiple IDs with prefix
echo "4. Generate 3 transaction IDs:"
node dist/cli.js -p TXN -c 3
echo

# JSON output format
echo "5. Generate 2 IDs in JSON format:"
node dist/cli.js -c 2 -f json
echo

# CSV output format
echo "6. Generate 3 IDs in CSV format:"
node dist/cli.js -c 3 -f csv
echo

# Validation examples
echo "7. Validate some IDs:"
VALID_ID=$(node dist/cli.js)
echo "Validating: $VALID_ID"
node dist/cli.js -v "$VALID_ID"
echo "Validating invalid ID:"
node dist/cli.js -v "invalid-id"
echo

# Parsing examples
echo "8. Parse an ID:"
PREFIXED_ID=$(node dist/cli.js -p USER)
echo "Parsing: $PREFIXED_ID"
node dist/cli.js --parse "$PREFIXED_ID"
echo

# Show help
echo "9. Show help:"
node dist/cli.js -h
echo

# Show examples
echo "10. Show examples:"
node dist/cli.js -e
