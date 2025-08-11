// API base URL for deployed backend
const API_BASE_URL = "https://couponswap-backend.onrender.com";

// ======================= UPLOAD COUPON =======================
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
          'Authorization': token
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

// ======================= MARKETPLACE COUPONS =======================
const couponList = document.getElementById('couponList');
if (couponList) {
  fetch(`${API_BASE_URL}/api/coupons`)
    .then(res => res.json())
    .then(coupons => {
      if (!coupons.length) {
        couponList.innerHTML = '<p>No coupons available right now.</p>';
        return;
      }

      coupons.forEach(coupon => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';

        col.innerHTML = `
          <div class="card h-100">
            <img src="${coupon.image || 'https://via.placeholder.com/300'}" class="card-img-top" alt="${coupon.title}">
            <div class="card-body">
              <h5 class="card-title">${coupon.title}</h5>
              <p class="card-text">${coupon.description || ''}</p>
              <p><strong>Expires:</strong> ${coupon.expiryDate.split('T')[0]}</p>
              <button class="btn btn-primary claim-btn" data-id="${coupon._id}">Claim</button>
            </div>
          </div>
        `;
        couponList.appendChild(col);
      });

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
              'Authorization': token
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

// ======================= MY UPLOADED COUPONS =======================
const myCouponList = document.getElementById('myCouponList');
if (myCouponList) {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('❌ Please login to view your coupons.');
    window.location.href = 'login.html';
  } else {
    fetch(`${API_BASE_URL}/api/coupons/my`, {
      headers: {
        'Authorization': token
      }
    })
    .then(res => res.json())
    .then(coupons => {
      if (!coupons.length) {
        myCouponList.innerHTML = '<p>You haven’t uploaded any coupons yet.</p>';
        return;
      }

      coupons.forEach(coupon => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';

        col.innerHTML = `
          <div class="card h-100">
            <img src="${coupon.image || 'https://via.placeholder.com/300'}" class="card-img-top" alt="${coupon.title}">
            <div class="card-body">
              <h5 class="card-title">${coupon.title}</h5>
              <p class="card-text">${coupon.description || ''}</p>
              <p><strong>Expires:</strong> ${coupon.expiryDate.split('T')[0]}</p>
              <p><strong>Status:</strong> ${coupon.claimed ? '✅ Claimed' : '🟡 Available'}</p>
            </div>
          </div>
        `;
        myCouponList.appendChild(col);
      });
    })
    .catch(err => {
      console.error(err);
      myCouponList.innerHTML = '<p>Error loading your coupons.</p>';
    });
  }
}

// ======================= CLAIMED COUPONS =======================
const claimedList = document.getElementById('claimedList');
if (claimedList) {
  const token = localStorage.getItem('token');

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
              <div class="card">
                <img src="${coupon.image}" class="card-img-top" alt="Coupon Image">
                <div class="card-body">
                  <h5 class="card-title">${coupon.title}</h5>
                  <p class="card-text">${coupon.description}</p>
                  <p class="text-muted">Expires on: ${new Date(coupon.expiryDate).toLocaleDateString()}</p>
                  <p class="text-muted">Owner: ${coupon.owner.name}</p>
                </div>
              </div>
            </div>
          `).join('');
        }
      } else {
        claimedList.innerHTML = `<p>❌ ${data.msg || 'Failed to fetch coupons.'}</p>`;
      }
    })
    .catch(err => {
      console.error(err);
      claimedList.innerHTML = '<p>❌ Error fetching claimed coupons.</p>';
    });
}
