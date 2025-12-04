// Loading Screen Messages
const loadingMessages = [
    "Kneading the dough...",
    "Feeding your starter...",
    "Waiting for the perfect rise...",
    "Scoring the loaf...",
    "Preheating the oven...",
    "Stretching and folding...",
    "Dusting with flour...",
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

// Register Service Worker with auto-update
if ('serviceWorker' in navigator) {
    let refreshing = false;
    
    navigator.serviceWorker.register('sw.js')
        .then(registration => {
            console.log('Service Worker registered');
            
            // Check for updates every time the app is opened
            registration.update();
            
            // Check for updates periodically (every 60 seconds)
            setInterval(() => {
                registration.update();
            }, 60000);
            
            // Listen for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New service worker is ready, reload to get updates
                        console.log('New version available! Reloading...');
                        if (!refreshing) {
                            refreshing = true;
                            window.location.reload();
                        }
                    }
                });
            });
        })
        .catch(err => console.log('Service Worker registration failed', err));
    
    // Reload page when new service worker takes control
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            refreshing = true;
            window.location.reload();
        }
    });
}

// Supabase Configuration
const SUPABASE_URL = 'https://yelrnhvhxgoqtbszvqzt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllbHJuaHZoeGdvcXRic3p2cXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDExODksImV4cCI6MjA4MDM3NzE4OX0.IOIU9Eob1JvcMZ0mjcQyjmSOKasYjGcwA3ZY5k5nJKE';

// Authentication Manager
class AuthManager {
    constructor() {
        this.userEmail = null;
        this.userId = null;
        this.checkAuth();
    }

    checkAuth() {
        const stored = localStorage.getItem('sourdough-user');
        if (stored) {
            const user = JSON.parse(stored);
            this.userEmail = user.email;
            this.userId = user.id;
            return true;
        }
        return false;
    }

    isAuthenticated() {
        return this.userEmail !== null;
    }

    async signUp(email, password) {
        try {
            // Simple hash of password (in production, use proper hashing)
            const passwordHash = await this.hashPassword(password);
            const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            // Check if user exists
            const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/recipes?user_email=eq.${encodeURIComponent(email)}&select=user_email&limit=1`, {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
            });
            
            const existing = await checkResponse.json();
            if (existing && existing.length > 0) {
                throw new Error('Email already registered');
            }
            
            // Store user credentials
            this.userEmail = email;
            this.userId = userId;
            localStorage.setItem('sourdough-user', JSON.stringify({ 
                email: email, 
                id: userId,
                passwordHash: passwordHash 
            }));
            
            return true;
        } catch (error) {
            console.error('Sign up failed:', error);
            throw error;
        }
    }

    async signIn(email, password) {
        try {
            const passwordHash = await this.hashPassword(password);
            
            // First, check if this email has recipes in the cloud (user exists)
            const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/recipes?user_email=eq.${encodeURIComponent(email)}&select=user_id&limit=1`, {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
            });
            
            const existing = await checkResponse.json();
            
            // Check if we have stored credentials locally
            const stored = localStorage.getItem('sourdough-user');
            let storedUser = stored ? JSON.parse(stored) : null;
            
            // Verify password hash
            if (storedUser && storedUser.email === email && storedUser.passwordHash === passwordHash) {
                // Credentials match
                this.userEmail = email;
                this.userId = storedUser.id;
                return true;
            } else if (existing && existing.length > 0) {
                // User exists in cloud, but no local creds or wrong password locally
                // This means they signed up on this device before, verify the password
                if (storedUser && storedUser.email === email) {
                    // Local credentials exist but password is wrong
                    throw new Error('Invalid email or password');
                } else {
                    // No local credentials, but user exists in cloud
                    // Store new credentials (this is signing in from a different device)
                    const userId = existing[0].user_id;
                    localStorage.setItem('sourdough-user', JSON.stringify({
                        email: email,
                        id: userId,
                        passwordHash: passwordHash
                    }));
                    this.userEmail = email;
                    this.userId = userId;
                    return true;
                }
            } else {
                // User doesn't exist at all
                throw new Error('Invalid email or password');
            }
        } catch (error) {
            console.error('Sign in failed:', error);
            throw error;
        }
    }

    signOut() {
        this.userEmail = null;
        this.userId = null;
        localStorage.removeItem('sourdough-user');
        localStorage.removeItem('sourdough-recipes');
    }

    async hashPassword(password) {
        // Simple hash for demo (in production, use bcrypt or similar)
        const encoder = new TextEncoder();
        const data = encoder.encode(password + 'sourdough_salt_2024');
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
}

