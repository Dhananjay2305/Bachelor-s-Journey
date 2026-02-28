document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-form`).classList.add('active');
        });
    });

    // Login Form Submit
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                // apiFetch is assumed to be available from common.js
                // we'll bypass it here to directly handle the auth response or we can try using standard fetch
                const res = await fetch(`${API_BASE}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || 'Login failed');
                }

                localStorage.setItem('bh_token', data.token);
                localStorage.setItem('bh_user', JSON.stringify(data.user));

                // Fetch full user data to populate cart and favorites
                try {
                    const fullUser = await fetch(`${API_BASE}/api/auth/me`, {
                        headers: { 'Authorization': `Bearer ${data.token}` }
                    }).then(r => r.json());

                    if (fullUser.cart) {
                        // Reshape cart if needed for frontend expectation
                        const cartForLocal = fullUser.cart.map(c => ({
                            productId: c.productId?._id || c.productId,
                            qty: c.quantity || 1,
                            name: c.productId?.name || 'Item',
                            price: c.productId?.price || 0,
                            emoji: c.productId?.emoji || '📦'
                        }));
                        localStorage.setItem('bh_cart', JSON.stringify(cartForLocal));
                    }
                    if (fullUser.favorites) {
                        localStorage.setItem('bh_favorites', JSON.stringify(fullUser.favorites));
                    }
                } catch (e) { console.error('Could not fetch full user data', e); }

                if (window.showToast) window.showToast('Login successful!');
                setTimeout(() => window.location.href = 'index.html', 1000);
            } catch (err) {
                if (window.showToast) window.showToast(err.message, 'error');
                else alert(err.message);
            }
        });
    }

    // Signup Form Submit
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('signup-username').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            try {
                const res = await fetch(`${API_BASE}/api/auth/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || 'Signup failed');
                }

                // Save token and user info
                localStorage.setItem('bh_token', data.token);
                localStorage.setItem('bh_user', JSON.stringify(data.user));

                // Clear local favorites and cart to prevent mixups from prior sessions
                localStorage.removeItem('bh_cart');
                localStorage.removeItem('bh_favorites');

                if (window.showToast) window.showToast('Signup successful!');
                setTimeout(() => window.location.href = 'index.html', 1000);
            } catch (err) {
                if (window.showToast) window.showToast(err.message, 'error');
                else alert(err.message);
            }
        });
    }

    // If user is already logged in, redirect to home
    if (localStorage.getItem('bh_token')) {
        window.location.href = 'index.html';
    }
});
