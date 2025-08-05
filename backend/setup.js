#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 CI/CD Monitoring Dashboard Setup');
console.log('=====================================\n');

console.log('To use this dashboard, you need a GitHub Personal Access Token.');
console.log('📋 Follow these steps:\n');
console.log('1. Go to: https://github.com/settings/tokens');
console.log('2. Click "Generate new token (classic)"');
console.log('3. Give it a name like "CI/CD Dashboard"');
console.log('4. Select these scopes:');
console.log('   ✅ repo (Full control of private repositories)');
console.log('   ✅ workflow (Update GitHub Action workflows)');
console.log('5. Click "Generate token"');
console.log('6. Copy the token (starts with ghp_ or github_pat_)\n');

rl.question('📝 Enter your GitHub Personal Access Token: ', (token) => {
  if (!token || token.trim() === '' || token === 'your_github_personal_access_token_here') {
    console.log('❌ No valid token provided. Please run this script again with a real token.');
    rl.close();
    return;
  }

  // Update .env file
  const envPath = path.join(__dirname, '.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  envContent = envContent.replace(
    'GITHUB_TOKEN=your_github_personal_access_token_here',
    `GITHUB_TOKEN=${token.trim()}`
  );
  
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ GitHub token configured successfully!');
  console.log('\n🚀 You can now:');
  console.log('1. Start the backend: npm run start:backend');
  console.log('2. Start the frontend: npm run start:frontend');
  console.log('3. Or start both: npm start');
  console.log('\n📊 Access the dashboard at: http://localhost:3000');
  
  rl.close();
});
