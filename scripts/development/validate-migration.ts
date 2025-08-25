/**
 * Migration Validation Script
 * 
 * Validates that the file structure migration was successful
 * and all imports are still working correctly
 */

import * as fs from 'fs';
import * as path from 'path';

interface ValidationResult {
  success: boolean;
  message: string;
  details?: string[];
}

const EXPECTED_STRUCTURE = {
  'src/components': true,
  'src/pages': true,
  'src/lib': true,
  'src/hooks': true,
  'src/types': true,
  'src/config': true,
  'src/layouts': true,
  'scripts/db/maintenance': true,
  'tests': true,
  'supabase/migrations': true,
  '.env.example': false, // file, not directory
};

const CRITICAL_FILES = [
  'src/pages/_app.tsx',
  'src/pages/_document.tsx',
  'src/pages/index.tsx',
  'src/components/Web3Provider.tsx',
  'src/lib/supabase.ts',
  'src/lib/auth.ts',
  'package.json',
  'next.config.js',
  'tsconfig.json',
];

const DANGEROUS_FILES = [
  'fix_admin_user.js',
  'fix_transformation.js',
  'minimal_fix.js',
  'test_api.js',
];

function checkPath(filePath: string, isDirectory: boolean = true): ValidationResult {
  const fullPath = path.join(process.cwd(), filePath);
  const exists = fs.existsSync(fullPath);
  
  if (!exists) {
    return {
      success: false,
      message: `${isDirectory ? 'Directory' : 'File'} missing: ${filePath}`
    };
  }
  
  const stat = fs.statSync(fullPath);
  const isCorrectType = isDirectory ? stat.isDirectory() : stat.isFile();
  
  if (!isCorrectType) {
    return {
      success: false,
      message: `Incorrect type for ${filePath}: expected ${isDirectory ? 'directory' : 'file'}`
    };
  }
  
  return {
    success: true,
    message: `✅ ${filePath} exists and is correct type`
  };
}

function checkDangerousFiles(): ValidationResult {
  const found = [];
  
  for (const file of DANGEROUS_FILES) {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      found.push(file);
    }
  }
  
  if (found.length > 0) {
    return {
      success: false,
      message: 'Dangerous files still present',
      details: found
    };
  }
  
  return {
    success: true,
    message: '✅ All dangerous files have been removed'
  };
}

function checkImportPaths(): ValidationResult {
  const issues = [];
  
  // Check a few critical files for import path issues
  const filesToCheck = [
    'src/pages/_app.tsx',
    'src/components/Web3Provider.tsx',
  ];
  
  for (const file of filesToCheck) {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Check for old relative imports that might be broken
      const oldImports = content.match(/import.*from\s+['"](\.\.?\/).*['"];?/g);
      if (oldImports && oldImports.length > 0) {
        issues.push(`${file}: Found potentially problematic relative imports`);
      }
    }
  }
  
  if (issues.length > 0) {
    return {
      success: false,
      message: 'Import path issues detected',
      details: issues
    };
  }
  
  return {
    success: true,
    message: '✅ Import paths appear to be correct'
  };
}

function checkPackageJson(): ValidationResult {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const requiredScripts = ['db:test', 'db:setup-admin', 'type-check'];
    const missing = requiredScripts.filter(script => !packageJson.scripts[script]);
    
    if (missing.length > 0) {
      return {
        success: false,
        message: 'Missing package.json scripts',
        details: missing
      };
    }
    
    return {
      success: true,
      message: '✅ Package.json has required scripts'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to validate package.json',
      details: [error instanceof Error ? error.message : 'Unknown error']
    };
  }
}

async function validateMigration() {
  console.log('🔍 Validating file structure migration...\n');
  
  const results: ValidationResult[] = [];
  
  // Check expected directory structure
  console.log('Checking directory structure...');
  for (const [pathToCheck, isDirectory] of Object.entries(EXPECTED_STRUCTURE)) {
    const result = checkPath(pathToCheck, isDirectory);
    results.push(result);
    console.log(result.message);
  }
  
  console.log('\nChecking critical files...');
  for (const file of CRITICAL_FILES) {
    const result = checkPath(file, false);
    results.push(result);
    console.log(result.message);
  }
  
  console.log('\nChecking for dangerous files...');
  const dangerousResult = checkDangerousFiles();
  results.push(dangerousResult);
  console.log(dangerousResult.message);
  if (dangerousResult.details) {
    dangerousResult.details.forEach(detail => console.log(`  ❌ ${detail}`));
  }
  
  console.log('\nChecking package.json...');
  const packageResult = checkPackageJson();
  results.push(packageResult);
  console.log(packageResult.message);
  if (packageResult.details) {
    packageResult.details.forEach(detail => console.log(`  - ${detail}`));
  }
  
  console.log('\nChecking import paths...');
  const importResult = checkImportPaths();
  results.push(importResult);
  console.log(importResult.message);
  if (importResult.details) {
    importResult.details.forEach(detail => console.log(`  ⚠️  ${detail}`));
  }
  
  // Summary
  const failures = results.filter(r => !r.success);
  const successes = results.filter(r => r.success);
  
  console.log('\n📊 Migration Validation Summary:');
  console.log(`✅ Passed: ${successes.length}`);
  console.log(`❌ Failed: ${failures.length}`);
  
  if (failures.length === 0) {
    console.log('\n🎉 Migration validation completed successfully!');
    console.log('The file structure has been properly reorganized.');
  } else {
    console.log('\n⚠️  Migration validation found issues:');
    failures.forEach(failure => {
      console.log(`  • ${failure.message}`);
      if (failure.details) {
        failure.details.forEach(detail => console.log(`    - ${detail}`));
      }
    });
  }
  
  return failures.length === 0;
}

// Run validation
validateMigration().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('❌ Validation failed with error:', error);
  process.exit(1);
});