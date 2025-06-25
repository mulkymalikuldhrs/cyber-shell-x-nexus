#!/usr/bin/env node

// Repository Verification Script
// Ensures correct GitHub repository is configured

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const OFFICIAL_REPO = 'https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus.git';

console.log('🔍 Verifying repository configuration...');

async function verifyRepo() {
  try {
    // Check current remote URL
    const { stdout } = await execAsync('git remote get-url origin');
    const currentRepo = stdout.trim();
    
    console.log(`Current repository: ${currentRepo}`);
    console.log(`Expected repository: ${OFFICIAL_REPO}`);
    
    if (currentRepo === OFFICIAL_REPO || currentRepo === OFFICIAL_REPO.replace('.git', '')) {
      console.log('✅ Repository configuration is correct');
      return true;
    } else {
      console.log('⚠️  Repository URL mismatch detected');
      
      // Fix the repository URL
      console.log('🔧 Updating repository URL...');
      await execAsync(`git remote set-url origin ${OFFICIAL_REPO}`);
      console.log('✅ Repository URL updated');
      
      return true;
    }
  } catch (error) {
    console.log('❌ Git repository not found or not configured');
    console.log('Run this in a git repository or clone from:');
    console.log(OFFICIAL_REPO);
    return false;
  }
}

verifyRepo().catch(console.error);