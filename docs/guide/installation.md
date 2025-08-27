# Installation

## Prerequisites

Spark-ID requires **Node.js 16.0.0** or higher.

```bash
# Check your Node.js version
node --version
```

## Package Manager Installation

### npm

```bash
npm install @aexoo-ai/spark-id
```

### pnpm (Recommended)

```bash
pnpm add @aexoo-ai/spark-id
```

### yarn

```bash
yarn add @aexoo-ai/spark-id
```

## Global CLI Installation

To use the command-line interface globally:

```bash
# npm
npm install -g @aexoo-ai/spark-id

# pnpm
pnpm add -g @aexoo-ai/spark-id

# yarn
yarn global add @aexoo-ai/spark-id
```

After global installation, you can use the `spark-id` command from anywhere:

```bash
spark-id --help
```

## TypeScript Support

Spark-ID includes full TypeScript support out of the box. No additional `@types` package is needed.

```typescript
import { generateId, createId, isValidId, SecureId } from '@aexoo-ai/spark-id';

// All functions and classes are fully typed
const id: string = generateId();
const secureId: SecureId = createId();
const isValid: boolean = isValidId(id);
```

## Development Installation

For development or contributing to Spark-ID:

```bash
# Clone the repository
git clone https://github.com/aexoo-ai/spark-id.git
cd spark-id

# Install dependencies
pnpm install

# Build the project
pnpm run build

# Run tests
pnpm test

# Run the CLI locally
node dist/cli.js
```

## Browser Usage

Spark-ID is designed for Node.js environments and uses the `crypto` module. For browser usage, you'll need to use a bundler that can polyfill Node.js modules.

### Webpack

```javascript
// webpack.config.js
module.exports = {
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
    },
  },
};
```

### Vite

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
    },
  },
});
```

### Rollup

```javascript
// rollup.config.js
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  plugins: [
    nodeResolve({
      preferBuiltins: false,
    }),
    commonjs(),
  ],
};
```

## Verification

To verify your installation:

```typescript
import { generateId, isValidId } from '@aexoo-ai/spark-id';

// Generate a test ID
const testId = generateId();
console.log('Generated ID:', testId);

// Validate it
console.log('Is valid:', isValidId(testId));

// Should output something like:
// Generated ID: ybndrfg8ejkmcpqxot1uwisza345h769
// Is valid: true
```

## Troubleshooting

### Common Issues

**"Cannot find module '@aexoo-ai/spark-id'"**

- Make sure you've installed the package correctly
- Check that your `package.json` includes the dependency
- Try deleting `node_modules` and reinstalling

**"crypto.randomBytes is not a function"**

- This happens in browser environments
- Use a bundler with Node.js polyfills (see Browser Usage above)

**"spark-id command not found"**

- Make sure you installed the package globally
- Check your PATH environment variable
- Try reinstalling with `npm install -g @aexoo-ai/spark-id`

### Node.js Version Issues

If you're using an older version of Node.js:

```bash
# Update Node.js using nvm
nvm install 18
nvm use 18

# Or download from nodejs.org
```

## Next Steps

Once installed, check out:

- [Getting Started](/guide/getting-started) - Basic usage examples
- [Quick Start](/guide/quick-start) - Fast setup guide
- [Examples](/examples/) - Real-world usage patterns
