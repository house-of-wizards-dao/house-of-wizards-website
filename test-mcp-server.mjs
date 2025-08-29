#!/usr/bin/env node

import { spawn } from 'child_process';
import readline from 'readline';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

console.log(`${colors.cyan}${colors.bright}Supabase MCP Server Test${colors.reset}\n`);

// Check if access token is provided
const accessToken = process.env.SUPABASE_ACCESS_TOKEN || process.argv[2];

if (!accessToken) {
  console.log(`${colors.red}Error: No access token provided${colors.reset}`);
  console.log('\nUsage:');
  console.log('  1. Set environment variable: export SUPABASE_ACCESS_TOKEN=your_token');
  console.log('  2. Or pass as argument: node test-mcp-server.mjs your_token');
  console.log('\nGet your token at: https://supabase.com/dashboard/account/tokens');
  process.exit(1);
}

console.log(`${colors.green}✓ Access token found${colors.reset}`);
console.log(`${colors.yellow}Starting MCP server test...${colors.reset}\n`);

// Spawn the MCP server process
const mcp = spawn('npx', [
  '@supabase/mcp-server-supabase',
  '--access-token',
  accessToken,
], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Create readline interface for interactive input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
});

// Handle MCP server output
mcp.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(`${colors.blue}[MCP Server]${colors.reset} ${output}`);
  
  // Check if server started successfully
  if (output.includes('ready') || output.includes('started')) {
    console.log(`${colors.green}✓ MCP Server is running${colors.reset}`);
    showTestCommands();
  }
});

// Handle MCP server errors
mcp.stderr.on('data', (data) => {
  console.error(`${colors.red}[MCP Error]${colors.reset} ${data}`);
});

// Handle MCP server exit
mcp.on('close', (code) => {
  console.log(`${colors.yellow}MCP server exited with code ${code}${colors.reset}`);
  rl.close();
  process.exit(code);
});

// Show available test commands
function showTestCommands() {
  console.log(`\n${colors.cyan}Available test commands:${colors.reset}`);
  console.log('  1. list - List all projects');
  console.log('  2. schema - Get database schema');
  console.log('  3. test-sql - Run a test SQL query');
  console.log('  4. exit - Stop the server');
  console.log('\n');
  
  promptCommand();
}

// Interactive command prompt
function promptCommand() {
  rl.question(`${colors.bright}Enter command: ${colors.reset}`, (answer) => {
    switch(answer.trim().toLowerCase()) {
      case '1':
      case 'list':
        sendMCPRequest({ method: 'list_projects' });
        break;
        
      case '2':
      case 'schema':
        sendMCPRequest({ 
          method: 'get_schema',
          params: { project_id: 'gptihsbiexsdxpkxkkwy' }
        });
        break;
        
      case '3':
      case 'test-sql':
        sendMCPRequest({ 
          method: 'execute_sql',
          params: {
            project_id: 'gptihsbiexsdxpkxkkwy',
            query: 'SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = \'public\''
          }
        });
        break;
        
      case '4':
      case 'exit':
        console.log(`${colors.yellow}Stopping MCP server...${colors.reset}`);
        mcp.kill();
        rl.close();
        process.exit(0);
        break;
        
      default:
        console.log(`${colors.red}Unknown command: ${answer}${colors.reset}`);
        promptCommand();
    }
  });
}

// Send request to MCP server
function sendMCPRequest(request) {
  console.log(`${colors.yellow}Sending request: ${JSON.stringify(request, null, 2)}${colors.reset}`);
  
  // MCP uses JSON-RPC protocol
  const jsonRpcRequest = {
    jsonrpc: '2.0',
    id: Date.now(),
    method: request.method,
    params: request.params || {}
  };
  
  mcp.stdin.write(JSON.stringify(jsonRpcRequest) + '\n');
  
  // Continue prompting
  setTimeout(() => promptCommand(), 1000);
}

// Handle process termination
process.on('SIGINT', () => {
  console.log(`\n${colors.yellow}Received SIGINT, stopping MCP server...${colors.reset}`);
  mcp.kill();
  rl.close();
  process.exit(0);
});

console.log(`${colors.cyan}Initializing MCP server...${colors.reset}`);
console.log('(This may take a moment)\n');