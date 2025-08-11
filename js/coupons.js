const API_BASE_URL = "https://couponswap-backend.onrender.com";

// ====================== REGISTER ======================
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

// ====================== LOGIN ======================
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

// ====================== LOGOUT ======================
const logoutBtn = document.getElementById('logoutBtn');

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    alert('✅ Logged out successfully!');
    window.location.href = 'login.html';
  });
}

// ====================== UPLOAD COUPON ======================
const uploadForm = document.getElementById('uploadForm');

if (uploadForm) {
  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('❌ Please login first.');
      window.location.href = 'login.html';
      return;
    }

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const image = document.getElementById('image').value;

    try {
      const res = await fetch(`${API_BASE_URL}/api/coupons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, expiryDate, image })
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ Coupon uploaded! 🎉 You earned 5 SwapCoins.`);
        uploadForm.reset();
      } else {
        alert(`❌ ${data.msg}`);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Server error.');
    }
  });
}

// ====================== MARKETPLACE ======================
const couponList = document.getElementById('couponList');

if (couponList) {
  fetch(`${API_BASE_URL}/api/coupons`)
    .then(res => res.json())
    .then(coupons => {
      if (!coupons.length) {
        couponList.innerHTML = '<p>No coupons available right now.</p>';
        return;
      }

      couponList.innerHTML = coupons.map(coupon => `
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <img src="${coupon.image || 'https://via.placeholder.com/300'}" class="card-img-top" alt="${coupon.title}">
            <div class="card-body">
              <h5 class="card-title">${coupon.title}</h5>
              <p>${coupon.description || ''}</p>
              <p><strong>Expires:</strong> ${coupon.expiryDate.split('T')[0]}</p>
              <button class="btn btn-primary claim-btn" data-id="${coupon._id}">Claim</button>
            </div>
          </div>
        </div>
      `).join('');

      document.querySelectorAll('.claim-btn').forEach(button => {
        button.addEventListener('click', async () => {
          const couponId = button.getAttribute('data-id');
          const token = localStorage.getItem('token');

          if (!token) {
            alert('❌ Please login to claim coupons.');
            window.location.href = 'login.html';
            return;
          }

          const res = await fetch(`${API_BASE_URL}/api/coupons/${couponId}/claim`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          const data = await res.json();

          if (res.ok) {
            alert('✅ Coupon claimed successfully!');
            location.reload();
          } else {
            alert(`❌ ${data.msg}`);
          }
        });
      });
    })
    .catch(err => {
      console.error(err);
      couponList.innerHTML = '<p>Error loading coupons.</p>';
    });
}

// ====================== MY COUPONS ======================
const myCouponList = document.getElementById('myCouponList');

if (myCouponList) {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('❌ Please login to view your coupons.');
    window.location.href = 'login.html';
  } else {
    fetch(`${API_BASE_URL}/api/coupons/my`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(coupons => {
      if (!coupons.length) {
        myCouponList.innerHTML = '<p>You haven’t uploaded any coupons yet.</p>';
        return;
      }

      myCouponList.innerHTML = coupons.map(coupon => `
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <img src="${coupon.image || 'https://via.placeholder.com/300'}" class="card-img-top" alt="${coupon.title}">
            <div class="card-body">
              <h5 class="card-title">${coupon.title}</h5>
              <p>${coupon.description || ''}</p>
              <p><strong>Expires:</strong> ${coupon.expiryDate.split('T')[0]}</p>
              <p><strong>Status:</strong> ${coupon.claimed ? '✅ Claimed' : '🟡 Available'}</p>
            </div>
          </div>
        </div>
      `).join('');
    })
    .catch(err => {
      console.error(err);
      myCouponList.innerHTML = '<p>Error loading your coupons.</p>';
    });
  }
}

// ====================== CLAIMED COUPONS ======================
const claimedList = document.getElementById('claimedList');

if (claimedList) {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('❌ Please login to view claimed coupons.');
    window.location.href = 'login.html';
  } else {
    fetch(`${API_BASE_URL}/api/coupons/claimed`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        if (data.length === 0) {
          claimedList.innerHTML = '<p>No claimed coupons yet.</p>';
        } else {
          claimedList.innerHTML = data.map(coupon => `
            <div class="col-md-4 mb-4">
              <div class="card h-100">
                <img src="${coupon.image || 'https://via.placeholder.com/300'}" class="card-img-top" alt="${coupon.title}">
                <div class="card-body">
                  <h5 class="card-title">${coupon.title}</h5>
                  <p>${coupon.description || ''}</p>
                  <p><strong>Expires:</strong> ${coupon.expiryDate.split('T')[0]}</p>
                  <p class="text-muted">Owner: ${coupon.owner?.name || 'Unknown'}</p>
                </div>
              </div>
            </div>
          `).join('');
        }
      } else {
        claimedList.innerHTML = `<p>❌ ${data.msg || 'Failed to fetch claimed coupons.'}</p>`;
      }
    })
    .catch(err => {
      console.error(err);
      claimedList.innerHTML = '<p>❌ Error fetching claimed coupons.</p>';
    });
  }
}
