const axios = require('axios');

async function testRegister() {
  try {
    const response = await axios.post('https://trc-backend.onrender.com/auth/register', {
      email: `test-${Date.now()}@example.com`,
      password: 'password123',
      name: 'Test User',
      institution: 'Test University',
      role: 'Public User'
    });
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testRegister();
