# Classes

Complete reference for the SecureId class.

## `SecureId`

The main class for working with secure IDs. Provides both instance methods and static methods for ID generation, validation, and manipulation.

### Constructor

```typescript
new SecureId(id?: string, prefix?: string, config?: Partial<SparkIdConfig>)
```

#### Parameters

- `id?` (optional): Existing ID string
- `prefix?` (optional): Prefix for the ID

#### Examples

```typescript
import { SecureId } from '@aexoo-ai/spark-id'

// Create with auto-generated ID
const secureId1 = new SecureId()

// Create with prefix
const secureId2 = new SecureId(undefined, 'USER')

// Create from existing ID
const secureId3 = new SecureId('ybndrfg8ejkmcpqxot1uwisza345h769')

// Create from existing ID with prefix
const secureId4 = new SecureId('ybndrfg8ejkmcpqxot1uwisza345h769', 'USER')
```

### Properties

#### `id: string`

The raw ID (without prefix).

```typescript
const secureId = new SecureId(undefined, 'USER')
console.log(secureId.id) // "ybndrfg8ejkmcpqxot1uwisza345h769"
```

#### `prefix?: string`

The prefix (if any).

```typescript
const secureId = new SecureId(undefined, 'USER')
console.log(secureId.prefix) // "USER"

const simpleId = new SecureId()
console.log(simpleId.prefix) // undefined
```

#### `full: string`

The complete ID string.

```typescript
const secureId = new SecureId(undefined, 'USER')
console.log(secureId.full) // "USER_ybndrfg8ejkmcpqxot1uwisza345h769"

const simpleId = new SecureId()
console.log(simpleId.full) // "ybndrfg8ejkmcpqxot1uwisza345h769"
```

### Instance Methods

#### `equals(other: SecureId | string): boolean`

Compares this SecureId with another ID.

##### Parameters

- `other`: Another SecureId instance or ID string

##### Returns

`true` if the IDs are equal, `false` otherwise.

##### Examples

```typescript
import { SecureId } from '@aexoo-ai/spark-id'

const id1 = new SecureId('abc123def456')
const id2 = new SecureId('abc123def456')
const id3 = new SecureId('xyz789uvw012')

console.log(id1.equals(id2)) // true
console.log(id1.equals(id2.full)) // true
console.log(id1.equals(id3)) // false
console.log(id1.equals(id3.full)) // false
```

#### `toString(): string`

Returns the full ID string.

##### Returns

The complete ID string.

##### Examples

```typescript
import { SecureId } from '@aexoo-ai/spark-id'

const secureId = new SecureId(undefined, 'USER')
console.log(secureId.toString()) // "USER_ybndrfg8ejkmcpqxot1uwisza345h769"

// Implicit string conversion
const idString = `ID: ${secureId}` // "ID: USER_ybndrfg8ejkmcpqxot1uwisza345h769"
```

### Static Methods

#### `SecureId.generate(prefix?: string): string`

Static method to generate a new ID.

##### Parameters

- `prefix?` (optional): A string prefix to add to the ID

##### Returns

A string containing the generated ID.

##### Examples

```typescript
import { SecureId } from '@aexoo-ai/spark-id'

// Generate simple ID
const id = SecureId.generate()
console.log(id) // "ybndrfg8ejkmcpqxot1uwisza345h769"

// Generate with prefix
const userId = SecureId.generate('USER')
console.log(userId) // "USER_ybndrfg8ejkmcpqxot1uwisza345h769"
```

#### `SecureId.create(prefix?: string, config?: Partial<SparkIdConfig>): SecureId`

Static method to create a new SecureId instance.

##### Parameters

- `prefix?` (optional): A string prefix to add to the ID

##### Returns

A new SecureId instance.

##### Examples

```typescript
import { SecureId } from '@aexoo-ai/spark-id'

// Create simple instance
const secureId = SecureId.create()
console.log(secureId.full) // "ybndrfg8ejkmcpqxot1uwisza345h769"

// Create with prefix
const userSecureId = SecureId.create('USER')
console.log(userSecureId.full) // "USER_ybndrfg8ejkmcpqxot1uwisza345h769"
```

#### `SecureId.parse(idString: string): ParsedId`
#### `SecureId.parse(idString: string, config?: Partial<SparkIdConfig>): ParsedId`

Static method to parse an ID string.

##### Parameters

- `idString`: The ID string to parse

##### Returns

A ParsedId object containing the parsed components.

##### Throws

- `Error`: If the ID format is invalid

##### Examples

```typescript
import { SecureId } from '@aexoo-ai/spark-id'

// Parse simple ID
const parsed1 = SecureId.parse('ybndrfg8ejkmcpqxot1uwisza345h769')
console.log(parsed1)
// {
//   id: 'ybndrfg8ejkmcpqxot1uwisza345h769',
//   full: 'ybndrfg8ejkmcpqxot1uwisza345h769'
// }

// Parse prefixed ID
const parsed2 = SecureId.parse('USER_ybndrfg8ejkmcpqxot1uwisza345h769')
console.log(parsed2)
// {
//   prefix: 'USER',
//   id: 'ybndrfg8ejkmcpqxot1uwisza345h769',
//   full: 'USER_ybndrfg8ejkmcpqxot1uwisza345h769'
// }
```

