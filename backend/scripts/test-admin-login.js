const axios = require('axios');

async function testAdminLogin() {
  try {
    const response = await axios.post('https://trc-backend.onrender.com/auth/login', {
      email: 'admin@trc.local',
      password: 'admin123'
    });
    console.log('Login Response User Role:', response.data.user.role);
    console.log('Full User Object:', JSON.stringify(response.data.user, null, 2));
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testAdminLogin();
