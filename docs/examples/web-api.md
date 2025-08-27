# Web API Examples

Express.js integration for web applications with Spark-ID.

## Basic Express.js Setup

```typescript
import express from 'express';
import { generateId, isValidId, parseId } from '@aexoo-ai/spark-id';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Middleware

### ID Validation Middleware

```typescript
import { isValidId } from '@aexoo-ai/spark-id';

// Middleware to validate ID parameters
function validateIdParam(req: any, res: any, next: any) {
  const id = req.params.id;

  if (!isValidId(id)) {
    return res.status(400).json({
      error: 'Invalid ID format',
      message: 'ID must be a valid Spark-ID format',
      received: id,
    });
  }

  next();
}

// Middleware to validate specific prefix
function validatePrefix(prefix: string) {
  return (req: any, res: any, next: any) => {
    const id = req.params.id;

    if (!isValidId(id)) {
      return res.status(400).json({
        error: 'Invalid ID format',
        message: 'ID must be a valid Spark-ID format',
        received: id,
      });
    }

    const parsed = parseId(id);
    if (parsed.prefix !== prefix) {
      return res.status(400).json({
        error: 'Invalid ID type',
        message: `Expected ${prefix} ID, got ${parsed.prefix || 'no prefix'}`,
        received: id,
      });
    }

    next();
  };
}
```

## Route Handlers

### User Routes

```typescript
// In-memory storage for examples
const users = new Map<string, any>();
const transactions = new Map<string, any>();
const posts = new Map<string, any>();

// GET /users - List all users
app.get('/users', (req, res) => {
  const userList = Array.from(users.values());
  res.json({
    users: userList,
    count: userList.length,
  });
});

// POST /users - Create a new user
app.post('/users', (req, res) => {
  const userId = generateId('USER');
  const user = {
    id: userId,
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  users.set(userId, user);

  res.status(201).json({
    message: 'User created successfully',
    user,
  });
});

// GET /users/:id - Get a specific user
app.get('/users/:id', validatePrefix('USER'), (req, res) => {
  const user = users.get(req.params.id);

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      message: 'No user found with the specified ID',
    });
  }

  res.json({ user });
});

// PUT /users/:id - Update a user
app.put('/users/:id', validatePrefix('USER'), (req, res) => {
  const user = users.get(req.params.id);

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      message: 'No user found with the specified ID',
    });
  }

  const updatedUser = {
    ...user,
    ...req.body,
    updatedAt: new Date(),
  };

  users.set(req.params.id, updatedUser);

  res.json({
    message: 'User updated successfully',
    user: updatedUser,
  });
});

// DELETE /users/:id - Delete a user
app.delete('/users/:id', validatePrefix('USER'), (req, res) => {
  const user = users.get(req.params.id);

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      message: 'No user found with the specified ID',
    });
  }

  users.delete(req.params.id);

  res.json({
    message: 'User deleted successfully',
    user,
  });
});
```

### Transaction Routes

```typescript
// GET /transactions - List all transactions
app.get('/transactions', (req, res) => {
  const transactionList = Array.from(transactions.values());
  res.json({
    transactions: transactionList,
    count: transactionList.length,
  });
});

// POST /transactions - Create a new transaction
app.post('/transactions', (req, res) => {
  const txnId = generateId('TXN');
  const transaction = {
    id: txnId,
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  transactions.set(txnId, transaction);

  res.status(201).json({
    message: 'Transaction created successfully',
    transaction,
  });
});

// GET /transactions/:id - Get a specific transaction
app.get('/transactions/:id', validatePrefix('TXN'), (req, res) => {
  const transaction = transactions.get(req.params.id);

  if (!transaction) {
    return res.status(404).json({
      error: 'Transaction not found',
      message: 'No transaction found with the specified ID',
    });
  }

  res.json({ transaction });
});

// GET /users/:id/transactions - Get transactions for a user
app.get('/users/:id/transactions', validatePrefix('USER'), (req, res) => {
  const user = users.get(req.params.id);

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      message: 'No user found with the specified ID',
    });
  }

  const userTransactions = Array.from(transactions.values()).filter(
    (t) => t.userId === req.params.id
  );

  res.json({
    transactions: userTransactions,
    count: userTransactions.length,
  });
});
```

### Post Routes

```typescript
// GET /posts - List all posts
app.get('/posts', (req, res) => {
  const postList = Array.from(posts.values());
  res.json({
    posts: postList,
    count: postList.length,
  });
});