#### `SecureId.isValid(idString: string, config?: Partial<SparkIdConfig>): boolean`

Static method to validate an ID string.

##### Parameters

- `idString`: The ID string to validate

##### Returns

`true` if the ID is valid, `false` otherwise.

##### Examples

```typescript
import { SecureId } from '@aexoo-ai/spark-id'

// Valid IDs
console.log(SecureId.isValid('ybndrfg8ejkmcpqxot1uwisza345h769')) // true
console.log(SecureId.isValid('USER_ybndrfg8ejkmcpqxot1uwisza345h769')) // true

// Invalid IDs
console.log(SecureId.isValid('invalid-id')) // false
console.log(SecureId.isValid('')) // false
```

#### `SecureId.isValidRawId(rawId: string): boolean`

Static method to validate a raw ID (without prefix).

##### Parameters

- `rawId`: The raw ID string to validate

##### Returns

`true` if the raw ID is valid, `false` otherwise.

##### Examples

```typescript
import { SecureId } from '@aexoo-ai/spark-id'

// Valid raw IDs
console.log(SecureId.isValidRawId('ybndrfg8ejkmcpqxot1uwisza345h769')) // true

// Invalid raw IDs
console.log(SecureId.isValidRawId('USER_ybndrfg8ejkmcpqxot1uwisza345h769')) // false (has prefix)
console.log(SecureId.isValidRawId('invalid-id')) // false
```

#### `SecureId.generateRaw(config?: Partial<SparkIdConfig>): string`

#### Configuration (static)

`SecureId` exposes process-wide configuration helpers:

- `configure(config: Partial<SparkIdConfig>): void`
- `getConfig(): SparkIdConfig`
- `resetConfig(): void`

```typescript
import { SecureId } from '@aexoo-ai/spark-id'

SecureId.configure({ separator: '-', case: 'lower' })
const id = SecureId.generate('user') // "user-..."

const current = SecureId.getConfig()
SecureId.resetConfig()
```

#### Instance helpers

- `getEntropyBits(): number`
- `hasPrefix(): boolean`
- `getStats(): SparkIdStats`
- `validate(): SparkIdValidationResult`
- `generateSimilar(): SecureId`

Static method to generate a raw ID (without prefix).

##### Returns

A string containing the generated raw ID.

##### Examples

```typescript
import { SecureId } from '@aexoo-ai/spark-id'

const rawId = SecureId.generateRaw()
console.log(rawId) // "ybndrfg8ejkmcpqxot1uwisza345h769"
```

## Usage Patterns

### Object-Oriented Approach

```typescript
import { SecureId } from '@aexoo-ai/spark-id'

// Create instances
const userId = new SecureId(undefined, 'USER')
const txnId = new SecureId(undefined, 'TXN')

// Use in objects
const user = {
  id: userId.full,
  name: 'John Doe',
  email: 'john@example.com'
}

const transaction = {
  id: txnId.full,
  amount: 100.50,
  userId: userId.full
}

// Compare IDs
console.log(userId.equals(txnId)) // false
console.log(userId.equals(userId)) // true
```

### Functional Approach

```typescript
import { generateId, createId, isValidId, parseId } from '@aexoo-ai/spark-id'

// Generate IDs
const userId = generateId('USER')
const txnId = generateId('TXN')

// Create instances
const userSecureId = createId('USER')
const txnSecureId = createId('TXN')

// Validate and parse
if (isValidId(userId)) {
  const parsed = parseId(userId)
  console.log('User prefix:', parsed.prefix)
  console.log('User ID:', parsed.id)
}
```

### Database Integration

```typescript
import { SecureId } from '@aexoo-ai/spark-id'

class UserService {
  async createUser(userData: any) {
    const userId = new SecureId(undefined, 'USER')
    
    const user = {
      id: userId.full,
      ...userData,
      createdAt: new Date()
    }
    
    await this.db.users.insert(user)
    return user
  }
  
  async findUser(id: string) {
    if (!SecureId.isValid(id)) {
      throw new Error('Invalid user ID format')
    }
    
    const parsed = SecureId.parse(id)
    if (parsed.prefix !== 'USER') {
      throw new Error('Not a user ID')
    }
    
    return await this.db.users.findOne({ id: parsed.id })
  }
}
```

## Performance Considerations

### Instance Creation

```typescript
import { SecureId } from '@aexoo-ai/spark-id'

// Performance test for instance creation
const start = Date.now()
const instances = Array.from({ length: 1000 }, () => new SecureId(undefined, 'USER'))
const end = Date.now()

console.log(`Created ${instances.length} instances in ${end - start}ms`)
// Typically creates 1000+ instances per second
```

### Method Performance

```typescript
import { SecureId } from '@aexoo-ai/spark-id'

const secureId = new SecureId(undefined, 'USER')
const otherId = new SecureId(undefined, 'TXN')

// Performance test for equals method
const start = Date.now()
for (let i = 0; i < 10000; i++) {
  secureId.equals(otherId)
}
const end = Date.now()

console.log(`Performed ${10000} comparisons in ${end - start}ms`)
// Typically performs 100,000+ comparisons per second
```

## Related

- [Functions](/api/functions) - Function documentation
- [Types](/api/types) - Type definitions
- [ID Generation](/guide/id-generation) - Usage examples
- [Validation](/guide/validation) - Validation patterns
