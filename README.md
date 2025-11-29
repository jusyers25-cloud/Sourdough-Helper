# Sourdough Helper - Progressive Web App

A beautiful mobile web app to help with sourdough baking! Works on iPhone and can be installed like a native app. Built with modern web technologies and designed with a fresh green color scheme.

## ✨ Features

### ⏱️ Fermentation Calculator
- Calculate bulk fermentation and proofing times
- Adjust for room temperature (60°F - 85°F)
- Factor in starter strength (0% - 100%)
- Account for dough weight (200g - 2000g)
- Get precise timing for your bake

### 📖 Recipe Storage
- Save unlimited sourdough recipes
- Add ingredients, instructions, and notes
- Mark favorites with a heart ❤️
- Edit or delete recipes anytime
- Comes with 2 starter recipes to get you going
- All recipes stored locally on your device

### 💚 Modern Design
- Beautiful shades of green throughout
- Smooth animations and transitions
- Optimized for iPhone screens
- Works offline after first visit
- Add to home screen for app-like experience

## 🚀 How to Deploy (From Windows!)

You have two easy options to get this on your mom's iPhone:

### Option 1: GitHub Pages (Recommended - Free!)

1. **Create a GitHub account** (if you don't have one)
   - Go to [github.com](https://github.com) and sign up

2. **Create a new repository**
   - Click the `+` button → "New repository"
   - Name it: `sourdough-helper`
   - Make it Public
   - Click "Create repository"

3. **Upload the files**
   - Click "uploading an existing file"
   - Drag and drop ALL files from this folder:
     - `index.html`
     - `styles.css`
     - `app.js`
     - `manifest.json`
     - `sw.js`
     - `icon.svg`
   - Click "Commit changes"

4. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Under "Source", select "main" branch
   - Click Save
   - Wait 1-2 minutes
   - Your app will be live at: `https://[your-username].github.io/sourdough-helper/`

5. **Create the icons**
   - You need to convert `icon.svg` to PNG files
   - Go to [Convertio](https://convertio.co/svg-png/) or similar
   - Upload `icon.svg`
   - Convert to PNG at 192x192px → save as `icon-192.png`
   - Convert to PNG at 512x512px → save as `icon-512.png`
   - Upload both PNG files to your GitHub repository

### Option 2: Netlify (Also Free!)

1. **Go to [Netlify](https://www.netlify.com)**
   - Sign up for a free account

2. **Deploy your site**
   - Click "Add new site" → "Deploy manually"
   - Drag and drop the entire `Sourdough Helper` folder
   - Wait for deployment to complete

3. **Get your URL**
   - Netlify will give you a URL like: `https://random-name.netlify.app`
   - You can customize this in Site settings

4. **Create the icons** (same as above)
   - Convert `icon.svg` to `icon-192.png` and `icon-512.png`
   - Upload via Netlify's file manager

## 📱 How to Install on iPhone

Once your app is deployed:

1. **Open Safari on iPhone**
   - Navigate to your app's URL
   - (GitHub Pages: `https://[username].github.io/sourdough-helper/`)
   - (Netlify: your custom URL)

2. **Add to Home Screen**
   - Tap the Share button (box with arrow)
   - Scroll down and tap "Add to Home Screen"
   - Edit the name if you want (e.g., "Sourdough")
   - Tap "Add"

3. **Use Like a Real App!**
   - The icon will appear on the home screen
   - Opens in fullscreen (no Safari bars)
   - Works offline after first load
   - All recipes saved locally

## 🎨 Color Scheme

The app uses a beautiful green color palette:
- **Deep Forest Green** (#2D5F3F) - Primary text and accents
- **Medium Sage Green** (#4A8B60) - Buttons and interactive elements
- **Soft Mint Green** (#6FB586) - Highlights
- **Light Mint** (#A8D5BA) - Subtle accents
- **Background** (#F0F7F4) - Clean, fresh background

## 📁 Files Included

- `index.html` - Main app structure
- `styles.css` - Beautiful green styling
- `app.js` - Calculator logic and recipe management
- `manifest.json` - PWA configuration
- `sw.js` - Service worker for offline support
- `icon.svg` - App icon (needs conversion to PNG)

## 💡 Tips for Your Mom

### Calculator Tab:
- Slide the controls to adjust temperature, starter strength, and dough weight
- The app automatically calculates fermentation and proofing times
- Perfect for planning your bake!

### Recipes Tab:
- Tap the + button to add a new recipe
- Tap any recipe card to view full details
- Tap the heart to mark favorites
- In detail view, use the buttons to edit or delete

### Works Offline:
- After first visit, the app works without internet
- All recipes are saved on the device
- Perfect for kitchen use!

## 🔧 Testing Locally (Optional)

If you want to test before deploying:

1. Install Python (comes with Windows)
2. Open PowerShell in the `Sourdough Helper` folder
3. Run: `python -m http.server 8000`
4. Open browser to: `http://localhost:8000`

## ❓ Troubleshooting

**Icons not showing?**
- Make sure you converted `icon.svg` to PNG files
- Upload `icon-192.png` and `icon-512.png` to your repository

**App not working offline?**
- Make sure all files are uploaded
- Try clearing Safari cache and reinstalling

**Can't add to home screen?**
- Make sure you're using Safari (not Chrome)
- Some features require HTTPS (GitHub Pages and Netlify provide this)

Enjoy baking! 🍞💚
