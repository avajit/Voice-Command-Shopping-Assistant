# Troubleshooting Guide

This guide helps you resolve common issues with the Voice Shopping Assistant.

---

## 🎤 Microphone Permission Issues

### Error: "not-allowed" or "Microphone access denied"

**This is the most common error.** It means your browser is blocking microphone access.

#### ✅ Solution 1: Grant Permission in Browser

**For Chrome/Edge:**

1. Look for the 🔒 **padlock icon** or **camera/microphone icon** in the address bar (left side)
2. Click on it
3. Find **"Microphone"** in the list
4. Change from "Block" to **"Allow"**
5. Click the **"Reload Page"** button in the error message (or press F5)

**Visual Guide:**
```
Address Bar:  🔒 https://your-app.com
              ↑ Click here
              
Permissions Menu:
  Microphone: [Block ▼] → Change to → [Allow ▼]
```

#### ✅ Solution 2: Check System Permissions

**On macOS:**
1. Open **System Preferences** → **Security & Privacy** → **Privacy**
2. Select **Microphone** from left sidebar
3. Ensure your browser (Chrome/Edge) is checked ✅

**On Windows:**
1. Open **Settings** → **Privacy** → **Microphone**
2. Ensure "Allow apps to access your microphone" is **ON**
3. Ensure your browser has microphone access

#### ✅ Solution 3: Clear Browser Cache

Sometimes old permissions get stuck:

```bash
Chrome/Edge: Settings → Privacy → Clear browsing data → Cookies and site data
```

Then revisit the app and allow microphone when prompted.

---

## 🔒 HTTPS Issues

### Error: "Voice features require HTTPS"

