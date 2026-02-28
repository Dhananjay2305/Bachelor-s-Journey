// ============================================
// Budget Page — Logic
// ============================================

const budgetCategories = [
    { key: 'rent', label: '🏠 Rent', color: '#f97316', defaultPct: 40 },
    { key: 'food', label: '🍽️ Food & Groceries', color: '#22c55e', defaultPct: 25 },
    { key: 'utilities', label: '💡 Electricity & Utilities', color: '#3b82f6', defaultPct: 10 },
    { key: 'cleaning', label: '🧹 Cleaning & Supplies', color: '#a855f7', defaultPct: 5 },
    { key: 'transport', label: '🚌 Transport', color: '#ec4899', defaultPct: 10 },
    { key: 'savings', label: '💰 Savings / Emergency', color: '#eab308', defaultPct: 10 },
];

const tips = [
    { icon: "🧹", title: "Daily 10-Min Cleanup", text: "Spend just 10 minutes each morning: make bed, wipe kitchen counter, wash dishes. Consistency beats deep cleaning." },
    { icon: "🗓️", title: "Weekly Laundry Schedule", text: "Pick one day a week for laundry. Separate whites and colors. Hang dry to save electricity and keep clothes fresh." },
    { icon: "🧊", title: "Batch Cook & Freeze", text: "Cook dal, rice, and curry in bulk on weekends. Freeze in portions for quick weekday meals — saves time and money." },
    { icon: "🧴", title: "Stock Cleaning Essentials", text: "Always keep toilet cleaner, floor cleaner, dish soap, and a scrub brush. These 4 items handle 90% of cleaning tasks." },
    { icon: "💡", title: "Save on Electricity", text: "Switch off fans and lights when leaving. Use LED bulbs. Unplug chargers when not in use — it adds up over months." },
    { icon: "🥡", title: "Smart Meal Prep", text: "Chop veggies on Sunday, store in airtight containers. Prep spice mixes in advance. Cooking becomes 2x faster on weekdays." },
    { icon: "🚰", title: "Keep Sink Empty", text: "Never leave dishes in the sink overnight. Wash immediately after eating — prevents bugs, smells, and the dreaded pile-up." },
    { icon: "📦", title: "Organize Monthly", text: "Once a month, declutter your room. Throw away things you don't need. A clean space = a clear mind." }
];

document.addEventListener('DOMContentLoaded', () => {
    setupBudgetCalculator();
    renderTips();
    loadSavedBudgets();
    calculateBudget(10000);
});

function setupBudgetCalculator() {
    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = parseInt(btn.dataset.value);
            document.getElementById('budgetInput').value = val;
            calculateBudget(val);
        });
    });

    // Input change
    const input = document.getElementById('budgetInput');
    if (input) {
        input.addEventListener('input', () => {
            const val = parseInt(input.value) || 0;
            calculateBudget(val);
        });
    }

    // Slider listeners
    budgetCategories.forEach(cat => {
        const slider = document.getElementById(`slider-${cat.key}`);
        if (slider) {
            slider.addEventListener('input', () => {
                document.getElementById(`value-${cat.key}`).textContent = `${slider.value}%`;
                const val = parseInt(document.getElementById('budgetInput').value) || 0;
                calculateBudget(val);
            });
        }
    });
}

function calculateBudget(total) {
    const breakdown = [];
    budgetCategories.forEach(cat => {
        const slider = document.getElementById(`slider-${cat.key}`);
        const pct = slider ? parseInt(slider.value) : cat.defaultPct;
        const amount = Math.round(total * pct / 100);
        breakdown.push({ ...cat, pct, amount });
    });

    const list = document.getElementById('budgetBreakdown');
    if (list) {
        list.innerHTML = breakdown.map(b => `
      <li>
        <span class="breakdown-label">
          <span class="breakdown-dot" style="background: ${b.color}"></span>
          ${b.label}
        </span>
        <span class="breakdown-amount">₹${b.amount.toLocaleString()}</span>
      </li>
    `).join('');
    }

    drawPieChart(breakdown, total);
    updateBudgetTip(total);
}

