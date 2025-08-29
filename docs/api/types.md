# Types

Complete reference for all TypeScript types and interfaces in the Spark-ID API.

## Core Types

### `ParsedId`

Represents the parsed components of an ID.

### `SparkIdConfig`

Controls ID generation, formatting, and validation behavior.

```typescript
interface SparkIdConfig {
  // Core generation
  alphabet?: string;
  entropyBits?: number;
  length?: number;

  // Formatting
  maxPrefixLength?: number;
  separator?: string;
  case?: 'upper' | 'lower' | 'mixed';

  // Advanced
  encoding?: 'base32' | 'base64' | 'hex' | 'custom';
  timestamp?: boolean;
  machineId?: string | number;
}
```

### `SparkIdOptions`

Wrapper for common call options.

```typescript
interface SparkIdOptions {
  prefix?: string;
  config?: Partial<SparkIdConfig>;
}
```

### `SparkIdValidationResult`

Detailed validation output.

```typescript
interface SparkIdValidationResult {
  isValid: boolean;
  error?: string;
  code?: string;
}
```

### `SparkIdStats`

Statistics for an ID or configuration.

```typescript
interface SparkIdStats {
  entropyBits: number;
  collisionProbability: number;
  maxIds: number;
}
```

### `DEFAULT_CONFIG`

Default configuration values used by Spark-ID.

```typescript
const DEFAULT_CONFIG: SparkIdConfig
```

```typescript
interface ParsedId {
  prefix?: string;
  id: string;
  full: string;
}
```

#### Properties

- `prefix?`: The prefix (if any)
- `id`: The raw ID (without prefix)
- `full`: The complete ID string

#### Examples

```typescript
import { parseId } from '@aexoo-ai/spark-id';

// Simple ID
const parsed1: ParsedId = parseId('YBNDRFG8EJKMCPQXOT1UWISZA345H769');
console.log(parsed1);
// {
//   id: 'YBNDRFG8EJKMCPQXOT1UWISZA345H769',
//   full: 'YBNDRFG8EJKMCPQXOT1UWISZA345H769'
// }

// Prefixed ID
const parsed2: ParsedId = parseId('USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769');
console.log(parsed2);
// {
//   prefix: 'USER',
//   id: 'YBNDRFG8EJKMCPQXOT1UWISZA345H769',
//   full: 'USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769'
// }
```

## Function Signatures

### `generateId`

```typescript
function generateId(prefix?: string, config?: Partial<SparkIdConfig>): string;
```

Generates a new cryptographically secure ID.

#### Parameters

- `prefix?`: Optional string prefix

#### Returns

- `string`: The generated ID

#### Type Usage

```typescript
import { generateId } from '@aexoo-ai/spark-id';

// Type inference
const id: string = generateId();
const userId: string = generateId('USER');

// Array of IDs
const ids: string[] = Array.from({ length: 5 }, () => generateId());
```

### `createId`

```typescript
function createId(prefix?: string, config?: Partial<SparkIdConfig>): SecureId;
```

Creates a new SecureId instance.

#### Parameters

- `prefix?`: Optional string prefix

#### Returns

- `SecureId`: A new SecureId instance

#### Type Usage

```typescript
import { createId } from '@aexoo-ai/spark-id';

// Type inference
const secureId: SecureId = createId();
const userSecureId: SecureId = createId('USER');

// Array of SecureId instances
const secureIds: SecureId[] = Array.from({ length: 3 }, () => createId('TXN'));
```

### `isValidId`

```typescript
function isValidId(id: string, config?: Partial<SparkIdConfig>): boolean;
```

Validates if a string is a properly formatted Spark-ID.

#### Parameters

- `id`: The string to validate

#### Returns

- `boolean`: `true` if valid, `false` otherwise

#### Type Usage

```typescript
import { isValidId } from '@aexoo-ai/spark-id';

// Type inference
const isValid: boolean = isValidId('USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769');

// Array validation
const ids: string[] = ['id1', 'id2', 'id3'];
const validIds: string[] = ids.filter(isValidId);

// Type guard
function processId(id: string): void {
  if (isValidId(id)) {
    // TypeScript knows id is valid here
    const parsed = parseId(id); // No error
  }
}
```

### `parseId`

```typescript
function parseId(id: string, config?: Partial<SparkIdConfig>): ParsedId;
```

Parses an ID string into its components.

#### Parameters

- `id`: The ID string to parse

#### Returns

- `ParsedId`: The parsed ID components

#### Throws

- `Error`: If the ID format is invalid

#### Type Usage

```typescript
import { parseId } from '@aexoo-ai/spark-id';

// Type inference
const parsed: ParsedId = parseId('USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769');

// Destructuring with types
const { prefix, id, full }: ParsedId = parseId(
  'USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769'
);

// Type-safe access
if (parsed.prefix) {
  const prefix: string = parsed.prefix; // TypeScript knows this is defined
}
```

## Class Types

### `SecureId`

The main class for working with secure IDs.

