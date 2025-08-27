# Quick Start

Get up and running with Spark-ID in under 5 minutes!

## 1. Install

```bash
npm install @aexoo-ai/spark-id
```

## 2. Generate Your First ID

```typescript
import { generateId } from '@aexoo-ai/spark-id'

const id = generateId()
console.log(id) // "ybndrfg8ejkmcpqxot1uwisza345h769"
```

## 3. Add a Prefix

```typescript
const userId = generateId('USER')
console.log(userId) // "USER_ybndrfg8ejkmcpqxot1uwisza345h769"
```

## 4. Validate IDs

```typescript
import { isValidId } from '@aexoo-ai/spark-id'

console.log(isValidId(userId)) // true
console.log(isValidId('invalid-id')) // false
```

## 5. Use in Your Project

```typescript
// Database example
const user = {
  id: generateId('USER'),
  name: 'John Doe',
  email: 'john@example.com'
}

// API response example
const response = {
  id: generateId('TXN'),
  amount: 100.50,
  status: 'completed'
}
```

## That's it! 🎉

You're now ready to use Spark-ID in your project. The IDs you generate are:

- ✅ **Cryptographically secure**
- ✅ **URL-safe**
- ✅ **Human-readable**
- ✅ **Collision-resistant**

## Next Steps

- [Full Guide](/guide/getting-started) - Learn all features
- [API Reference](/api/) - Complete documentation
- [Examples](/examples/) - Real-world usage patterns
