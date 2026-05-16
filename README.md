<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6">
  <img width="1200" height="475" alt="Thiqah Banner" src="public/_logo.png">
</picture>

<p align="center">
  <strong>الثقة للمنتجات البلدية</strong> &mdash; Al-Thiqah Local Products
</p>

<p align="center">
  A bilingual (AR/EN) admin dashboard and brand landing page for a Jordanian heritage food brand selling olive oil, cheese, and ghee. Built with React 19, Convex, Tailwind CSS v4, and GSAP.
</p>

<p align="center">
  <a href="#features">Features</a> &bull;
  <a href="#stack">Stack</a> &bull;
  <a href="#getting-started">Getting Started</a> &bull;
  <a href="#project-structure">Structure</a> &bull;
  <a href="#design-system">Design System</a> &bull;
  <a href="#audit-score">Audit</a>
</p>

---

## Features

**Landing Page**
- Brand hero with parallax background and GSAP-staggered word reveal
- Custom animated splash loader with SVG progress arc, particles, and shimmer transitions
- Product catalog with WhatsApp-driven ordering flow
- Seasonal offers section with live countdown timers
- Brand story section with scroll-triggered parallax
- Customer testimonials with ScrollTrigger animations
- Contact form with server-side persistence (Convex) and Zod validation
- Smooth Lenis scrolling with GSAP ScrollTrigger integration
- Responsive RTL-first layout

**Admin Dashboard**
- Role-based access control (admin / employee) via Clerk
- Product management: create, read, update, delete with image upload
- Order management: lifecycle status tracking, search, filter, pagination
- Customer contact inbox: read/unread tracking, WhatsApp reply, deletion
- Offer management: CRUD with expiry tracking and discount display
- User management: role assignment (admin / employee) with mobile-optimised table
- Dashboard overview with sales stats, active orders, low-stock alerts
- Dark mode support (respects `prefers-color-scheme`) with properly visible elevation tokens
- Fully responsive mobile layout: collapsible sidebar, single-column grids, adaptive table padding
- Keyboard-accessible confirmation dialogs with focus trapping and Escape support
- WCAG AA accessibility: form error `aria-describedby` linkage, 44px touch targets, `aria-invalid`, descriptive pagination labels
- `prefers-reduced-motion` respected globally; no CSS layout-property animations
- Skeleton loading states for every data view
- Code-split routes with manual vendor chunking

## Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React 19 + TypeScript 5.8 |
| **Build** | Vite 6 with Tailwind CSS v4 |
| **Backend** | Convex (reactive DB + serverless functions) |
| **Auth** | Clerk |
| **Animation** | GSAP + ScrollTrigger + Lenis |
| **Forms** | React Hook Form + Zod |
| **Analytics** | Firebase (lazy-loaded, optional) |
| **Icons** | Lucide React |
| **Routing** | React Router v7 |
| **Deployment** | Convex (backend), Vite (frontend) |

## Getting Started

```bash
npm install
```

Copy the environment file and fill in your keys:

```bash
cp .env.local.example .env.local
```

**Required variables:**

| Variable | Description |
|----------|-------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `VITE_CONVEX_URL` | Convex deployment URL |
| `VITE_WHATSAPP_PHONE` | WhatsApp business number |
| `VITE_FIREBASE_API_KEY` | Firebase API key (optional, analytics only) |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID (optional) |

Start the development server:

```bash
npm run dev
```

Run the Convex backend (separate terminal):

```bash
npx convex dev
```

Build for production:

```bash
npm run build
```

## Project Structure

