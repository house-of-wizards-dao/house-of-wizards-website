#!/bin/bash
# Rollback Script for File Structure Migration
#
# WARNING: This script will undo all file structure changes
# Make sure you have committed any work before running this script
#
# Usage: bash scripts/development/rollback-migration.sh

set -e

echo "🔄 Starting file structure rollback..."
echo "⚠️  This will undo the src/ directory migration"
echo "⚠️  Press Ctrl+C within 5 seconds to cancel..."
sleep 5

# Check if src directory exists
if [ ! -d "src" ]; then
    echo "❌ src directory not found. Nothing to rollback."
    exit 1
fi

# Create backup of current state
echo "📦 Creating backup of current state..."
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r src "$BACKUP_DIR/"
echo "✅ Backup created at $BACKUP_DIR/"

# Move directories back to root
echo "📁 Moving directories back to root..."

if [ -d "src/components" ]; then
    echo "  Moving components..."
    mv src/components ./ || echo "  ⚠️  Failed to move components"
fi

if [ -d "src/pages" ]; then
    echo "  Moving pages..."
    mv src/pages ./ || echo "  ⚠️  Failed to move pages"
fi

if [ -d "src/lib" ]; then
    echo "  Moving lib..."
    mv src/lib ./ || echo "  ⚠️  Failed to move lib"
fi

if [ -d "src/hooks" ]; then
    echo "  Moving hooks..."
    mv src/hooks ./ || echo "  ⚠️  Failed to move hooks"
fi

if [ -d "src/types" ]; then
    echo "  Moving types..."
    mv src/types ./ || echo "  ⚠️  Failed to move types"
fi

if [ -d "src/config" ]; then
    echo "  Moving config..."
    mv src/config ./ || echo "  ⚠️  Failed to move config"
fi

if [ -d "src/layouts" ]; then
    echo "  Moving layouts..."
    mv src/layouts ./ || echo "  ⚠️  Failed to move layouts"
fi

if [ -d "src/styles" ]; then
    echo "  Moving styles..."
    mv src/styles ./ || echo "  ⚠️  Failed to move styles"
fi

# Remove empty src directory
if [ -d "src" ] && [ -z "$(ls -A src)" ]; then
    echo "  Removing empty src directory..."
    rmdir src
fi

# Move tests back to __tests__
if [ -d "tests" ]; then
    echo "  Moving tests back to __tests__..."
    mv tests __tests__ || echo "  ⚠️  Failed to move tests"
fi

# Revert configuration files
echo "🔧 Reverting configuration files..."

# Revert tsconfig.json
echo "  Reverting tsconfig.json..."
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
  "exclude": ["node_modules"]
}
EOF

# Revert jest.config.js
echo "  Reverting jest.config.js..."
cat > jest.config.js << 'EOF'
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'pages/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!pages/_app.tsx',
    '!pages/_document.tsx',
    '!pages/api/**',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 40,
      lines: 40,
      statements: 40,
    },
  },
  testMatch: [
    '<rootDir>/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/**/*.(test|spec).{js,jsx,ts,tsx}',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
EOF

# Revert tailwind.config.js
echo "  Reverting tailwind.config.js..."
sed -i '' 's|./src/config/design-tokens|./config/design-tokens|g' tailwind.config.js
sed -i '' 's|./src/layouts/|./layouts/|g' tailwind.config.js
sed -i '' 's|./src/pages/|./pages/|g' tailwind.config.js
sed -i '' 's|./src/components/|./components/|g' tailwind.config.js

# Revert .gitignore to basic version
echo "  Reverting .gitignore..."
cat > .gitignore << 'EOF'
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
EOF

# Remove migration-specific files
echo "🧹 Cleaning up migration-specific files..."
rm -f .env.example
rm -f FILE_STRUCTURE_GUIDE.md
rm -rf scripts/
rm -f tests/tsconfig.json

echo ""
echo "✅ Rollback completed successfully!"
echo "📦 Backup of src/ structure saved in: $BACKUP_DIR/"
echo ""
echo "Next steps:"
echo "1. Run 'npm run type-check' to verify everything works"
echo "2. Run 'npm run build' to test the build"
echo "3. Remove backup directory when confident: rm -rf $BACKUP_DIR"
echo ""
echo "⚠️  Note: You may need to manually fix any import paths that were updated for the src/ structure"