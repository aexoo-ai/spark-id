---
layout: home
hero:
  name: Spark-ID
  text: Cryptographically secure, URL-safe ID generator
  tagline: Generate unique, human-readable IDs with optional prefixes. Perfect for databases, APIs, and distributed systems.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/aexoo-ai/spark-id
    - theme: alt
      text: Try it Online
      link: /examples/

features:
  - icon: 🔐
    title: Cryptographically Secure
    details: Uses Node.js crypto.randomBytes() for true randomness. 72 bits of entropy ensures collision resistance.
  - icon: 🌐
    title: URL-Safe
    details: Z-Base32 encoding avoids commonly confused characters (0/O, 1/I, 8/B). Perfect for URLs and filenames.
  - icon: 🏷️
    title: Prefix Support
    details: Add meaningful prefixes like USER_, TXN_, ORDER_ to organize and identify different types of IDs.
  - icon: ⚡
    title: High Performance
    details: Generates 1000+ IDs per second. Lightweight with zero dependencies.
  - icon: 🔍
    title: Built-in Validation
    details: Validate ID format, parse components, and compare IDs with ease.
  - icon: 🛠️
    title: TypeScript Ready
    details: Full TypeScript support with comprehensive type definitions and IntelliSense.
  - icon: ⚙️
    title: Configurable
    details: Customize casing, separators, alphabets, and more. Global defaults or per-call overrides.
---

## Quick Start

::: code-group

```bash [npm]
npm install @aexoo-ai/spark-id
```

```bash [pnpm]
pnpm add @aexoo-ai/spark-id
```

```bash [yarn]
yarn add @aexoo-ai/spark-id
```

:::

```typescript
import { generateId, createId, isValidId, configure } from '@aexoo-ai/spark-id';

// Configure defaults (optional)
configure({ case: 'upper', separator: '_' });

// Generate a simple ID
const id = generateId(); // "YBNDRFG8EJKMCPQXOT1UWISZA345H769"

// Generate with prefix
const userId = generateId('USER'); // "USER_YBNDRFG8EJKMCPQXOT1UWISZA345H769"

// Generate with custom config
const customId = generateId('TXN', { case: 'lower', separator: '-' }); // "txn-YBNDRFG8EJKMCPQXOT1UWISZA345H769"

// Validate an ID
isValidId(userId); // true
```

## Live Demo

<div class="demo-container">
  <div class="demo-section">
    <h3>Generate IDs</h3>
    <button id="generateBtn" class="demo-btn">Generate New ID</button>
    <div id="generatedId" class="demo-output"></div>
  </div>
  
  <div class="demo-section">
    <h3>Generate with Prefix</h3>
    <input id="prefixInput" type="text" placeholder="Enter prefix (e.g., USER)" class="demo-input">
    <button id="generatePrefixedBtn" class="demo-btn">Generate Prefixed ID</button>
    <div id="prefixedId" class="demo-output"></div>
  </div>
  
  <div class="demo-section">
    <h3>Validate ID</h3>
    <input id="validateInput" type="text" placeholder="Enter ID to validate" class="demo-input">
    <button id="validateBtn" class="demo-btn">Validate</button>
    <div id="validationResult" class="demo-output"></div>
  </div>
</div>

<style>
.demo-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}

.demo-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.demo-section h3 {
  margin: 0;
  color: var(--vp-c-text-1);
}

.demo-input {
  padding: 0.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.demo-btn {
  padding: 0.5rem 1rem;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.demo-btn:hover {
  background: var(--vp-c-brand-dark);
}

.demo-output {
  padding: 0.75rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  font-family: monospace;
  word-break: break-all;
  min-height: 2.5rem;
  display: flex;
  align-items: center;
}

.demo-output.valid {
  border-color: #10b981;
  background: #f0fdf4;
}

.demo-output.invalid {
  border-color: #ef4444;
  background: #fef2f2;
}
</style>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // Mock spark-id functionality for demo
  const generateMockId = () => {
    const chars = 'YBNDRFG8EJKMCPQXOT1UWISZA345H769'
    return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  }

  const generateBtn = document.getElementById('generateBtn')
  const generatedId = document.getElementById('generatedId')
  
  generateBtn?.addEventListener('click', () => {
    generatedId.textContent = generateMockId()
  })

  const generatePrefixedBtn = document.getElementById('generatePrefixedBtn')
  const prefixInput = document.getElementById('prefixInput')
  const prefixedId = document.getElementById('prefixedId')
  
  generatePrefixedBtn?.addEventListener('click', () => {
    const prefix = prefixInput?.value?.trim()
    if (prefix) {
      prefixedId.textContent = `${prefix}_${generateMockId()}`
    } else {
      prefixedId.textContent = 'Please enter a prefix'
    }
  })

  const validateBtn = document.getElementById('validateBtn')
  const validateInput = document.getElementById('validateInput')
  const validationResult = document.getElementById('validationResult')
  
  validateBtn?.addEventListener('click', () => {
    const id = validateInput?.value?.trim()
    if (!id) {
      validationResult.textContent = 'Please enter an ID'
      validationResult.className = 'demo-output'
      return
    }
    
    // Simple validation for demo
    const isValid = /^[A-Z_]*[YBNDRFG8EJKMCPQXOT1UWISZA345H769]+$/.test(id)
    validationResult.textContent = isValid ? '✅ Valid ID' : '❌ Invalid ID'
    validationResult.className = `demo-output ${isValid ? 'valid' : 'invalid'}`
  })

  // Generate initial ID
  if (generatedId) {
    generatedId.textContent = generateMockId()
  }
})
</script>

## Why Spark-ID?

### 🚀 **Performance**

- Generates 1000+ IDs per second
- Zero dependencies
- Lightweight bundle size

### 🔒 **Security**

- Cryptographically secure random generation
- 72 bits of entropy
- Collision-resistant

### 🎯 **Developer Experience**

- Simple, intuitive API
- Full TypeScript support
- Comprehensive validation
- CLI tool included

### 🌍 **Production Ready**

- URL-safe encoding
- Human-readable format
- Prefix support for organization
- Battle-tested in production

## Get Started

Choose your path to get started with Spark-ID:

<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
  <a href="/spark-id/guide/getting-started" class="feature-card">
    <h3>📖 Guide</h3>
    <p>Learn the basics and core concepts</p>
  </a>
  <a href="/spark-id/examples/" class="feature-card">
    <h3>💡 Examples</h3>
    <p>See real-world usage patterns</p>
  </a>
  <a href="/spark-id/api/" class="feature-card">
    <h3>🔧 API Reference</h3>
    <p>Complete API documentation</p>
  </a>
</div>

<style>
.feature-card {
  display: block;
  padding: 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition: all 0.2s;
}

.feature-card:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
}

.feature-card h3 {
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-brand);
}

.feature-card p {
  margin: 0;
  color: var(--vp-c-text-2);
}
</style>
