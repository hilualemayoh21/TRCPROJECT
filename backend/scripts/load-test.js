import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 }, // Ramp up to 50 users
    { duration: '1m', target: 50 },  // Stay at 50 users
    { duration: '30s', target: 0 },  // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'],   // Error rate should be less than 1%
  },
};

const BASE_URL = 'http://localhost:4000';

export default function () {
  // 1. Health Check
  const healthRes = http.get(`${BASE_URL}/health`);
  check(healthRes, { 'health status is 200': (r) => r.status === 200 });

  // 2. Login (Heavy operation - bcrypt)
  const loginPayload = JSON.stringify({
    email: 'admin@trc.local',
    password: 'admin123',
  });
  const loginParams = { headers: { 'Content-Type': 'application/json' } };
  const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, loginParams);
  
  check(loginRes, {
    'login successful': (r) => r.status === 200,
    'has access token': (r) => r.json().accessToken !== undefined,
  });

  sleep(1);
}
