# Getting Started

## What is Spark-ID?

Spark-ID is a cryptographically secure, URL-safe ID generator designed for modern applications. It generates unique, human-readable identifiers that are perfect for databases, APIs, and distributed systems.

### Key Features

- 🔐 **Cryptographically Secure**: Uses Node.js `crypto.randomBytes()` for true randomness
- 🌐 **URL-Safe**: Z-Base32 encoding avoids commonly confused characters
- 🏷️ **Prefix Support**: Add meaningful prefixes like `USER_`, `TXN_`, `ORDER_`
- ⚡ **High Performance**: Generates 1000+ IDs per second
- 🛠️ **TypeScript Ready**: Full type support with comprehensive definitions
- 🔍 **Built-in Validation**: Validate, parse, and compare IDs with ease

## Installation

Choose your package manager:

::: code-group

```bash [npm]
npm install @aexoo-ai/spark-id
```

```bash [pnpm]
pnpm add @aexoo-ai/spark-id
```

```bash [yarn]
yarn add @aexoo-ai/spark-id
```

:::

## Quick Start

### Basic Usage

```typescript
import { generateId, createId, isValidId } from '@aexoo-ai/spark-id';

// Generate a simple ID
const id = generateId();
console.log(id); // "ybndrfg8ejkmcpqxot1uwisza345h769"

// Generate with prefix
const userId = generateId('USER');
console.log(userId); // "USER_ybndrfg8ejkmcpqxot1uwisza345h769"

// Validate an ID
console.log(isValidId(userId)); // true
console.log(isValidId('invalid-id')); // false
```

### Using SecureId Class

```typescript
import { SecureId } from '@aexoo-ai/spark-id';

// Create a new SecureId instance
const secureId = new SecureId();
console.log(secureId.id); // "ybndrfg8ejkmcpqxot1uwisza345h769"
console.log(secureId.full); // "ybndrfg8ejkmcpqxot1uwisza345h769"

// Create with prefix
const userSecureId = new SecureId(undefined, 'USER');
console.log(userSecureId.full); // "USER_ybndrfg8ejkmcpqxot1uwisza345h769"
console.log(userSecureId.prefix); // "USER"
console.log(userSecureId.id); // "ybndrfg8ejkmcpqxot1uwisza345h769"

// Create from existing ID
const existingId = new SecureId('ybndrfg8ejkmcpqxot1uwisza345h769');
console.log(existingId.id); // "ybndrfg8ejkmcpqxot1uwisza345h769"
```

### Validation and Parsing

```typescript
import { isValidId, parseId } from '@aexoo-ai/spark-id';

// Validate IDs
console.log(isValidId('ybndrfg8ejkmcpqxot1uwisza345h769')); // true
console.log(isValidId('USER_ybndrfg8ejkmcpqxot1uwisza345h769')); // true
console.log(isValidId('invalid-id')); // false

// Parse IDs
const parsed1 = parseId('ybndrfg8ejkmcpqxot1uwisza345h769');
console.log(parsed1);
// { id: 'ybndrfg8ejkmcpqxot1uwisza345h769', full: 'ybndrfg8ejkmcpqxot1uwisza345h769' }

const parsed2 = parseId('USER_ybndrfg8ejkmcpqxot1uwisza345h769');
console.log(parsed2);
// { prefix: 'USER', id: 'ybndrfg8ejkmcpqxot1uwisza345h769', full: 'USER_ybndrfg8ejkmcpqxot1uwisza345h769' }
```

## Command Line Interface

Spark-ID also includes a powerful CLI tool:

```bash
# Install globally
npm install -g @aexoo-ai/spark-id

# Generate a single ID
spark-id

# Generate with prefix
spark-id -p USER

# Generate multiple IDs
spark-id -c 5

# Generate multiple IDs with prefix
spark-id -p TXN -c 3

# Validate an ID
spark-id -v USER_ybndrfg8ejkmcpqxot1uwisza345h769

# Parse an ID
spark-id --parse USER_ybndrfg8ejkmcpqxot1uwisza345h769

# JSON output
spark-id -c 3 -f json

# CSV output
spark-id -c 3 -f csv
```

## ID Format

Spark-ID generates IDs using the following format:

### Simple IDs

```
ybndrfg8ejkmcpqxot1uwisza345h769
```

### Prefixed IDs

```
PREFIX_ybndrfg8ejkmcpqxot1uwisza345h769
```

### Characteristics

- **Length**: 12-15 characters (depending on encoding)
- **Alphabet**: Z-Base32 (`ybndrfg8ejkmcpqxot1uwisza345h769`)
- **Entropy**: 72 bits (9 bytes)
- **Collision Resistance**: Extremely high
- **URL-Safe**: No special characters that need encoding

### Z-Base32 Alphabet

Spark-ID uses Z-Base32 encoding which avoids commonly confused characters:

- ❌ No `0` (zero) - confused with `O`
- ❌ No `O` (capital O) - confused with `0`
- ❌ No `1` (one) - confused with `I`
- ❌ No `I` (capital I) - confused with `1`
- ❌ No `8` (eight) - confused with `B`
- ❌ No `B` (capital B) - confused with `8`

This makes IDs more human-readable and reduces errors in manual entry.

## Next Steps

Now that you have the basics, explore:

- [ID Generation](/guide/id-generation) - Learn about different generation methods
- [Prefixes](/guide/prefixes) - Organize your IDs with meaningful prefixes
- [Validation](/guide/validation) - Validate and parse IDs
- [Security](/guide/security) - Understand the security features
- [Examples](/examples/) - See real-world usage patterns
- [API Reference](/api/) - Complete API documentation
