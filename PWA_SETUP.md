# PWA Setup Documentation

## سامانه فرم ساز - Progressive Web App

This document describes the PWA (Progressive Web App) implementation for the university website.

## ✅ Installation Completed

### Packages Installed

- `next-pwa@5.6.0` - PWA support for Next.js

### Node Version Used

- Node.js v20.19.0

## 📁 Files Created/Modified

### 1. Configuration Files

#### `next.config.js`

- Added `withPWA` wrapper with configuration:
  - `dest: 'public'` - Service worker files destination
  - `register: true` - Auto-register service worker
  - `skipWaiting: true` - Skip waiting for service worker activation
  - `disable: process.env.NODE_ENV === 'development'` - Disabled in development mode

#### `public/manifest.json`

Updated with university information:

- **Name**: سامانه فرم ساز
- **Short Name**: دانشگاه انقلاب
- **Theme Color**: #244a9a (Primary blue from design system)
- **Background Color**: #ffffff
- **Display**: standalone
- **Direction**: rtl (Right-to-left for Persian/Arabic)
- **Language**: fa (Farsi)

### 2. Icons Created

All icons created from `/public/Images/Logo/univeristy-logo.png`:

- `icon-144x144.png` (22KB)
- `icon-192x192.png` (35KB)
- `icon-384x384.png` (106KB)
- `icon-512x512.png` (169KB) - Also used as maskable icon
- `apple-touch-icon.png` (32KB) - For iOS devices

### 3. Layout Updates

#### `src/app/layout.jsx`

Added PWA meta tags:

- Manifest link
- Theme color
- Mobile web app capabilities
- Apple touch icon references
- Viewport settings

### 4. .gitignore Updates

Added PWA-generated files to `.gitignore`:

```
/public/sw.js
/public/workbox-*.js
/public/worker-*.js
/public/sw.js.map
/public/workbox-*.js.map
/public/worker-*.js.map
```

## 🚀 Usage

### Development

```bash
yarn dev
```

PWA is **disabled** in development mode for faster iteration.

### Production Build

```bash
yarn build
yarn start
```

When building for production, next-pwa will automatically:

1. Generate service worker (`sw.js`)
2. Generate workbox runtime files
3. Cache static assets
4. Enable offline functionality

### Testing PWA

1. **Build for production:**

   ```bash
   yarn build
   yarn start
   ```

2. **Open in browser:** `http://localhost:3000`

3. **Test PWA features:**
   - Open DevTools → Application tab
   - Check "Service Workers" section
   - Check "Manifest" section
   - Use Lighthouse to audit PWA score

4. **Install on mobile:**
   - Open website on mobile browser
   - Look for "Add to Home Screen" prompt
   - Install and test offline functionality

## 🎨 Design Tokens

The PWA uses the project's design system:

- **Primary Color**: `#244a9a` (from tailwind.config.js)
- **Theme**: Based on university branding
- **Icons**: University logo in various sizes

## 📱 Features

### Enabled Features:

- ✅ Install to home screen
- ✅ Offline support
- ✅ Fast loading with service worker caching
- ✅ RTL support for Persian language
- ✅ iOS compatibility (Apple touch icons)
- ✅ Standalone app mode
- ✅ Maskable icons support

### Caching Strategy:

next-pwa automatically handles:

- Static assets caching
- Runtime caching for API calls
- Precaching of important pages
- Cache invalidation on updates

## 🔧 Maintenance

### Updating Icons

If the university logo changes:

```bash
cd /Users/ali/Desktop/Project/enghelab/Enghelab-Project
sips -z 192 192 public/Images/Logo/univeristy-logo.png --out public/icons/icon-192x192.png
sips -z 512 512 public/Images/Logo/univeristy-logo.png --out public/icons/icon-512x512.png
sips -z 144 144 public/Images/Logo/univeristy-logo.png --out public/icons/icon-144x144.png
sips -z 384 384 public/Images/Logo/univeristy-logo.png --out public/icons/icon-384x384.png
sips -z 180 180 public/Images/Logo/univeristy-logo.png --out public/icons/apple-touch-icon.png
```

### Updating Manifest

Edit `public/manifest.json` to update:

- App name or description
- Theme colors
- Icon paths
- Display mode

## 📊 PWA Checklist

- ✅ Web App Manifest configured
- ✅ Service Worker configured
- ✅ Icons in multiple sizes (144, 192, 384, 512)
- ✅ Apple touch icon
- ✅ Theme color meta tag
- ✅ Viewport meta tag
- ✅ RTL and Persian language support
- ✅ HTTPS ready (required for PWA)
- ✅ Offline functionality
- ✅ Installable

## 🌐 Browser Support

- ✅ Chrome/Edge (Full support)
- ✅ Firefox (Full support)
- ✅ Safari (iOS 11.3+)
- ✅ Samsung Internet
- ✅ Opera

## 📝 Notes

1. PWA features only work over HTTPS (except localhost)
2. Service worker is disabled in development mode
3. Generated service worker files are in `.gitignore`
4. Icons are optimized from the university logo
5. RTL layout is fully supported

## 🔗 Related Files

- Configuration: `next.config.js`
- Manifest: `public/manifest.json`
- Layout: `src/app/layout.jsx`
- Icons: `public/icons/*`
- Logo source: `public/Images/Logo/univeristy-logo.png`

## Support

For issues or questions about PWA implementation, refer to:

- [next-pwa documentation](https://github.com/shadowwalker/next-pwa)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
