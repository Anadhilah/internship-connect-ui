

## Plan: Convert to Installable Web App (PWA)

Make InternshipConnect installable on mobile devices directly from the browser — no app store needed. Users can add it to their home screen and it will look and feel like a native app.

### What will be done

1. **Install `vite-plugin-pwa`** and configure it in `vite.config.ts` with a web app manifest (app name, icons, theme color, start URL) and a service worker for offline support.

2. **Add PWA icons** — Create standard icon files (`icon-192x192.png`, `icon-512x512.png`) in the `public/` folder.

3. **Add mobile meta tags** to `index.html` — `apple-mobile-web-app-capable`, `theme-color`, and `apple-touch-icon` for iOS home screen support.

4. **Create an `/install` page** with instructions and a browser install prompt button, guiding users to add the app to their home screen.

5. **Add route** for `/install` in `App.tsx`.

### Result
Users visiting the app on their phone can install it to their home screen. It will launch full-screen (no browser bar), work offline for cached pages, and behave like a native app — all without any app store submission.

