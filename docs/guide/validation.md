# Validation

Learn how to validate Spark-ID format and handle validation errors effectively.

## Basic Validation

### Using `isValidId()`

The simplest way to validate an ID:

```typescript
import { isValidId } from '@aexoo-ai/spark-id';

// Valid IDs
console.log(isValidId('YBNDRFG8EJKMCPQXOT1UWISZA345H769')); // true
console.log(isValidId('USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769')); // true

// Invalid IDs
console.log(isValidId('invalid-id')); // false
console.log(isValidId('')); // false
console.log(isValidId('abc123def456ghi789jkl012mno345pqr678stu901vwx234yz0')); // false (contains 0)
```

### Using SecureId Class

```typescript
import { SecureId } from '@aexoo-ai/spark-id';

// Static validation methods
console.log(SecureId.isValid('YBNDRFG8EJKMCPQXOT1UWISZA345H769')); // true
console.log(SecureId.isValidRawId('YBNDRFG8EJKMCPQXOT1UWISZA345H769')); // true
```

## Detailed validation

Use `validateId()` for structured results with error codes:

```typescript
import { validateId } from '@aexoo-ai/spark-id'

const result = validateId('invalid-id')
// { isValid: false, error: 'Invalid ID format', code: 'INVALID_FORMAT' }
```

## What Gets Validated

### Valid Characters

Spark-ID only accepts characters from the Z-Base32 alphabet:

```
yvndrfg9ejkmcpqxwt2uwxsza345h769
```

### Invalid Characters

The following characters are **not allowed**:

- `0` (zero) - confused with `O`
- `O` (capital O) - confused with `0`
- `1` (one) - confused with `I`
- `I` (capital I) - confused with `1`
- `8` (eight) - confused with `B`
- `B` (capital B) - confused with `8`
- Any other characters (spaces, hyphens, special characters)

### Format Rules

```typescript
// ✅ Valid formats
'YBNDRFG8EJKMCPQXOT1UWISZA345H769'; // Simple ID
'USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769'; // Prefixed ID
'ABC123_YBNDRFG8EJKMCPQXOT1UWISZA345H769'; // Multi-character prefix

// ❌ Invalid formats
'abc123def456ghi789jkl012mno345pqr678stu901vwx234yz0'; // Contains 0
'abc123def456ghi789jkl012mno345pqr678stu901vwx234yzo'; // Contains o
'abc123def456ghi789jkl012mno345pqr678stu901vwx234yzi'; // Contains i
'abc123def456ghi789jkl012mno345pqr678stu901vwx234yzb'; // Contains b
'abc123def456ghi789jkl012mno345pqr678stu901vwx234yz8'; // Contains 8
'abc-123-def-456'; // Contains hyphens
'abc 123 def 456'; // Contains spaces
'abc_123_def_456'; // Multiple underscores
```

## Validation Examples

### User Input Validation

```typescript
import { isValidId } from '@aexoo-ai/spark-id';

function validateUserInput(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false;
  }

  return isValidId(input.trim());
}

// Usage
console.log(validateUserInput('USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769')); // true
console.log(validateUserInput('invalid-id')); // false
console.log(validateUserInput('')); // false
console.log(validateUserInput(null)); // false
```

### API Validation

```typescript
import { isValidId } from '@aexoo-ai/spark-id';

// Express.js middleware
function validateIdParam(req: any, res: any, next: any) {
  const id = req.params.id;

  if (!isValidId(id)) {
    return res.status(400).json({
      error: 'Invalid ID format',
      message: 'ID must be a valid Spark-ID format',
      received: id,
    });
  }

  next();
}

// Usage in routes
app.get('/users/:id', validateIdParam, (req, res) => {
  // ID is guaranteed to be valid here
  const userId = req.params.id;
  // ... handle request
});
```

### Database Validation

```typescript
import { isValidId } from '@aexoo-ai/spark-id';

class DatabaseService {
  async findById(id: string) {
    if (!isValidId(id)) {
      throw new Error(`Invalid ID format: ${id}`);
    }

    // Proceed with database query
    return await this.db.find({ id });
  }

  async create(data: any) {
    const id = data.id;

    if (id && !isValidId(id)) {
      throw new Error(`Invalid ID format: ${id}`);
    }

    // Proceed with creation
    return await this.db.create(data);
  }
}
```