// POST /posts - Create a new post
app.post('/posts', (req, res) => {
  const postId = generateId('POST');
  const post = {
    id: postId,
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  posts.set(postId, post);

  res.status(201).json({
    message: 'Post created successfully',
    post,
  });
});

// GET /posts/:id - Get a specific post
app.get('/posts/:id', validatePrefix('POST'), (req, res) => {
  const post = posts.get(req.params.id);

  if (!post) {
    return res.status(404).json({
      error: 'Post not found',
      message: 'No post found with the specified ID',
    });
  }

  res.json({ post });
});

// GET /users/:id/posts - Get posts by a user
app.get('/users/:id/posts', validatePrefix('USER'), (req, res) => {
  const user = users.get(req.params.id);

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      message: 'No user found with the specified ID',
    });
  }

  const userPosts = Array.from(posts.values()).filter(
    (p) => p.userId === req.params.id
  );

  res.json({
    posts: userPosts,
    count: userPosts.length,
  });
});
```

## Bulk Operations

### Bulk Creation

```typescript
// POST /users/bulk - Create multiple users
app.post('/users/bulk', (req, res) => {
  const { users: userDataArray } = req.body;

  if (!Array.isArray(userDataArray)) {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'users must be an array',
    });
  }

  const createdUsers = [];

  for (const userData of userDataArray) {
    const userId = generateId('USER');
    const user = {
      id: userId,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.set(userId, user);
    createdUsers.push(user);
  }

  res.status(201).json({
    message: `${createdUsers.length} users created successfully`,
    users: createdUsers,
  });
});

// POST /transactions/bulk - Create multiple transactions
app.post('/transactions/bulk', (req, res) => {
  const { transactions: transactionDataArray } = req.body;

  if (!Array.isArray(transactionDataArray)) {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'transactions must be an array',
    });
  }

  const createdTransactions = [];

  for (const transactionData of transactionDataArray) {
    const txnId = generateId('TXN');
    const transaction = {
      id: txnId,
      ...transactionData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    transactions.set(txnId, transaction);
    createdTransactions.push(transaction);
  }

  res.status(201).json({
    message: `${createdTransactions.length} transactions created successfully`,
    transactions: createdTransactions,
  });
});
```

### Bulk Validation

```typescript
// POST /validate - Validate multiple IDs
app.post('/validate', (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids)) {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'ids must be an array',
    });
  }

  const results = ids.map((id) => ({
    id,
    valid: isValidId(id),
    parsed: isValidId(id) ? parseId(id) : null,
  }));

  const validCount = results.filter((r) => r.valid).length;
  const invalidCount = results.length - validCount;

  res.json({
    results,
    summary: {
      total: results.length,
      valid: validCount,
      invalid: invalidCount,
    },
  });
});
```

## Search and Filtering

### Search by Prefix

```typescript
// GET /search/:prefix - Search entities by prefix
app.get('/search/:prefix', (req, res) => {
  const { prefix } = req.params;
  const { limit = 10, offset = 0 } = req.query;

  let results = [];

  switch (prefix.toUpperCase()) {
    case 'USER':
      results = Array.from(users.values());
      break;
    case 'TXN':
      results = Array.from(transactions.values());
      break;
    case 'POST':
      results = Array.from(posts.values());
      break;
    default:
      return res.status(400).json({
        error: 'Invalid prefix',
        message: 'Supported prefixes: USER, TXN, POST',
      });
  }

  // Apply pagination
  const paginatedResults = results.slice(offset, offset + limit);

  res.json({
    results: paginatedResults,
    pagination: {
      total: results.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
      hasMore: offset + limit < results.length,
    },
  });
});
```

### Advanced Search

```typescript
// GET /search - Advanced search with filters
app.get('/search', (req, res) => {
  const { type, userId, status, limit = 10, offset = 0 } = req.query;

  let results = [];

  switch (type?.toUpperCase()) {
    case 'USER':
      results = Array.from(users.values());
      break;
    case 'TXN':
      results = Array.from(transactions.values());
      if (userId) {
        results = results.filter((t) => t.userId === userId);
      }
      if (status) {
        results = results.filter((t) => t.status === status);
      }
      break;
    case 'POST':
      results = Array.from(posts.values());
      if (userId) {
        results = results.filter((p) => p.userId === userId);
      }
      break;
    default:
      return res.status(400).json({
        error: 'Invalid type',
        message: 'Supported types: USER, TXN, POST',
      });
  }

  // Apply pagination
  const paginatedResults = results.slice(offset, offset + limit);

  res.json({
    results: paginatedResults,
    filters: { type, userId, status },
    pagination: {
      total: results.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
      hasMore: offset + limit < results.length,
    },
  });
});
```

## Error Handling

### Global Error Handler

```typescript
// Global error handler
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Error:', error);

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: error.message,
    });
  }

  if (error.name === 'NotFoundError') {
    return res.status(404).json({
      error: 'Not Found',
      message: error.message,
    });
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});
```

### Custom Error Classes

```typescript
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

