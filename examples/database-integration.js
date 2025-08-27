const { generateId, createId, isValidId } = require('@aexoo-ai/spark-id');

console.log('=== Database Integration Examples ===\n');

// Simulate database operations
class MockDatabase {
  constructor() {
    this.users = new Map();
    this.transactions = new Map();
    this.orders = new Map();
  }

  // User operations
  createUser(userData) {
    const userId = generateId('USER');
    const user = {
      id: userId,
      ...userData,
      createdAt: new Date().toISOString()
    };
    this.users.set(userId, user);
    return user;
  }

  getUser(userId) {
    if (!isValidId(userId)) {
      throw new Error('Invalid user ID format');
    }
    return this.users.get(userId);
  }

  // Transaction operations
  createTransaction(amount, userId) {
    const txnId = generateId('TXN');
    const transaction = {
      id: txnId,
      amount,
      userId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.transactions.set(txnId, transaction);
    return transaction;
  }

  getTransaction(txnId) {
    if (!isValidId(txnId)) {
      throw new Error('Invalid transaction ID format');
    }
    return this.transactions.get(txnId);
  }

  // Order operations
  createOrder(items, userId) {
    const orderId = createId('ORDER');
    const order = {
      id: orderId.full,
      items,
      userId,
      status: 'created',
      createdAt: new Date().toISOString()
    };
    this.orders.set(orderId.full, order);
    return order;
  }

  getOrder(orderId) {
    if (!isValidId(orderId)) {
      throw new Error('Invalid order ID format');
    }
    return this.orders.get(orderId);
  }

  // Bulk operations
  generateBulkIds(count, prefix) {
    return Array.from({ length: count }, () => generateId(prefix));
  }

  // Search by prefix
  findByIdsByPrefix(prefix) {
    const allIds = [...this.users.keys(), ...this.transactions.keys(), ...this.orders.keys()];
    return allIds.filter(id => id.startsWith(prefix + '_'));
  }
}

// Usage examples
const db = new MockDatabase();

console.log('1. Creating users:');
const user1 = db.createUser({ name: 'John Doe', email: 'john@example.com' });
const user2 = db.createUser({ name: 'Jane Smith', email: 'jane@example.com' });
console.log('  User 1:', user1);
console.log('  User 2:', user2);

console.log('\n2. Creating transactions:');
const txn1 = db.createTransaction(100.50, user1.id);
const txn2 = db.createTransaction(25.75, user2.id);
console.log('  Transaction 1:', txn1);
console.log('  Transaction 2:', txn2);

console.log('\n3. Creating orders:');
const order1 = db.createOrder(['item1', 'item2'], user1.id);
const order2 = db.createOrder(['item3'], user2.id);
console.log('  Order 1:', order1);
console.log('  Order 2:', order2);

console.log('\n4. Retrieving data:');
console.log('  Retrieved user:', db.getUser(user1.id));
console.log('  Retrieved transaction:', db.getTransaction(txn1.id));
console.log('  Retrieved order:', db.getOrder(order1.id));

console.log('\n5. Bulk ID generation:');
const bulkUserIds = db.generateBulkIds(5, 'USER');
const bulkTxnIds = db.generateBulkIds(3, 'TXN');
console.log('  Bulk user IDs:', bulkUserIds);
console.log('  Bulk transaction IDs:', bulkTxnIds);

console.log('\n6. Search by prefix:');
const allUserIds = db.findByIdsByPrefix('USER');
const allTxnIds = db.findByIdsByPrefix('TXN');
console.log('  All user IDs:', allUserIds);
console.log('  All transaction IDs:', allTxnIds);

console.log('\n7. Error handling:');
try {
  db.getUser('invalid-id');
} catch (error) {
  console.log('  Error caught:', error.message);
}

// Performance example
console.log('\n8. Performance test:');
const startTime = Date.now();
const performanceIds = db.generateBulkIds(1000, 'PERF');
const endTime = Date.now();
console.log(`  Generated 1000 IDs in ${endTime - startTime}ms`);
console.log(`  Sample IDs: ${performanceIds.slice(0, 3).join(', ')}...`);
