import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'node:dns';
import User from './src/models/User.js';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

dotenv.config();

const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('====================================================');
  console.log('🧪 RUNNING COMPREHENSIVE PHASE 1 AUTH INTEGRATION TESTS');
  console.log('====================================================');

  const testEmail = `athlete_test_${Date.now()}@fitpulse.ai`;
  const testPassword = 'Password123!@#';
  const testName = 'Alex Testrunner';

  let accessToken = null;
  let refreshCookie = null;
  let createdUserId = null;

  // Helper to extract cookies
  const getCookie = (res) => {
    const raw = res.headers.get('set-cookie');
    if (!raw) return null;
    return raw.split(';')[0];
  };

  try {
    // 1. Health check
    console.log('\n[TEST 1] GET /api/health');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    console.log(`Status: ${healthRes.status}, Body:`, healthData);
    if (healthRes.status !== 200 || healthData.status !== 'Healthy') {
      throw new Error('Health check failed');
    }
    console.log('✅ TEST 1 PASSED: Server is healthy');

    // 2. Register user
    console.log('\n[TEST 2] POST /api/auth/register (New User)');
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: testName,
        email: testEmail,
        password: testPassword,
      }),
    });
    const regData = await regRes.json();
    refreshCookie = getCookie(regRes);
    accessToken = regData.accessToken;
    createdUserId = regData.user?.id;

    console.log(`Status: ${regRes.status}`);
    console.log(`Access Token present: ${Boolean(accessToken)}`);
    console.log(`Refresh Cookie header: ${refreshCookie}`);
    console.log(`User data returned:`, regData.user);
    console.log(`Password in response? ${Boolean(regData.user?.password)}`);

    if (regRes.status !== 201 || !accessToken || !refreshCookie || regData.user?.password) {
      throw new Error('Registration test failed');
    }
    console.log('✅ TEST 2 PASSED: User registered with tokens, password withheld');

    // 3. Duplicate email registration
    console.log('\n[TEST 3] POST /api/auth/register (Duplicate Email)');
    const dupRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Another Name',
        email: testEmail,
        password: testPassword,
      }),
    });
    const dupData = await dupRes.json();
    console.log(`Status: ${dupRes.status}, Message: "${dupData.message}"`);
    if (dupRes.status !== 409) {
      throw new Error('Duplicate email was not rejected with 409 Conflict');
    }
    console.log('✅ TEST 3 PASSED: Duplicate registration rejected with 409 Conflict');

    // 4. Login with invalid password
    console.log('\n[TEST 4] POST /api/auth/login (Invalid Password)');
    const badLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'WrongPassword999!',
      }),
    });
    const badLoginData = await badLoginRes.json();
    console.log(`Status: ${badLoginRes.status}, Message: "${badLoginData.message}"`);
    if (badLoginRes.status !== 401) {
      throw new Error('Invalid login did not return 401 Unauthorized');
    }
    console.log('✅ TEST 4 PASSED: Invalid credentials rejected with 401');

    // 5. Login with valid credentials
    console.log('\n[TEST 5] POST /api/auth/login (Valid Credentials)');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });
    const loginData = await loginRes.json();
    refreshCookie = getCookie(loginRes);
    accessToken = loginData.accessToken;

    console.log(`Status: ${loginRes.status}`);
    console.log(`New Access Token: ${accessToken ? accessToken.slice(0, 20) + '...' : 'NONE'}`);
    console.log(`New Refresh Cookie: ${refreshCookie}`);
    if (loginRes.status !== 200 || !accessToken || !refreshCookie) {
      throw new Error('Valid login failed');
    }
    console.log('✅ TEST 5 PASSED: Login succeeded and returned tokens');

    // 6. Access protected route without token
    console.log('\n[TEST 6] GET /api/auth/me (No Bearer Token)');
    const unauthRes = await fetch(`${BASE_URL}/auth/me`);
    const unauthData = await unauthRes.json();
    console.log(`Status: ${unauthRes.status}, Code: ${unauthData.code}`);
    if (unauthRes.status !== 401) {
      throw new Error('Protected route allowed unauthenticated access');
    }
    console.log('✅ TEST 6 PASSED: Protected route rejected unauthenticated request');

    // 7. Access protected route with Bearer token
    console.log('\n[TEST 7] GET /api/auth/me (With Bearer Token)');
    const authRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const authData = await authRes.json();
    console.log(`Status: ${authRes.status}, User:`, authData.user);
    if (authRes.status !== 200 || authData.user?.email !== testEmail.toLowerCase()) {
      throw new Error('Protected route failed to return user data');
    }
    console.log('✅ TEST 7 PASSED: Protected route returned user data');

    // 8. Refresh access token via cookie
    console.log('\n[TEST 8] POST /api/auth/refresh (With Refresh Cookie)');
    const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        Cookie: refreshCookie,
      },
    });
    const refreshData = await refreshRes.json();
    const rotatedCookie = getCookie(refreshRes);
    console.log(`Status: ${refreshRes.status}`);
    console.log(`Refreshed Token: ${refreshData.accessToken ? refreshData.accessToken.slice(0, 20) + '...' : 'NONE'}`);
    console.log(`Rotated Cookie: ${rotatedCookie || 'Existing'}`);
    if (refreshRes.status !== 200 || !refreshData.accessToken) {
      throw new Error('Token refresh failed');
    }
    accessToken = refreshData.accessToken;
    if (rotatedCookie) refreshCookie = rotatedCookie;
    console.log('✅ TEST 8 PASSED: Access token refreshed successfully');

    // 9. Logout and verify token revocation
    console.log('\n[TEST 9] POST /api/auth/logout');
    const logoutRes = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        Cookie: refreshCookie,
      },
    });
    const logoutData = await logoutRes.json();
    const clearedCookie = getCookie(logoutRes);
    console.log(`Status: ${logoutRes.status}, Body:`, logoutData);
    console.log(`Cleared cookie header: ${clearedCookie}`);
    if (logoutRes.status !== 200) {
      throw new Error('Logout failed');
    }
    console.log('✅ TEST 9 PASSED: Logged out and cleared cookie');

    // 10. Attempt refresh after logout (should be revoked)
    console.log('\n[TEST 10] POST /api/auth/refresh (After Logout - Should Fail)');
    const postLogoutRefreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        Cookie: refreshCookie,
      },
    });
    const postLogoutRefreshData = await postLogoutRefreshRes.json();
    console.log(`Status: ${postLogoutRefreshRes.status}, Message: "${postLogoutRefreshData.message}"`);
    if (postLogoutRefreshRes.status === 200) {
      throw new Error('Revoked refresh token was erroneously accepted');
    }
    console.log('✅ TEST 10 PASSED: Revoked refresh token rejected');

    console.log('\n====================================================');
    console.log('🎉 ALL 10 AUTHENTICATION INTEGRATION TESTS PASSED!');
    console.log('====================================================');
  } catch (err) {
    console.error('\n❌ TEST SUITE FAILED:', err.message);
  } finally {
    // Clean up test user from MongoDB Atlas
    if (createdUserId) {
      try {
        await mongoose.connect(process.env.MONGO_URI);
        await User.findByIdAndDelete(createdUserId);
        console.log(`[Cleanup] Deleted test user ${createdUserId} from MongoDB Atlas.`);
        await mongoose.disconnect();
      } catch (cleanupErr) {
        console.warn('[Cleanup Warning]:', cleanupErr.message);
      }
    }
    process.exit(0);
  }
};

runTests();