function drawPieChart(data, total) {
    const canvas = document.getElementById('budgetChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 280;
    canvas.width = size * 2;
    canvas.height = size * 2;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(2, 2);

    const cx = size / 2, cy = size / 2;
    const radius = size / 2 - 10;
    const innerRadius = radius * 0.55;
    let startAngle = -Math.PI / 2;

    data.forEach(item => {
        const sliceAngle = (item.pct / 100) * 2 * Math.PI;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = item.color;
        ctx.fill();
        startAngle += sliceAngle;
    });

    ctx.beginPath();
    ctx.arc(cx, cy, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#111827';
    ctx.fill();

    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 18px Outfit';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`₹${total.toLocaleString()}`, cx, cy - 8);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Inter';
    ctx.fillText('Monthly Budget', cx, cy + 12);
}

function updateBudgetTip(total) {
    const tipEl = document.getElementById('budgetTip');
    if (!tipEl) return;
    let tip = '';
    if (total <= 6000) {
        tip = "💡 Tight budget! Focus on essentials. Cook at home, skip ordering food. Buy groceries in bulk from wholesale markets.";
    } else if (total <= 10000) {
        tip = "💡 Good budget range! You can eat well and keep your room maintained. Use the 50-30-20 rule: needs-wants-savings.";
    } else if (total <= 15000) {
        tip = "💡 Comfortable budget! You have room for some luxuries. Still cook most meals at home and save at least 10%.";
    } else {
        tip = "💡 Great budget! Invest in quality groceries, a good cleaning routine, and invest your savings for the future.";
    }
    tipEl.textContent = tip;
}

let activeBudgetId = null;
let activeBudgetExpenses = [];
let activeMonthlyBudget = 0;
let barChartInstance = null;

// Save budget to server
async function saveBudget() {
    if (!localStorage.getItem('bh_token')) {
        showToast('Please login to save your budget', 'error');
        setTimeout(() => window.location.href = '/auth', 1500);
        return;
    }

    const total = parseInt(document.getElementById('budgetInput').value) || 0;
    if (total <= 0) { showToast('Enter a valid budget amount', 'error'); return; }

    const splits = {};
    budgetCategories.forEach(cat => {
        const slider = document.getElementById(`slider-${cat.key}`);
        const pct = slider ? parseInt(slider.value) : cat.defaultPct;
        splits[cat.key] = { pct, amount: Math.round(total * pct / 100) };
    });

    const tipEl = document.getElementById('budgetTip');
    const tip = tipEl ? tipEl.textContent : '';

    try {
        const data = await apiFetch('/api/budget', {
            method: 'POST',
            body: JSON.stringify({ monthlyBudget: total, splits, tip })
        });
        showToast('Budget plan saved! 💾');
        loadSavedBudgets();
        // Set as active
        loadBudget(data.budget);
    } catch (err) {
        showToast('Failed to save budget', 'error');
    }
}

// Load saved budgets
async function loadSavedBudgets() {
    const historyEl = document.getElementById('budgetHistory');
    if (!historyEl) return;

    try {
        const budgets = await apiFetch('/api/budget');
        if (budgets.length === 0) {
            historyEl.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No saved budgets yet.</p>';
            return;
        }

        // Store globally to find them later
        window.savedBudgets = budgets;

        historyEl.innerHTML = budgets.slice(0, 5).map(b => `
      <div class="history-item" onclick="loadBudgetById('${b._id}')">
        <span>₹${b.monthlyBudget.toLocaleString()}</span>
        <small>${new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</small>
      </div>
    `).join('');

        // Auto-load the newest budget if none is active
        if (!activeBudgetId && budgets.length > 0) {
            loadBudget(budgets[0], true);
        }
    } catch {
        historyEl.innerHTML = '<p style="color: var(--text-muted); text-align: center; font-size: 0.85rem;">Login to save and load budget history.</p>';
    }
}

function loadBudgetById(id) {
    const budget = window.savedBudgets.find(b => b._id === id);
    if (budget) {
        loadBudget(budget);
    }
}

function loadBudget(budgetObj) {
    activeBudgetId = budgetObj._id;
    activeBudgetExpenses = budgetObj.expenses || [];
    activeMonthlyBudget = budgetObj.monthlyBudget;

    document.getElementById('budgetInput').value = activeMonthlyBudget;

    // Set sliders if splits exist
    if (budgetObj.splits) {
        budgetCategories.forEach(cat => {
            const split = budgetObj.splits[cat.key];
            if (split) {
                const slider = document.getElementById(`slider-${cat.key}`);
                if (slider) {
                    slider.value = split.pct;
                    document.getElementById(`value-${cat.key}`).textContent = `${split.pct}%`;
                }
            }
        });
    }

    calculateBudget(activeMonthlyBudget);

    // Show expense section
    document.getElementById('expenseSection').style.display = 'block';

    if (!isSilent) showToast(`Loaded ₹${activeMonthlyBudget.toLocaleString()} budget`);

    updateExpenseChartAndBreakdown(budgetObj.splits, activeBudgetExpenses);
}

// Render Tips
function renderTips() {
    const grid = document.getElementById('tipsGrid');
    if (!grid) return;
    grid.innerHTML = tips.map((tip, i) => `
    <div class="tip-card fade-in-up" style="transition-delay: ${i * 60}ms">
      <div class="tip-icon">${tip.icon}</div>
      <h3>${tip.title}</h3>
      <p>${tip.text}</p>
    </div>
  `).join('');
}

// EXPENSE TRACKING
async function saveExpense() {
    if (!localStorage.getItem('bh_token')) {
        showToast('Please login to track expenses', 'error');
        setTimeout(() => window.location.href = '/auth', 1500);
        return;
    }

    if (!activeBudgetId) {
        showToast('Please select or save a budget first', 'error');
        return;
    }

    const title = document.getElementById('expense-title').value;
    const amount = parseInt(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;

    if (!title || !amount) {
        showToast('Enter valid title and amount', 'error');
        return;
    }

    try {
        const data = await apiFetch(`/api/budget/${activeBudgetId}/expense`, {
            method: 'POST',
            body: JSON.stringify({ title, amount, category })
        });

        // Update expenses array directly from the server response
        activeBudgetExpenses = data.budget.expenses;
        showToast('Expense added! 💸');

        // Reset inputs
        document.getElementById('expense-title').value = '';
        document.getElementById('expense-amount').value = '';

        // Refresh budget splits mock data to redraw the chart
        const splits = {};
        budgetCategories.forEach(cat => {
            const slider = document.getElementById(`slider-${cat.key}`);
            const pct = slider ? parseInt(slider.value) : cat.defaultPct;
            splits[cat.key] = { pct, amount: Math.round(activeMonthlyBudget * pct / 100) };
        });

        updateExpenseChartAndBreakdown(splits, activeBudgetExpenses);
    } catch (err) {
        showToast('Failed to save expense', 'error');
    }
}

function updateExpenseChartAndBreakdown(plannedSplits, expenses) {
    if (!window.Chart) return;

    document.getElementById('budgetChart').style.display = 'none';
    const monthlyChartCanvas = document.getElementById('monthlyChart');
    monthlyChartCanvas.style.display = 'block';

    const categories = budgetCategories.map(c => c.label);
    const keys = budgetCategories.map(c => c.key);

    const plannedData = keys.map(k => plannedSplits[k] ? plannedSplits[k].amount : 0);
    const actualData = keys.map(k => {
        return expenses.filter(e => e.category === k).reduce((sum, e) => sum + e.amount, 0);
    });

    const totalSpent = actualData.reduce((a, b) => a + b, 0);
    const remaining = activeMonthlyBudget - totalSpent;

    const display = document.getElementById('remainingBudgetDisplay');
    display.style.display = 'block';
    display.innerHTML = `Total Budget: ₹${activeMonthlyBudget.toLocaleString()} <br> 
                         Spent: <span style="color:#ef4444">₹${totalSpent.toLocaleString()}</span> <br>
                         Remaining: <span style="color:${remaining >= 0 ? '#22c55e' : '#ef4444'}">₹${remaining.toLocaleString()}</span>`;

    const breakdownList = document.getElementById('budgetBreakdown');
    if (breakdownList) {
        breakdownList.innerHTML = budgetCategories.map(cat => {
            const split = plannedSplits[cat.key];
            const planned = split ? split.amount : 0;
            const spent = expenses.filter(e => e.category === cat.key).reduce((s, e) => s + e.amount, 0);
            const remainingCat = planned - spent;

            return `
              <li>
                <div style="display: flex; flex-direction: column; width: 100%;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span class="breakdown-label">
                            <span class="breakdown-dot" style="background: ${cat.color}"></span>
                            ${cat.label}
                        </span>
                        <span class="breakdown-amount">₹${planned.toLocaleString()}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-muted); margin-top: 5px; padding-left: 18px;">
                        <span>Spent: <span style="color: #ef4444;">₹${spent.toLocaleString()}</span></span>
                        <span>Remaining: <span style="color: ${remainingCat >= 0 ? '#22c55e' : '#ef4444'}">₹${remainingCat.toLocaleString()}</span></span>
                    </div>
                </div>
              </li>
            `;
        }).join('');
    }

    if (barChartInstance) {
        barChartInstance.destroy();
    }

    barChartInstance = new Chart(monthlyChartCanvas, {
        type: 'bar',
        data: {
            labels: categories.map(c => c.split(' ')[1]), // Take only the word, not emoji to save space
            datasets: [
                {
                    label: 'Planned (₹)',
                    data: plannedData,
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 1
                },
                {
                    label: 'Actual Spent (₹)',
                    data: actualData,
                    backgroundColor: 'rgba(239, 68, 68, 0.5)',
                    borderColor: 'rgb(239, 68, 68)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}
