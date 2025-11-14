# Voice Shopping Assistant - User Guide

Welcome to the Voice Command Shopping Assistant! This guide will help you get started and make the most of all features.

## 🎤 Getting Started

### Step 1: Enable Microphone Access

When you first use the app, your browser will ask for microphone permission:

1. Click **"Allow"** when prompted
2. If denied, click the microphone icon in your browser's address bar to grant permission
3. The app requires HTTPS for microphone access (automatically enabled on deployment)

### Step 2: Choose Your Language

1. Look for the language dropdown in the **Voice Commands** section
2. Select from 8 supported languages:
   - English (US)
   - Spanish
   - French
   - German
   - Italian
   - Portuguese
   - Chinese
   - Japanese

---

## 🗣️ Using Voice Commands

### Adding Items to Your List

**Click "Start Listening"** in the Voice Commands section, then speak naturally:

#### Basic Commands:
- **"Add milk"** → Adds 1 milk to your list
- **"I need bread"** → Adds 1 bread to your list
- **"Get apples"** → Adds 1 apple to your list

#### With Quantities:
- **"Add 3 bananas"** → Adds 3 bananas
- **"I need 2 bottles of water"** → Adds 2 water bottles
- **"Buy 5 oranges"** → Adds 5 oranges

#### Natural Language:
- **"I want to buy eggs"** → Adds eggs
- **"Purchase chicken"** → Adds chicken
- **"Can you add tomatoes to my list"** → Adds tomatoes

### Removing Items

- **"Remove milk"** → Removes milk from your list
- **"Delete bread from my list"** → Removes bread
- **"Take off apples"** → Removes apples

### Managing Your List

- **"Clear all"** → Removes all items
- **"Empty list"** → Clears the entire list

---

## 🔍 Voice-Activated Search

Use the search feature to find products with specific criteria:

### Basic Search:
1. Click the microphone button in the **Voice Search** section
2. Speak your search:
   - **"Find organic apples"** → Shows organic apple options
   - **"Search for bread"** → Shows all bread options
   - **"Show me coffee"** → Displays coffee products

### Price Filtering:
- **"Find toothpaste under $5"** → Shows toothpaste items under $5
- **"Search for coffee under $10"** → Shows affordable coffee options

### Price Range:
- **"Find bread between $2 and $4"** → Shows bread in that price range
- **"Show me milk between $3 and $5"** → Filters milk by price

### Adding from Search:
- Search results show product details (brand, size, price)
- Click **"Add"** button to add item directly to your shopping list

---

## 📋 Managing Your Shopping List

### View Items by Category

Items are automatically organized into categories:
- 🥛 **Dairy**: Milk, cheese, yogurt, eggs
- 🍎 **Produce**: Fruits and vegetables
- 🥩 **Meat**: Chicken, beef, fish
- 🍞 **Bakery**: Bread, bagels, muffins
- ☕ **Beverages**: Coffee, juice, water
- 🍿 **Snacks**: Chips, crackers, candy
- 🍝 **Pantry**: Rice, pasta, sauces
- 🧊 **Frozen**: Ice cream, frozen foods
- 🧴 **Personal Care**: Toiletries
- 🧹 **Household**: Cleaning supplies

### Category Actions:
1. **Click category header** to expand/collapse
2. View item count and completed items per category
3. All items within a category are displayed together

### Item Actions:

#### Mark as Completed:
- ☑️ Click the checkbox next to any item
- Completed items show with strikethrough text
- Items remain visible until you clear them

#### Update Quantity:
- Change the number in the quantity field
- Use arrow buttons or type directly
- Minimum quantity is 1

#### Remove Item:
- Click the 🗑️ trash icon to delete
- Confirmation message appears

#### Clear Completed:
- Click **"Clear Completed"** button at the top
- Removes all checked items at once

---

## ✨ Smart Suggestions

The app learns from your shopping habits and provides intelligent recommendations:

### Types of Suggestions:

#### 1. Frequent Items (Purple Badge)
- Shows items you buy most often
- Based on your purchase history
- Example: "You buy this often (5 times)"

#### 2. Seasonal Items (Green Badge)
- Recommends items currently in season
- November: Pumpkins, squash, cranberries
- Changes based on current month

