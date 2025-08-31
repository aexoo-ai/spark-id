# Development Guide

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Run tests
pnpm test

# Check code quality
pnpm quality
```

## 🛡️ Preventing Linting & Formatting Issues

### **1. Pre-commit Hooks (Automatic)**

We use **Husky + lint-staged** to automatically fix issues before commits:

- **Pre-commit**: Automatically formats and lints staged files
- **Pre-push**: Runs tests and builds to ensure quality

**No action needed** - this happens automatically when you commit!

### **2. Manual Quality Checks**

```bash
# Check everything at once
pnpm quality

# Individual checks
pnpm lint          # ESLint (TypeScript + code quality)
pnpm format:check  # Prettier (code formatting)
pnpm test          # Vitest (unit tests)
```

### **3. Auto-fix Commands**

```bash
# Fix linting issues
pnpm lint:fix

# Fix formatting issues
pnpm format

# Fix both
pnpm lint:fix && pnpm format
```

## 📝 Development Workflow

### **Before Committing**

1. **Write your code**
2. **Stage your changes**: `git add .`
3. **Commit**: `git commit -m "your message"`
   - ✅ Pre-commit hooks automatically run
   - ✅ Code is formatted and linted
   - ✅ Issues are fixed automatically

### **Before Pushing**

1. **Push your changes**: `git push`
   - ✅ Pre-push hooks automatically run
   - ✅ Tests are executed
   - ✅ Build is verified

### **If Hooks Fail**

If pre-commit or pre-push hooks fail:

1. **Fix the issues** (hooks usually auto-fix them)
2. **Re-stage and commit**: `git add . && git commit -m "fix: linting issues"`
3. **Try again**: `git push`

## 🔧 Common Issues & Solutions

### **Prettier Formatting Issues**

```bash
# Auto-fix all formatting
pnpm format

# Check what would be changed
pnpm format:check
```

### **ESLint Issues**

```bash
# Auto-fix auto-fixable issues
pnpm lint:fix

# See all issues
pnpm lint
```

### **TypeScript Errors**

```bash
# Check TypeScript compilation
pnpm build

# Watch for TypeScript errors
pnpm dev
```

## 🎯 Best Practices

### **1. Use Your Editor's Integration**

- **VS Code**: Install ESLint and Prettier extensions
- **Auto-format on save**: Configure your editor to format on save
- **Real-time linting**: See issues as you type

### **2. Regular Quality Checks**

```bash
# Run before starting work
pnpm quality

# Run before breaks
pnpm quality

# Run before ending the day
pnpm quality
```

### **3. Commit Frequently**

- Small, focused commits
- Let hooks catch issues early
- Easier to fix problems when they're small

### **4. Use Descriptive Commit Messages**

```bash
# Good
git commit -m "feat: add configuration system"

# Better
git commit -m "feat: add configuration system with maxPrefixLength option"
```

## 🚨 Troubleshooting

### **Hooks Not Running**

```bash
# Reinstall hooks
pnpm prepare

# Check hook permissions
ls -la .husky/
```

### **Prettier Conflicts**

```bash
# Reset Prettier cache
rm -rf node_modules/.cache/prettier

# Reinstall dependencies
rm -rf node_modules && pnpm install
```

### **ESLint Configuration Issues**

```bash
# Check ESLint config
npx eslint --print-config src/lib/secure-id.ts

# Reset ESLint cache
npx eslint --cache-location .eslintcache --cache src/
```

## 📚 Additional Resources

- **ESLint Rules**: See `.eslintrc.js` for configuration
- **Prettier Config**: See `.prettierrc` for formatting rules
- **TypeScript Config**: See `tsconfig.json` for compiler options
- **Husky Hooks**: See `.husky/` directory for git hooks

## 🎉 Success Checklist

Before considering your work complete:

- [ ] `pnpm quality` passes
- [ ] `pnpm build` succeeds
- [ ] `pnpm test` passes
- [ ] `pnpm test:integration` passes
- [ ] Code is committed and pushed
- [ ] CI/CD pipeline passes

---

**Remember**: The pre-commit hooks are your friend! They catch issues early and automatically fix most problems. Trust the process! 🛡️✨
