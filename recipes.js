// ============================================
// Recipes Page — Logic
// ============================================

let allRecipes = [];
let activeCategory = 'all';

document.addEventListener('DOMContentLoaded', async () => {
  await loadRecipes();
});

async function loadRecipes() {
  try {
    allRecipes = await apiFetch('/api/recipes');
    renderRecipes();
  } catch (err) {
    document.getElementById('recipeGrid').innerHTML =
      '<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1;">Failed to load recipes. Make sure the server is running.</p>';
  }
}

function applyFilters() {
  renderRecipes();
}

function renderRecipes() {
  const grid = document.getElementById('recipeGrid');
  if (!grid) return;

  const timeFilter = document.getElementById('filter-time') ? document.getElementById('filter-time').value : 'all';
  const diffFilter = document.getElementById('filter-difficulty') ? document.getElementById('filter-difficulty').value : 'all';
  const vegFilter = document.getElementById('filter-veg') ? document.getElementById('filter-veg').checked : false;

  let filtered = allRecipes;
  if (activeCategory === 'favorites') {
    const favIds = getFavorites();
    filtered = allRecipes.filter(r => favIds.includes(r._id));
  } else if (activeCategory !== 'all') {
    filtered = allRecipes.filter(r => r.category === activeCategory);
  }

  // Apply Advanced Filters
  if (timeFilter !== 'all') {
    filtered = filtered.filter(r => {
      const minsMatch = r.time.match(/(\d+)/);
      if (!minsMatch) return true;
      const mins = parseInt(minsMatch[1]);
      if (timeFilter === '15') return mins <= 15;
      if (timeFilter === '30') return mins > 15 && mins <= 30;
      if (timeFilter === '60') return mins > 30;
      return true;
    });
  }

  if (diffFilter !== 'all') {
    filtered = filtered.filter(r => r.difficulty.toLowerCase() === diffFilter);
  }

  if (vegFilter) {
    filtered = filtered.filter(r => {
      if (r.isVegetarian !== undefined) return r.isVegetarian;
      const lowerIngs = (r.ingredients || []).join(' ').toLowerCase();
      const lowerDesc = (r.desc || '').toLowerCase();
      const meaterms = ['chicken', 'egg', 'meat', 'fish', 'prawn', 'beef', 'pork', 'mutton', 'lamb'];
      return !meaterms.some(term => lowerIngs.includes(term) || lowerDesc.includes(term));
    });
  }

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1;">No recipes found matching these filters.</p>';
    return;
  }

  grid.innerHTML = filtered.map(r => {
    const isFav = getFavorites().includes(r._id);
    const favIcon = isFav ? '❤️' : '🤍';
    const favBtnHtml = `<button class="fav-btn" onclick="toggleFavorite('${r._id}', event)" style="position:absolute; top:10px; right:10px; background:white; border:none; border-radius:50%; width:32px; height:32px; font-size:1.2rem; cursor:pointer; box-shadow:0 2px 5px rgba(0,0,0,0.2); z-index:10; display:flex; align-items:center; justify-content:center;">${favIcon}</button>`;

    const imageHtml = r.image
      ? `<div class="recipe-card-img" style="position:relative; background-image: url('${r.image}'); background-size: cover; background-position: center;">${favBtnHtml}</div>`
      : `<div class="recipe-card-img" style="position:relative; font-size: 4rem; display: flex; align-items: center; justify-content: center; background: var(--bg-glass);">${favBtnHtml}${r.emoji || '🍽️'}</div>`;

    const difficultyCap = r.difficulty.charAt(0).toUpperCase() + r.difficulty.slice(1);
    const regionEmoji = r.regionEmoji || '🍽️';

    return `
        <div class="recipe-card fade-in-up" onclick="openRecipeModal('${r._id}')">
          ${imageHtml}
          <div class="recipe-card-body">
            <h3 style="margin-bottom: 4px;">${r.name}</h3>
            <div style="font-size: 0.88rem; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
              <span>${regionEmoji}</span>
              <span style="color: #fbbf24; font-weight: 500;">${r.time} | ${difficultyCap}</span>
            </div>
            <p class="recipe-card-desc" style="margin-bottom: 16px;">${r.desc}</p>
            <div class="recipe-card-footer" style="display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; color: var(--text-secondary); margin-top: 5px;">
              <span style="display: flex; align-items: center; gap: 4px;">📺 ${r.servings} servings</span>
              <button class="btn-primary" onclick="addIngredientsToCart('${r._id}', event)" style="font-size: 0.75rem; padding: 4px 8px; border-radius: 4px;">🛒 Add to Cart</button>
            </div>
          </div>
        </div>
      `
  }).join('');

  requestAnimationFrame(() => {
    grid.querySelectorAll('.fade-in-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 80);
    });
  });
}

