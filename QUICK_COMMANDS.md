# Quick Commands Reference

## 🚀 Daily Development

```bash
# Start development (watch mode)
pnpm dev

# Run tests
pnpm test

# Check code quality (lint + format + test)
pnpm quality
```

## 🛡️ Code Quality

```bash
# Fix all issues automatically
pnpm lint:fix && pnpm format

# Check for issues
pnpm lint && pnpm format:check

# One command to rule them all
pnpm quality
```

## 📦 Build & Deploy

```bash
# Build everything
pnpm build

# Test integration
pnpm test:integration

# Prepare for publish
pnpm prepublishOnly
```

## 📚 Documentation

```bash
# Start docs dev server
pnpm docs:dev

# Build docs
pnpm docs:build

# Check docs for issues
pnpm docs:check
```

## 🔧 Git Workflow

```bash
# Stage and commit (hooks run automatically)
git add .
git commit -m "your message"

# Push (pre-push hooks run automatically)
git push
```

## 🚨 Emergency Fixes

```bash
# Fix all formatting issues
pnpm format

# Fix all linting issues
pnpm lint:fix

# Reset everything
rm -rf node_modules && pnpm install
```

---

**Pro Tip**: Use `pnpm quality` before committing to catch issues early! 🎯