```
src/
├── admin/                # Dashboard pages (lazy-loaded)
│   ├── AdminLayout.tsx   # Shared admin shell (sidebar, header, auth guard, tab trapping)
│   ├── Dashboard.tsx     # Overview stats and recent activity
│   ├── Products.tsx      # Product CRUD with image upload
│   ├── Orders.tsx        # Order lifecycle management
│   ├── Contacts.tsx      # Customer contact inbox
│   ├── Offers.tsx        # Promotional offer management
│   └── Users.tsx         # Role-based user administration
├── components/           # Shared UI components
│   ├── ConfirmDialog.tsx # Accessible confirmation modal with keyboard trap
│   ├── Navbar.tsx        # Landing page navigation (mobile + desktop)
│   ├── Pagination.tsx    # Server-style page controls
│   ├── ProductCard.tsx   # Public-facing product card (motion + WhatsApp)
│   ├── SignIn.tsx        # Clerk sign-in wrapper with custom theming
│   ├── Skeleton.tsx      # Loading state components (card, table, order, contact)
│   ├── Toast.tsx         # Toast notification display
│   └── useToast.ts       # Toast state hook
├── sections/             # Landing page sections
│   ├── Hero.tsx          # Parallax hero with GSAP word reveal
│   ├── Products.tsx      # Product grid from Convex
│   ├── Offers.tsx        # Offers with live countdown timers
│   ├── Story.tsx         # Brand story with parallax background
│   ├── Testimonials.tsx  # Customer reviews with ScrollTrigger
│   ├── Contact.tsx       # Contact form with Zod validation
│   ├── Footer.tsx        # Site footer
│   └── PageLoader.tsx    # GSAP-animated splash loader (SVG arc, particles, shimmer)
├── hooks/
│   └── useSmoothScroll.tsx  # Lenis + GSAP ScrollTrigger integration
├── lib/
│   ├── firebase.ts       # Lazy-loaded analytics initialization
│   └── whatsapp.ts       # WhatsApp link utilities
├── types/
│   └── clerk.d.ts        # Clerk type augmentations
├── App.tsx               # Root layout and routing
├── main.tsx              # Entry point (Clerk + Convex providers)
└── index.css             # Tokenized theme + keyframes + dark mode

convex/
├── schema.ts             # Database schema (users, products, offers, orders, contacts)
├── auth.config.ts        # Clerk auth integration
├── products.ts           # Product queries and mutations
├── orders.ts             # Order queries and mutations
├── contacts.ts           # Contact queries and mutations
├── offers.ts             # Offer queries and mutations
├── users.ts              # User role management
└── seed.ts               # Development seed data
```

## Design System

The color palette is tokenized in Tailwind v4's `@theme` directive with olive green (`#3e5219`) as the primary, deliberately avoiding conventional SaaS dark-blue/navy palettes.

| Token | Light | Dark |
|-------|-------|------|
| `primary` | `#3e5219` | `#d0eba1` |
| `background` | `#fbf9f9` | `#141514` |
| `surface` | `#fbf9f9` | `#1a1c1a` |
| `on-surface` | `#1b1c1c` | `#e4e2e2` |
| `surface-container` | `#efeded` | `#222422` |
| `outline` | `#75796b` | `#8e9284` |
| `error` | `#ba1a1a` | `#ffb4ab` |

All 27 color tokens have dark variants with adjusted chroma for readability. Dark mode activates automatically via `prefers-color-scheme`. `prefers-reduced-motion` is respected globally.

Shadow tokens have separate light and dark values: light mode uses soft drop shadows (`rgba(0,0,0,0.04–0.1)`); dark mode uses white-outline glows combined with deep drops so elevation remains visible on near-black surfaces.

Animation easings use custom cubic-bezier curves (`cubic-bezier(0.23, 1, 0.32, 1)`) rather than Tailwind defaults, and keyframes include `fadeSlideUp`, `shimmer`, `float`, `countIn`, and `scaleIn`. All animations respect `prefers-reduced-motion` via a global `*` override that collapses durations to `0.01ms`.

## Audit Score

**19 / 20 &mdash; Excellent**

| # | Dimension | Score | Key Finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 4/4 | WCAG AA met: `aria-describedby` on all form errors, 44px touch targets, `aria-invalid`, descriptive pagination labels, `lang="ar"` on `<html>` |
| 2 | Performance | 3/4 | Specific `transition-[transform,box-shadow]` on cards, `max-height` accordion replacing layout animation; image `srcset`/`sizes` not yet added |
| 3 | Responsive Design | 4/4 | Mobile overflow fixed (`min-w-0` on main), adaptive table columns, `flex-wrap` on action rows, heading scale breakpoints |
| 4 | Theming | 4/4 | Full token system; dark mode shadows visible; `color-scheme: dark` set; shimmer uses `on-surface/10` token |
| 5 | Anti-Patterns | 4/4 | Distinctive olive-green heritage identity; side-stripe accent removed; no AI-slop tells |

Last audited with `/impeccable audit` + `/impeccable polish`.

## Commit Convention

```
Type: short description

- Specific change 1
- Specific change 2
```

Types: `Feat`, `Fix`, `Polish`, `Docs`, `Chore`.

## License

MIT
