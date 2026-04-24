async function testSubmit() {
  try {
    console.log('Logging in...');
    // Real endpoint is /api/v1/auth/login
    // But login data might be in a different format. 
    // In seed.ts: 'rohit.schoolleader@pdi.com', 'Rohit@123'
    const loginRes = await fetch('http://localhost:4000/api/v1/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'rohit.schoolleader@pdi.com',
        password: 'Rohit@123'
      })
    });
    // Wait, the authRoutes.ts maps /login to authController.login
    // So it's /api/v1/auth/login
    
  } catch(e) {}
}
