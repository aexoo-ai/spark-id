# Documentation Quick Reference

## 🚀 Quick Commands

```bash
# Start development server
pnpm docs:dev

# Build documentation
pnpm docs:build

# Check for broken links
pnpm docs:check

# Auto-update docs from code changes
pnpm update-docs

# Generate favicons from logo
pnpm favicon

# Preview built docs
pnpm docs:preview
```

## 📁 File Locations

| Purpose          | Location                                 |
| ---------------- | ---------------------------------------- |
| VitePress config | `docs/.vitepress/config.ts`              |
| Homepage         | `docs/index.md`                          |
| API docs         | `docs/api/`                              |
| Examples         | `docs/examples/`                         |
| Guides           | `docs/guide/`                            |
| CLI docs         | `docs/cli/`                              |
| Logos            | `docs/public/logo.svg` & `logo-dark.svg` |

## 🔧 Common Tasks

### Add New Feature Documentation

1. **Update code** in `src/`
2. **Run auto-update**: `pnpm update-docs`
3. **Review changes**: Check modified files in `docs/`
4. **Test locally**: `pnpm docs:dev`
5. **Commit**: Include both code and doc changes

### Fix Broken Links

1. **Check for issues**: `pnpm docs:check`
2. **Fix internal links**: Add `/spark-id/` prefix if missing
3. **Verify external links**: Test URLs manually
4. **Re-check**: `pnpm docs:check`

### Update Logo

1. **Replace files**: `docs/public/logo.svg` (light) & `logo-dark.svg` (dark)
2. **Test themes**: Switch between light/dark in dev server
3. **Verify**: Check header logo changes correctly

### Add New Example

1. **Create file**: `docs/examples/your-example.md`
2. **Add to sidebar**: Update `docs/.vitepress/config.ts`
3. **Test**: `pnpm docs:dev`
4. **Link check**: `pnpm docs:check`

## 🎨 Theme Variables

```css
--vp-c-text-1    /* Primary text */
--vp-c-text-2    /* Secondary text */
--vp-c-brand     /* Brand color */
--vp-c-bg        /* Background */
--vp-c-divider   /* Borders */
```

## 📝 Content Guidelines

- **IDs**: Use uppercase by default (`YBNDRFG8EJKMCPQXOT1UWISZA345H769`)
- **Examples**: Include both simple and prefixed IDs
- **Configuration**: Show both global and per-call usage
- **TypeScript**: Use for type safety examples

## 🚨 Troubleshooting

| Issue             | Solution                                                    |
| ----------------- | ----------------------------------------------------------- |
| Logo not changing | Check both `logo.svg` and `logo-dark.svg` exist             |
| Broken links      | Run `pnpm docs:check` and fix missing `/spark-id/` prefixes |
| Build fails       | Check markdown syntax, run `pnpm docs:check`                |
| Missing updates   | Run `pnpm update-docs` after code changes                   |

## 🔄 Workflow

### After Code Changes

```bash
# 1. Make code changes
git add src/
git commit -m "Add new feature"

# 2. Update docs
pnpm update-docs

# 3. Review and test
pnpm docs:dev
pnpm docs:check

# 4. Commit docs
git add docs/
git commit -m "Update documentation for new feature"
```

### Before Release

```bash
# 1. Test everything
pnpm docs:build
pnpm docs:check
pnpm docs:preview

# 2. Verify examples work
pnpm test:integration

# 3. Deploy
git push origin main
```