function filterRecipes(category, btn) {
  activeCategory = category;
  document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderRecipes();
}

async function openRecipeModal(id) {
  const r = allRecipes.find(rec => rec._id === id);
  if (!r) return;

  const overlay = document.getElementById('recipeModal');
  overlay.innerHTML = `
    <div class="recipe-modal">
      <button class="modal-close" onclick="closeRecipeModal()">✕</button>
      <div class="modal-emoji">${r.emoji || '🍽️'}</div>
      <h2 class="modal-title">${r.name}</h2>
      <div class="modal-meta">
        <span>⏱ ${r.time}</span>
        <span>👤 ${r.servings} serving${r.servings > 1 ? 's' : ''}</span>
        <span>📊 ${r.difficulty}</span>
        <span>🍽️ ${r.category}</span>
      </div>
      <p style="color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.7;">${r.desc}</p>
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h3 class="modal-section-title" style="margin: 0;">🥘 Ingredients</h3>
        <button class="btn-primary" onclick="addIngredientsToCart('${r._id}')" style="font-size: 0.9rem; padding: 6px 12px;">🛒 Add to Cart</button>
      </div>

      <ul class="modal-ingredients">
        ${r.ingredients.map(ing => `<li>${ing}</li>`).join('')}
      </ul>
      <h3 class="modal-section-title">👨‍🍳 Steps</h3>
      <ol class="modal-steps">
        ${r.steps.map(step => `<li>${step}</li>`).join('')}
      </ol>
    </div>
  `;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeRecipeModal() {
  document.getElementById('recipeModal').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('recipe-modal-overlay') && e.target.classList.contains('active')) {
    closeRecipeModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeRecipeModal();
});

// Shop Integration
async function addIngredientsToCart(recipeId, event) {
  if (event) event.stopPropagation();

  const r = allRecipes.find(rec => rec._id === recipeId);
  if (!r) return;

  try {
    const products = await apiFetch('/api/products');
    let cart = getCart(); // From common.js
    let itemsAdded = 0;

    // Very basic matching based on ingredient containing product name
    r.ingredients.forEach(ing => {
      const ingLower = ing.toLowerCase();
      // Find a matching product
      const productMatch = products.find(p => {
        // Splitting product name e.g. "Tomatoes" -> "tomato"
        let pName = p.name.toLowerCase();
        if (pName.endsWith('s')) pName = pName.slice(0, -1);
        if (pName.endsWith('es')) pName = pName.slice(0, -2);
        return ingLower.includes(pName) || pName.includes(ingLower);
      });

      if (productMatch) {
        const existing = cart.find(item => item.productId === productMatch._id);
        if (existing) {
          existing.qty += 1;
        } else {
          cart.push({
            productId: productMatch._id,
            name: productMatch.name,
            emoji: productMatch.emoji,
            price: productMatch.price,
            qty: 1
          });
        }
        itemsAdded++;
      }
    });

    if (itemsAdded > 0) {
      saveCart(cart);
      showToast('Ingredients added to your 🛒 Shop cart!', 'success');

      // If logged in, save to backend
      if (localStorage.getItem('bh_token')) {
        apiFetch('/api/auth/cart', {
          method: 'POST',
          body: JSON.stringify({ cart: cart.map(c => ({ productId: c.productId, quantity: c.qty })) })
        }).catch(console.error); // Silently sync
      }
    } else {
      showToast('Could not find matching ingredients in the Shop.', 'info');
    }

  } catch (err) {
    showToast('Failed to connect to Shop.', 'error');
  }
}

// Favorites Integration
function toggleFavorite(id, event) {
  event.stopPropagation(); // prevent opening the modal

  if (!localStorage.getItem('bh_token')) {
    showToast('Please Login to save favorites', 'error');
    setTimeout(() => window.location.href = '/auth', 1500);
    return;
  }

  let favs = getFavorites();
  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
    showToast('Removed from favorites', 'info');
  } else {
    favs.push(id);
    showToast('Added to favorites! ❤️', 'success');
  }

  saveFavorites(favs);
  renderRecipes(); // Re-render to update heart icons and potentially remove from 'favorites' filter view
}

