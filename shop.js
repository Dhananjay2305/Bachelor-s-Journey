// ============================================
// Shop Page — Logic
// ============================================

let allProducts = [];
let activeShopCategory = 'all';

document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
    renderCart();
    setupShopSearch();
});

async function loadProducts() {
    try {
        allProducts = await apiFetch('/api/products');
        renderProducts();
    } catch (err) {
        document.getElementById('shopGrid').innerHTML =
            '<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1;">Failed to load products. Make sure the server is running.</p>';
    }
}

function renderProducts() {
    const grid = document.getElementById('shopGrid');
    if (!grid) return;

    const cart = getCart();
    const filtered = activeShopCategory === 'all'
        ? allProducts
        : allProducts.filter(p => p.category === activeShopCategory);

    grid.innerHTML = filtered.map(p => {
        const inCart = cart.find(c => c._id === p._id);
        const qty = inCart ? inCart.qty : 0;
        return `
      <div class="product-card" id="product-${p._id}">
        <span class="product-emoji">${p.emoji}</span>
        <div class="product-name">${p.name}</div>
        <div class="product-weight">${p.weight}</div>
        <div class="product-price">₹${p.price}</div>
        <div class="product-actions">
          <button class="qty-btn" onclick="changeQty('${p._id}', -1)" ${qty === 0 ? 'disabled style="opacity:0.3"' : ''}>−</button>
          <span class="qty-display">${qty}</span>
          <button class="qty-btn" onclick="changeQty('${p._id}', 1)">+</button>
        </div>
        <button class="add-cart-btn ${qty > 0 ? 'added' : ''}" onclick="addToCart('${p._id}')">
          ${qty > 0 ? '✓ In Cart' : '🛒 Add to Cart'}
        </button>
      </div>
    `;
    }).join('');
}

function filterShop(category, btn) {
    activeShopCategory = category;
    document.querySelectorAll('.shop-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts();
}

function setupShopSearch() {
    const searchInput = document.getElementById('shopSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.product-card');
            cards.forEach(card => {
                const name = card.querySelector('.product-name').textContent.toLowerCase();
                card.style.display = name.includes(query) ? '' : 'none';
            });
        });
    }
}

function addToCart(id) {
    const product = allProducts.find(p => p._id === id);
    if (!product) return;

    let cart = getCart();
    const existing = cart.find(c => c._id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    saveCart(cart);
    renderProducts();
    renderCart();
    showToast(`${product.emoji} ${product.name} added to cart!`);
}

function changeQty(id, delta) {
    let cart = getCart();
    const item = cart.find(c => c._id === id);

    if (!item && delta > 0) {
        addToCart(id);
        return;
    }
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(c => c._id !== id);
        }
    }
    saveCart(cart);
    renderProducts();
    renderCart();
}

function removeFromCart(id) {
    let cart = getCart();
    const item = cart.find(c => c._id === id);
    cart = cart.filter(c => c._id !== id);
    saveCart(cart);
    renderProducts();
    renderCart();
    if (item) showToast(`${item.emoji} ${item.name} removed from cart`);
}

let activeDiscount = 0;

function applyDiscount() {
    const code = document.getElementById('discountCode').value.toUpperCase();
    if (code === 'BACHELOR10') {
        activeDiscount = 0.10; // 10% off
        showToast('Discount applied: 10% OFF! 🎉', 'success');
        renderCart();
    } else {
        activeDiscount = 0;
        showToast('Invalid discount code', 'error');
        renderCart();
    }
}

function renderCart() {
    const cart = getCart();
    const cartItemsEl = document.getElementById('cartItems');
    const subtotalEl = document.getElementById('cartSubtotal');
    const deliveryEl = document.getElementById('cartDelivery');
    const totalEl = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (!cartItemsEl) return;

    let subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
    const discountAmount = subtotal * activeDiscount;
    subtotal -= discountAmount;

    // Free delivery above ₹500
    const delivery = subtotal >= 500 ? 0 : (subtotal > 0 ? 30 : 0);
    const grandTotal = Math.round(subtotal + delivery);

    updateCartBadge();

    if (cart.length === 0) {
        cartItemsEl.innerHTML = `
      <div class="cart-empty">
        <span class="cart-empty-icon">🛒</span>
        Your cart is empty<br><small>Add some items to get started!</small>
      </div>
    `;
    } else {
        cartItemsEl.innerHTML = cart.map(c => `
      <div class="cart-item">
        <span class="cart-item-emoji">${c.emoji}</span>
        <div class="cart-item-info">
          <div class="cart-item-name">${c.name}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty('${c.productId || c._id}', -1)" style="padding:0 5px;">−</button>
            <span style="font-weight:bold; margin: 0 5px;">${c.qty}</span>
            <button class="qty-btn" onclick="changeQty('${c.productId || c._id}', 1)" style="padding:0 5px;">+</button>
            <span style="color:var(--text-muted); font-size:0.8rem; margin-left:5px;">× ₹${c.price}</span>
          </div>
        </div>
        <span class="cart-item-price">₹${c.price * c.qty}</span>
      </div>
    `).join('');

        // Add discount input
        cartItemsEl.innerHTML += `
        <div style="margin-top: 15px; display: flex; gap: 5px;">
            <input type="text" id="discountCode" placeholder="Promo code (try: BACHELOR10)" style="flex:1; padding: 6px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color);">
            <button class="btn-primary" onclick="applyDiscount()" style="padding: 6px 10px; font-size: 0.85rem;">Apply</button>
        </div>
        ${activeDiscount > 0 ? `<div style="color: #22c55e; margin-top: 5px; font-size: 0.85rem;">✔️ 10% Discount Applied!</div>` : ''}
        `;
    }

    if (subtotalEl) {
        if (activeDiscount > 0) {
            subtotalEl.innerHTML = `<span style="text-decoration:line-through; font-size: 0.8em; color: var(--text-muted);">₹${Math.round(subtotal + discountAmount)}</span> ₹${Math.round(subtotal)}`;
        } else {
            subtotalEl.textContent = `₹${Math.round(subtotal)}`;
        }
    }
    if (deliveryEl) deliveryEl.innerHTML = delivery === 0 && subtotal > 0 ? '<span style="color:#22c55e; font-weight:bold;">FREE via ₹500 offer</span>' : (delivery === 0 ? '₹0' : `₹${delivery}`);
    if (totalEl) totalEl.textContent = `₹${grandTotal}`;
    if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
}

async function checkout() {
    // Must be logged in
    const token = localStorage.getItem('bh_token');
    if (!token) {
        showToast('Please Login to place an order.', 'error');
        setTimeout(() => window.location.href = '/auth', 1500);
        return;
    }

    const cart = getCart();
    if (cart.length === 0) return;

    const rawSubtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
    const subtotal = rawSubtotal - (rawSubtotal * activeDiscount);
    const delivery = subtotal >= 500 ? 0 : 30;
    const total = Math.round(subtotal + delivery);

    const orderItems = cart.map(c => ({
        productId: c.productId || c._id, // Handle auth/cart shape differences
        name: c.name,
        emoji: c.emoji,
        price: c.price,
        qty: c.qty
    }));

    try {
        const result = await apiFetch('/api/orders', {
            method: 'POST',
            body: JSON.stringify({ items: orderItems, subtotal, delivery, total })
        });

        saveCart([]);
        showToast('Order placed successfully! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = '/orders.html';
        }, 1500);
    } catch (err) {
        showToast(err.message || 'Failed to place order.', 'error');
    }
}