// Recipe Storage with Supabase Cloud Sync
class RecipeStore {
    constructor() {
        this.supabaseReady = false;
        this.syncQueue = [];
        this.recipes = [];
        
        // Initialize Supabase first, then load recipes
        this.initSupabase();
    }

    // Initialize Supabase connection
    async initSupabase() {
        console.log('🚀 Initializing Supabase connection...');
        
        // Check if user is authenticated
        if (!auth.isAuthenticated()) {
            console.log('❌ User not authenticated');
            showAuthScreen();
            return;
        }
        
        console.log('✅ User authenticated:', auth.userEmail);

        try {
            // Fetch recipes for this user
            console.log('📥 Fetching recipes from cloud...');
            const cloudRecipes = await this.fetchFromSupabase();
            
            if (cloudRecipes && cloudRecipes.length > 0) {
                // Cloud has recipes - use them
                this.recipes = cloudRecipes;
                this.save(false); // Save to localStorage only
                console.log('✅ Recipes restored from cloud');
                renderRecipes();
            } else {
                // Check localStorage as fallback
                const localRecipes = this.load();
                
                if (localRecipes && localRecipes.length > 0) {
                    // Have local recipes - upload to cloud
                    this.recipes = localRecipes;
                    await this.syncAllToSupabase();
                    console.log('✅ Local recipes uploaded to cloud');
                    renderRecipes();
                } else {
                    // No recipes - start with empty list
                    this.recipes = [];
                    console.log('✅ Ready - no recipes yet');
                    renderRecipes();
                }
            }
            
            this.supabaseReady = true;
            
            // Process any queued syncs
            while (this.syncQueue.length > 0) {
                const recipe = this.syncQueue.shift();
                await this.syncToSupabase(recipe);
            }
        } catch (error) {
            console.log('Supabase init failed:', error.message);
            // Fallback to localStorage
            this.recipes = this.load();
            if (this.recipes.length === 0) {
                this.recipes = [];
            }
            this.supabaseReady = false;
            renderRecipes();
        }
    }

    // Fetch all recipes from Supabase for this user
    async fetchFromSupabase() {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/recipes?user_email=eq.${encodeURIComponent(auth.userEmail)}&select=*`, {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch');
            
            const data = await response.json();
            return data.map(item => ({
                id: item.id,
                name: item.name,
                ingredients: item.ingredients,
                instructions: item.instructions,
                notes: item.notes,
                dateCreated: item.date_created,
                isFavorite: item.is_favorite
            }));
        } catch (error) {
            console.log('Fetch from Supabase failed:', error);
            return null;
        }
    }



    // Sync single recipe to Supabase
    async syncToSupabase(recipe) {
        console.log('🔄 Syncing recipe to Supabase:', recipe.name);
        console.log('   Supabase ready:', this.supabaseReady);
        console.log('   User email:', auth.userEmail);
        
        if (!this.supabaseReady) {
            console.log('⏳ Queuing recipe for later sync');
            this.syncQueue.push(recipe);
            return;
        }

        try {
            // Check if recipe already exists in cloud
            console.log('   Checking if recipe exists in cloud...');
            const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/recipes?id=eq.${recipe.id}&user_email=eq.${encodeURIComponent(auth.userEmail)}`, {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
            });
            
            const existing = await checkResponse.json();
            
            const recipeData = {
                id: recipe.id,
                user_email: auth.userEmail,
                user_id: auth.userId,
                name: recipe.name,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions,
                notes: recipe.notes,
                date_created: recipe.dateCreated,
                is_favorite: recipe.isFavorite,
                updated_at: new Date().toISOString()
            };