#### 3. Substitutes (Blue Badge)
- Suggests healthier alternatives
- Example: "Alternative to milk" → Suggests almond milk
- Helps discover new products

#### 4. Complementary Items (Orange Badge)
- Recommends items that go well together
- Example: Added bread → Suggests butter
- Makes shopping more complete

### Using Suggestions:
1. View suggestions in the sidebar
2. Click **"+"** button to add to your list
3. Suggestions update as you add items

---

## 📊 Shopping Statistics

Track your shopping habits with real-time analytics:

### Metrics Displayed:

**Total Items**: Current number of items in your list

**Completed**: How many items you've checked off

**Total Quantity**: Sum of all quantities across items

**Top Category**: Your most-shopped category with item count

**Most Purchased**: Item you buy most frequently with purchase count

---

## 💡 Pro Tips

### Voice Recognition Tips:
1. **Speak clearly** in a quiet environment
2. **Be specific** with quantities: "three" or "3" both work
3. **Natural speech** works best - speak as you normally would
4. **Pause briefly** after the listening indicator appears
5. **Try again** if command isn't recognized

### Efficiency Tips:
1. **Leave listening on** for hands-free operation while cooking
2. **Use search** to compare prices before adding
3. **Check suggestions** before shopping - you might be forgetting something
4. **Mark items as completed** while shopping to track progress
5. **Clear completed items** after shopping to start fresh

### Mobile Usage:
1. Works great on mobile devices with responsive design
2. Perfect for in-store shopping
3. Voice recognition works with phone's microphone
4. Touch-friendly buttons for manual control

---

## 🔒 Privacy & Data

### Your Data is Safe:
- ✅ All data stored **locally in your browser**
- ✅ No server-side storage
- ✅ No account required
- ✅ No data collection or tracking
- ✅ Works offline after initial load

### Data Persistence:
- Shopping list saved to localStorage
- Purchase history saved for smart suggestions
- Data persists across browser sessions
- Clear browser data to reset

---

## ❓ Troubleshooting

### Microphone Not Working:

**Problem**: Voice recognition not responding

**Solutions**:
1. Check browser permissions (click padlock in address bar)
2. Ensure you're using HTTPS (required for microphone access)
3. Try refreshing the page
4. Use Chrome or Edge for best compatibility
5. Check if microphone works in other apps

### Voice Commands Not Recognized:

**Problem**: Commands aren't being processed

**Solutions**:
1. Speak more clearly and slightly slower
2. Ensure you're using supported command phrases
3. Check if listening is actually active (red microphone icon)
4. Try manual search if voice continues to fail

### Items Not Saving:

**Problem**: Shopping list disappears on reload

**Solutions**:
1. Check if browser is in private/incognito mode
2. Ensure localStorage is enabled in browser settings
3. Check browser storage limits aren't exceeded
4. Try a different browser

### Search Returns No Results:

**Problem**: Voice search finds nothing

**Solutions**:
1. Try broader search terms
2. Use manual text search to verify spelling
3. Adjust price filters if active
4. Check if you're searching for items in the database

---

## 🌐 Browser Compatibility

### Fully Supported:
- ✅ **Chrome 25+** (Recommended)
- ✅ **Microsoft Edge 79+** (Recommended)

### Partial Support:
- ⚠️ **Safari 14.1+** (Limited features)

### Not Supported:
- ❌ **Firefox** (No Web Speech API support)

---

## 📱 Example Shopping Session

Here's how a typical shopping session might look:

1. **Open the app** and click "Start Listening"
2. **Add items**: "Add milk", "I need 3 apples", "Buy bread"
3. **Check suggestions**: Notice butter suggested with bread - add it
4. **Search for specifics**: "Find toothpaste under $5"
5. **Add from search**: Click "Add" on preferred brand
6. **Review list**: 5 items organized by category
7. **Go shopping**: Mark items as completed while in store
8. **Clear completed**: Remove checked items when done

---

## 🎯 Quick Reference Card

| Action | Voice Command Example |
|--------|----------------------|
| Add item | "Add [item]" |
| Add with quantity | "I need [number] [item]" |
| Remove item | "Remove [item]" |
| Clear list | "Clear all" |
| Search | "Find [item]" |
| Price filter | "Find [item] under $[amount]" |

---

**Happy Shopping!** 🛒

Need more help? Check the [README.md](README.md) for technical details.
