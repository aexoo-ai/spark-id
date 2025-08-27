# Prefixes

Learn how to use prefixes effectively to organize and identify different types of IDs.

## What are Prefixes?

Prefixes are optional labels that help you categorize and identify different types of IDs in your application.

```typescript
import { generateId } from '@aexoo-ai/spark-id'

// Without prefix
const id = generateId() // "ybndrfg8ejkmcpqxot1uwisza345h769"

// With prefix
const userId = generateId('USER') // "USER_ybndrfg8ejkmcpqxot1uwisza345h769"
```

## Why Use Prefixes?

### 1. **Organization**
Prefixes help you organize different types of entities:

```typescript
const userId = generateId('USER')     // User accounts
const txnId = generateId('TXN')       // Transactions
const orderId = generateId('ORDER')   // Orders
const commentId = generateId('COMMENT') // Comments
```

### 2. **Debugging**
Prefixes make it easier to identify ID types in logs and databases:

```typescript
console.log('Processing user:', userId) // "Processing user: USER_ybndrfg8ejkmcpqxot1uwisza345h769"
console.log('Transaction ID:', txnId)   // "Transaction ID: TXN_ybndrfg8ejkmcpqxot1uwisza345h769"
```

### 3. **Database Queries**
Prefixes enable efficient filtering and searching:

```sql
-- Find all users
SELECT * FROM entities WHERE id LIKE 'USER_%'

-- Find all transactions
SELECT * FROM entities WHERE id LIKE 'TXN_%'
```

## Common Prefix Patterns

### Entity Types

```typescript
// User management
const userId = generateId('USER')
const adminId = generateId('ADMIN')
const guestId = generateId('GUEST')

// E-commerce
const productId = generateId('PRODUCT')
const orderId = generateId('ORDER')
const cartId = generateId('CART')
const paymentId = generateId('PAYMENT')

// Content management
const postId = generateId('POST')
const commentId = generateId('COMMENT')
const categoryId = generateId('CATEGORY')
const tagId = generateId('TAG')
```

### Business Domains

```typescript
// Financial
const txnId = generateId('TXN')
const invoiceId = generateId('INVOICE')
const receiptId = generateId('RECEIPT')

// Communication
const messageId = generateId('MSG')
const emailId = generateId('EMAIL')
const notificationId = generateId('NOTIF')

// System
const sessionId = generateId('SESSION')
const tokenId = generateId('TOKEN')
const logId = generateId('LOG')
```

## Prefix Naming Conventions

### Best Practices

```typescript
// ✅ Use UPPERCASE for consistency
const userId = generateId('USER')
const txnId = generateId('TXN')

// ✅ Use descriptive names
const orderId = generateId('ORDER')
const commentId = generateId('COMMENT')

// ✅ Keep prefixes short but clear
const productId = generateId('PRODUCT') // Good
const productItemId = generateId('PRODUCT_ITEM') // Too long
```

### Avoid These Patterns

```typescript
// ❌ Don't use lowercase (inconsistent)
const userId = generateId('user')

// ❌ Don't use generic names
const id1 = generateId('ID')
const obj1 = generateId('OBJ')

// ❌ Don't use abbreviations without context
const usrId = generateId('USR') // Unclear
const tId = generateId('T')     // Too short
```

## Working with Prefixed IDs

### Parsing

```typescript
import { parseId } from '@aexoo-ai/spark-id'

const prefixedId = 'USER_ybndrfg8ejkmcpqxot1uwisza345h769'
const parsed = parseId(prefixedId)

console.log(parsed.prefix) // "USER"
console.log(parsed.id)     // "ybndrfg8ejkmcpqxot1uwisza345h769"
console.log(parsed.full)   // "USER_ybndrfg8ejkmcpqxot1uwisza345h769"
```

### Validation

```typescript
import { isValidId } from '@aexoo-ai/spark-id'

// Validate prefixed IDs
console.log(isValidId('USER_ybndrfg8ejkmcpqxot1uwisza345h769')) // true
console.log(isValidId('TXN_ybndrfg8ejkmcpqxot1uwisza345h769'))  // true
console.log(isValidId('INVALID_ybndrfg8ejkmcpqxot1uwisza345h769')) // false (invalid characters)
```

### Filtering by Prefix

```typescript
// Filter IDs by prefix
const ids = [
  'USER_ybndrfg8ejkmcpqxot1uwisza345h769',
  'TXN_ybndrfg8ejkmcpqxot1uwisza345h769',
  'ORDER_ybndrfg8ejkmcpqxot1uwisza345h769'
]

const userIds = ids.filter(id => id.startsWith('USER_'))
const txnIds = ids.filter(id => id.startsWith('TXN_'))
```

## Advanced Prefix Patterns

### Hierarchical Prefixes

```typescript
// Use underscores for hierarchy
const productId = generateId('PRODUCT')
const productVariantId = generateId('PRODUCT_VARIANT')
const productImageId = generateId('PRODUCT_IMAGE')

// Database queries become more specific
// SELECT * FROM entities WHERE id LIKE 'PRODUCT_%'
// SELECT * FROM entities WHERE id LIKE 'PRODUCT_VARIANT_%'
```

### Environment-Specific Prefixes

```typescript
// Different prefixes for different environments
const devUserId = generateId('DEV_USER')
const testUserId = generateId('TEST_USER')
const prodUserId = generateId('PROD_USER')
```

### Version Prefixes

```typescript
// Version your prefixes
const v1UserId = generateId('V1_USER')
const v2UserId = generateId('V2_USER')
```

## Database Integration

### Indexing

```sql
-- Create indexes for efficient prefix queries
CREATE INDEX idx_entity_prefix ON entities (id) WHERE id LIKE 'USER_%';
CREATE INDEX idx_entity_prefix ON entities (id) WHERE id LIKE 'TXN_%';
```

### Partitioning

```sql
-- Partition tables by prefix
CREATE TABLE entities (
  id VARCHAR(50) PRIMARY KEY,
  data JSONB
) PARTITION BY LIST (LEFT(id, 5));

CREATE TABLE entities_user PARTITION OF entities
  FOR VALUES IN ('USER_');

CREATE TABLE entities_txn PARTITION OF entities
  FOR VALUES IN ('TXN_');
```

## Performance Considerations

### Prefix Length

```typescript
// ✅ Good: Short, clear prefixes
const userId = generateId('USER')
const txnId = generateId('TXN')

// ❌ Avoid: Very long prefixes
const veryLongPrefixId = generateId('VERY_LONG_PREFIX_NAME')
```

### Query Optimization

```typescript
// Efficient prefix queries
const userIds = entities.filter(entity => entity.id.startsWith('USER_'))

// Less efficient (requires full scan)
const userIds = entities.filter(entity => entity.id.includes('USER'))
```

## Related

- [ID Generation](/guide/id-generation) - Learn about generating IDs
- [Validation](/guide/validation) - Validate prefixed IDs
- [Examples](/examples/) - See real-world prefix usage
- [API Reference](/api/) - Complete API documentation