            if (existing && existing.length > 0) {
                // Update existing recipe
                console.log('   📝 Updating existing recipe');
                const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/recipes?id=eq.${recipe.id}&user_email=eq.${encodeURIComponent(auth.userEmail)}`, {
                    method: 'PATCH',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify(recipeData)
                });
                console.log('   ✅ Recipe updated, status:', updateResponse.status);
            } else {
                // Insert new recipe
                console.log('   ➕ Inserting new recipe');
                const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/recipes`, {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify(recipeData)
                });
                console.log('   ✅ Recipe inserted, status:', insertResponse.status);
                if (!insertResponse.ok) {
                    const errorText = await insertResponse.text();
                    console.error('   ❌ Insert failed:', errorText);
                }
            }
        } catch (error) {
            console.error('❌ Sync to Supabase failed:', error);
        }
    }

    // Sync all recipes to Supabase
    async syncAllToSupabase() {
        for (const recipe of this.recipes) {
            await this.syncToSupabase(recipe);
        }
    }

    // Delete recipe from Supabase
    async deleteFromSupabase(id) {
        try {
            await fetch(`${SUPABASE_URL}/rest/v1/recipes?id=eq.${id}&user_email=eq.${encodeURIComponent(auth.userEmail)}`, {
                method: 'DELETE',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
            });
        } catch (error) {
            console.log('Delete from Supabase failed:', error);
        }
    }

    load() {
        const stored = localStorage.getItem('sourdough-recipes');
        return stored ? JSON.parse(stored) : [];
    }

    save(syncToCloud = true) {
        console.log('💾 Saving recipes to localStorage, count:', this.recipes.length);
        localStorage.setItem('sourdough-recipes', JSON.stringify(this.recipes));
        
        // Sync to Supabase
        if (syncToCloud) {
            console.log('☁️ Triggering cloud sync...');
            this.syncAllToSupabase();
        }
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
        this.deleteFromSupabase(id);
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
}

// Initialize
const auth = new AuthManager();
const store = new RecipeStore();
let currentRecipeId = null;
let isEditMode = false;

// Auth Screen Functions
function showAuthScreen() {
    document.getElementById('auth-screen').style.display = 'flex';
    document.getElementById('app-content').style.display = 'none';
}

function hideAuthScreen() {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('app-content').style.display = 'flex';
}

function switchToSignUp() {
    document.getElementById('signin-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
}

function switchToSignIn() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('signin-form').style.display = 'block';
}

async function handleSignIn(e) {
    e.preventDefault();
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    const errorEl = document.getElementById('signin-error');
    
    try {
        await auth.signIn(email, password);
        hideAuthScreen();
        await store.initSupabase();
    } catch (error) {
        errorEl.textContent = error.message;
        errorEl.style.display = 'block';
    }
}

async function handleSignUp(e) {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const errorEl = document.getElementById('signup-error');
    
    if (password !== confirmPassword) {
        errorEl.textContent = 'Passwords do not match';
        errorEl.style.display = 'block';
        return;
    }
    
    if (password.length < 6) {
        errorEl.textContent = 'Password must be at least 6 characters';
        errorEl.style.display = 'block';
        return;
    }
    
    try {
        await auth.signUp(email, password);
        hideAuthScreen();
        await store.initSupabase();
    } catch (error) {
        errorEl.textContent = error.message;
        errorEl.style.display = 'block';
    }
}

function handleSignOut() {
    if (confirm('Are you sure you want to sign out?')) {
        auth.signOut();
        store.recipes = [];
        showAuthScreen();
        renderRecipes();
    }
}

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
let currentMode = 'counter'; // 'counter', 'bulk-cold', 'cold-only'

const temperatureInput = document.getElementById('temperature');
const fridgeTemperatureInput = document.getElementById('fridge-temperature');
const fridgeTemperatureMainInput = document.getElementById('fridge-temperature-main');
const flourInput = document.getElementById('flour-weight');
const waterInput = document.getElementById('water-weight');
const starterInput = document.getElementById('starter-weight');

const tempValue = document.getElementById('temp-value');
const fridgeTempValue = document.getElementById('fridge-temp-value');
const fridgeTempValueMain = document.getElementById('fridge-temp-value-main');
const flourValue = document.getElementById('flour-value');
const waterValue = document.getElementById('water-value');
const starterValue = document.getElementById('starter-value');

