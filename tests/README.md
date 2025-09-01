# Tests Directory

This directory contains all testing files organized by test type and purpose.

## Structure

- **`integration/`** - API endpoint and integration tests
- **`unit/`** - Unit tests for individual functions/components (future)
- **`e2e/`** - End-to-end tests (future)
- **`fixtures/`** - Test data and mock objects
- **`utilities/`** - Test utilities and verification scripts

## Current Test Files

### Integration Tests
- `endpoints_test.js` - Basic API endpoint testing
- `endpoints_comprehensive_test.js` - Comprehensive API testing suite
- `rate_limit_test.js` - Rate limiting functionality tests
- `storage_test.js` - File storage and upload tests

### Utilities
- `verify_implementation.js` - System verification and validation script

## Running Tests

```bash
# Run all Jest tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run integration tests manually
node tests/integration/endpoints_test.js
```

## Test Development Guidelines

1. Keep test files focused and organized by feature
2. Use descriptive test names that explain the expected behavior
3. Include both positive and negative test cases
4. Mock external dependencies appropriately
5. Clean up test data after test runs