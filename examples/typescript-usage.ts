import { generateId, createId, isValidId, parseId, SecureId } from '@aexoo-ai/spark-id';

console.log('=== TypeScript Usage Examples ===\n');

// Type-safe ID generation
const simpleId: string = generateId();
const userId: string = generateId('USER');
const txnId: string = generateId('TXN');

console.log('Generated IDs:');
console.log('  Simple:', simpleId);
console.log('  User:', userId);
console.log('  Transaction:', txnId);

// Type-safe SecureId instances
const secureId1: SecureId = createId();
const secureId2: SecureId = createId('ORDER');

console.log('\nSecureId instances:');
console.log('  Instance 1:', secureId1.full);
console.log('  Instance 2:', secureId2.full);
console.log('  Instance 1 ID only:', secureId1.id);
console.log('  Instance 2 prefix:', secureId2.prefix);

// Type-safe validation
const validationResults: boolean[] = [
  isValidId(simpleId),
  isValidId(userId),
  isValidId('invalid-id'),
  isValidId('USER_123456')
];

console.log('\nValidation results:');
validationResults.forEach((result, index) => {
  console.log(`  Test ${index + 1}: ${result}`);
});

// Type-safe parsing
interface ParsedId {
  prefix?: string;
  id: string;
  full: string;
}

const parsedSimple: ParsedId = parseId(simpleId);
const parsedUser: ParsedId = parseId(userId);

console.log('\nParsed results:');
console.log('  Simple ID parsed:', parsedSimple);
console.log('  User ID parsed:', parsedUser);

// Type-safe comparison
const comparisonResults: boolean[] = [
  secureId1.equals(secureId1),
  secureId1.equals(secureId2),
  secureId1.equals(secureId1.full),
  secureId1.equals(secureId2.id)
];

console.log('\nComparison results:');
comparisonResults.forEach((result, index) => {
  console.log(`  Comparison ${index + 1}: ${result}`);
});

// Array of IDs with proper typing
const idArray: string[] = Array.from({ length: 5 }, () => generateId());
const prefixedIdArray: string[] = Array.from({ length: 3 }, () => generateId('ITEM'));

console.log('\nGenerated arrays:');
console.log('  Simple IDs:', idArray);
console.log('  Prefixed IDs:', prefixedIdArray);
