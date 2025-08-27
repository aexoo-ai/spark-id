# Spark-ID Examples

This directory contains various examples demonstrating how to use the `@aexoo-ai/spark-id` library in different scenarios.

## Examples Overview

### 1. Basic Usage (`basic-usage.js`)
Demonstrates the core functionality of the library:
- Generating simple IDs
- Creating IDs with prefixes
- Working with SecureId instances
- Validation and parsing
- ID comparison

**Run with:**
```bash
npm run build
node examples/basic-usage.js
```

### 2. TypeScript Usage (`typescript-usage.ts`)
Shows type-safe usage of the library with TypeScript:
- Type annotations for all functions
- Interface definitions
- Array operations with proper typing
- Type-safe validation and parsing

**Run with:**
```bash
npm run build
npx ts-node examples/typescript-usage.ts
```

### 3. CLI Usage (`cli-usage.sh`)
Demonstrates the command-line interface:
- Basic ID generation
- Prefix support
- Multiple ID generation
- Different output formats (JSON, CSV)
- Validation and parsing via CLI
- Help and examples

**Run with:**
```bash
chmod +x examples/cli-usage.sh
./examples/cli-usage.sh
```

### 4. Database Integration (`database-integration.js`)
Shows how to integrate spark-id with database operations:
- User, transaction, and order management
- Bulk ID generation
- Prefix-based searching
- Error handling
- Performance testing

**Run with:**
```bash
npm run build
node examples/database-integration.js
```

### 5. Web API Example (`web-api-example.js`)
Demonstrates using spark-id in a web API context:
- Express.js integration
- RESTful endpoints
- ID validation middleware
- Bulk operations
- Search functionality
- Health checks

**Run with:**
```bash
npm install express  # If not already installed
npm run build
node examples/web-api-example.js
```

Then test with:
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

## Key Features Demonstrated

### ID Generation
- Simple IDs: `ybndrfg8ejkmcpqxot1uwisza345h769`
- Prefixed IDs: `USER_ybndrfg8ejkmcpqxot1uwisza345h769`
- Bulk generation for performance

### Validation
- Format validation using `isValidId()`
- Error handling for invalid IDs
- Middleware integration

### Parsing
- Extracting prefix and ID components
- Type-safe parsing with TypeScript
- API response formatting

### Integration Patterns
- Database operations
- Web API endpoints
- CLI tools
- Bulk operations
- Search and filtering

## Security Features

All examples demonstrate the security features of spark-id:
- Cryptographically secure random generation
- URL-safe encoding
- Collision resistance
- Human-readable format

## Performance Considerations

The examples show:
- Fast ID generation (1000+ IDs per second)
- Memory-efficient bulk operations
- Optimized validation and parsing

## Getting Started

1. Build the project: `npm run build`
2. Choose an example based on your use case
3. Run the example: `node examples/[example-name].js`
4. Modify the code to fit your specific needs

## Contributing

Feel free to add more examples or improve existing ones. Each example should:
- Be self-contained and runnable
- Demonstrate clear use cases
- Include proper error handling
- Show best practices
