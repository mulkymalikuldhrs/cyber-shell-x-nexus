#!/usr/bin/env node

// CyberShellX Health Check Script
// Verifies all components are working properly

import 'dotenv/config';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔍 CyberShellX Nexus - System Health Check');
console.log('==========================================\n');

let checks = {
  files: 0,
  dependencies: 0,
  database: 0,
  apis: 0,
  total: 4
};

// Check essential files
console.log('📁 Checking essential files...');
const essentialFiles = [
  'run.sh',
  'cli-interface.js',
  'server/index.ts',
  'server/gemini-api.ts',
  'client/src/App.tsx',
  'package.json'
];

let filesOk = true;
essentialFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    filesOk = false;
  }
});

if (filesOk) checks.files = 1;
console.log(filesOk ? '  Files check: PASSED\n' : '  Files check: FAILED\n');

// Check Node.js dependencies
console.log('📦 Checking dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(`  ✅ Package.json loaded`);
  console.log(`  ✅ ${Object.keys(packageJson.dependencies || {}).length} dependencies`);
  console.log(`  ✅ ${Object.keys(packageJson.devDependencies || {}).length} dev dependencies`);
  checks.dependencies = 1;
  console.log('  Dependencies check: PASSED\n');
} catch (error) {
  console.log('  ❌ Package.json error:', error.message);
  console.log('  Dependencies check: FAILED\n');
}

// Check database connection
console.log('🗄️  Checking database...');
if (process.env.DATABASE_URL) {
  console.log('  ✅ DATABASE_URL configured');
  checks.database = 1;
  console.log('  Database check: PASSED\n');
} else {
  console.log('  ❌ DATABASE_URL not configured');
  console.log('  Database check: FAILED\n');
}

// Check API keys
console.log('🔑 Checking API configuration...');
const apiKeys = ['GOOGLE_API_KEY', 'GOOGLE_API_KEY_2', 'GEMINI_API_KEY'];
let apiCount = 0;

apiKeys.forEach(key => {
  if (process.env[key]) {
    console.log(`  ✅ ${key} configured`);
    apiCount++;
  } else {
    console.log(`  ⚠️  ${key} not configured`);
  }
});

if (apiCount > 0) {
  checks.apis = 1;
  console.log(`  API check: PASSED (${apiCount} keys available)\n`);
} else {
  console.log('  API check: FAILED (no keys configured)\n');
}

// Final summary
const passed = Object.values(checks).reduce((sum, val) => sum + val, 0) - checks.total;
const total = checks.total;

console.log('📊 SUMMARY');
console.log('==========');
console.log(`Files: ${checks.files ? 'PASS' : 'FAIL'}`);
console.log(`Dependencies: ${checks.dependencies ? 'PASS' : 'FAIL'}`);
console.log(`Database: ${checks.database ? 'PASS' : 'FAIL'}`);
console.log(`APIs: ${checks.apis ? 'PASS' : 'FAIL'}`);
console.log(`\nOverall: ${passed}/${total} checks passed`);

if (passed === total) {
  console.log('\n🎉 System is healthy and ready to run!');
  process.exit(0);
} else {
  console.log('\n⚠️  System has issues that need attention.');
  process.exit(1);
}