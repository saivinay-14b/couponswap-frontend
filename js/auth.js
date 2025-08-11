const API_BASE_URL = "https://couponswap-backend.onrender.com";

// Register
const registerForm = document.getElementById('registerForm');

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Registered successfully! Please login.');
        window.location.href = 'login.html';
      } else {
        alert(`❌ ${data.msg}`);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Server error.');
    }
  });
}

// Login
const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        alert('✅ Login successful!');
        window.location.href = 'marketplace.html';
      } else {
        alert(`❌ ${data.msg}`);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Server error.');
    }
  });
}

// Logout
const logoutBtn = document.getElementById('logoutBtn');

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    alert('✅ Logged out successfully!');
    window.location.href = 'login.html';
  });
}
