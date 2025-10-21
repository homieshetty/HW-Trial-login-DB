# PWA Icons Setup Instructions

## ⚠️ Current Status

The manifest is currently using the favicon (`newfavicon.ico`) as a temporary solution.
This works for basic PWA functionality but is **not optimal** for Android installation.

## 🎯 Why Proper Icons Matter

For the best PWA experience on Android, you need:
- **192x192 PNG** - Used for app icon on home screen
- **512x512 PNG** - Used for splash screen
- **Proper format** - PNG with transparency or solid background

---

## Required Icon Sizes

You need to create two icon files in the `public/` folder:

1. **icon-192.png** - 192x192 pixels
2. **icon-512.png** - 512x512 pixels

## Option 1: Use Online Tool (Easiest)

1. Go to: https://www.pwabuilder.com/imageGenerator
2. Upload your `public/logo.png` file
3. Download the generated icons
4. Rename them to `icon-192.png` and `icon-512.png`
5. Place them in the `public/` folder

## Option 2: Manual Creation

Use any image editor (Photoshop, GIMP, Canva, etc.):
- Create 192x192px PNG with your logo
- Create 512x512px PNG with your logo
- Save as `icon-192.png` and `icon-512.png` in `public/` folder

## Option 3: Use Existing Logo (Temporary)

For testing, you can:
1. Copy `public/logo.png` twice
2. Rename copies to `icon-192.png` and `icon-512.png`
3. Resize them to proper dimensions using an image editor

## Note

The icons should have:
- Transparent or solid background (matches your app theme)
- Simple, recognizable design
- Good contrast for visibility on various Android launchers

---

## After Creating Proper Icons

Once you have created `icon-192.png` and `icon-512.png`, update `public/manifest.json`:

```json
"icons": [
  {
    "src": "/icon-192.png",
    "sizes": "192x192",
    "type": "image/png",
    "purpose": "any maskable"
  },
  {
    "src": "/icon-512.png",
    "sizes": "512x512",
    "type": "image/png",
    "purpose": "any maskable"
  }
]
```

Also update `src/app/layout.tsx`:
```typescript
<link rel="apple-touch-icon" href="/icon-192.png" />
```
