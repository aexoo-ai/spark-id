# Spark-ID 🔥

[![npm version](https://img.shields.io/npm/v/@aexoo-ai/spark-id.svg)](https://www.npmjs.com/package/@aexoo-ai/spark-id)
[![npm downloads](https://img.shields.io/npm/dm/@aexoo-ai/spark-id.svg)](https://www.npmjs.com/package/@aexoo-ai/spark-id)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**Cryptographically secure, URL-safe ID generator with prefix support**

Spark-ID generates cryptographically secure, URL-safe identifiers that are perfect for databases, APIs, and distributed systems. Built with TypeScript and optimized for performance.

## ✨ Features

- 🔐 **Cryptographically Secure** - Uses Node.js crypto for true randomness
- 🌐 **URL-Safe** - Z-Base32 encoding, no special characters
- 🏷️ **Prefix Support** - Add meaningful prefixes like `USER_`, `TXN_`, `ORDER_`
- ⚡ **High Performance** - Optimized for speed and memory efficiency
- 🛡️ **TypeScript First** - Full type safety and IntelliSense support
- 🔧 **CLI Tool** - Generate IDs from command line
- 📦 **Zero Dependencies** - Lightweight and secure
- 🧪 **Well Tested** - Comprehensive test suite

## 🚀 Quick Start

### Installation

```bash
npm install @aexoo-ai/spark-id
```

### Multiple Import Options

```typescript
// ESM (recommended)
import { generateId, sparkId, isValidId, parseId } from '@aexoo-ai/spark-id';

// CommonJS
const {
  generateId,
  sparkId,
  isValidId,
  parseId,
} = require('@aexoo-ai/spark-id');

// Specific entry points
import { generateId } from '@aexoo-ai/spark-id/esm';
const { generateId } = require('@aexoo-ai/spark-id/cjs');

// Spark-ID specific entry point
import { sparkId } from '@aexoo-ai/spark-id/spark-id';
```

### Basic Usage

```typescript
import { generateId, sparkId, isValidId, parseId } from '@aexoo-ai/spark-id';

// Generate a simple ID
const id = generateId();
console.log(id); // "YBNDRFG8EJKMCPQXOT1UWISZA345H769"

// Alternative function name
const id2 = sparkId();
console.log(id2); // "YBNDRFG8EJKMCPQXOT1UWISZA345H769"

// Generate with prefix
const userId = generateId('USER');
console.log(userId); // "USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769"

// Validate an ID
console.log(isValidId(userId)); // true

// Parse an ID
const parsed = parseId(userId);
console.log(parsed.prefix); // "USER"
console.log(parsed.id); // "YBNDRFG8EJKMCPQXOT1UWISZA345H769"
```

### CLI Usage

```bash
# Install globally
npm install -g @aexoo-ai/spark-id

# Generate IDs
spark-id                    # Simple ID
spark-id -p USER           # With prefix
spark-id -c 5              # Multiple IDs
spark-id -v USER_123       # Validate ID
```

## 📖 Documentation

- **[Getting Started](https://aexoo-ai.github.io/spark-id/guide/getting-started)** - Quick setup guide
- **[API Reference](https://aexoo-ai.github.io/spark-id/api/)** - Complete API documentation
- **[Examples](https://aexoo-ai.github.io/spark-id/examples/)** - Real-world usage patterns
- **[CLI Guide](https://aexoo-ai.github.io/spark-id/cli/)** - Command-line interface
- **[Security](https://aexoo-ai.github.io/spark-id/guide/security)** - Security considerations

## 🎯 Use Cases

### Database Primary Keys

```typescript
import { generateId } from '@aexoo-ai/spark-id';

// Create user with secure ID
const user = {
  id: generateId('USER'),
  name: 'John Doe',
  email: 'john@example.com',
};

// Create transaction
const transaction = {
  id: generateId('TXN'),
  userId: user.id,
  amount: 100.5,
  status: 'completed',
};
```

### Enhanced Features

```typescript
import {
  generateId,
  generateIdSafe,
  validateId,
  generateMultiple,
  generateUnique,
  SecureId,
} from '@aexoo-ai/spark-id';

// Safe generation with error handling
const result = generateIdSafe('USER');
if (result.success) {
  console.log('Generated ID:', result.id);
} else {
  console.error('Error:', result.error);
}

// Detailed validation
const validation = validateId('USER_123456789');
console.log(validation);
// { isValid: false, error: 'Invalid ID format', code: 'INVALID_FORMAT' }

// Generate multiple IDs
const ids = generateMultiple(5, 'BATCH');
console.log(ids); // Array of 5 IDs

// Generate unique IDs
const uniqueIds = generateUnique(10, 'UNIQUE');
console.log(uniqueIds); // Set of 10 unique IDs

// Using the SecureId class
const secureId = new SecureId(undefined, 'CLASS');
console.log(secureId.toString()); // "CLASS_..."
console.log(secureId.getStats()); // Statistics about the ID
console.log(secureId.validate()); // Validation result
```

### Configuration System

```typescript
import {
  generateId,
  configure,
  getConfig,
  resetConfig,
} from '@aexoo-ai/spark-id';

// Global configuration
configure({
  maxPrefixLength: 10,
  separator: '-',
  case: 'lower',
  entropyBits: 48,
});

// Generate with global config
const id1 = generateId('USER'); // "user-abc123"

// Per-call configuration (overrides global)
const id2 = generateId('TEST', {
  alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUV',
  entropyBits: 32,
  separator: '=',
  case: 'upper',
}); // "TEST=ABC123"

// Get current configuration
console.log(getConfig());

// Reset to defaults
resetConfig();
```

#### Configuration Options

| Option            | Type                                        | Default                              | Description                                   |
| ----------------- | ------------------------------------------- | ------------------------------------ | --------------------------------------------- |
| `alphabet`        | `string`                                    | `'yvndrfg9ejkmcpqxwt2uwxsza345h769'` | Character set for encoding (must be 32 chars) |
| `entropyBits`     | `number`                                    | `72`                                 | Security level in bits (9 bytes)              |
| `maxPrefixLength` | `number`                                    | `20`                                 | Maximum prefix length                         |
| `separator`       | `string`                                    | `'_'`                                | Prefix separator character                    |
| `case`            | `'upper' \| 'lower' \| 'mixed'`             | `'upper'`                            | Output case formatting                        |
| `encoding`        | `'base32' \| 'base64' \| 'hex' \| 'custom'` | `'base32'`                           | Encoding method                               |
| `timestamp`       | `boolean`                                   | `false`                              | Include timestamp component                   |
| `machineId`       | `string \| number`                          | `undefined`                          | Machine/instance identifier                   |

### Error Handling

```typescript
import {
  generateId,
  SparkIdError,
  InvalidPrefixError,
  InvalidIdError,
} from '@aexoo-ai/spark-id';

try {
  const id = generateId('invalid-prefix!');
} catch (error) {
  if (error instanceof InvalidPrefixError) {
    console.error('Invalid prefix:', error.message);
    console.error('Error code:', error.code); // 'INVALID_PREFIX'
  }
}

try {
  const parsed = parseId('invalid-id!');
} catch (error) {
  if (error instanceof InvalidIdError) {
    console.error('Invalid ID:', error.message);
    console.error('Error code:', error.code); // 'INVALID_ID'
  }
}
```

### API Endpoints

```typescript
import { generateId, isValidId } from '@aexoo-ai/spark-id';

// Express.js route
app.post('/users', (req, res) => {
  const userId = generateId('USER');
  const user = { id: userId, ...req.body };
  res.status(201).json(user);
});

// Validation middleware
app.get('/users/:id', (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  // Process request...
});
```

### Bulk Operations

```typescript
import { generateId } from '@aexoo-ai/spark-id';

// Generate multiple IDs efficiently
const userIds = Array.from({ length: 1000 }, () => generateId('USER'));
const txnIds = Array.from({ length: 500 }, () => generateId('TXN'));

// All IDs are unique and secure
console.log(new Set(userIds).size); // 1000 (no duplicates)
```

## 🔧 API Reference

### Core Functions

| Function              | Description              | Example                 |
| --------------------- | ------------------------ | ----------------------- |
| `generateId(prefix?)` | Generate a new ID        | `generateId('USER')`    |
| `isValidId(id)`       | Validate ID format       | `isValidId('USER_123')` |
| `parseId(id)`         | Parse ID components      | `parseId('USER_123')`   |
| `createId(prefix?)`   | Create SecureId instance | `createId('TXN')`       |

### SecureId Class

```typescript
import { SecureId } from '@aexoo-ai/spark-id';

const secureId = new SecureId(undefined, 'USER');
console.log(secureId.id); // "YBNDRFG8EJKMCPQXOT1UWISZA345H769"
console.log(secureId.prefix); // "USER"
console.log(secureId.full); // "USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769"

// Compare IDs
const id1 = new SecureId('abc123');
const id2 = new SecureId('abc123');
console.log(id1.equals(id2)); // true
```

## 🛠️ CLI Commands

```bash
# Generate IDs
spark-id                    # Simple ID
spark-id -p USER           # With prefix
spark-id -c 5              # Multiple IDs
spark-id --json            # JSON output
spark-id --compact         # Comma-separated

# Validation
spark-id -v USER_123       # Validate single ID
spark-id --parse USER_123  # Parse ID components

# Help
spark-id --help            # Show all options
spark-id --version         # Show version
```

## 🔒 Security Features

- **Cryptographic Randomness** - Uses Node.js `crypto.randomBytes()`
- **Collision Resistant** - 128-bit entropy (2^128 possible values)
- **No Sequential Patterns** - Each ID is completely random
- **URL-Safe Encoding** - Z-Base32 alphabet, no special characters
- **Prefix Validation** - Ensures safe prefix characters

## 📊 Performance

```typescript
// Generate 10,000 IDs in ~15ms
const start = Date.now();
const ids = Array.from({ length: 10000 }, () => generateId());
const end = Date.now();
console.log(`Generated ${ids.length} IDs in ${end - start}ms`);

// Validate 100,000 IDs in ~8ms
const testIds = Array.from({ length: 100000 }, () => generateId('TEST'));
const start = Date.now();
const results = testIds.map(isValidId);
const end = Date.now();
console.log(`Validated ${testIds.length} IDs in ${end - start}ms`);
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📦 Installation Options

### npm

```bash
npm install @aexoo-ai/spark-id
```

### pnpm

```bash
pnpm add @aexoo-ai/spark-id
```

### yarn

```bash
yarn add @aexoo-ai/spark-id
```

### Global CLI

```bash
npm install -g @aexoo-ai/spark-id
```

### Using npx (no installation)

```bash
npx @aexoo-ai/spark-id
```

## 🌐 Browser Support

For browser usage, you'll need to polyfill the Node.js crypto module:

### Webpack

```javascript
module.exports = {
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
    },
  },
};
```

### Vite

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
    },
  },
});
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/aexoo-ai/spark-id.git
cd spark-id

# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build

# Start documentation
npm run docs:dev
```

### Publishing

For information on how to publish new versions to npm, see [PUBLISHING.md](internal/development/publishing-guide.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [nanoid](https://github.com/ai/nanoid) and [ulid](https://github.com/ulid/spec)
- Z-Base32 encoding for URL-safe characters
- Node.js crypto module for secure randomness
- Meets AEXOO requirements

## 📞 Support

- 📖 [Documentation](https://aexoo-ai.github.io/spark-id/)
- 🐛 [Issue Tracker](https://github.com/aexoo-ai/spark-id/issues)
- 💬 [Discussions](https://github.com/aexoo-ai/spark-id/discussions)
- 📧 [Email](mailto:info@aexoo.com)

---

**Made with ❤️ by [ÆXꝎ](https://aexoo.com)**
