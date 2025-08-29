# Database Integration Examples

Real-world database patterns and operations with Spark-ID.

## Mock Database Class

```typescript
import { generateId, isValidId, parseId } from '@aexoo-ai/spark-id';

// Mock database class for examples
class MockDatabase {
  private users = new Map<string, any>();
  private transactions = new Map<string, any>();
  private orders = new Map<string, any>();

  // User operations
  async createUser(userData: any) {
    const userId = generateId('USER');
    const user = {
      id: userId,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userId, user);
    return user;
  }

  async findUser(id: string) {
    if (!isValidId(id)) {
      throw new Error('Invalid user ID format');
    }
    const parsed = parseId(id);
    if (parsed.prefix !== 'USER') {
      throw new Error('Not a user ID');
    }
    return this.users.get(id) || null;
  }

  async updateUser(id: string, updates: any) {
    const user = await this.findUser(id);
    if (!user) {
      throw new Error('User not found');
    }
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string) {
    const user = await this.findUser(id);
    if (!user) {
      throw new Error('User not found');
    }
    this.users.delete(id);
    return user;
  }

  // Transaction operations
  async createTransaction(transactionData: any) {
    const txnId = generateId('TXN');
    const transaction = {
      id: txnId,
      ...transactionData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.transactions.set(txnId, transaction);
    return transaction;
  }

  async findTransaction(id: string) {
    if (!isValidId(id)) {
      throw new Error('Invalid transaction ID format');
    }
    const parsed = parseId(id);
    if (parsed.prefix !== 'TXN') {
      throw new Error('Not a transaction ID');
    }
    return this.transactions.get(id) || null;
  }

  // Order operations
  async createOrder(orderData: any) {
    const orderId = generateId('ORDER');
    const order = {
      id: orderId,
      ...orderData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(orderId, order);
    return order;
  }

  async findOrder(id: string) {
    if (!isValidId(id)) {
      throw new Error('Invalid order ID format');
    }
    const parsed = parseId(id);
    if (parsed.prefix !== 'ORDER') {
      throw new Error('Not an order ID');
    }
    return this.orders.get(id) || null;
  }

  // Bulk operations
  async bulkCreateUsers(userDataArray: any[]) {
    const users = [];
    for (const userData of userDataArray) {
      const user = await this.createUser(userData);
      users.push(user);
    }
    return users;
  }

  async bulkCreateTransactions(transactionDataArray: any[]) {
    const transactions = [];
    for (const transactionData of transactionDataArray) {
      const transaction = await this.createTransaction(transactionData);
      transactions.push(transaction);
    }
    return transactions;
  }

  // Search operations
  async findUsersByPrefix(prefix: string) {
    const users = [];
    for (const [id, user] of this.users) {
      if (id.startsWith(prefix)) {
        users.push(user);
      }
    }
    return users;
  }

  async findTransactionsByUserId(userId: string) {
    const transactions = [];
    for (const [id, transaction] of this.transactions) {
      if (transaction.userId === userId) {
        transactions.push(transaction);
      }
    }
    return transactions;
  }

  // Performance testing
  async performanceTest() {
    console.log('Starting performance test...');

    const start = Date.now();

    // Generate 1000 users
    const userPromises = Array.from({ length: 1000 }, (_, i) =>
      this.createUser({ name: `User ${i}`, email: `user${i}@example.com` })
    );
    const users = await Promise.all(userPromises);

    // Generate 5000 transactions
    const transactionPromises = Array.from({ length: 5000 }, (_, i) =>
      this.createTransaction({
        userId: users[i % users.length].id,
        amount: Math.random() * 1000,
        status: ['pending', 'completed', 'failed'][
          Math.floor(Math.random() * 3)
        ],
      })
    );
    const transactions = await Promise.all(transactionPromises);

    const end = Date.now();

    console.log(
      `Created ${users.length} users and ${transactions.length} transactions in ${end - start}ms`
    );
    return { users, transactions };
  }
}
```

## Usage Examples

### Basic CRUD Operations

```typescript
import { MockDatabase } from './mock-database';

async function basicCrudExample() {
  const db = new MockDatabase();

  // Create a user
  const user = await db.createUser({
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
  });
  console.log('Created user:', user.id); // USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769

  // Find the user
  const foundUser = await db.findUser(user.id);
  console.log('Found user:', foundUser.name); // John Doe

  // Update the user
  const updatedUser = await db.updateUser(user.id, { age: 31 });
  console.log('Updated user age:', updatedUser.age); // 31

  // Create a transaction for the user
  const transaction = await db.createTransaction({
    userId: user.id,
    amount: 100.5,
    status: 'completed',
  });
  console.log('Created transaction:', transaction.id); // TXN_YBNDRFG8EJKMCPQXOT1UWISZA345H769

  // Find the transaction
  const foundTransaction = await db.findTransaction(transaction.id);
  console.log('Found transaction amount:', foundTransaction.amount); // 100.50

  // Delete the user
  const deletedUser = await db.deleteUser(user.id);
  console.log('Deleted user:', deletedUser.name); // John Doe
}

basicCrudExample();
```

### Bulk Operations

