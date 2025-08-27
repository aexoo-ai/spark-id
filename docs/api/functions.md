# Functions

Complete reference for all functions in the Spark-ID API.

## `generateId(prefix?: string): string`

Generates a new cryptographically secure ID.

### Parameters

- `prefix` (optional): A string prefix to add to the ID

### Returns

A string containing the generated ID.

### Examples

```typescript
import { generateId } from '@aexoo-ai/spark-id'

// Generate a simple ID
const id = generateId()
console.log(id) // "ybndrfg8ejkmcpqxot1uwisza345h769"

// Generate with prefix
const userId = generateId('USER')
console.log(userId) // "USER_ybndrfg8ejkmcpqxot1uwisza345h769"

// Generate multiple IDs
const ids = Array.from({ length: 3 }, () => generateId())
console.log(ids)
// [
//   "ybndrfg8ejkmcpqxot1uwisza345h769",
//   "abc123def456ghi789",
//   "xyz789uvw012mno345"
// ]
```

### Performance

- **Speed**: ~1000+ IDs per second
- **Memory**: Minimal memory footprint
- **Thread Safety**: Safe for concurrent use

## `createId(prefix?: string): SecureId`

Creates a new SecureId instance.

### Parameters

- `prefix` (optional): A string prefix to add to the ID

### Returns

A new SecureId instance.

### Examples

```typescript
import { createId } from '@aexoo-ai/spark-id'

// Create a simple SecureId
const secureId = createId()
console.log(secureId.id)     // "ybndrfg8ejkmcpqxot1uwisza345h769"
console.log(secureId.full)   // "ybndrfg8ejkmcpqxot1uwisza345h769"
console.log(secureId.prefix) // undefined

// Create with prefix
const userSecureId = createId('USER')
console.log(userSecureId.id)     // "ybndrfg8ejkmcpqxot1uwisza345h769"
console.log(userSecureId.full)   // "USER_ybndrfg8ejkmcpqxot1uwisza345h769"
console.log(userSecureId.prefix) // "USER"
```

### Use Cases

```typescript
// Database operations
const user = {
  id: createId('USER').full,
  name: 'John Doe',
  email: 'john@example.com'
}

// API responses
const response = {
  id: createId('TXN').full,
  amount: 100.50,
  status: 'completed'
}
```

## `isValidId(id: string): boolean`

Validates if a string is a properly formatted Spark-ID.

### Parameters

- `id`: The string to validate

### Returns

`true` if the ID is valid, `false` otherwise.

### Examples

```typescript
import { isValidId } from '@aexoo-ai/spark-id'

// Valid IDs
console.log(isValidId('ybndrfg8ejkmcpqxot1uwisza345h769')) // true
console.log(isValidId('USER_ybndrfg8ejkmcpqxot1uwisza345h769')) // true

// Invalid IDs
console.log(isValidId('invalid-id')) // false
console.log(isValidId('')) // false
console.log(isValidId('abc123def456ghi789jkl012mno345pqr678stu901vwx234yz0')) // false
console.log(isValidId('abc-123-def-456')) // false
console.log(isValidId('abc 123 def 456')) // false
```

### Validation Rules

The function checks that the ID:

1. Is a non-empty string
2. Contains only characters from the Z-Base32 alphabet
3. Has proper prefix format (if present)
4. Uses single underscore as separator

### Performance

- **Speed**: ~10,000+ validations per second
- **Memory**: Constant memory usage

## `parseId(id: string): ParsedId`

Parses an ID string into its components.

### Parameters

- `id`: The ID string to parse

### Returns

A ParsedId object containing the parsed components.

### Throws

- `Error`: If the ID format is invalid

### Examples

