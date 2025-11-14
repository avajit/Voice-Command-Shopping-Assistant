# Deployment Guide

This guide provides step-by-step instructions for deploying the Voice Command Shopping Assistant to various hosting platforms.

## 📦 Build the Application

Before deploying, build the production version:

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

Vercel offers the easiest deployment with automatic HTTPS and global CDN.

#### Deploy via CLI:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Follow the prompts to link your project

#### Deploy via Git:

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Connect your GitHub repository
5. Vercel will auto-detect the framework and deploy

**Configuration:**
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

---

### Option 2: Netlify

Netlify provides similar features with drag-and-drop deployment.

#### Deploy via CLI:

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build and deploy:
```bash
npm run build
netlify deploy --prod --dir=dist
```

#### Deploy via Drag & Drop:

1. Build the project: `npm run build`
2. Visit [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag the `dist` folder to the deployment zone

**netlify.toml configuration:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Option 3: AWS S3 + CloudFront

For scalable enterprise deployment.

#### Steps:

1. **Create S3 Bucket:**
```bash
aws s3 mb s3://voice-shopping-assistant
```

2. **Configure bucket for static hosting:**
```bash
aws s3 website s3://voice-shopping-assistant \
  --index-document index.html \
  --error-document index.html
```

3. **Upload build files:**
```bash
npm run build
aws s3 sync dist/ s3://voice-shopping-assistant --delete
```

4. **Set bucket policy for public access:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::voice-shopping-assistant/*"
    }
  ]
}
```

5. **Create CloudFront distribution** (optional, for CDN and HTTPS):
   - Origin: Your S3 bucket
   - Default Root Object: `index.html`
   - Enable HTTPS
   - Configure error pages to redirect 404 to `/index.html`

---

### Option 4: Firebase Hosting

Google Firebase offers free hosting with SSL.

#### Steps:

1. **Install Firebase CLI:**
```bash
npm install -g firebase-tools
```

2. **Login to Firebase:**
```bash
firebase login
```

3. **Initialize Firebase:**
```bash
firebase init hosting
```

Configuration:
- Public directory: `dist`
- Configure as SPA: Yes
- Automatic builds: No

4. **Deploy:**
```bash
npm run build
firebase deploy --only hosting
```

**firebase.json:**
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

### Option 5: GitHub Pages

Free hosting directly from your repository.

#### Steps:

1. **Install gh-pages:**
```bash
npm install --save-dev gh-pages
```

2. **Add deployment script to package.json:**
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. **Update vite.config.ts for base path:**
```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
})
```

4. **Deploy:**
```bash
npm run deploy
```

5. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Deploy from branch `gh-pages`
   - Save

---

## 🔧 Environment Configuration

For production deployments, ensure:

1. **HTTPS is enabled** - Required for microphone access
2. **Permissions** - Set proper Content Security Policy headers
3. **Caching** - Configure cache headers for optimal performance
4. **Error Handling** - Set 404 redirects to index.html for SPA routing

---

## ✅ Post-Deployment Checklist

- [ ] Test voice recognition on deployed URL
- [ ] Verify microphone permissions work over HTTPS
- [ ] Test on mobile devices
- [ ] Verify all voice commands function correctly
- [ ] Check browser console for errors
- [ ] Test localStorage persistence
- [ ] Verify responsive design on different screen sizes

---

## 🐛 Troubleshooting

### Voice Recognition Not Working

- **Issue**: Microphone access denied
- **Solution**: Ensure deployment uses HTTPS. HTTP does not support Web Speech API.

### 404 Errors on Refresh

- **Issue**: Page not found when refreshing on routes
- **Solution**: Configure server to redirect all routes to index.html (see platform-specific configs above)

### Build Errors

- **Issue**: Build fails with module errors
- **Solution**: 
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  npm run build
  ```

---

## 📊 Recommended Platform

For this technical assessment, **Vercel** is recommended because:

- ✅ Zero configuration required
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Free tier available
- ✅ Perfect for React/Vite apps
- ✅ Automatic deployments from Git
- ✅ Preview deployments for branches

---

## 🔗 After Deployment

Update these files with your deployment URL:

1. **README.md**: Replace `[Your Deployment URL Here]`
2. **GitHub Repository**: Add live demo link to repo description
3. **Assessment Submission**: Include live URL in submission email

---

**Need help?** Consult platform-specific documentation:
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [AWS S3 Docs](https://docs.aws.amazon.com/s3)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
