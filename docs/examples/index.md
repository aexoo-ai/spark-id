# Examples

Real-world usage examples and patterns for Spark-ID.

## Overview

This section contains practical examples showing how to use Spark-ID in various scenarios. Each example is designed to be runnable and demonstrates best practices.

## Available Examples

### [Basic Usage](/examples/basic)

Learn the fundamentals with simple, practical examples:

- Generating IDs with and without prefixes
- Validation and parsing
- Working with SecureId instances
- ID comparison and manipulation

### [TypeScript](/examples/typescript)

Type-safe usage patterns with full TypeScript support:

- Type annotations and interfaces
- Generic functions and type guards
- Advanced TypeScript patterns
- Array operations with proper typing

### [Database Integration](/examples/database)

Real-world database patterns and operations:

- User, transaction, and order management
- Bulk ID generation
- Prefix-based searching and filtering
- Error handling and validation
- Performance testing

### [Web API](/examples/web-api)

Express.js integration for web applications:

- RESTful API endpoints
- ID validation middleware
- Bulk operations
- Search functionality
- Health checks and monitoring

## Quick Examples

### Basic ID Generation

```typescript
import { generateId, configure } from '@aexoo-ai/spark-id';

configure({ case: 'upper', separator: '_' })

// Simple ID
const id = generateId(); // "YBNDRFG8EJKMCPQXOT1UWISZA345H769"

// With prefix
const userId = generateId('USER'); // "USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769"
```

### Database Operations

```typescript
import { generateId, isValidId } from '@aexoo-ai/spark-id';

class UserService {
  async createUser(userData: any) {
    const userId = generateId('USER');
    const user = { id: userId, ...userData };
    return await this.db.users.insert(user);
  }

  async findUser(id: string) {
    if (!isValidId(id)) {
      throw new Error('Invalid user ID');
    }
    return await this.db.users.findOne({ id });
  }
}
```

### API Integration

```typescript
import { generateId, parseId } from '@aexoo-ai/spark-id';

// Express.js middleware
function validateId(req: any, res: any, next: any) {
  const id = req.params.id;
  if (!isValidId(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  next();
}

// Route handler
app.post('/users', (req, res) => {
  const userId = generateId('USER');
  const user = { id: userId, ...req.body };
  res.status(201).json(user);
});
```

## Running Examples

### Prerequisites

Make sure you have the project built:

```bash
npm run build
```

### Running Individual Examples

```bash
# Basic usage
node examples/basic-usage.js

# TypeScript (requires ts-node)
npx ts-node examples/typescript-usage.ts

# Database integration
node examples/database-integration.js

# Web API (requires Express.js)
npm install express
node examples/web-api-example.js
```

### CLI Examples

```bash
# Generate a single ID
spark-id

# Generate with prefix
spark-id -p USER

# Generate multiple IDs
spark-id -c 5

# Validate an ID
spark-id -v USER_ybndrfg8ejkmcpqxot1uwisza345h769

# Parse an ID
spark-id --parse USER_ybndrfg8ejkmcpqxot1uwisza345h769
```

## Common Patterns

### Bulk Operations

```typescript
// Generate multiple IDs efficiently
const userIds = Array.from({ length: 100 }, () => generateId('USER'));
const txnIds = Array.from({ length: 50 }, () => generateId('TXN'));
```

### Validation Patterns

```typescript
// Validate user input
function processUserRequest(userId: string) {
  if (!isValidId(userId)) {
    throw new Error('Invalid user ID format');
  }

  const parsed = parseId(userId);
  if (parsed.prefix !== 'USER') {
    throw new Error('Not a user ID');
  }

  // Process the request
}
```

### Error Handling

```typescript
// Safe parsing with error handling
function safeParseId(id: string) {
  try {
    return parseId(id);
  } catch (error) {
    console.error('Failed to parse ID:', error.message);
    return null;
  }
}
```

## Performance Tips

### Efficient Generation

```typescript
// Pre-generate IDs for high-volume operations
const idPool = Array.from({ length: 1000 }, () => generateId('TXN'));

// Use from pool
const txnId = idPool.pop();
```

### Validation Optimization

```typescript
// Cache validation results for repeated checks
const validationCache = new Map();

function cachedIsValidId(id: string): boolean {
  if (validationCache.has(id)) {
    return validationCache.get(id);
  }

  const isValid = isValidId(id);
  validationCache.set(id, isValid);
  return isValid;
}
```

## Best Practices

### Prefix Naming

```typescript
// ✅ Good: Clear, consistent prefixes
const userId = generateId('USER');
const txnId = generateId('TXN');
const orderId = generateId('ORDER');

// ❌ Avoid: Inconsistent or unclear prefixes
const id1 = generateId('ID');
const obj1 = generateId('OBJ');
const usr1 = generateId('USR');
```

### Error Handling

```typescript
// ✅ Good: Validate early and handle errors
function processId(id: string) {
  if (!isValidId(id)) {
    throw new Error('Invalid ID format');
  }

  const parsed = parseId(id);
  // Process with confidence
}

// ❌ Avoid: Ignoring validation
function processId(id: string) {
  const parsed = parseId(id); // May throw
  // Process without validation
}
```

### Type Safety

```typescript
// ✅ Good: Use TypeScript for type safety
interface User {
  id: string;
  name: string;
  email: string;
}

const user: User = {
  id: generateId('USER'),
  name: 'John Doe',
  email: 'john@example.com',
};

// ❌ Avoid: No type checking
const user = {
  id: generateId('USER'),
  name: 'John Doe',
  email: 'john@example.com',
};
```

## Related

- [Getting Started](/guide/getting-started) - Basic usage guide
- [API Reference](/api/) - Complete API documentation
- [CLI Usage](/cli/) - Command-line interface
- [Security](/guide/security) - Security considerations
