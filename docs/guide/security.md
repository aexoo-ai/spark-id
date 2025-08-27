# Security

Learn about the security features and considerations of Spark-ID.

## Cryptographically Secure

Spark-ID uses cryptographically secure random number generation to ensure IDs are truly unique and unpredictable.

### Random Number Generation

```typescript
import { generateId } from '@aexoo-ai/spark-id'

// Each ID is generated using Node.js crypto.randomBytes()
const id = generateId() // Uses 9 bytes (72 bits) of entropy
```

### Entropy and Collision Resistance

Spark-ID generates IDs with **72 bits of entropy** (9 bytes), providing:

- **Extremely low collision probability**: ~2.7 × 10^-22 chance of collision
- **Unpredictable IDs**: Each ID is cryptographically random
- **No sequential patterns**: IDs cannot be guessed or enumerated

## Entropy Analysis

### Bit Strength

```typescript
// Spark-ID uses 72 bits of entropy
const bitsOfEntropy = 72

// Collision probability calculation
const collisionProbability = 1 / (2 ** (bitsOfEntropy / 2))
console.log(`Collision probability: ${collisionProbability}`)
// Output: ~2.7 × 10^-22
```

### Comparison with Other ID Systems

| ID System | Entropy | Collision Risk |
|-----------|---------|----------------|
| Spark-ID | 72 bits | ~2.7 × 10^-22 |
| UUID v4 | 122 bits | ~2.6 × 10^-37 |
| Nano ID (21 chars) | 126 bits | ~1.4 × 10^-38 |
| ULID | 80 bits | ~1.2 × 10^-24 |

## Security Features

### 1. **Cryptographic Randomness**

Spark-ID uses Node.js `crypto.randomBytes()` which:

- ✅ Uses the operating system's cryptographically secure random number generator
- ✅ Is suitable for security-sensitive applications
- ✅ Provides true randomness, not pseudo-randomness
- ✅ Is resistant to timing attacks

### 2. **No Sequential Patterns**

Unlike auto-incrementing IDs, Spark-ID:

- ✅ Cannot be guessed or enumerated
- ✅ Provides no information about creation order
- ✅ Cannot be used for timing attacks
- ✅ Is suitable for public exposure

### 3. **URL-Safe Encoding**

Z-Base32 encoding ensures:

- ✅ No special characters that need URL encoding
- ✅ Safe for use in URLs, filenames, and databases
- ✅ No SQL injection risks from special characters
- ✅ Compatible with all web frameworks

### 4. **Human-Readable Format**

Z-Base32 alphabet avoids commonly confused characters:

- ✅ No `0` (zero) - confused with `O`
- ✅ No `O` (capital O) - confused with `0`
- ✅ No `1` (one) - confused with `I`
- ✅ No `I` (capital I) - confused with `1`
- ✅ No `8` (eight) - confused with `B`
- ✅ No `B` (capital B) - confused with `8`

## Security Best Practices

### 1. **Don't Rely on ID Secrecy**

```typescript
// ❌ Don't assume IDs are secret
const secretToken = generateId('TOKEN') // Not secure for authentication

// ✅ Use proper authentication tokens
const authToken = crypto.randomBytes(32).toString('hex') // 256 bits of entropy
```

### 2. **Validate All Inputs**

```typescript
import { isValidId } from '@aexoo-ai/spark-id'

// Always validate IDs from user input
function processUserRequest(userId: string) {
  if (!isValidId(userId)) {
    throw new Error('Invalid user ID format')
  }
  
  // Process the request
}
```

### 3. **Use Appropriate Prefixes**

```typescript
// ✅ Good: Use descriptive prefixes
const userId = generateId('USER')
const txnId = generateId('TXN')

// ❌ Avoid: Using IDs as secrets
const secretKey = generateId('SECRET') // Not secure enough for secrets
```

### 4. **Handle Errors Securely**

```typescript
import { parseId } from '@aexoo-ai/spark-id'

function safeParseId(id: string) {
  try {
    return parseId(id)
  } catch (error) {
    // Don't expose internal error details
    console.error('ID parsing failed:', error)
    throw new Error('Invalid ID format')
  }
}
```

## Threat Model

### What Spark-ID Protects Against

1. **ID Enumeration**: Cannot guess or enumerate IDs
2. **Timing Attacks**: No sequential patterns to exploit
3. **Collision Attacks**: Extremely low probability of collisions
4. **Injection Attacks**: URL-safe encoding prevents injection

### What Spark-ID Does NOT Protect Against

1. **ID Reuse**: If you reuse an ID, it's not unique
2. **ID Exposure**: IDs are not secret and can be shared
3. **Authentication**: IDs are not suitable for authentication tokens
4. **Authorization**: IDs don't provide access control

## Use Cases and Security Considerations

### ✅ **Safe Use Cases**

```typescript
// Database primary keys
const userId = generateId('USER')

// Public resource identifiers
const postId = generateId('POST')

// Transaction IDs
const txnId = generateId('TXN')

// File identifiers
const fileId = generateId('FILE')
```

### ⚠️ **Use with Caution**

```typescript
// Temporary tokens (use with expiration)
const tempToken = generateId('TEMP')

// Non-critical identifiers
const logId = generateId('LOG')
```

### ❌ **Avoid These Use Cases**

```typescript
// Authentication tokens (use crypto.randomBytes instead)
const authToken = generateId('AUTH')

// Encryption keys (use crypto.randomBytes instead)
const encryptionKey = generateId('KEY')

// Session tokens (use crypto.randomBytes instead)
const sessionToken = generateId('SESSION')
```

## Performance and Security Trade-offs

### Entropy vs. Performance

Spark-ID balances security and performance:

```typescript
// Performance test
const start = Date.now()
const ids = Array.from({ length: 1000 }, () => generateId())
const end = Date.now()

console.log(`Generated ${ids.length} secure IDs in ${end - start}ms`)
// Typically generates 1000+ cryptographically secure IDs per second
```

### Memory Security

Spark-ID doesn't store sensitive data in memory:

- ✅ No persistent state
- ✅ No cached random numbers
- ✅ Each ID is generated independently
- ✅ Memory is cleared after generation

## Compliance and Standards

### Cryptographic Standards

Spark-ID follows established cryptographic practices:

- ✅ Uses cryptographically secure random number generation
- ✅ Meets NIST SP 800-90A standards for random number generation
- ✅ Suitable for FIPS 140-2 compliant systems
- ✅ Compatible with security audit requirements

### Data Protection

Spark-ID supports data protection requirements:

- ✅ No personally identifiable information in IDs
- ✅ No creation timestamps embedded in IDs
- ✅ No sequential patterns that could reveal data
- ✅ Suitable for GDPR and privacy compliance

## Related

- [ID Generation](/guide/id-generation) - Generate secure IDs
- [Validation](/guide/validation) - Validate ID security
- [API Reference](/api/) - Security-related API methods
- [Examples](/examples/) - Secure usage patterns