const bulkTimeEl = document.getElementById('bulk-time');
const proofTimeEl = document.getElementById('proof-time');
const totalTimeEl = document.getElementById('total-time');

// Mode selector
const modeButtons = document.querySelectorAll('.mode-button');
modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        modeButtons.forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        currentMode = button.dataset.mode;
        updateUIForMode();
        calculateTimes();
    });
});

function updateUIForMode() {
    const sectionDivider = document.getElementById('section-divider');
    const fridgeTempInput = document.getElementById('fridge-temp-input');
    const fridgeTempMainInput = document.getElementById('fridge-temp-main');
    const doughTempInput = document.getElementById('dough-temp-input');
    const bulkResult = document.getElementById('bulk-result');
    const proofResult = document.getElementById('proof-result');
    
    const bulkTitle = document.getElementById('bulk-title');
    const bulkSubtitle = document.getElementById('bulk-subtitle');
    const bulkTimeLabel = document.getElementById('bulk-time-label');
    const bulkTimeDesc = document.getElementById('bulk-time-desc');
    
    const proofTitle = document.getElementById('proof-title');
    const proofSubtitle = document.getElementById('proof-subtitle');
    const proofTimeLabel = document.getElementById('proof-time-label');
    const proofTimeDesc = document.getElementById('proof-time-desc');
    
    const totalDivider = document.getElementById('total-divider');
    const totalTimeSection = document.getElementById('total-time-section');
    
    if (currentMode === 'counter') {
        // Counter only mode
        doughTempInput.style.display = 'block';
        fridgeTempMainInput.style.display = 'none';
        sectionDivider.style.display = 'none';
        fridgeTempInput.style.display = 'none';
        proofResult.style.display = 'none';
        bulkResult.style.display = 'block';
        
        bulkTitle.textContent = 'Fermentation Time';
        bulkSubtitle.textContent = 'On the counter';
        bulkTimeLabel.textContent = 'Total fermentation time';
        bulkTimeDesc.textContent = 'Until ready to bake';
        
    } else if (currentMode === 'bulk-cold') {
        // Bulk on counter, then cold proof
        doughTempInput.style.display = 'block';
        fridgeTempMainInput.style.display = 'none';
        sectionDivider.style.display = 'flex';
        fridgeTempInput.style.display = 'block';
        proofResult.style.display = 'block';
        bulkResult.style.display = 'block';
        
        bulkTitle.textContent = 'Bulk Fermentation';
        bulkSubtitle.textContent = 'On the counter';
        bulkTimeLabel.textContent = 'Bulk fermentation time';
        bulkTimeDesc.textContent = 'Until dough doubles';
        
        proofTitle.textContent = 'Cold Proof';
        proofSubtitle.textContent = 'In the fridge';
        proofTimeLabel.textContent = 'Final proof time';
        proofTimeDesc.textContent = 'Overnight in fridge';
        
        totalDivider.style.display = 'block';
        totalTimeSection.style.display = 'flex';
        
    } else if (currentMode === 'cold-only') {
        // Cold only mode - hide dough temp, show fridge temp in main section
        doughTempInput.style.display = 'none';
        fridgeTempMainInput.style.display = 'block';
        sectionDivider.style.display = 'none';
        fridgeTempInput.style.display = 'none';
        proofResult.style.display = 'none';
        bulkResult.style.display = 'block';
        
        bulkTitle.textContent = 'Cold Fermentation';
        bulkSubtitle.textContent = 'In the fridge';
        bulkTimeLabel.textContent = 'Total fermentation time';
        bulkTimeDesc.textContent = 'Cold bulk and proof';
    }
}

