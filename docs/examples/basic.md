# Basic Usage Examples

Learn the fundamentals of Spark-ID with simple, practical examples.

## Quick Examples

### Generate Simple IDs

```typescript
import { generateId, configure } from '@aexoo-ai/spark-id';

configure({ case: 'upper' })

// Generate a basic ID
const id = generateId();
console.log(id); // "YBNDRFG8EJKMCPQXOT1UWISZA345H769"
```

### Generate Prefixed IDs

```typescript
import { generateId } from '@aexoo-ai/spark-id';

// Generate with prefix
const userId = generateId('USER');
console.log(userId); // "USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769"

const txnId = generateId('TXN');
console.log(txnId); // "TXN_YBNDRFG8EJKMCPQXOT1UWISZA345H769"
```

### Configure ID Generation

```typescript
import { generateId, configure } from '@aexoo-ai/spark-id';

// Set global defaults
configure({ case: 'upper', separator: '_' })

// Generate with global config
const id1 = generateId('USER'); // "USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769"

// Override for specific call
const id2 = generateId('TXN', { case: 'lower', separator: '-' }); // "txn-YBNDRFG8EJKMCPQXOT1UWISZA345H769"
```

### Validate IDs

```typescript
import { isValidId } from '@aexoo-ai/spark-id';

// Valid IDs
console.log(isValidId('YBNDRFG8EJKMCPQXOT1UWISZA345H769')); // true
console.log(isValidId('USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769')); // true

// Invalid IDs
console.log(isValidId('invalid-id')); // false
console.log(isValidId('')); // false
```

### Parse IDs

```typescript
import { parseId } from '@aexoo-ai/spark-id';

// Parse simple ID
const parsed1 = parseId('YBNDRFG8EJKMCPQXOT1UWISZA345H769');
console.log(parsed1);
// {
//   id: 'YBNDRFG8EJKMCPQXOT1UWISZA345H769',
//   full: 'YBNDRFG8EJKMCPQXOT1UWISZA345H769'
// }

// Parse prefixed ID
const parsed2 = parseId('USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769');
console.log(parsed2);
// {
//   prefix: 'USER',
//   id: 'YBNDRFG8EJKMCPQXOT1UWISZA345H769',
//   full: 'USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769'
// }
```

## Working with SecureId Class

### Create Instances

```typescript
import { SecureId, createId } from '@aexoo-ai/spark-id';

// Using constructor
const secureId1 = new SecureId();
const secureId2 = new SecureId(undefined, 'USER');

// Using factory function
const secureId3 = createId();
const secureId4 = createId('TXN');
```

### Access Properties

```typescript
import { SecureId } from '@aexoo-ai/spark-id';

const secureId = new SecureId(undefined, 'USER');

console.log(secureId.id); // "YBNDRFG8EJKMCPQXOT1UWISZA345H769"
console.log(secureId.prefix); // "USER"
console.log(secureId.full); // "USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769"
```

### Compare IDs

```typescript
import { SecureId } from '@aexoo-ai/spark-id';

const id1 = new SecureId('abc123def456');
const id2 = new SecureId('abc123def456');
const id3 = new SecureId('xyz789uvw012');

console.log(id1.equals(id2)); // true
console.log(id1.equals(id3)); // false
console.log(id1.equals(id2.full)); // true
```

## Bulk Operations

### Generate Multiple IDs

```typescript
import { generateId } from '@aexoo-ai/spark-id';

// Generate array of IDs
const ids = Array.from({ length: 10 }, () => generateId());
console.log(ids);
// [
//   "YBNDRFG8EJKMCPQXOT1UWISZA345H769",
//   "abc123def456ghi789",
//   "xyz789uvw012mno345",
//   ...
// ]

// Generate multiple prefixed IDs
const userIds = Array.from({ length: 5 }, () => generateId('USER'));
console.log(userIds);
// [
//   "USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769",
//   "USER_abc123def456ghi789",
//   "USER_xyz789uvw012mno345",
//   ...
// ]
```

### Validate Multiple IDs

```typescript
import { isValidId } from '@aexoo-ai/spark-id';

const ids = [
  'USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769',
  'TXN_YBNDRFG8EJKMCPQXOT1UWISZA345H769',
  'invalid-id',
  'ORDER_YBNDRFG8EJKMCPQXOT1UWISZA345H769',
];

// Filter valid IDs
const validIds = ids.filter(isValidId);
console.log(validIds);
// [
//   "USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769",
//   "TXN_YBNDRFG8EJKMCPQXOT1UWISZA345H769",
//   "ORDER_YBNDRFG8EJKMCPQXOT1UWISZA345H769"
// ]

// Separate valid and invalid
const { valid, invalid } = ids.reduce(
  (acc, id) => {
    if (isValidId(id)) {
      acc.valid.push(id);
    } else {
      acc.invalid.push(id);
    }
    return acc;
  },
  { valid: [], invalid: [] }
);

console.log('Valid:', valid);
console.log('Invalid:', invalid);
```

## Error Handling

### Safe Parsing

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
// { prefix: 'USER', id: '...', full: '...' }

const result2 = safeParseId('invalid-id');
// null
```

### Validation with Messages

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
console.log(validateIdWithMessage('USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769'));
// { valid: true, message: 'ID is valid' }

console.log(validateIdWithMessage('invalid-id'));
// { valid: false, message: 'ID contains invalid characters' }
```

## Common Patterns

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

### API Responses

```typescript
import { generateId } from '@aexoo-ai/spark-id';

// Express.js route handler
app.post('/users', (req, res) => {
  const userId = generateId('USER');
  const user = { id: userId, ...req.body };
  res.status(201).json(user);
});

app.post('/transactions', (req, res) => {
  const txnId = generateId('TXN');
  const transaction = { id: txnId, ...req.body };
  res.status(201).json(transaction);
});
```

### Object Creation

```typescript
import { generateId } from '@aexoo-ai/spark-id';

// Create user object
const user = {
  id: generateId('USER'),
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date(),
};

// Create transaction object
const transaction = {
  id: generateId('TXN'),
  userId: user.id,
  amount: 100.5,
  status: 'completed',
  createdAt: new Date(),
};

// Create order object
const order = {
  id: generateId('ORDER'),
  userId: user.id,
  items: ['product1', 'product2'],
  total: 200.0,
  status: 'pending',
  createdAt: new Date(),
};
```

## Performance Examples

### Generation Speed Test

```typescript
import { generateId } from '@aexoo-ai/spark-id';

// Performance test
const start = Date.now();
const ids = Array.from({ length: 1000 }, () => generateId());
const end = Date.now();

console.log(`Generated ${ids.length} IDs in ${end - start}ms`);
// Typically: "Generated 1000 IDs in 15ms"
```

### Validation Speed Test

```typescript
import { isValidId } from '@aexoo-ai/spark-id';

const testIds = Array.from(
  { length: 10000 },
  () => 'USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769'
);

const start = Date.now();
const results = testIds.map(isValidId);
const end = Date.now();

console.log(`Validated ${testIds.length} IDs in ${end - start}ms`);
// Typically: "Validated 10000 IDs in 8ms"
```

## Related

- [TypeScript Examples](/examples/typescript) - Type-safe usage patterns
- [Database Integration](/examples/database) - Database operations
- [Web API Examples](/examples/web-api) - API integration
- [API Reference](/api/) - Complete API documentation