```typescript
import { MockDatabase } from './mock-database';

async function bulkOperationsExample() {
  const db = new MockDatabase();

  // Bulk create users
  const userDataArray = [
    { name: 'Alice', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' },
    { name: 'Charlie', email: 'charlie@example.com' },
    { name: 'Diana', email: 'diana@example.com' },
    { name: 'Eve', email: 'eve@example.com' },
  ];

  const users = await db.bulkCreateUsers(userDataArray);
  console.log(`Created ${users.length} users`);

  // Bulk create transactions
  const transactionDataArray = users.map((user) => ({
    userId: user.id,
    amount: Math.random() * 1000,
    status: 'completed',
  }));

  const transactions = await db.bulkCreateTransactions(transactionDataArray);
  console.log(`Created ${transactions.length} transactions`);

  // Verify all IDs are unique
  const allIds = [...users.map((u) => u.id), ...transactions.map((t) => t.id)];
  const uniqueIds = new Set(allIds);
  console.log(`All IDs are unique: ${allIds.length === uniqueIds.size}`);
}

bulkOperationsExample();
```

### Search and Filtering

```typescript
import { MockDatabase } from './mock-database';

async function searchExample() {
  const db = new MockDatabase();

  // Create some test data
  const user1 = await db.createUser({
    name: 'Alice',
    email: 'alice@example.com',
  });
  const user2 = await db.createUser({ name: 'Bob', email: 'bob@example.com' });

  await db.createTransaction({
    userId: user1.id,
    amount: 100,
    status: 'completed',
  });
  await db.createTransaction({
    userId: user1.id,
    amount: 200,
    status: 'pending',
  });
  await db.createTransaction({
    userId: user2.id,
    amount: 150,
    status: 'completed',
  });

  // Find all users (by prefix)
  const allUsers = await db.findUsersByPrefix('USER_');
  console.log(`Found ${allUsers.length} users`);

  // Find transactions for a specific user
  const userTransactions = await db.findTransactionsByUserId(user1.id);
  console.log(
    `Found ${userTransactions.length} transactions for user ${user1.id}`
  );

  // Filter transactions by status
  const completedTransactions = userTransactions.filter(
    (t) => t.status === 'completed'
  );
  console.log(`Found ${completedTransactions.length} completed transactions`);
}

searchExample();
```

### Error Handling

```typescript
import { MockDatabase } from './mock-database';

async function errorHandlingExample() {
  const db = new MockDatabase();

  try {
    // Try to find user with invalid ID
    await db.findUser('invalid-id');
  } catch (error) {
    console.error('Error:', error.message); // Invalid user ID format
  }

  try {
    // Try to find user with wrong prefix
    const txnId = await db.createTransaction({
      userId: 'some-user',
      amount: 100,
    });
    await db.findUser(txnId.id); // This will fail
  } catch (error) {
    console.error('Error:', error.message); // Not a user ID
  }

  try {
    // Try to find non-existent user
    await db.findUser('USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769');
  } catch (error) {
    console.error('Error:', error.message); // User not found
  }
}

errorHandlingExample();
```

### Performance Testing

```typescript
import { MockDatabase } from './mock-database';

async function performanceTestExample() {
  const db = new MockDatabase();

  // Run performance test
  const { users, transactions } = await db.performanceTest();

  // Analyze results
  console.log(`Generated ${users.length} unique user IDs`);
  console.log(`Generated ${transactions.length} unique transaction IDs`);

  // Check for collisions (should be none)
  const allIds = [...users.map((u) => u.id), ...transactions.map((t) => t.id)];
  const uniqueIds = new Set(allIds);
  console.log(
    `Collision check: ${allIds.length === uniqueIds.size ? 'No collisions' : 'Collisions detected'}`
  );

  // Check ID format consistency
  const validIds = allIds.filter((id) => isValidId(id));
  console.log(
    `Format validation: ${validIds.length === allIds.length ? 'All IDs valid' : 'Some IDs invalid'}`
  );

  // Check prefix distribution
  const userIds = allIds.filter((id) => id.startsWith('USER_'));
  const txnIds = allIds.filter((id) => id.startsWith('TXN_'));
  console.log(`User IDs: ${userIds.length}, Transaction IDs: ${txnIds.length}`);
}

performanceTestExample();
```

### Real Database Integration

```typescript
import { generateId, isValidId, parseId } from '@aexoo-ai/spark-id';

// Example with a real database (using a generic interface)
interface DatabaseAdapter {
  insert(collection: string, document: any): Promise<any>;
  findOne(collection: string, query: any): Promise<any | null>;
  find(collection: string, query: any): Promise<any[]>;
  update(collection: string, query: any, updates: any): Promise<any>;
  delete(collection: string, query: any): Promise<any>;
}

class RealDatabaseService {
  constructor(private db: DatabaseAdapter) {}

  async createUser(userData: any) {
    const userId = generateId('USER');
    const user = {
      id: userId,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.db.insert('users', user);
    return user;
  }

  async findUser(id: string) {
    if (!isValidId(id)) {
      throw new Error('Invalid user ID format');
    }

    const parsed = parseId(id);
    if (parsed.prefix !== 'USER') {
      throw new Error('Not a user ID');
    }

    return await this.db.findOne('users', { id });
  }

  async findUsersByPrefix(prefix: string) {
    return await this.db.find('users', { id: { $regex: `^${prefix}` } });
  }

  async updateUser(id: string, updates: any) {
    const user = await this.findUser(id);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    await this.db.update('users', { id }, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string) {
    const user = await this.findUser(id);
    if (!user) {
      throw new Error('User not found');
    }

    await this.db.delete('users', { id });
    return user;
  }
}
```

## Related

- [Basic Examples](/examples/basic) - Basic usage patterns
- [TypeScript Examples](/examples/typescript) - Type-safe patterns
- [Web API Examples](/examples/web-api) - API integration
- [API Reference](/api/) - Complete API documentation
