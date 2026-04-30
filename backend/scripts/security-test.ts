import axios from 'axios';

const API_URL = 'http://localhost:4000';
const TEST_EMAIL = 'security-test@trc.local';
const TEST_PASS = 'password123';

async function runSecurityTests() {
  console.log('🛡️ Starting Security Validation...');

  // 1. Brute Force Protection Test
  console.log('\n--- Testing Brute Force Protection ---');
  for (let i = 1; i <= 6; i++) {
    try {
      await axios.post(`${API_URL}/auth/login`, { email: TEST_EMAIL, password: 'wrong-password' });
    } catch (error: any) {
      console.log(`Attempt ${i}: ${error.response?.data?.error?.message}`);
      if (i === 6 && error.response?.data?.error?.code === 'AUTH_ERROR') {
        console.log('✅ SUCCESS: Account locked after 5 attempts.');
      }
    }
  }

  // 2. Rate Limiting Test
  console.log('\n--- Testing Rate Limiting ---');
  let blocked = false;
  for (let i = 1; i <= 10; i++) {
    try {
      await axios.post(`${API_URL}/auth/login`, { email: 'spam@trc.local', password: 'any' });
    } catch (error: any) {
      if (error.response?.status === 429) {
        blocked = true;
        console.log('✅ SUCCESS: Rate limit triggered (429 Too Many Requests).');
        break;
      }
    }
  }
  if (!blocked) console.log('❌ FAILURE: Rate limit not triggered.');

  // 3. Token Reuse Detection Test
  console.log('\n--- Testing Token Reuse Detection (Panic Mode) ---');
  try {
    // Setup: Login to get tokens
    const login = await axios.post(`${API_URL}/auth/login`, { email: 'admin@trc.local', password: 'admin123' });
    const { refreshToken } = login.data;

    // Use refresh token once (valid)
    console.log('Rotating token once...');
    const refresh1 = await axios.post(`${API_URL}/auth/refresh`, { token: refreshToken });
    
    // Attempt to reuse the OLD refresh token
    console.log('Attempting reuse of revoked token...');
    await axios.post(`${API_URL}/auth/refresh`, { token: refreshToken });
  } catch (error: any) {
    if (error.response?.data?.error?.message.includes('Panic Mode')) {
      console.log('✅ SUCCESS: Token reuse detected. Panic Mode triggered.');
    } else {
      console.log(`Unexpected result: ${error.response?.data?.error?.message}`);
    }
  }
}

runSecurityTests().catch(console.error);
