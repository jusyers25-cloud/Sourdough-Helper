<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="theme-color" content="#2D5F3F">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Sourdough Helper">
    <title>Sourdough Helper</title>
    <link rel="manifest" href="manifest.json">
    <link rel="icon" type="image/png" href="images/icon-192.png">
    <link rel="apple-touch-icon" href="images/icon-192.png">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Loading Screen -->
    <div class="splash-screen" id="splash-screen">
        <div class="splash-content">
            <img src="images/icon-192.png" alt="Sourdough Helper" class="splash-icon">
            <h1 class="splash-title">Sourdough Helper</h1>
            <p class="splash-message" id="splash-message">Kneading the dough...</p>
        </div>
    </div>

    <div class="app">
        <!-- Tab Navigation -->
        <nav class="tab-bar">
            <button class="tab-button active" data-tab="calculator">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>Calculator</span>
            </button>
            <button class="tab-button" data-tab="recipes">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                <span>Recipes</span>
            </button>
        </nav>

        <!-- Calculator View -->
        <div class="view active" id="calculator-view">
            <div class="container">
                <div class="header">
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <h1>Fermentation Timer</h1>
                    <p class="subtitle">Calculate your wait time</p>
                </div>

                <!-- Mode Selector -->
                <div class="mode-selector">
                    <button class="mode-button active" data-mode="counter">Counter Only</button>
                    <button class="mode-button" data-mode="bulk-cold">Bulk + Cold</button>
                    <button class="mode-button" data-mode="cold-only">Cold Only</button>
                </div>

                <div class="input-cards">
                    <div class="input-card">
                        <div class="input-header">
                            <div class="input-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
                                </svg>
                            </div>
                            <div class="input-info">
                                <h3>Dough Temperature</h3>
                                <p>Final dough temp after mixing</p>
                            </div>
                            <div class="input-value" id="temp-value">75°F</div>
                        </div>
                        <input type="range" id="temperature" min="65" max="85" value="75" class="slider">
                    </div>

                    <div class="input-card">
                        <div class="input-header">
                            <div class="input-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M3 3v18h18"></path>
                                    <path d="m19 9-5 5-4-4-3 3"></path>
                                </svg>
                            </div>
                            <div class="input-info">
                                <h3>Flour Weight</h3>
                                <p>Total flour in recipe</p>
                            </div>
                            <div class="input-value" id="flour-value">500g</div>
                        </div>
                        <input type="range" id="flour-weight" min="100" max="1000" value="500" step="50" class="slider">
                    </div>

                    <div class="input-card">
                        <div class="input-header">
                            <div class="input-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                                </svg>
                            </div>
                            <div class="input-info">
                                <h3>Water Weight</h3>
                                <p>Total water in recipe</p>
                            </div>
                            <div class="input-value" id="water-value">350g</div>
                        </div>
                        <input type="range" id="water-weight" min="50" max="800" value="350" step="10" class="slider">
                    </div>

                    <div class="input-card">
                        <div class="input-header">
                            <div class="input-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                </svg>
                            </div>
                            <div class="input-info">
                                <h3>Starter Amount</h3>
                                <p>Active sourdough starter</p>
                            </div>
                            <div class="input-value" id="starter-value">100g</div>
                        </div>
                        <input type="range" id="starter-weight" min="20" max="300" value="100" step="10" class="slider">
                    </div>
                </div>

                <div class="result-card" id="bulk-result">
                    <div class="result-header">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M5 22h14"></path>
                            <path d="M5 2h14"></path>
                            <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"></path>
                            <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"></path>
                        </svg>
                        <h2 id="bulk-title">Bulk Fermentation</h2>
                        <p id="bulk-subtitle" style="font-size: 14px; color: var(--text-secondary); margin-top: 4px;">On the counter</p>
                    </div>
                    <div class="divider"></div>
                    <div class="time-result">
                        <div class="time-step">
                            <div class="step-info" style="flex: 1;">
                                <h4 id="bulk-time-label">Bulk fermentation time</h4>
                                <p id="bulk-time-desc" style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Until dough doubles</p>
                            </div>
                            <div class="step-time" id="bulk-time">4h 0m</div>
                        </div>
                    </div>
                </div>

                <div class="section-divider" id="section-divider" style="display: none;">
                    <div class="divider-line"></div>
                    <span class="divider-text">Then shape and cold proof</span>
                    <div class="divider-line"></div>
                </div>

                <div class="input-card" id="fridge-temp-input" style="margin-top: 20px; display: none;">
                    <div class="input-header">
                        <div class="input-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
                            </svg>
                        </div>
                        <div class="input-info">
                            <h3>Fridge Temperature</h3>
                            <p>Cold proof temperature</p>
                        </div>
                        <div class="input-value" id="fridge-temp-value">38°F</div>
                    </div>
                    <input type="range" id="fridge-temperature" min="30" max="50" value="38" class="slider">
                </div>

                <div class="result-card" id="proof-result" style="margin-top: 24px; display: none;">
                    <div class="result-header">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="3" y1="9" x2="21" y2="9"></line>
                            <line x1="9" y1="21" x2="9" y2="9"></line>
                        </svg>
                        <h2 id="proof-title">Cold Proof</h2>
                        <p id="proof-subtitle" style="font-size: 14px; color: var(--text-secondary); margin-top: 4px;">In the fridge</p>
                    </div>
                    <div class="divider"></div>
                    <div class="time-result">
                        <div class="time-step">
                            <div class="step-info" style="flex: 1;">
                                <h4 id="proof-time-label">Final proof time</h4>
                                <p id="proof-time-desc" style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Overnight in fridge</p>
                            </div>
                            <div class="step-time" id="proof-time">12h 0m</div>
                        </div>
                    </div>
                    <div class="divider" id="total-divider"></div>
                    <div class="total-time" id="total-time-section">
                        <div>
                            <h3>Total Time</h3>
                            <p>From mix to bake</p>
                        </div>
                        <div class="total-value" id="total-time">16h 0m</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recipes View -->
        <div class="view" id="recipes-view">
            <div class="container">
                <div class="recipes-header">
                    <div>
                        <h1>My Recipes</h1>
                        <p class="subtitle" id="recipe-count">0 saved recipes</p>
                    </div>
                    <button class="add-button" id="add-recipe-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="16"></line>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                    </button>
                </div>

                <div id="recipes-list"></div>
            </div>
        </div>
    </div>

    <!-- Add/Edit Recipe Modal -->
    <div class="modal" id="recipe-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modal-title">New Recipe</h2>
                <button class="close-button" id="close-modal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <form id="recipe-form">
                <div class="form-group">
                    <label>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="20" x2="12" y2="10"></line>
                            <line x1="18" y1="20" x2="18" y2="4"></line>
                            <line x1="6" y1="20" x2="6" y2="16"></line>
                        </svg>
                        Recipe Name
                    </label>
                    <input type="text" id="recipe-name" placeholder="e.g., Classic Sourdough" required>
                </div>
                <div class="form-group">
                    <label>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="8" y1="6" x2="21" y2="6"></line>
                            <line x1="8" y1="12" x2="21" y2="12"></line>
                            <line x1="8" y1="18" x2="21" y2="18"></line>
                            <line x1="3" y1="6" x2="3.01" y2="6"></line>
                            <line x1="3" y1="12" x2="3.01" y2="12"></line>
                            <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                        Ingredients
                    </label>
                    <textarea id="recipe-ingredients" rows="6" placeholder="• 500g bread flour&#10;• 350g water&#10;• 100g starter&#10;• 10g salt"></textarea>
                </div>
                <div class="form-group">
                    <label>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        Instructions
                    </label>
                    <textarea id="recipe-instructions" rows="8" placeholder="1. Mix flour and water&#10;2. Add starter and salt&#10;3. Bulk ferment 4-6 hours&#10;..."></textarea>
                </div>
                <div class="form-group">
                    <label>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        Notes (Optional)
                    </label>
                    <textarea id="recipe-notes" rows="3" placeholder="Any tips or variations..."></textarea>
                </div>
                <button type="submit" class="btn-primary">Save Recipe</button>
            </form>
        </div>
    </div>

    <!-- Recipe Detail Modal -->
    <div class="modal" id="detail-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="detail-name"></h2>
                <div class="header-buttons">
                    <button class="icon-button" id="favorite-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                    <button class="icon-button" id="edit-recipe-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="icon-button" id="delete-recipe-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                    <button class="close-button" id="close-detail">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="detail-content">
                <p class="detail-date" id="detail-date"></p>
                <div class="detail-notes" id="detail-notes-section">
                    <h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        Notes
                    </h3>
                    <p id="detail-notes"></p>
                </div>
                <div class="detail-section">
                    <h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="8" y1="6" x2="21" y2="6"></line>
                            <line x1="8" y1="12" x2="21" y2="12"></line>
                            <line x1="8" y1="18" x2="21" y2="18"></line>
                            <line x1="3" y1="6" x2="3.01" y2="6"></line>
                            <line x1="3" y1="12" x2="3.01" y2="12"></line>
                            <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                        Ingredients
                    </h3>
                    <p id="detail-ingredients"></p>
                </div>
                <div class="detail-section">
                    <h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                        </svg>
                        Instructions
                    </h3>
                    <p id="detail-instructions"></p>
                </div>
            </div>
        </div>
    </div>

    <script src="app.js"></script>
</body>
</html>

