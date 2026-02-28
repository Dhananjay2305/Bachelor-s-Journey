// ============================================
// Bachelor Life Hub — Shared Utilities
// ============================================

const API_BASE = 'http://localhost:3000';

// ========================
// NAVBAR
// ========================
function setupNavigation() {
    const navbar = document.querySelector('.navbar');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            mobileBtn.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                mobileBtn.textContent = '☰';
            });
        });
    }

    // Highlight current page in nav
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (currentPath === href || (currentPath === '/' && href === '/')) {
            link.classList.add('active');
        }
    });

    // Update cart badge from localStorage
    updateCartBadge();

    // Setup Auth Nav
    const authLink = document.getElementById('nav-auth-link');
    const user = JSON.parse(localStorage.getItem('bh_user') || 'null');
    const token = localStorage.getItem('bh_token');

    if (authLink) {
        if (token && user) {
            authLink.textContent = `Logout (${user.username})`;
            authLink.href = '#';
            authLink.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('bh_token');
                localStorage.removeItem('bh_user');
                localStorage.removeItem('bh_cart');
                localStorage.removeItem('bh_favorites');
                showToast('Logged out successfully', 'info');
                setTimeout(() => window.location.href = 'index.html', 1000);
            });
        }
    }
}

// ========================
// CART (localStorage -> or sync)
// ========================
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('bh_cart')) || [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('bh_cart', JSON.stringify(cart));
    updateCartBadge();

    // Sync with backend if logged in
    if (localStorage.getItem('bh_token')) {
        apiFetch('/api/auth/cart', {
            method: 'POST',
            body: JSON.stringify({ cart: cart.map(c => ({ productId: c.productId, quantity: c.qty })) })
        }).catch(err => console.error('Silent cart sync failed:', err));
    }
}

// ========================
// FAVORITES (localStorage -> sync)
// ========================
function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem('bh_favorites')) || [];
    } catch {
        return [];
    }
}

function saveFavorites(favorites) {
    localStorage.setItem('bh_favorites', JSON.stringify(favorites));

    // Sync with backend if logged in
    if (localStorage.getItem('bh_token')) {
        apiFetch('/api/auth/favorites', {
            method: 'POST',
            body: JSON.stringify({ favorites })
        }).catch(err => console.error('Silent favorites sync failed:', err));
    }
}

function updateCartBadge() {
    const badge = document.getElementById('cartCount');
    if (!badge) return;
    const cart = getCart();
    const count = cart.reduce((s, c) => s + c.qty, 0);
    badge.textContent = count;
    badge.classList.toggle('visible', count > 0);
}

// ========================
// TOAST NOTIFICATION
// ========================
function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    toast.innerHTML = `<span class="toast-icon">${icon}</span> ${message}`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ========================
// SCROLL ANIMATIONS
// ========================
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

    const mutationObserver = new MutationObserver(() => {
        document.querySelectorAll('.fade-in-up:not(.visible)').forEach(el => observer.observe(el));
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
}

// ========================
// API HELPER
// ========================
async function apiFetch(endpoint, options = {}) {
    try {
        const headers = { 'Content-Type': 'application/json' };

        // Add Authorization header if token exists
        const token = localStorage.getItem('bh_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${API_BASE}${endpoint}`, {
            headers: { ...headers, ...(options.headers || {}) },
            ...options
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || data.error || 'API error');
        return data;
    } catch (err) {
        console.error('API Error:', err);
        throw err;
    }
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupScrollAnimations();
});