// Usage in routes
app.get('/users/:id', (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      throw new ValidationError('Invalid user ID format');
    }

    const user = users.get(req.params.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});
```

## Health Check and Monitoring

### Health Check Endpoint

```typescript
// GET /health - Health check endpoint
app.get('/health', (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    idGeneration: {
      test: generateId('TEST'),
      valid: isValidId(generateId('TEST')),
    },
  };

  res.json(health);
});

// GET /health/detailed - Detailed health check
app.get('/health/detailed', (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: {
      users: users.size,
      transactions: transactions.size,
      posts: posts.size,
    },
    idGeneration: {
      test: generateId('TEST'),
      valid: isValidId(generateId('TEST')),
      parsed: parseId(generateId('TEST')),
    },
  };

  res.json(health);
});
```

## Complete Example

```typescript
import express from 'express';
import { generateId, isValidId, parseId } from '@aexoo-ai/spark-id';

const app = express();
app.use(express.json());

// In-memory storage
const users = new Map<string, any>();
const transactions = new Map<string, any>();

// Middleware
function validateIdParam(req: any, res: any, next: any) {
  const id = req.params.id;
  if (!isValidId(id)) {
    return res.status(400).json({
      error: 'Invalid ID format',
      message: 'ID must be a valid Spark-ID format',
    });
  }
  next();
}

// Routes
app.post('/users', (req, res) => {
  const userId = generateId('USER');
  const user = {
    id: userId,
    ...req.body,
    createdAt: new Date(),
  };
  users.set(userId, user);
  res.status(201).json({ user });
});

app.get('/users/:id', validateIdParam, (req, res) => {
  const user = users.get(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
});

app.post('/transactions', (req, res) => {
  const txnId = generateId('TXN');
  const transaction = {
    id: txnId,
    ...req.body,
    createdAt: new Date(),
  };
  transactions.set(txnId, transaction);
  res.status(201).json({ transaction });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    users: users.size,
    transactions: transactions.size,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Related

- [Basic Examples](/examples/basic) - Basic usage patterns
- [TypeScript Examples](/examples/typescript) - Type-safe patterns
- [Database Integration](/examples/database) - Database operations
- [API Reference](/api/) - Complete API documentation
