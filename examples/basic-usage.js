const { generateId, createId, isValidId, parseId } = require('@aexoo-ai/spark-id');

console.log('=== Basic Usage Examples ===\n');

// Generate a simple ID
const simpleId = generateId();
console.log('Simple ID:', simpleId);

// Generate ID with prefix
const userId = generateId('USER');
console.log('User ID with prefix:', userId);

// Generate multiple IDs
console.log('\nMultiple IDs:');
for (let i = 0; i < 3; i++) {
  console.log(`  ${i + 1}. ${generateId()}`);
}

// Create SecureId instances
const secureId1 = createId();
const secureId2 = createId('TXN');
console.log('\nSecureId instances:');
console.log('  Instance 1:', secureId1.toString());
console.log('  Instance 2:', secureId2.toString());

// Validation
console.log('\nValidation examples:');
console.log(`  "${simpleId}" is valid:`, isValidId(simpleId));
console.log(`  "${userId}" is valid:`, isValidId(userId));
console.log(`  "invalid-id" is valid:`, isValidId('invalid-id'));

// Parsing
console.log('\nParsing examples:');
const parsed1 = parseId(simpleId);
const parsed2 = parseId(userId);
console.log('  Parsed simple ID:', parsed1);
console.log('  Parsed prefixed ID:', parsed2);

// Comparison
console.log('\nComparison:');
console.log('  secureId1 equals itself:', secureId1.equals(secureId1));
console.log('  secureId1 equals secureId2:', secureId1.equals(secureId2));
