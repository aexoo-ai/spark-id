# TypeScript Examples

Type-safe usage patterns with full TypeScript support.

## Type Annotations

### Basic Types

```typescript
import { generateId, isValidId, parseId, ParsedId, SparkIdConfig } from '@aexoo-ai/spark-id';

// Explicit type annotations
const id: string = generateId();
const userId: string = generateId('USER');
const isValid: boolean = isValidId(userId);
const parsed: ParsedId = parseId(userId);
```

### Interface Definitions

```typescript
import { generateId } from '@aexoo-ai/spark-id';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

// Create typed objects
const user: User = {
  id: generateId('USER'),
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date(),
};

const transaction: Transaction = {
  id: generateId('TXN'),
  userId: user.id,
  amount: 100.5,
  status: 'completed',
  createdAt: new Date(),
};
```

## Generic Functions

### Type-Safe ID Processing

```typescript
import { generateId, isValidId, parseId } from '@aexoo-ai/spark-id';

// Generic function for processing IDs
function processIds<T extends string>(ids: T[]): T[] {
  return ids.filter(isValidId);
}

// Usage with type inference
const userIds: string[] = ['USER_123', 'USER_456', 'invalid'];
const validUserIds: string[] = processIds(userIds);

// Generic function for ID validation
function validateIdType<T extends string>(
  id: T,
  expectedPrefix?: string
): id is T {
  if (!isValidId(id)) return false;
  if (expectedPrefix) {
    const parsed = parseId(id);
    return parsed.prefix === expectedPrefix;
  }
  return true;
}

// Usage
const testId = 'USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769';
if (validateIdType(testId, 'USER')) {
  // TypeScript knows this is a valid user ID
  console.log('Valid user ID:', testId);
}
```

### Generic Entity Types

```typescript
import { generateId } from '@aexoo-ai/spark-id';

// Generic entity type
type EntityId<T extends string> = `${T}_${string}`;

// Specific entity types
type UserId = EntityId<'USER'>;
type TransactionId = EntityId<'TXN'>;
type OrderId = EntityId<'ORDER'>;

// Generic entity interface
interface Entity<T extends string> {
  id: EntityId<T>;
  createdAt: Date;
  updatedAt: Date;
}

// Specific entity interfaces
interface User extends Entity<'USER'> {
  name: string;
  email: string;
}

interface Transaction extends Entity<'TXN'> {
  userId: UserId;
  amount: number;
  status: string;
}

// Type-safe creation functions
function createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
  return {
    id: generateId('USER') as UserId,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function createTransaction(
  data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
): Transaction {
  return {
    id: generateId('TXN') as TransactionId,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
```

## Type Guards

### Custom Type Guards

```typescript
import { isValidId, parseId } from '@aexoo-ai/spark-id';

// Type guard for user IDs
function isUserId(id: string): id is UserId {
  if (!isValidId(id)) return false;
  const parsed = parseId(id);
  return parsed.prefix === 'USER';
}

// Type guard for transaction IDs
function isTransactionId(id: string): id is TransactionId {
  if (!isValidId(id)) return false;
  const parsed = parseId(id);
  return parsed.prefix === 'TXN';
}

// Type guard for any entity ID
function isEntityId<T extends string>(
  id: string,
  prefix: T
): id is EntityId<T> {
  if (!isValidId(id)) return false;
  const parsed = parseId(id);
  return parsed.prefix === prefix;
}

// Usage
function processUserRequest(id: string) {
  if (isUserId(id)) {
    // TypeScript knows this is a UserId
    console.log('Processing user:', id);
  } else if (isTransactionId(id)) {
    // TypeScript knows this is a TransactionId
    console.log('Processing transaction:', id);
  } else {
    console.log('Unknown ID type:', id);
  }
}
```

### Union Types with Type Guards

```typescript
import { generateId, parseId } from '@aexoo-ai/spark-id';

// Union type for different entity IDs
type EntityId = UserId | TransactionId | OrderId;

// Type guard for entity IDs
function isEntityId(id: string): id is EntityId {
  if (!isValidId(id)) return false;
  const parsed = parseId(id);
  return ['USER', 'TXN', 'ORDER'].includes(parsed.prefix || '');
}

// Function that works with any entity ID
function getEntityType(id: EntityId): string {
  const parsed = parseId(id);
  return parsed.prefix || 'unknown';
}

// Usage
const testIds = [
  generateId('USER'),
  generateId('TXN'),
  generateId('ORDER'),
  'invalid-id',
];

testIds.forEach((id) => {
  if (isEntityId(id)) {
    console.log(`${getEntityType(id)}: ${id}`);
  } else {
    console.log('Invalid ID:', id);
  }
});
```

## Advanced Type Patterns

### Mapped Types

```typescript
import { generateId } from '@aexoo-ai/spark-id';

// Mapped type for entity records
type EntityRecord<T extends string> = {
  id: EntityId<T>;
  createdAt: Date;
  updatedAt: Date;
};

// Specific entity records
type UserRecord = EntityRecord<'USER'>;
type TransactionRecord = EntityRecord<'TXN'>;

// Factory function with mapped types
function createEntityRecord<T extends string>(
  prefix: T,
  data: Partial<EntityRecord<T>>
): EntityRecord<T> {
  return {
    id: generateId(prefix) as EntityId<T>,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  };
}

// Usage
const userRecord: UserRecord = createEntityRecord('USER', {});
const txnRecord: TransactionRecord = createEntityRecord('TXN', {});
```