## Error Handling

### Try-Catch with Parsing

```typescript
import { parseId, isValidId } from '@aexoo-ai/spark-id';

function safeParseId(id: string) {
  try {
    if (!isValidId(id)) {
      throw new Error('Invalid ID format');
    }

    return parseId(id);
  } catch (error) {
    console.error('Failed to parse ID:', error.message);
    return null;
  }
}

// Usage
const result1 = safeParseId('USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769');
// { prefix: 'USER', id: 'YBNDRFG8EJKMCPQXOT1UWISZA345H769', full: 'USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769' }

const result2 = safeParseId('invalid-id');
// null
```

### Validation with Custom Messages

```typescript
import { isValidId } from '@aexoo-ai/spark-id';

function validateIdWithMessage(id: string): {
  valid: boolean;
  message: string;
} {
  if (!id || typeof id !== 'string') {
    return { valid: false, message: 'ID must be a non-empty string' };
  }

  if (id.length < 12) {
    return { valid: false, message: 'ID is too short' };
  }

  if (id.length > 50) {
    return { valid: false, message: 'ID is too long' };
  }

  if (!isValidId(id)) {
    return { valid: false, message: 'ID contains invalid characters' };
  }

  return { valid: true, message: 'ID is valid' };
}

// Usage
const result1 = validateIdWithMessage('USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769');
// { valid: true, message: 'ID is valid' }

const result2 = validateIdWithMessage('invalid-id');
// { valid: false, message: 'ID contains invalid characters' }
```

## Bulk Validation

### Validate Multiple IDs

```typescript
import { isValidId } from '@aexoo-ai/spark-id';

function validateIds(ids: string[]): { valid: string[]; invalid: string[] } {
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const id of ids) {
    if (isValidId(id)) {
      valid.push(id);
    } else {
      invalid.push(id);
    }
  }

  return { valid, invalid };
}

// Usage
const ids = [
  'USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769',
  'TXN_YBNDRFG8EJKMCPQXOT1UWISZA345H769',
  'invalid-id',
  'ORDER_YBNDRFG8EJKMCPQXOT1UWISZA345H769',
];

const result = validateIds(ids);
console.log(result.valid); // ['USER_...', 'TXN_...', 'ORDER_...']
console.log(result.invalid); // ['invalid-id']
```

### Filter Valid IDs

```typescript
import { isValidId } from '@aexoo-ai/spark-id';

const ids = [
  'USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769',
  'invalid-id',
  'TXN_YBNDRFG8EJKMCPQXOT1UWISZA345H769',
];

const validIds = ids.filter(isValidId);
console.log(validIds); // ['USER_...', 'TXN_...']
```

## Performance Considerations

### Validation Speed

Spark-ID validation is optimized for performance:

```typescript
import { isValidId } from '@aexoo-ai/spark-id';

// Performance test
const testIds = Array.from(
  { length: 10000 },
  () => 'USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769'
);

const start = Date.now();
const results = testIds.map(isValidId);
const end = Date.now();

console.log(`Validated ${testIds.length} IDs in ${end - start}ms`);
// Typically validates 10,000+ IDs per second
```

### Early Validation

Validate IDs as early as possible in your application flow:

```typescript
// ✅ Good: Validate early
function processUser(userId: string) {
  if (!isValidId(userId)) {
    throw new Error('Invalid user ID');
  }

  // Process user with confidence
}

// ❌ Avoid: Validate late
function processUser(userId: string) {
  // Do lots of work...

  // Then validate (wasted work if invalid)
  if (!isValidId(userId)) {
    throw new Error('Invalid user ID');
  }
}
```

## Related

- [ID Generation](/guide/id-generation) - Generate valid IDs
- [Prefixes](/guide/prefixes) - Validate prefixed IDs
- [Security](/guide/security) - Security considerations
- [API Reference](/api/) - Complete API documentation
