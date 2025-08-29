# Configuration

Learn how to customize Spark-ID generation and formatting using global and per-call configuration.

## Overview

Spark-ID supports both:

- Global configuration: affects all subsequent calls
- Per-call overrides: passed to individual functions

## Global Configuration

Use `configure()` to set process-wide defaults. Retrieve or reset with `getConfig()` and `resetConfig()`.

```typescript
import { configure, getConfig, resetConfig, generateId } from '@aexoo-ai/spark-id'

// Set defaults
configure({
  case: 'upper',           // 'upper' | 'lower' | 'mixed'
  separator: '_',          // e.g., '_' or '-'
  entropyBits: 72,         // default 72
  maxPrefixLength: 20,     // default 20
})

const id = generateId('USER')  // Uses the configured defaults
console.log(getConfig())       // Inspect current config

resetConfig()                  // Revert to library defaults
```

## Per-call Overrides

Pass a partial `SparkIdConfig` to functions to override specific settings:

```typescript
import { generateId, createId, isValidId, parseId } from '@aexoo-ai/spark-id'

// Lowercase IDs and dash separator for this call only
const id = generateId('user', { case: 'lower', separator: '-' })

// Create instance with custom alphabet (must be length 32 for base32)
const instance = createId('TXN', { alphabet: 'abcdefghijklmnopqrstuvwxyz23456789' })

// Validation/parsing with a custom separator
const ok = isValidId('USER-ABC123', { separator: '-' })
const parsed = parseId('USER-ABC123', { separator: '-' })
```

## Available Options (SparkIdConfig)

```ts
interface SparkIdConfig {
  // Core generation
  alphabet?: string
  entropyBits?: number
  length?: number

  // Formatting
  maxPrefixLength?: number
  separator?: string
  case?: 'upper' | 'lower' | 'mixed'

  // Advanced (reserved for future)
  encoding?: 'base32' | 'base64' | 'hex' | 'custom'
  timestamp?: boolean
  machineId?: string | number
}
```

Notes:
- When using base32 encoding, `alphabet` must contain exactly 32 characters; otherwise an error is thrown.
- `case` applies to both the raw ID and the prefix formatting.
- `separator` is used between prefix and ID when a prefix is supplied.

## Examples

### Uppercase with underscore (default)

```ts
configure({ case: 'upper', separator: '_' })
const id = generateId('USER') // USER_...
```

### Lowercase with dash, per-call

```ts
const id = generateId('user', { case: 'lower', separator: '-' }) // user-...
```

### Custom alphabet (base32)

```ts
const alphabet = 'abcdefghijklmnopqrstuvwxyz23456789'
const id = generateId(undefined, { alphabet })
```

### Batch generation with overrides

```ts
import { generateMultiple, generateUnique } from '@aexoo-ai/spark-id'

const batch = generateMultiple(10, 'ORDER', { case: 'upper' })
const unique = generateUnique(100, 'TXN', { separator: '-' })
```

## Error Handling

- Invalid prefix: throws `InvalidPrefixError`
- Invalid ID: throws `InvalidIdError`
- Invalid alphabet (not 32 chars for base32): throws `SparkIdError` with code `INVALID_ALPHABET`
- Invalid count for batch generation: throws `SparkIdError` with codes like `INVALID_COUNT`, `COUNT_TOO_LARGE`

## See also

- [API Reference](/api/)
- [Functions](/api/functions)
- [Types](/api/types)
- [ID Generation](/guide/id-generation)
