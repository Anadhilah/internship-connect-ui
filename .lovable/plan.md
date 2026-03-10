

## Plan: Replace Briefcase Icon with Custom Logo

Replace the current briefcase icon used throughout the app with the uploaded InternshipConnect logo.

### What will be done

1. **Copy logo to project** — Copy the uploaded image to both `src/assets/logo.png` (for React component imports) and `public/logo.png` (for favicon/PWA icons).

2. **Replace logo in branding spots** — Swap the `<Briefcase>` icon inside the gradient-hero div with an `<img>` tag using the logo in these files:
   - `Navbar.tsx` — landing page navbar
   - `Footer.tsx` — landing page footer
   - `Login.tsx` — login page header
   - `Register.tsx` — register page header
   - `AdminLayout.tsx` — admin sidebar header
   - `RecruiterLayout.tsx` — recruiter sidebar header
   - `StudentLayout.tsx` — student sidebar header

3. **Update PWA icons and favicon** — Point `index.html` favicon and PWA manifest icons to the new logo. Replace `icon-192x192.png` and `icon-512x512.png` with the uploaded logo.

4. **Keep Briefcase icon for non-branding uses** — The Briefcase icon used in stat cards, onboarding role selection, and the landing page hero badge are semantic/decorative and will remain unchanged.

### Technical details
- Import logo as `import logo from "@/assets/logo.png"` in components
- Replace the gradient-hero div + Briefcase icon with `<img src={logo} className="h-8 w-8 rounded-lg" />`
- Copy uploaded file to `public/` for favicon and PWA icon references