```typescript
import { parseId } from '@aexoo-ai/spark-id'

// Parse simple ID
const parsed1 = parseId('ybndrfg8ejkmcpqxot1uwisza345h769')
console.log(parsed1)
// {
//   id: 'ybndrfg8ejkmcpqxot1uwisza345h769',
//   full: 'ybndrfg8ejkmcpqxot1uwisza345h769'
// }

// Parse prefixed ID
const parsed2 = parseId('USER_ybndrfg8ejkmcpqxot1uwisza345h769')
console.log(parsed2)
// {
//   prefix: 'USER',
//   id: 'ybndrfg8ejkmcpqxot1uwisza345h769',
//   full: 'USER_ybndrfg8ejkmcpqxot1uwisza345h769'
// }
```

### Error Handling

```typescript
import { parseId } from '@aexoo-ai/spark-id'

try {
  const parsed = parseId('invalid-id-format')
} catch (error) {
  console.error('Failed to parse ID:', error.message)
  // Handle the error appropriately
}
```

### Use Cases

```typescript
// Extract prefix for routing
const parsed = parseId('USER_ybndrfg8ejkmcpqxot1uwisza345h769')
if (parsed.prefix === 'USER') {
  // Route to user handler
} else if (parsed.prefix === 'TXN') {
  // Route to transaction handler
}

// Database queries
const parsed = parseId('USER_ybndrfg8ejkmcpqxot1uwisza345h769')
const query = `SELECT * FROM ${parsed.prefix.toLowerCase()}s WHERE id = '${parsed.id}'`
```

## Type Definitions

### `ParsedId`

```typescript
interface ParsedId {
  prefix?: string
  id: string
  full: string
}
```

Represents the parsed components of an ID.

#### Properties

- `prefix?`: The prefix (if any)
- `id`: The raw ID (without prefix)
- `full`: The complete ID string

## Performance Characteristics

### Generation Performance

```typescript
import { generateId } from '@aexoo-ai/spark-id'

// Performance test
const start = Date.now()
const ids = Array.from({ length: 1000 }, () => generateId())
const end = Date.now()

console.log(`Generated ${ids.length} IDs in ${end - start}ms`)
// Typically generates 1000+ IDs per second
```

### Validation Performance

```typescript
import { isValidId } from '@aexoo-ai/spark-id'

// Performance test
const testIds = Array.from({ length: 10000 }, () => 'USER_ybndrfg8ejkmcpqxot1uwisza345h769')

const start = Date.now()
const results = testIds.map(isValidId)
const end = Date.now()

console.log(`Validated ${testIds.length} IDs in ${end - start}ms`)
// Typically validates 10,000+ IDs per second
```

### Parsing Performance

```typescript
import { parseId } from '@aexoo-ai/spark-id'

// Performance test
const testIds = Array.from({ length: 10000 }, () => 'USER_ybndrfg8ejkmcpqxot1uwisza345h769')

const start = Date.now()
const results = testIds.map(parseId)
const end = Date.now()

console.log(`Parsed ${testIds.length} IDs in ${end - start}ms`)
// Typically parses 10,000+ IDs per second
```

## Error Handling

### Common Error Scenarios

```typescript
import { parseId, isValidId } from '@aexoo-ai/spark-id'

// Invalid format
try {
  parseId('invalid-id-format')
} catch (error) {
  console.error('Invalid format:', error.message)
}

// Empty string
console.log(isValidId('')) // false

// Null/undefined
console.log(isValidId(null)) // false
console.log(isValidId(undefined)) // false

// Wrong type
console.log(isValidId(123)) // false
console.log(isValidId({})) // false
```

### Best Practices

```typescript
import { generateId, isValidId, parseId } from '@aexoo-ai/spark-id'

// Always validate user input
function processUserInput(input: string) {
  if (!isValidId(input)) {
    throw new Error('Invalid ID format')
  }
  
  const parsed = parseId(input)
  // Process the parsed ID
}

// Handle parsing errors gracefully
function safeParseId(id: string) {
  try {
    return parseId(id)
  } catch (error) {
    console.error('Failed to parse ID:', error.message)
    return null
  }
}
```

## Related

- [Classes](/api/classes) - SecureId class documentation
- [Types](/api/types) - Type definitions
- [ID Generation](/guide/id-generation) - Usage examples
- [Validation](/guide/validation) - Validation patterns
