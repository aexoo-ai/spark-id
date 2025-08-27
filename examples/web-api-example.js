const express = require('express');
const { generateId, createId, isValidId, parseId } = require('@aexoo-ai/spark-id');

// Mock database for demonstration
const mockDb = {
  users: new Map(),
  posts: new Map(),
  comments: new Map()
};

const app = express();
app.use(express.json());

// Middleware to validate IDs
const validateId = (req, res, next) => {
  const id = req.params.id;
  if (!isValidId(id)) {
    return res.status(400).json({ 
      error: 'Invalid ID format',
      message: 'ID must be a valid spark-id format'
    });
  }
  next();
};

// User routes
app.post('/users', (req, res) => {
  const userId = generateId('USER');
  const user = {
    id: userId,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  mockDb.users.set(userId, user);
  
  res.status(201).json({
    message: 'User created successfully',
    user,
    parsed: parseId(userId)
  });
});

app.get('/users/:id', validateId, (req, res) => {
  const user = mockDb.users.get(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    user,
    parsed: parseId(req.params.id)
  });
});

// Post routes
app.post('/posts', (req, res) => {
  const postId = generateId('POST');
  const post = {
    id: postId,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  mockDb.posts.set(postId, post);
  
  res.status(201).json({
    message: 'Post created successfully',
    post,
    parsed: parseId(postId)
  });
});

app.get('/posts/:id', validateId, (req, res) => {
  const post = mockDb.posts.get(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  res.json({
    post,
    parsed: parseId(req.params.id)
  });
});

// Comment routes
app.post('/posts/:postId/comments', validateId, (req, res) => {
  const commentId = createId('COMMENT');
  const comment = {
    id: commentId.full,
    postId: req.params.postId,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  mockDb.comments.set(commentId.full, comment);
  
  res.status(201).json({
    message: 'Comment created successfully',
    comment,
    parsed: parseId(commentId.full)
  });
});

// Bulk operations
app.post('/bulk/users', (req, res) => {
  const { count = 10 } = req.body;
  const users = [];
  
  for (let i = 0; i < count; i++) {
    const userId = generateId('USER');
    const user = {
      id: userId,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      createdAt: new Date().toISOString()
    };
    mockDb.users.set(userId, user);
    users.push(user);
  }
  
  res.json({
    message: `Created ${count} users`,
    users,
    ids: users.map(u => u.id)
  });
});

// Search by prefix
app.get('/search/:prefix', (req, res) => {
  const { prefix } = req.params;
  const results = {
    users: [],
    posts: [],
    comments: []
  };
  
  // Search users
  for (const [id, user] of mockDb.users) {
    if (id.startsWith(prefix + '_')) {
      results.users.push(user);
    }
  }
  
  // Search posts
  for (const [id, post] of mockDb.posts) {
    if (id.startsWith(prefix + '_')) {
      results.posts.push(post);
    }
  }
  
  // Search comments
  for (const [id, comment] of mockDb.comments) {
    if (id.startsWith(prefix + '_')) {
      results.comments.push(comment);
    }
  }
  
  res.json({
    prefix,
    results,
    counts: {
      users: results.users.length,
      posts: results.posts.length,
      comments: results.comments.length
    }
  });
});

// Health check with ID generation
app.get('/health', (req, res) => {
  const testId = generateId('HEALTH');
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    testId,
    parsed: parseId(testId)
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`=== Web API Example ===`);
  console.log(`Server running on http://localhost:${PORT}`);
  console.log();
  console.log('Available endpoints:');
  console.log('  POST   /users                    - Create a user');
  console.log('  GET    /users/:id                - Get user by ID');
  console.log('  POST   /posts                    - Create a post');
  console.log('  GET    /posts/:id                - Get post by ID');
  console.log('  POST   /posts/:postId/comments   - Create a comment');
  console.log('  POST   /bulk/users               - Create multiple users');
  console.log('  GET    /search/:prefix           - Search by ID prefix');
  console.log('  GET    /health                   - Health check');
  console.log();
  console.log('Example usage:');
  console.log('  curl -X POST http://localhost:3000/users \\');
  console.log('    -H "Content-Type: application/json" \\');
  console.log('    -d \'{"name": "John Doe", "email": "john@example.com"}\'');
  console.log();
});

module.exports = app;
