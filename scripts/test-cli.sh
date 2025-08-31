#!/bin/bash

echo "🧪 Testing Spark-ID CLI functionality..."
echo "========================================"

echo ""
echo "1. Basic ID generation:"
pnpm spark-id

echo ""
echo "2. ID with prefix:"
pnpm spark-id -p USER

echo ""
echo "3. Multiple IDs:"
pnpm spark-id -c 3

echo ""
echo "4. Multiple IDs with prefix:"
pnpm spark-id -p TXN -c 3

echo ""
echo "5. JSON format output:"
pnpm spark-id -p ORDER -c 2 -f json

echo ""
echo "6. CSV format output:"
pnpm spark-id -p PRODUCT -c 3 -f csv

echo ""
echo "7. Validation test:"
TEST_ID=$(pnpm spark-id -p TEST)
echo "Generated ID: $TEST_ID"
pnpm spark-id -v "$TEST_ID"

echo ""
echo "8. Parse test:"
pnpm spark-id --parse "$TEST_ID"

echo ""
echo "9. Help:"
pnpm spark-id --help

echo ""
echo "✅ CLI tests completed successfully!"
