#!/bin/bash

# Check for broken links in documentation
# This script can be run in CI to ensure all links are valid

set -e

echo "🔍 Checking for broken links in documentation..."

# Check if we're in a CI environment
if [ -n "$CI" ]; then
    echo "Running in CI mode - will fail on any broken links"
    FAIL_ON_ERROR=true
else
    echo "Running in local mode - will warn on broken links"
    FAIL_ON_ERROR=false
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Try different link checkers
if command_exists "markdown-link-check"; then
    echo "Using markdown-link-check..."
    
    # Find all markdown files and check their links
    find docs/ -name "*.md" -exec markdown-link-check {} \; 2>/dev/null || {
        if [ "$FAIL_ON_ERROR" = true ]; then
            echo "❌ Broken links found!"
            exit 1
        else
            echo "⚠️  Some links may be broken (check output above)"
        fi
    }
    
elif command_exists "npx"; then
    echo "Using npx markdown-link-check..."
    
    # Install and run markdown-link-check via npx
    npx markdown-link-check docs/**/*.md 2>/dev/null || {
        if [ "$FAIL_ON_ERROR" = true ]; then
            echo "❌ Broken links found!"
            exit 1
        else
            echo "⚠️  Some links may be broken (check output above)"
        fi
    }
    
else
    echo "⚠️  No link checker found. Install markdown-link-check:"
    echo "   npm install -g markdown-link-check"
    echo "   or"
    echo "   npm install --save-dev markdown-link-check"
    
    if [ "$FAIL_ON_ERROR" = true ]; then
        echo "❌ Cannot check links - failing build"
        exit 1
    fi
fi

echo "✅ Link check completed!"
