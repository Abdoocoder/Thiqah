<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6">
  <img width="1200" height="475" alt="Thiqah Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6">
</picture>

<p align="center">
  <strong>الثقة للمنتجات البلدية</strong> — Al-Thiqah Local Products
</p>

<p align="center">
  A bilingual admin dashboard and brand landing page for a Jordanian heritage food brand selling olive oil, cheese, and ghee. Built with React, Convex, Tailwind CSS v4, and GSAP.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#stack">Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Structure</a> •
  <a href="#audit-score">Audit Score</a>
</p>

---

## Features

**Landing Page**
- Brand hero with parallax background and GSAP-staggered word reveal
- Product catalog with WhatsApp-driven ordering flow
- Seasonal offers section with live countdown timers
- Brand story section with scroll-triggered parallax
- Customer testimonials with ScrollTrigger animations
- Contact form with server-side persistence (Convex)
- Smooth Lenis scrolling with GSAP ScrollTrigger integration
- Responsive RTL-first layout

**Admin Dashboard**
- Role-based access control (admin / employee) via Clerk
- Product management: create, read, update, delete with image upload
- Order management: status tracking, search, filter, pagination
- Customer contact inbox: read/unread, reply via WhatsApp, delete
- Offer management: CRUD with expiry tracking, discount display
- User management: role assignment (admin → employee)
- Dashboard overview with sales stats, active orders, low-stock alerts
- Dark mode support (respects `prefers-color-scheme`)
- Interactive confirmation dialogs for destructive actions

## Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React 19 + TypeScript ~5.8 |
| **Build** | Vite 6 with Tailwind CSS v4 |
| **Backend** | Convex (reactive DB + serverless functions) |
| **Auth** | Clerk |
| **Animation** | GSAP + ScrollTrigger + Lenis |
| **Forms** | React Hook Form + Zod |
| **Analytics** | Firebase (lazy-loaded) |
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
├── admin/                # Dashboard pages
│   ├── AdminLayout.tsx   # Shared admin shell (sidebar, header, auth guard)
│   ├── Dashboard.tsx     # Overview stats and recent activity
│   ├── Products.tsx      # Product CRUD with image upload
│   ├── Orders.tsx        # Order lifecycle management
│   ├── Contacts.tsx      # Customer contact inbox
│   ├── Offers.tsx        # Promotional offer management
│   └── Users.tsx         # Role-based user administration
├── components/           # Shared UI components
│   ├── ConfirmDialog.tsx # Accessible confirmation modal
│   ├── Navbar.tsx        # Landing page navigation
│   ├── Pagination.tsx    # Server-style page controls
│   ├── ProductCard.tsx   # Public-facing product card
│   ├── SignIn.tsx        # Clerk sign-in wrapper
│   ├── Skeleton.tsx      # Loading state components
│   ├── Toast.tsx         # Toast notification display
│   └── useToast.ts       # Toast state hook
├── sections/             # Landing page sections
│   ├── Hero.tsx          # Parallax hero with GSAP
│   ├── Products.tsx      # Product grid from Convex
│   ├── Offers.tsx        # Offers with countdown timers
│   ├── Story.tsx         # Brand story with parallax
│   ├── Testimonials.tsx  # Customer reviews
│   ├── Contact.tsx       # Contact form with validation
│   ├── Footer.tsx        # Site footer
│   └── PageLoader.tsx    # Splash loader animation
├── hooks/
│   └── useSmoothScroll.tsx  # Lenis + GSAP integration
├── lib/
│   ├── firebase.ts       # Analytics initialization
│   └── whatsapp.ts       # WhatsApp link utilities
├── App.tsx               # Root layout and routing
├── main.tsx              # Entry point (Clerk + Convex providers)
└── index.css             # Tokenized theme + animations + dark mode

convex/
├── schema.ts             # Database schema (products, orders, contacts, offers, users)
├── products.ts           # Product queries and mutations
├── orders.ts             # Order queries and mutations
├── contacts.ts           # Contact queries and mutations
├── offers.ts             # Offer queries and mutations
├── users.ts              # User role management
└── seed.ts               # Development seed data
```

## Design System

The color palette is tokenized in Tailwind v4's `@theme` directive with olive green (`#3e5219`) as the primary — a deliberate departure from conventional SaaS dark-blue/navy palettes.

| Token | Light | Dark |
|-------|-------|------|
| `primary` | `#3e5219` | `#d0eba1` |
| `background` | `#fbf9f9` | `#141514` |
| `surface` | `#fbf9f9` | `#1a1c1a` |
| `on-surface` | `#1b1c1c` | `#e4e2e2` |

Dark mode activates automatically via `prefers-color-scheme`. All 27 color tokens have dark variants with adjusted chroma for readability.

## Audit Score

**15 / 20 — Good**

| Dimension | Score | Status |
|-----------|-------|--------|
| Accessibility | 3/4 | WCAG AA mostly met |
| Performance | 3/4 | Code-split routes, lazy images |
| Responsive | 3/4 | Fluid, collapsible sidebar |
| Theming | 2/4 | Full token system, dark mode |
| Anti-Patterns | 4/4 | Clean, intentional design |

## Commit Convention

```
Type: short description

- Specific change 1
- Specific change 2
```

Types: `Feat`, `Fix`, `Polish`, `Docs`, `Chore`.

## License

MIT
