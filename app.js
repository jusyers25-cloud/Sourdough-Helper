// Loading Screen Messages
const loadingMessages = [
    "Kneading the dough...",
    "Feeding your starter...",
    "Waiting for the perfect rise...",
    "Scoring the loaf...",
    "Preheating the oven...",
    "Creating something delicious...",
    "Stretching and folding...",
    "Building gluten structure...",
    "Checking the float test...",
    "Dusting with flour...",
    "Getting that perfect ear...",
    "Preparing the banneton...",
    "I love you mom!",
    "Save some for Cody!",
    "Throwing Shadow's ball..."
];

// Show random loading message
function showSplashScreen() {
    const messageEl = document.getElementById('splash-message');
    const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    messageEl.textContent = randomMessage;
    
    // Hide splash screen after 2.5 seconds
    setTimeout(() => {
        document.getElementById('splash-screen').style.display = 'none';
    }, 2500);
}

// Show splash on load
window.addEventListener('load', showSplashScreen);

// Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log('Service Worker registered'))
        .catch(err => console.log('Service Worker registration failed', err));
}

// Recipe Storage
class RecipeStore {
    constructor() {
        this.recipes = this.load();
        if (this.recipes.length === 0) {
            this.addSampleRecipes();
        }
    }

    load() {
        const stored = localStorage.getItem('sourdough-recipes');
        return stored ? JSON.parse(stored) : [];
    }

    save() {
        localStorage.setItem('sourdough-recipes', JSON.stringify(this.recipes));
    }

    add(recipe) {
        recipe.id = Date.now().toString();
        recipe.dateCreated = new Date().toISOString();
        recipe.isFavorite = false;
        this.recipes.unshift(recipe);
        this.save();
        return recipe;
    }

    update(id, updates) {
        const index = this.recipes.findIndex(r => r.id === id);
        if (index !== -1) {
            this.recipes[index] = { ...this.recipes[index], ...updates };
            this.save();
            return this.recipes[index];
        }
        return null;
    }

    delete(id) {
        this.recipes = this.recipes.filter(r => r.id !== id);
        this.save();
    }

    toggleFavorite(id) {
        const recipe = this.recipes.find(r => r.id === id);
        if (recipe) {
            recipe.isFavorite = !recipe.isFavorite;
            this.save();
            return recipe;
        }
        return null;
    }

    addSampleRecipes() {
        this.add({
            name: 'Classic Sourdough Boule',
            ingredients: `• 500g bread flour
• 350g water (70% hydration)
• 100g active sourdough starter
• 10g salt`,
            instructions: `1. Mix flour and water, autolyse for 30 minutes
2. Add starter and salt, mix until combined
3. Bulk ferment 4-6 hours with stretch & folds every 30 min
4. Shape and place in banneton
5. Cold proof in fridge overnight
6. Bake at 450°F in Dutch oven: 20 min covered, 25 min uncovered`,
            notes: 'Perfect for beginners! Adjust hydration if too sticky.'
        });

        this.add({
            name: 'Whole Wheat Sandwich Loaf',
            ingredients: `• 300g bread flour
• 200g whole wheat flour
• 350g water
• 100g active starter
• 10g salt
• 20g honey (optional)`,
            instructions: `1. Mix all ingredients except salt
2. Autolyse 30 minutes
3. Add salt, knead 5 minutes
4. Bulk ferment 4-5 hours
5. Shape into loaf pan
6. Proof 2-3 hours
7. Bake at 375°F for 40-45 minutes`,
            notes: 'Great for sandwiches and toast!'
        });

        // Mark first recipe as favorite
        this.recipes[0].isFavorite = true;
        this.save();
    }
}

// Initialize
const store = new RecipeStore();
let currentRecipeId = null;
let isEditMode = false;

// Tab Navigation
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        const tab = button.dataset.tab;
        
        // Update active states
        document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        
        button.classList.add('active');
        document.getElementById(`${tab}-view`).classList.add('active');
        
        // Refresh recipes when switching to recipes tab
        if (tab === 'recipes') {
            renderRecipes();
        }
    });
});

// Calculator Logic
const temperatureInput = document.getElementById('temperature');
const strengthInput = document.getElementById('starter-strength');
const weightInput = document.getElementById('dough-weight');

const tempValue = document.getElementById('temp-value');
const strengthValue = document.getElementById('strength-value');
const weightValue = document.getElementById('weight-value');

const bulkTimeEl = document.getElementById('bulk-time');
const proofTimeEl = document.getElementById('proof-time');
const totalTimeEl = document.getElementById('total-time');

function calculateTimes() {
    const temp = parseFloat(temperatureInput.value);
    const strength = parseFloat(strengthInput.value);
    const weight = parseFloat(weightInput.value);

    // Base times
    const baseBulk = 4.0; // hours
    const baseProof = 3.0; // hours

    // Temperature factor (warmer = faster)
    const tempFactor = Math.pow(1.15, (70 - temp) / 5);

    // Strength factor (stronger = faster)
    const strengthFactor = 100 / (strength + 50);

    // Size factor (larger = slightly longer)
    const sizeFactor = 1.0 + ((weight - 1000) / 5000);

    // Calculate times
    const bulkTime = baseBulk * tempFactor * strengthFactor * sizeFactor;
    const proofTime = baseProof * tempFactor * strengthFactor;
    const totalTime = bulkTime + proofTime;

    // Update display
    bulkTimeEl.textContent = formatTime(bulkTime);
    proofTimeEl.textContent = formatTime(proofTime);
    totalTimeEl.textContent = formatTime(totalTime);
}

