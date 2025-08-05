const axios = require('axios');

console.log('🧪 Testing CI/CD Dashboard APIs\n');

// Test 1: Health Check
console.log('1. Testing Backend Health...');
axios.get('http://localhost:5000/api/health')
  .then(response => {
    console.log('✅ Backend Health:', response.data);
    
    // Test 2: GitHub API with public repository
    console.log('\n2. Testing GitHub API with public repository...');
    return axios.get('http://localhost:5000/api/github-status?owner=octocat&repo=Hello-World');
  })
  .then(response => {
    console.log('✅ GitHub API Test Success!');
    console.log(`📊 Found ${response.data.runs.length} workflow runs`);
    console.log(`🏢 Repository: ${response.data.repository}`);
    
    if (response.data.runs.length > 0) {
      const latestRun = response.data.runs[0];
      console.log(`🔄 Latest run: ${latestRun.name} - ${latestRun.conclusion || latestRun.status}`);
    }
    
    console.log('\n🎉 All tests passed! Your dashboard is ready to use.');
    console.log('💡 Open http://localhost:3000 to see the dashboard');
  })
  .catch(error => {
    console.log('\n❌ Test Failed:');
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Error: ${error.response.data.error || error.response.data}`);
      
      if (error.response.status === 401) {
        console.log('\n🔧 Fix: Update your GitHub token in backend/.env');
        console.log('Run: npm run setup (or use setup.bat on Windows)');
      }
    } else {
      console.log('Network Error:', error.message);
      console.log('\n🔧 Fix: Make sure the backend is running on port 5000');
      console.log('Run: npm run start:backend');
    }
  });