```typescript
class SecureId {
  public readonly id: string;
  public readonly prefix?: string;
  public readonly full: string;

  constructor(id?: string, prefix?: string, config?: Partial<SparkIdConfig>);

  equals(other: SecureId | string): boolean;
  toString(): string;

  static generate(prefix?: string, config?: Partial<SparkIdConfig>): string;
  static create(prefix?: string, config?: Partial<SparkIdConfig>): SecureId;
  static parse(idString: string, config?: Partial<SparkIdConfig>): ParsedId;
  static isValid(idString: string, config?: Partial<SparkIdConfig>): boolean;
  static isValidRawId(rawId: string): boolean;
  static generateRaw(config?: Partial<SparkIdConfig>): string;

  // Configuration helpers
  static configure(config: Partial<SparkIdConfig>): void;
  static getConfig(): SparkIdConfig;
  static resetConfig(): void;

  // Instance helpers
  getEntropyBits(): number;
  hasPrefix(): boolean;
  getStats(): SparkIdStats;
  validate(): SparkIdValidationResult;
  generateSimilar(): SecureId;
}
```

#### Instance Properties

```typescript
const secureId = new SecureId(undefined, 'USER');

// Type-safe property access
const id: string = secureId.id;
const prefix: string | undefined = secureId.prefix;
const full: string = secureId.full;
```

#### Instance Methods

```typescript
// equals method
const result: boolean = secureId.equals(otherSecureId);
const result2: boolean = secureId.equals(
  'USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769'
);

// toString method
const stringValue: string = secureId.toString();
```

#### Static Methods

```typescript
// Static method types
const generatedId: string = SecureId.generate('USER');
const newInstance: SecureId = SecureId.create('TXN');
const parsed: ParsedId = SecureId.parse(
  'USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769'
);
const isValid: boolean = SecureId.isValid(
  'USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769'
);
const isValidRaw: boolean = SecureId.isValidRawId(
  'YBNDRFG8EJKMCPQXOT1UWISZA345H769'
);
const rawId: string = SecureId.generateRaw();
```

## Advanced Type Usage

### Generic Functions

```typescript
// Generic function that works with IDs
function processIds<T extends string>(ids: T[]): T[] {
  return ids.filter(isValidId);
}

// Usage
const userIds: string[] = ['USER_123', 'USER_456', 'invalid'];
const validIds: string[] = processIds(userIds);
```

### Type Guards

```typescript
// Custom type guard
function isUserId(id: string): id is string {
  if (!isValidId(id)) return false;
  const parsed = parseId(id);
  return parsed.prefix === 'USER';
}

// Usage
function processUser(id: string) {
  if (isUserId(id)) {
    // TypeScript knows this is a valid user ID
    const parsed = parseId(id);
    console.log('User ID:', parsed.id);
  }
}
```

### Union Types

```typescript
// Union type for different ID types
type EntityId = `USER_${string}` | `TXN_${string}` | `ORDER_${string}`;

// Type-safe function
function getEntityType(id: EntityId): string {
  const parsed = parseId(id);
  return parsed.prefix || 'unknown';
}
```

### Mapped Types

```typescript
// Mapped type for entity records
type EntityRecord<T extends string> = {
  id: T;
  createdAt: Date;
  updatedAt: Date;
};

// Usage
type UserRecord = EntityRecord<`USER_${string}`>;
type TransactionRecord = EntityRecord<`TXN_${string}`>;

const user: UserRecord = {
  id: generateId('USER'),
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

### Conditional Types

```typescript
// Conditional type based on prefix
type IdType<T extends string> = T extends `USER_${string}`
  ? 'user'
  : T extends `TXN_${string}`
    ? 'transaction'
    : 'unknown';

// Usage
type UserIdType = IdType<`USER_${string}`>; // 'user'
type TxnIdType = IdType<`TXN_${string}`>; // 'transaction'
```

## Error Types

### Parsing Errors

```typescript
import { parseId } from '@aexoo-ai/spark-id';

try {
  const parsed = parseId('invalid-id');
} catch (error) {
  // error is of type Error
  console.error('Parsing failed:', error.message);
}
```

### Validation Errors

```typescript
import { isValidId } from '@aexoo-ai/spark-id';

function validateId(id: string): { valid: boolean; error?: string } {
  if (!isValidId(id)) {
    return { valid: false, error: 'Invalid ID format' };
  }
  return { valid: true };
}
```

## Module Augmentation

### Extending Types

```typescript
// Extend ParsedId with custom properties
declare module '@aexoo-ai/spark-id' {
  interface ParsedId {
    isValid?: boolean;
    createdAt?: Date;
  }
}

// Usage
const parsed = parseId('USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769');
parsed.isValid = true;
parsed.createdAt = new Date();
```

## Type Utilities

### Utility Types

```typescript
// Extract prefix type
type ExtractPrefix<T extends string> = T extends `${infer P}_${string}`
  ? P
  : never;

// Extract ID type
type ExtractId<T extends string> = T extends `${string}_${infer I}` ? I : T;

// Usage
type UserPrefix = ExtractPrefix<'USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769'>; // 'USER'
type UserId = ExtractId<'USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769'>; // 'YBNDRFG8EJKMCPQXOT1UWISZA345H769'
```

### Type Assertions

```typescript
// Type assertion for known valid IDs
const knownValidId = 'USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769' as const;
const parsed = parseId(knownValidId); // TypeScript knows this won't throw

// Type assertion for prefix
function assertUserId(id: string): asserts id is `USER_${string}` {
  if (!isValidId(id) || !id.startsWith('USER_')) {
    throw new Error('Not a valid user ID');
  }
}
```

## Related

- [Functions](/api/functions) - Function documentation
- [Classes](/api/classes) - Class documentation
- [ID Generation](/guide/id-generation) - Usage examples
- [Validation](/guide/validation) - Validation patterns
