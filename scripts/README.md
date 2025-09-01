# Scripts Directory

This directory contains utility scripts organized by purpose and usage context.

## Structure

- **`database/`** - Database management and migration scripts
- **`deployment/`** - Deployment automation and setup scripts
- **`development/`** - Development utilities and debugging tools

## Current Scripts

### Development Scripts
- `development/quick_api_test.js` - Quick API endpoint testing utility

## Script Categories

### Database Scripts (Future)
- Migration runners
- Database backup utilities
- Schema validation tools

### Deployment Scripts (Future)
- Automated deployment workflows
- Environment setup scripts
- Production deployment validation

### Development Scripts
- API testing utilities
- Debug helpers
- Development server tools

## Usage Guidelines

1. Make scripts executable: `chmod +x script_name.js`
2. Include usage instructions in script comments
3. Handle errors gracefully with proper exit codes
4. Use environment variables for configuration
5. Log important operations for debugging

## Running Scripts

```bash
# Run development scripts
node scripts/development/quick_api_test.js

# Run with specific environment
NODE_ENV=development node scripts/development/script_name.js
```

## Security Notes

- Never commit API keys or secrets in scripts
- Use environment variables for sensitive data
- Validate inputs to prevent injection attacks
- Test scripts in development before production use