### Conditional Types

```typescript
import { parseId } from '@aexoo-ai/spark-id';

// Conditional type based on prefix
type IdType<T extends string> = T extends `USER_${string}`
  ? 'user'
  : T extends `TXN_${string}`
    ? 'transaction'
    : T extends `ORDER_${string}`
      ? 'order'
      : 'unknown';

// Function that uses conditional types
function getEntityType<T extends string>(id: T): IdType<T> {
  const parsed = parseId(id);
  switch (parsed.prefix) {
    case 'USER':
      return 'user' as IdType<T>;
    case 'TXN':
      return 'transaction' as IdType<T>;
    case 'ORDER':
      return 'order' as IdType<T>;
    default:
      return 'unknown' as IdType<T>;
  }
}

// Usage with type inference
const userId = 'USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769';
const userType = getEntityType(userId); // Type: 'user'

const txnId = 'TXN_YBNDRFG8EJKMCPQXOT1UWISZA345H769';
const txnType = getEntityType(txnId); // Type: 'transaction'
```

### Template Literal Types

```typescript
import { generateId } from '@aexoo-ai/spark-id';

// Template literal types for prefixes
type Prefix = 'USER' | 'TXN' | 'ORDER' | 'PRODUCT';
type PrefixedId<T extends Prefix> = `${T}_${string}`;

// Type-safe ID generation
function generateTypedId<T extends Prefix>(prefix: T): PrefixedId<T> {
  return generateId(prefix) as PrefixedId<T>;
}

// Usage
const userId = generateTypedId('USER'); // Type: `USER_${string}`
const txnId = generateTypedId('TXN'); // Type: `TXN_${string}`

// Function that accepts specific prefixed IDs
function processUser(userId: PrefixedId<'USER'>) {
  console.log('Processing user:', userId);
}

function processTransaction(txnId: PrefixedId<'TXN'>) {
  console.log('Processing transaction:', txnId);
}

// Type-safe function calls
processUser(userId); // ✅ Valid
processTransaction(txnId); // ✅ Valid
// processUser(txnId) // ❌ Type error
```

## Error Handling with Types

### Typed Error Handling

```typescript
import { parseId, isValidId } from '@aexoo-ai/spark-id';

// Custom error types
class InvalidIdError extends Error {
  constructor(
    public id: string,
    public reason: string
  ) {
    super(`Invalid ID "${id}": ${reason}`);
    this.name = 'InvalidIdError';
  }
}

class WrongPrefixError extends Error {
  constructor(
    public id: string,
    public expectedPrefix: string,
    public actualPrefix?: string
  ) {
    super(
      `Expected prefix "${expectedPrefix}" but got "${actualPrefix || 'none'}" for ID "${id}"`
    );
    this.name = 'WrongPrefixError';
  }
}

// Type-safe parsing with errors
function safeParseId<T extends string>(
  id: string,
  expectedPrefix?: T
): { success: true; data: ParsedId } | { success: false; error: Error } {
  try {
    if (!isValidId(id)) {
      return {
        success: false,
        error: new InvalidIdError(id, 'Invalid format'),
      };
    }

    const parsed = parseId(id);

    if (expectedPrefix && parsed.prefix !== expectedPrefix) {
      return {
        success: false,
        error: new WrongPrefixError(id, expectedPrefix, parsed.prefix),
      };
    }

    return { success: true, data: parsed };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

// Usage with type narrowing
const result = safeParseId('USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769', 'USER');

if (result.success) {
  // TypeScript knows result.data is ParsedId
  console.log('Parsed ID:', result.data);
} else {
  // TypeScript knows result.error is Error
  console.error('Error:', result.error.message);
}
```

## Array Operations with Types

### Typed Array Operations

```typescript
import { generateId, isValidId, parseId } from '@aexoo-ai/spark-id';

// Type-safe array operations
function generateTypedIds<T extends string>(
  prefix: T,
  count: number
): Array<PrefixedId<T>> {
  return Array.from(
    { length: count },
    () => generateId(prefix) as PrefixedId<T>
  );
}

function filterValidIds<T extends string>(ids: T[]): T[] {
  return ids.filter(isValidId);
}

function filterByPrefix<T extends string>(
  ids: string[],
  prefix: T
): Array<PrefixedId<T>> {
  return ids
    .filter(isValidId)
    .map((id) => parseId(id))
    .filter((parsed) => parsed.prefix === prefix)
    .map((parsed) => parsed.full as PrefixedId<T>);
}

// Usage
const userIds = generateTypedIds('USER', 5); // Type: Array<PrefixedId<'USER'>>
const txnIds = generateTypedIds('TXN', 3); // Type: Array<PrefixedId<'TXN'>>

const mixedIds = [...userIds, ...txnIds, 'invalid-id'];
const validIds = filterValidIds(mixedIds);
const filteredUserIds = filterByPrefix(mixedIds, 'USER'); // Type: Array<PrefixedId<'USER'>>
```

## Related

- [Basic Examples](/examples/basic) - Basic usage patterns
- [Database Integration](/examples/database) - Database operations
- [Web API Examples](/examples/web-api) - API integration
- [API Reference](/api/) - Complete API documentation