function calculateTimes() {
    const doughTemp = parseFloat(temperatureInput.value);
    const fridgeTemp = parseFloat(fridgeTemperatureInput.value);
    const flour = parseFloat(flourInput.value);
    const water = parseFloat(waterInput.value);
    const starter = parseFloat(starterInput.value);

    // Calculate hydration percentage
    const hydration = (water / flour) * 100;

    // Calculate inoculation percentage (starter as % of flour)
    const inoculation = (starter / flour) * 100;

    let bulkTime, proofTime, totalTime;

    if (currentMode === 'counter') {
        // === COUNTER ONLY MODE ===
        // Full fermentation at room temperature
        // Base time at 75°F dough temp, 20% inoculation, 70% hydration
        let baseTime = 6.0; // Slightly longer for full proof on counter
        
        const idealTemp = 75;
        const tempDiff = doughTemp - idealTemp;
        const tempFactor = Math.pow(2, -tempDiff / 9);
        
        const inoculationFactor = 20 / inoculation;
        const hydrationFactor = 1 + ((70 - hydration) * 0.015);
        
        bulkTime = baseTime * tempFactor * inoculationFactor * hydrationFactor;
        totalTime = bulkTime;
        
        // Update display
        bulkTimeEl.textContent = formatTime(bulkTime);
        
    } else if (currentMode === 'bulk-cold') {
        // === BULK + COLD MODE ===
        // Bulk fermentation on counter, then cold proof in fridge
        
        // Bulk fermentation (counter)
        let baseBulkTime = 4.0;
        const idealTemp = 75;
        const tempDiff = doughTemp - idealTemp;
        const tempFactor = Math.pow(2, -tempDiff / 9);
        const inoculationFactor = 20 / inoculation;
        const hydrationFactor = 1 + ((70 - hydration) * 0.015);
        bulkTime = baseBulkTime * tempFactor * inoculationFactor * hydrationFactor;
        
        // Cold proof (fridge)
        const baseColdProofTime = 12.0;
        const idealFridgeTemp = 38;
        const fridgeTempDiff = fridgeTemp - idealFridgeTemp;
        const fridgeTempFactor = Math.pow(0.75, fridgeTempDiff / 4);
        const coldInoculationFactor = 1 + ((20 - inoculation) * 0.01);
        proofTime = baseColdProofTime * fridgeTempFactor * coldInoculationFactor;
        
        totalTime = bulkTime + proofTime;
        
        // Update display
        bulkTimeEl.textContent = formatTime(bulkTime);
        proofTimeEl.textContent = formatTime(proofTime);
        totalTimeEl.textContent = formatTime(totalTime);
        
    } else if (currentMode === 'cold-only') {
        // === COLD ONLY MODE ===
        // Full fermentation in fridge (slower, longer process)
        // Base time at 38°F fridge temp, 20% inoculation
        let baseColdTime = 24.0; // Much longer for full cold fermentation
        
        const idealFridgeTemp = 38;
        const fridgeTempDiff = fridgeTemp - idealFridgeTemp;
        const fridgeTempFactor = Math.pow(0.75, fridgeTempDiff / 4);
        
        // Cold fermentation is less affected by inoculation
        const coldInoculationFactor = 1 + ((20 - inoculation) * 0.015);
        
        bulkTime = baseColdTime * fridgeTempFactor * coldInoculationFactor;
        totalTime = bulkTime;
        
        // Update display
        bulkTimeEl.textContent = formatTime(bulkTime);
    }
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

fridgeTemperatureInput.addEventListener('input', () => {
    const value = fridgeTemperatureInput.value;
    fridgeTempValue.textContent = `${value}°F`;
    // Sync with main fridge input
    fridgeTemperatureMainInput.value = value;
    fridgeTempValueMain.textContent = `${value}°F`;
    calculateTimes();
});

fridgeTemperatureMainInput.addEventListener('input', () => {
    const value = fridgeTemperatureMainInput.value;
    fridgeTempValueMain.textContent = `${value}°F`;
    // Sync with separate fridge input
    fridgeTemperatureInput.value = value;
    fridgeTempValue.textContent = `${value}°F`;
    calculateTimes();
});

flourInput.addEventListener('input', () => {
    flourValue.textContent = `${flourInput.value}g`;
    calculateTimes();
});

waterInput.addEventListener('input', () => {
    waterValue.textContent = `${waterInput.value}g`;
    calculateTimes();
});

starterInput.addEventListener('input', () => {
    starterValue.textContent = `${starterInput.value}g`;
    calculateTimes();
});

// Initial calculation
updateUIForMode();
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
