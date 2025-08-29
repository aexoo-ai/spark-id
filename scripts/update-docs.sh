#!/bin/bash

# Spark-ID Documentation Update Script
# Automatically updates documentation based on changes since main branch

set -e  # Exit on any error

echo "🔄 Spark-ID Documentation Update"
echo "================================"

# Get current branch and changes since main
BRANCH=$(git branch --show-current)
CHANGES=$(git diff --name-only main...HEAD)

echo "📋 Current branch: $BRANCH"
echo "📋 Changes since main:"
if [ -z "$CHANGES" ]; then
    echo "   No changes detected"
    exit 0
else
    echo "$CHANGES" | sed 's/^/   /'
fi

echo ""
echo "🔍 Analyzing changes for documentation updates..."

# Check if we have Cursor CLI installed
if ! command -v cursor-agent &> /dev/null; then
    echo "❌ Error: cursor-agent not found"
    echo "Please install Cursor CLI: https://cursor.com/docs/cli"
    exit 1
fi

# Create the prompt directly with variables
PROMPT="You are updating documentation for the Spark-ID library, a TypeScript/JavaScript ID generation library.

# Context:
- Current branch: $BRANCH
- Changes since main: $CHANGES
- Docs directory: ./docs/
- Library: @aexoo-ai/spark-id

# Goal:
Update documentation to reflect ALL changes since main branch. Focus on:
1. API documentation (docs/api/*.md)
2. Examples and guides (docs/examples/, docs/guide/)
3. Configuration documentation
4. README updates if needed
5. CLI documentation (docs/cli/)

# Documentation Structure:
- docs/api/functions.md - Function documentation
- docs/api/classes.md - Class documentation  
- docs/api/types.md - Type definitions
- docs/api/index.md - API overview
- docs/guide/ - User guides
- docs/examples/ - Code examples
- docs/cli/ - CLI documentation

# Requirements:
- Only update docs relevant to the changes
- Maintain VitePress formatting and frontmatter
- Keep existing doc structure and style
- Add new functions/classes to appropriate files
- Update examples to reflect new features
- Ensure code examples are accurate and working
- Maintain consistent formatting and tone

# Code Changes to Document:
$CHANGES

# Output:
- Update markdown files in docs/
- Provide a summary of what was updated
- Ensure all new features are documented
- Update examples to use new APIs

# Important:
- Be thorough but concise
- Maintain the existing documentation style
- Ensure all new functions, classes, and types are documented
- Update configuration examples if configuration system changed"

echo "🤖 Running Cursor agent to update documentation..."

# Run Cursor agent
cursor-agent -p "$PROMPT" \
    --model "gpt-5" \
    --force \
    --output-format=text

echo ""
echo "✅ Documentation update complete!"
echo ""
echo "📖 Next steps:"
echo "   1. Review changes: git diff docs/"
echo "   2. Preview docs: pnpm docs:dev"
echo "   3. Build docs: pnpm docs:build"
echo "   4. Commit if happy: git add docs/ && git commit -m 'Update docs'"
echo ""
echo "🔍 To see what changed:"
echo "   git diff docs/"
