# ID Generation

Learn about the different ways to generate IDs with Spark-ID.

## Basic Generation

### Simple IDs

Generate a basic ID without any prefix:

```typescript
import { generateId } from '@aexoo-ai/spark-id';

const id = generateId();
console.log(id); // "ybndrfg8ejkmcpqxot1uwisza345h769"
```

### Prefixed IDs

Add a meaningful prefix to organize your IDs:

```typescript
const userId = generateId('USER');
const txnId = generateId('TXN');
const orderId = generateId('ORDER');

console.log(userId); // "USER_ybndrfg8ejkmcpqxot1uwisza345h769"
console.log(txnId); // "TXN_ybndrfg8ejkmcpqxot1uwisza345h769"
console.log(orderId); // "ORDER_ybndrfg8ejkmcpqxot1uwisza345h769"
```

## Using the SecureId Class

### Creating Instances

```typescript
import { SecureId, createId } from '@aexoo-ai/spark-id';

// Using the constructor
const secureId1 = new SecureId();
const secureId2 = new SecureId(undefined, 'USER');

// Using the factory function
const secureId3 = createId();
const secureId4 = createId('TXN');
```

### Accessing Properties

```typescript
const secureId = new SecureId(undefined, 'USER');

console.log(secureId.id); // "ybndrfg8ejkmcpqxot1uwisza345h769"
console.log(secureId.prefix); // "USER"
console.log(secureId.full); // "USER_ybndrfg8ejkmcpqxot1uwisza345h769"
```

## Bulk Generation

Generate multiple IDs efficiently:

```typescript
// Generate an array of IDs
const ids = Array.from({ length: 10 }, () => generateId());

// Generate multiple prefixed IDs
const userIds = Array.from({ length: 5 }, () => generateId('USER'));

// Using SecureId class
const secureIds = Array.from({ length: 3 }, () => createId('TXN'));
```

## Static Methods

Use static methods for direct access:

```typescript
import { SecureId } from '@aexoo-ai/spark-id';

// Generate directly
const id = SecureId.generate('USER');

// Create instance
const secureId = SecureId.create('TXN');

// Generate raw ID (without prefix)
const rawId = SecureId.generateRaw();
```

## ID Format Details

### Structure

Spark-ID generates IDs with the following characteristics:

- **Length**: 12-15 characters
- **Alphabet**: Z-Base32 (`yvndrfg9ejkmcpqxwt2uwxsza345h769`)
- **Entropy**: 72 bits (9 bytes)
- **Format**: `[PREFIX_]ID`

### Z-Base32 Encoding

Spark-ID uses Z-Base32 encoding which:

- ✅ Avoids commonly confused characters (0/O, 1/I, 8/B)
- ✅ Is URL-safe (no special characters)
- ✅ Is human-readable
- ✅ Reduces transcription errors

### Prefix Rules

- **Optional**: You can generate IDs without prefixes
- **Single underscore separator**: `PREFIX_ID`
- **Case-sensitive**: `USER` and `user` are different
- **No spaces**: Use underscores or hyphens instead

## Performance

Spark-ID is optimized for high-performance generation:

```typescript
// Performance test
const start = Date.now();
const ids = Array.from({ length: 1000 }, () => generateId());
const end = Date.now();

console.log(`Generated ${ids.length} IDs in ${end - start}ms`);
// Typically generates 1000+ IDs per second
```

## Best Practices

### Choose Meaningful Prefixes

```typescript
// Good prefixes
const userId = generateId('USER');
const txnId = generateId('TXN');
const orderId = generateId('ORDER');
const commentId = generateId('COMMENT');

// Avoid generic prefixes
const id1 = generateId('ID'); // Too generic
const obj1 = generateId('OBJ'); // Too generic
```

### Use Consistent Naming

```typescript
// Be consistent with your prefix naming
const user1 = generateId('USER');
const user2 = generateId('USER');
const user3 = generateId('USER');

// Don't mix different styles
const user4 = generateId('user'); // Inconsistent casing
const user5 = generateId('USR'); // Inconsistent abbreviation
```

### Handle Errors Gracefully

```typescript
try {
  const id = generateId();
  // Use the ID
} catch (error) {
  console.error('Failed to generate ID:', error);
  // Handle the error appropriately
}
```

## Related

- [Prefixes](/guide/prefixes) - Learn more about prefix usage
- [Validation](/guide/validation) - Validate generated IDs
- [Security](/guide/security) - Understand security features
- [API Reference](/api/) - Complete API documentation