function formatTime(hours) {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// Update values and recalculate
temperatureInput.addEventListener('input', () => {
    tempValue.textContent = `${temperatureInput.value}°F`;
    calculateTimes();
});

strengthInput.addEventListener('input', () => {
    strengthValue.textContent = `${strengthInput.value}%`;
    calculateTimes();
});

weightInput.addEventListener('input', () => {
    weightValue.textContent = `${weightInput.value}g`;
    calculateTimes();
});

// Initial calculation
calculateTimes();

// Recipe List
function renderRecipes() {
    const list = document.getElementById('recipes-list');
    const count = document.getElementById('recipe-count');
    
    count.textContent = `${store.recipes.length} saved recipe${store.recipes.length !== 1 ? 's' : ''}`;

    if (store.recipes.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                <h2>No Recipes Yet</h2>
                <p>Add your first sourdough recipe to get started</p>
                <button class="btn-primary" onclick="openAddRecipe()">Add Recipe</button>
            </div>
        `;
        return;
    }

    list.innerHTML = store.recipes.map(recipe => `
        <div class="recipe-card" onclick="openRecipeDetail('${recipe.id}')">
            <div class="recipe-card-header">
                <div class="recipe-card-info">
                    <h3>${escapeHtml(recipe.name)}</h3>
                    <div class="recipe-date">${formatDate(recipe.dateCreated)}</div>
                </div>
                <button class="favorite-button ${recipe.isFavorite ? 'active' : ''}" 
                        onclick="event.stopPropagation(); toggleFavorite('${recipe.id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>
            ${recipe.notes ? `<div class="recipe-notes">${escapeHtml(recipe.notes)}</div>` : ''}
            <div class="recipe-card-footer">
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    Tap to view recipe
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </div>
        </div>
    `).join('');
}

function toggleFavorite(id) {
    store.toggleFavorite(id);
    renderRecipes();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Modal Management
const recipeModal = document.getElementById('recipe-modal');
const detailModal = document.getElementById('detail-modal');
const recipeForm = document.getElementById('recipe-form');

document.getElementById('add-recipe-btn').addEventListener('click', openAddRecipe);
document.getElementById('close-modal').addEventListener('click', closeRecipeModal);
document.getElementById('close-detail').addEventListener('click', closeDetailModal);

// Close on backdrop click
recipeModal.addEventListener('click', (e) => {
    if (e.target === recipeModal) closeRecipeModal();
});

detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) closeDetailModal();
});

function openAddRecipe() {
    isEditMode = false;
    currentRecipeId = null;
    document.getElementById('modal-title').textContent = 'New Recipe';
    recipeForm.reset();
    recipeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeRecipeModal() {
    recipeModal.classList.remove('active');
    document.body.style.overflow = '';
}

function closeDetailModal() {
    detailModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Recipe Form Submit
recipeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const recipe = {
        name: document.getElementById('recipe-name').value,
        ingredients: document.getElementById('recipe-ingredients').value,
        instructions: document.getElementById('recipe-instructions').value,
        notes: document.getElementById('recipe-notes').value
    };

    if (isEditMode && currentRecipeId) {
        store.update(currentRecipeId, recipe);
    } else {
        store.add(recipe);
    }

    closeRecipeModal();
    renderRecipes();
    
    // Switch to recipes tab
    document.querySelector('[data-tab="recipes"]').click();
});

// Recipe Detail View
function openRecipeDetail(id) {
    const recipe = store.recipes.find(r => r.id === id);
    if (!recipe) return;

    currentRecipeId = id;

    document.getElementById('detail-name').textContent = recipe.name;
    document.getElementById('detail-date').textContent = formatDate(recipe.dateCreated);
    
    // Notes section
    const notesSection = document.getElementById('detail-notes-section');
    if (recipe.notes) {
        notesSection.style.display = 'block';
        document.getElementById('detail-notes').textContent = recipe.notes;
    } else {
        notesSection.style.display = 'none';
    }

    document.getElementById('detail-ingredients').textContent = recipe.ingredients;
    document.getElementById('detail-instructions').textContent = recipe.instructions;

    // Favorite button
    const favBtn = document.getElementById('favorite-btn');
    if (recipe.isFavorite) {
        favBtn.classList.add('favorite');
    } else {
        favBtn.classList.remove('favorite');
    }

    detailModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Detail Modal Actions
document.getElementById('favorite-btn').addEventListener('click', () => {
    if (!currentRecipeId) return;
    const recipe = store.toggleFavorite(currentRecipeId);
    const btn = document.getElementById('favorite-btn');
    
    if (recipe.isFavorite) {
        btn.classList.add('favorite');
    } else {
        btn.classList.remove('favorite');
    }
    
    renderRecipes();
});

document.getElementById('edit-recipe-btn').addEventListener('click', () => {
    if (!currentRecipeId) return;
    
    const recipe = store.recipes.find(r => r.id === currentRecipeId);
    if (!recipe) return;

    isEditMode = true;
    document.getElementById('modal-title').textContent = 'Edit Recipe';
    document.getElementById('recipe-name').value = recipe.name;
    document.getElementById('recipe-ingredients').value = recipe.ingredients;
    document.getElementById('recipe-instructions').value = recipe.instructions;
    document.getElementById('recipe-notes').value = recipe.notes;

    closeDetailModal();
    recipeModal.classList.add('active');
});

document.getElementById('delete-recipe-btn').addEventListener('click', () => {
    if (!currentRecipeId) return;
    
    if (confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
        store.delete(currentRecipeId);
        closeDetailModal();
        renderRecipes();
    }
});

// Initialize
renderRecipes();

// Prevent zoom on double tap
let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);
