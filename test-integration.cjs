#!/usr/bin/env node

/**
 * Integration test for @aexoo-ai/spark-id
 * Tests different import patterns and module systems
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Running integration tests...\n');

// Test 1: CommonJS require
console.log('📦 Testing CommonJS require...');
try {
  const sparkId = require('./dist/index.cjs');

  // Test basic functionality
  const id1 = sparkId.generateId();
  const id2 = sparkId.generateId('USER');

  console.log('  ✅ generateId():', id1);
  console.log('  ✅ generateId("USER"):', id2);
  console.log('  ✅ isValidId():', sparkId.isValidId(id1));
  console.log('  ✅ parseId():', JSON.stringify(sparkId.parseId(id2)));

  // Test class usage
  const secureId = sparkId.SecureId.create('TEST');
  console.log('  ✅ SecureId.create():', secureId.toString());

  console.log('  ✅ CommonJS require: PASSED\n');
} catch (error) {
  console.error('  ❌ CommonJS require: FAILED', error.message);
  process.exit(1);
}

// Test 2: ESM import (dynamic)
console.log('📦 Testing ESM dynamic import...');
async function testESM() {
  try {
    const sparkId = await import('./dist/index.js');

    // Test basic functionality
    const id1 = sparkId.generateId();
    const id2 = sparkId.generateId('USER');

    console.log('  ✅ generateId():', id1);
    console.log('  ✅ generateId("USER"):', id2);
    console.log('  ✅ isValidId():', sparkId.isValidId(id1));
    console.log('  ✅ parseId():', JSON.stringify(sparkId.parseId(id2)));

    // Test new functions
    const safeResult = sparkId.generateIdSafe('SAFE');
    console.log('  ✅ generateIdSafe():', JSON.stringify(safeResult));

    const validation = sparkId.validateId(id1);
    console.log('  ✅ validateId():', JSON.stringify(validation));

    const multiple = sparkId.generateMultiple(3, 'MULTI');
    console.log('  ✅ generateMultiple():', multiple);

    console.log('  ✅ ESM dynamic import: PASSED\n');
  } catch (error) {
    console.error('  ❌ ESM dynamic import: FAILED', error.message);
    throw error;
  }
}

// Test 3: Spark-ID specific entry point
console.log('📦 Testing spark-id entry point...');
async function testSparkIdEntry() {
  try {
    const sparkId = await import('./dist/spark-id.js');

    // Test sparkId function
    const id = sparkId.sparkId('SPARK');
    console.log('  ✅ sparkId():', id);

    // Test default export
    const defaultExport = sparkId.default;
    const defaultId = defaultExport.generateId('DEFAULT');
    console.log('  ✅ default export:', defaultId);

    console.log('  ✅ Spark-ID entry point: PASSED\n');
  } catch (error) {
    console.error('  ❌ Spark-ID entry point: FAILED', error.message);
    throw error;
  }
}

// Test 4: CLI functionality
console.log('📦 Testing CLI...');
try {
  const cli = require('./dist/cli.cjs');
  console.log('  ✅ CLI module loaded successfully');
  console.log('  ✅ CLI: PASSED\n');
} catch (error) {
  console.error('  ❌ CLI: FAILED', error.message);
  process.exit(1);
}

// Test 5: Type definitions
console.log('📦 Testing TypeScript definitions...');
try {
  const typeFiles = [
    './dist/index.d.ts',
    './dist/spark-id.d.ts',
    './dist/cli.d.ts',
  ];

  for (const typeFile of typeFiles) {
    if (fs.existsSync(typeFile)) {
      console.log(`  ✅ ${typeFile}: EXISTS`);
    } else {
      console.error(`  ❌ ${typeFile}: MISSING`);
      process.exit(1);
    }
  }

  console.log('  ✅ TypeScript definitions: PASSED\n');
} catch (error) {
  console.error('  ❌ TypeScript definitions: FAILED', error.message);
  process.exit(1);
}

// Test 6: Error handling
console.log('📦 Testing error handling...');
try {
  const sparkId = require('./dist/index.cjs');

  // Test invalid prefix
  try {
    sparkId.generateId('invalid-prefix!');
    console.error('  ❌ Should have thrown error for invalid prefix');
    process.exit(1);
  } catch (error) {
    if (error.name === 'InvalidPrefixError') {
      console.log('  ✅ InvalidPrefixError caught correctly');
    } else {
      console.error('  ❌ Wrong error type:', error.name);
      process.exit(1);
    }
  }

  // Test invalid ID
  try {
    sparkId.parseId('invalid-id!');
    console.error('  ❌ Should have thrown error for invalid ID');
    process.exit(1);
  } catch (error) {
    if (error.name === 'InvalidIdError') {
      console.log('  ✅ InvalidIdError caught correctly');
    } else {
      console.error('  ❌ Wrong error type:', error.name);
      console.error('  ❌ Error details:', error.message);
      process.exit(1);
    }
  }

  console.log('  ✅ Error handling: PASSED\n');
} catch (error) {
  console.error('  ❌ Error handling: FAILED', error.message);
  process.exit(1);
}

// Run async tests
async function runTests() {
  try {
    console.log('Starting ESM test...');
    await testESM();
    console.log('Starting Spark-ID entry test...');
    await testSparkIdEntry();

    console.log('🎉 All integration tests passed!');
    console.log('✅ Module system compatibility: VERIFIED');
    console.log('✅ Multiple entry points: VERIFIED');
    console.log('✅ Error handling: VERIFIED');
    console.log('✅ TypeScript support: VERIFIED');
  } catch (error) {
    console.error('❌ Integration tests failed:', error);
    process.exit(1);
  }
}

runTests();
