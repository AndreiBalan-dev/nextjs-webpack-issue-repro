# Next.js Devtools Production Bundle Bug Reproduction

This repository demonstrates a bug where ~840KB of dev-only code (devtools CSS, UI components) is bundled into webpack production builds.

## Quick Start

```bash
# Install dependencies (must use npm ci for exact versions)
npm ci

# Build with webpack
npm run build:webpack

# Verify the bug (count occurrences of dev-only strings)
grep -o "next-devtools" .next/static/chunks/ed9f2dc4-*.js | wc -l
# Expected: 27 (should be 0 in production)

grep -o "dev-overlay" .next/static/chunks/ed9f2dc4-*.js | wc -l
# Expected: 29 (should be 0 in production)
```

## The Issue

- **Affected chunk**: `ed9f2dc4-*.js` (~840 KB)
- **Dev-only strings found**:
  - `next-devtools`: 27 occurrences
  - `dev-overlay`: 29 occurrences
  - `dev-tools-indicator`: 16 occurrences

## Root Cause

Webpack doesn't tree-shake `require()` calls inside `process.env.NODE_ENV` guards. The dev-only modules are added to the dependency graph before dead code elimination runs.

## Notes

- This only affects **webpack** builds (`next build --webpack`)
- **Turbopack** (default in Next.js 16) handles this correctly
- The bug is triggered by specific dependency version combinations
- Using `npm ci` with the exact lock file is required to reproduce