Voice recognition **only works** on:
- ✅ HTTPS websites (https://)
- ✅ Localhost (http://localhost)

#### ✅ Solution: Deploy to HTTPS Platform

**Development (Local):**
```bash
# Localhost automatically works
npm run dev
# Opens at http://localhost:5173 ✅
```

**Production (Deployment):**
- Use Vercel (automatic HTTPS) ✅ RECOMMENDED
- Use Netlify (automatic HTTPS) ✅
- Use Firebase Hosting (automatic HTTPS) ✅
- Configure SSL certificate if using custom server

**Do NOT use:**
- ❌ http://your-ip-address
- ❌ http://your-domain.com (without SSL)

---

## 🌐 Browser Compatibility Issues

### Error: "Voice recognition is not supported in this browser"

#### Supported Browsers:
- ✅ **Google Chrome 25+** (Recommended)
- ✅ **Microsoft Edge 79+** (Recommended)
- ⚠️ **Safari 14.1+** (Limited support, may have issues)

#### Not Supported:
- ❌ **Firefox** (Web Speech API not supported)
- ❌ **Opera** (Limited support)
- ❌ **Internet Explorer** (Outdated)

#### ✅ Solution:
1. Download and install [Google Chrome](https://www.google.com/chrome/)
2. Or use Microsoft Edge (pre-installed on Windows)
3. Open the app in the supported browser

---

## 🗣️ Voice Recognition Not Working

### Issue: "No speech detected" or commands not recognized

#### ✅ Solution 1: Check Microphone

1. **Test your microphone:**
   - Open voice recorder app
   - Record a test message
   - Verify it records properly

2. **Check microphone selection:**
   - Your computer might have multiple microphones
   - Use system settings to select the correct one

#### ✅ Solution 2: Improve Voice Quality

**Best Practices:**
- 🔇 Reduce background noise
- 🎤 Speak clearly and at normal volume
- ⏸️ Pause briefly after clicking "Start Listening"
- 📏 Be 6-12 inches from microphone
- 🗣️ Speak at normal conversational speed

#### ✅ Solution 3: Use Correct Command Format

**Working Commands:**
```
✅ "Add milk"
✅ "I need 3 apples"
✅ "Buy 2 bottles of water"
✅ "Remove bread"
```

**Not Working:**
```
❌ "Milk" (too short, no verb)
❌ "Can you please maybe add milk if possible" (too complex)
```

#### ✅ Solution 4: Check Language Setting

Make sure the voice language matches your speaking language:
1. Click the language dropdown
2. Select your language (e.g., "English (US)")
3. Speak in that language

---

## 📱 Mobile Device Issues

### Issue: Voice not working on mobile

#### ✅ Solution 1: Use Mobile Browser

**Recommended:**
- ✅ Chrome for Android
- ✅ Safari for iOS (limited support)

**Not Recommended:**
- ❌ In-app browsers (Facebook, Instagram, etc.)
- ❌ Firefox mobile

#### ✅ Solution 2: Grant Mobile Permissions

**iOS (Safari):**
1. Go to Settings → Safari → Microphone
2. Set to "Ask" or "Allow"

**Android (Chrome):**
1. Open Chrome
2. Tap the three dots → Settings → Site settings → Microphone
3. Ensure microphone is enabled

#### ✅ Solution 3: Check Do Not Disturb

- Ensure your phone isn't in Do Not Disturb mode
- Some DND settings block microphone access

---

## 💾 Data Not Saving

### Issue: Shopping list disappears on refresh

#### ✅ Solution 1: Enable localStorage

**Check if localStorage is enabled:**
```javascript
// Open browser console (F12) and type:
localStorage.setItem('test', 'test')
localStorage.getItem('test')
// Should return "test"
```

**If not working:**
- Exit private/incognito mode
- Enable cookies in browser settings
- Check browser storage quota

#### ✅ Solution 2: Check Storage Quota

Some browsers limit storage:
1. Open DevTools (F12)
2. Go to Application → Storage
3. Check available storage
4. Clear old data if needed

---

## 🔍 Search Not Finding Items

### Issue: Voice search returns no results

#### ✅ Solution: Use Broader Terms

**Better Search Terms:**
```
✅ "apples" (finds all apple products)
✅ "toothpaste" (finds all brands)
✅ "bread" (finds all bread types)
```

**Too Specific:**
```
❌ "organic gala apples from washington state"
❌ "sensodyne pro-health advanced toothpaste"
```

**Note:** The mock database has limited items. In production, this would connect to a real product API.

---

## ⚡ Performance Issues

### Issue: App is slow or laggy

#### ✅ Solution 1: Clear Browser Cache
```bash
1. Press Ctrl+Shift+Delete (Cmd+Shift+Delete on Mac)
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh the page
```

#### ✅ Solution 2: Reduce Active Listening Time
- Don't leave voice listening on indefinitely
- Click "Stop Listening" when done
- Reduces CPU/memory usage

#### ✅ Solution 3: Update Browser
- Ensure you're using the latest Chrome/Edge version
- Outdated browsers may have performance issues

---

## 🐛 Console Errors

### Issue: Seeing errors in browser console

#### ✅ How to Check Console:
1. Press **F12** (Windows/Linux) or **Cmd+Option+I** (Mac)
2. Click **Console** tab
3. Look for red error messages

#### Common Errors & Solutions:

**"SpeechRecognition is not defined"**
- ✅ Use Chrome or Edge browser

**"SecurityError: The operation is insecure"**
- ✅ Use HTTPS or localhost only

**"Failed to execute 'start' on 'SpeechRecognition'"**
- ✅ Ensure previous listening session was stopped
- ✅ Reload the page

---

## 🔄 Quick Reset

### If nothing works, try this:

**Complete Reset Procedure:**

1. **Clear all app data:**
   ```javascript
   // Open console (F12) and paste:
   localStorage.clear()
   location.reload()
   ```

2. **Reset browser permissions:**
   - Chrome: Settings → Privacy → Site settings → Reset permissions
   - Edge: Settings → Cookies and site permissions → Manage and delete cookies → See all cookies → Remove app domain

3. **Hard refresh:**
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

4. **Restart browser:**
   - Completely close and reopen browser
   - Don't just close the tab

---

## 📞 Still Having Issues?

If you've tried everything above and still experiencing problems:

### Provide This Information:

1. **Browser & Version:**
   - Example: "Chrome 120.0.6099"
   - Find at: chrome://version or edge://version

2. **Operating System:**
   - Example: "Windows 11" or "macOS 14.0"

3. **Exact Error Message:**
   - Screenshot or copy the exact error text

4. **Steps to Reproduce:**
   - What were you doing when the error occurred?

5. **Console Log:**
   - Open DevTools (F12)
   - Copy any red error messages from Console tab

---

## ✅ Verification Checklist

Before reporting an issue, verify:

- [ ] Using Chrome or Edge browser
- [ ] On HTTPS or localhost URL
- [ ] Microphone permission is "Allow"
- [ ] Not in private/incognito mode
- [ ] Browser is up to date
- [ ] System microphone permissions enabled
- [ ] Tried hard refresh (Ctrl+Shift+R)
- [ ] Checked browser console for errors

---

## 🎯 Quick Fixes Summary

| Problem | Quick Fix |
|---------|-----------|
| Permission denied | Click padlock → Allow microphone → Reload |
| HTTPS required | Deploy to Vercel/Netlify or use localhost |
| Browser not supported | Use Chrome or Edge |
| No speech detected | Check microphone, reduce noise, speak clearly |
| Commands not recognized | Use example command format |
| Data not saving | Exit private mode, enable cookies |
| Slow performance | Close other tabs, update browser |

---

**Last Updated:** November 13, 2025

For technical details, see [README.md](README.md)  
For usage instructions, see [USER_GUIDE.md](USER_GUIDE.md)
