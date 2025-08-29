# API Reference

## Overview

Spark-ID provides a comprehensive API for generating, validating, and working with cryptographically secure IDs. The API is designed to be simple, intuitive, and fully type-safe.

## Core Functions

### `generateId(prefix?: string, config?: Partial<SparkIdConfig>): string`

Generates a new cryptographically secure ID.

```typescript
import { generateId } from '@aexoo-ai/spark-id';

// Generate a simple ID
const id = generateId(); // "ybndrfg8ejkmcpqxot1uwisza345h769"

// Generate with prefix
const userId = generateId('USER'); // "USER_ybndrfg8ejkmcpqxot1uwisza345h769"
```

**Parameters:**

- `prefix` (optional): A string prefix to add to the ID

**Returns:** A string containing the generated ID

### `createId(prefix?: string, config?: Partial<SparkIdConfig>): SecureId`

Creates a new SecureId instance.

```typescript
import { createId } from '@aexoo-ai/spark-id';

// Create a simple SecureId
const secureId = createId();

// Create with prefix
const userSecureId = createId('USER');
```

**Parameters:**

- `prefix` (optional): A string prefix to add to the ID

**Returns:** A new SecureId instance

### `isValidId(id: string, config?: Partial<SparkIdConfig>): boolean`

Validates if a string is a properly formatted Spark-ID.

```typescript
import { isValidId } from '@aexoo-ai/spark-id';

console.log(isValidId('ybndrfg8ejkmcpqxot1uwisza345h769')); // true
console.log(isValidId('USER_ybndrfg8ejkmcpqxot1uwisza345h769')); // true
console.log(isValidId('invalid-id')); // false
```

**Parameters:**

- `id`: The string to validate

**Returns:** `true` if the ID is valid, `false` otherwise

### `parseId(id: string, config?: Partial<SparkIdConfig>): ParsedId`

Parses an ID string into its components.

```typescript
import { parseId } from '@aexoo-ai/spark-id';

// Parse simple ID
const parsed1 = parseId('ybndrfg8ejkmcpqxot1uwisza345h769');
// { id: 'ybndrfg8ejkmcpqxot1uwisza345h769', full: 'ybndrfg8ejkmcpqxot1uwisza345h769' }

// Parse prefixed ID
const parsed2 = parseId('USER_ybndrfg8ejkmcpqxot1uwisza345h769');
// { prefix: 'USER', id: 'ybndrfg8ejkmcpqxot1uwisza345h769', full: 'USER_ybndrfg8ejkmcpqxot1uwisza345h769' }
```

**Parameters:**

- `id`: The ID string to parse

**Returns:** A ParsedId object containing the parsed components

**Throws:** Error if the ID format is invalid

## Classes

### `SecureId`

The main class for working with secure IDs.

```typescript
import { SecureId } from '@aexoo-ai/spark-id';

// Create a new SecureId
const secureId = new SecureId();

// Create with prefix
const userSecureId = new SecureId(undefined, 'USER');

// Create from existing ID
const existingId = new SecureId('ybndrfg8ejkmcpqxot1uwisza345h769');
```

**Constructor:**

- `id?` (optional): Existing ID string
- `prefix?` (optional): Prefix for the ID

**Properties:**

- `id: string` - The raw ID (without prefix)
- `prefix?: string` - The prefix (if any)
- `full: string` - The complete ID string

**Methods:**

- `equals(other: SecureId | string): boolean` - Compare with another ID
- `toString(): string` - Return the full ID string

## Types

### `ParsedId`

```typescript
interface ParsedId {
  prefix?: string;
  id: string;
  full: string;
}
```

Represents the parsed components of an ID.

## Static Methods

### `SecureId.generate(prefix?: string, config?: Partial<SparkIdConfig>): string`

Static method to generate a new ID.

```typescript
const id = SecureId.generate('USER');
```

### `SecureId.create(prefix?: string, config?: Partial<SparkIdConfig>): SecureId`

Static method to create a new SecureId instance.

```typescript
const secureId = SecureId.create('USER');
```

### `SecureId.parse(idString: string, config?: Partial<SparkIdConfig>): ParsedId`

Static method to parse an ID string.

```typescript
const parsed = SecureId.parse('USER_ybndrfg8ejkmcpqxot1uwisza345h769');
```

### `SecureId.isValid(idString: string, config?: Partial<SparkIdConfig>): boolean`

Static method to validate an ID string.

```typescript
const isValid = SecureId.isValid('USER_ybndrfg8ejkmcpqxot1uwisza345h769');
```

### `SecureId.isValidRawId(rawId: string): boolean`

### Global configuration

Process-wide configuration helpers to control defaults:

```typescript
import { configure, getConfig, resetConfig } from '@aexoo-ai/spark-id'

configure({ separator: '_', case: 'upper', entropyBits: 72 })
const cfg = getConfig()
resetConfig()
```


Static method to validate a raw ID (without prefix).

```typescript
const isValid = SecureId.isValidRawId('ybndrfg8ejkmcpqxot1uwisza345h769');
```

## Error Handling

Spark-ID functions throw errors in the following cases:

- **Invalid ID format**: When parsing an ID with incorrect format
- **Invalid prefix**: When a prefix contains invalid characters

```typescript
import { parseId } from '@aexoo-ai/spark-id';

try {
  const parsed = parseId('invalid-id-format');
} catch (error) {
  console.error('Invalid ID format:', error.message);
}
```

## Performance Considerations

- **ID Generation**: ~1000+ IDs per second
- **Validation**: ~10,000+ validations per second
- **Parsing**: ~10,000+ parses per second
- **Memory**: Minimal memory footprint

## Browser Compatibility

Spark-ID is designed for Node.js environments. For browser usage, see the [Installation Guide](/guide/installation#browser-usage) for bundler configuration.

## Related

- [Functions](/api/functions) - Detailed function documentation
- [Classes](/api/classes) - Detailed class documentation
- [Types](/api/types) - Type definitions
- [Examples](/examples/) - Usage examples
