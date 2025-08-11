const API_BASE_URL = "https://couponswap-backend.onrender.com";

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

    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const expiryDate = document.getElementById('expiryDate').value;
    const image = document.getElementById('image').value.trim();

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
        alert('✅ Coupon uploaded! 🎉 You earned 5 SwapCoins.');
        uploadForm.reset();
      } else {
        alert(`❌ ${data.msg || 'Upload failed.'}`);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Server error.');
    }
  });
}

// ====================== DISPLAY MARKETPLACE ======================
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
              <p class="card-text">${coupon.description || ''}</p>
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
