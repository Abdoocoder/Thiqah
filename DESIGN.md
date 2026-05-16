---
name: Al-Thiqah Admin
description: Arabic-first heritage food brand admin dashboard — clean, functional, olive-rooted.
colors:
  ancient-olive: "#3e5219"
  pressed-linen: "#fbf9f9"
  night-olive: "#1b1c1c"
  stone-bark: "#45483c"
  basalt-dust: "#e4e2e2"
  olive-stone: "#75796b"
  outline-mist: "#c5c8b8"
  inverse-coal: "#1c1d1d"
  warm-white: "#f0efee"
  surface-container: "#efeded"
  surface-container-low: "#f5f3f3"
  surface-container-high: "#e9e8e7"
  surface-container-highest: "#e4e2e2"
  error-red: "#ba1a1a"
  error-blush: "#ffdad6"
  success-pine: "#059669"
  warning-amber: "#d97706"
  info-cobalt: "#2563eb"
  whatsapp-green: "#25D366"
typography:
  display:
    fontFamily: "DM Sans, Noto Sans Arabic, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
  headline:
    fontFamily: "DM Sans, Noto Sans Arabic, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
  title:
    fontFamily: "DM Sans, Noto Sans Arabic, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "DM Sans, Noto Sans Arabic, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "DM Sans, Noto Sans Arabic, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  none: "0px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  section: "120px"
components:
  button-primary:
    backgroundColor: "{colors.inverse-coal}"
    textColor: "{colors.warm-white}"
    rounded: "{rounded.full}"
    padding: "14px 24px"
  button-primary-hover:
    backgroundColor: "{colors.ancient-olive}"
    textColor: "{colors.warm-white}"
    rounded: "{rounded.full}"
    padding: "14px 24px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.night-olive}"
    rounded: "{rounded.full}"
    padding: "14px 24px"
  badge-neutral:
    backgroundColor: "{colors.surface-container-high}"
    textColor: "{colors.stone-bark}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  badge-error:
    backgroundColor: "{colors.error-blush}"
    textColor: "{colors.error-red}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
---

# Design System: Al-Thiqah Admin

## 1. Overview

**Creative North Star: "The Olive Grove at Midday"**

A working tool built for one person: the owner of a Jordanian heritage food brand who spends their day managing products, orders, and customers. The interface carries the weight and warmth of the brand — olive green, pressed linen, earthy neutrals — without disguising itself as a dashboard. Nothing decorative. Every element earns its place.

The palette draws from the grove itself: deep grove-green for authority, pressed linen for calm, night-olive for text that reads without effort. Dark mode inverts this to a near-black olive surface with a spring-leaf primary accent, so the same heritage feeling persists after sundown. Depth comes from always-on ambient shadows — low-opacity, directional — that give each card its place in the stack without dramatic contrast. The result feels like quality printed matter made interactive, not a web application that happens to look nice.

This system explicitly rejects: cluttered dashboards that use cards as filler, aimless decorative gradients, side-stripe accents on list items, generic SaaS blue-navy palettes, and glassmorphism as decoration. If it looks like a bootstrapped React admin template, it has failed.

**Key Characteristics:**
- RTL-first layout; Arabic script is a first-class typographic concern, never an afterthought
- Pill-shaped buttons and chips — cards and panels use gently rounded edges (16–20px)
- Dark-inverse CTA buttons at rest, shifting to ancient olive on hover
- Underline inputs (no box) with high-contrast olive focus border
- Ambient-always card shadows, not state-triggered elevation
- Full dark-mode parity: 27 color tokens each with a dark-mode counterpart

## 2. Colors: The Grove Palette

A restrained palette anchored by a single saturated accent — ancient olive — surrounded by a family of warm, subtly tinted neutrals. No secondary accent. The olive's rarity is its power.

### Primary
- **Ancient Olive** (#3e5219): The brand's anchor. Used on active nav states, focus rings, and the hover background of primary CTA buttons. Appears on ≤10% of any given screen. In dark mode, inverts to **Pressed Pistachio** (#d0eba1) — a full-spectrum lightness inversion with adjusted chroma, not a simple tint.

### Neutral
- **Pressed Linen** (#fbf9f9): The base surface and background. Slightly warm — never pure white. Gives the page a paper-like quality.
- **Night Olive** (#1b1c1c): Primary text color. Near-black, tinted faintly green. The olive grove's shadow.
- **Stone Bark** (#45483c): Secondary text, labels, on-surface-variant. Readable but receded.
- **Basalt Dust** (#e4e2e2): The highest surface container; default horizontal divider color.
- **Olive Stone** (#75796b): Mid-value outlines, border strokes, placeholder text.
- **Outline Mist** (#c5c8b8): Lightest border variant — subtle dividers, dashed outlines.
- **Inverse Coal** (#1c1d1d): The primary button surface at rest. Near-black, distinct from Night Olive — used only on interactive primary surfaces.

### Semantic
- **Error Red** (#ba1a1a, dark: #ffb4ab): Destructive actions, validation errors.
- **Error Blush** (#ffdad6): Error container background.
- **Success Pine** (#059669, dark: #34d399): Positive status badges.
- **Warning Amber** (#d97706, dark: #fbbf24): Caution states.
- **Info Cobalt** (#2563eb, dark: #60a5fa): Informational status.
- **WhatsApp Green** (#25D366): WhatsApp reply CTA exclusively. Not a brand color — a vendor affordance.

**The Single Accent Rule.** Ancient Olive is the only brand color. It never fills a button at rest. It appears as hover state, active background, and focus ring. Its rarity is the point. Using it as a default button fill makes it invisible.

**The Dark Parity Rule.** Every light-mode color token has an explicitly defined dark-mode counterpart. No token is acceptable without its dark twin. Dark surfaces use adjusted chroma — not simply darker versions of light surfaces.

## 3. Typography

**Display / Body Font:** DM Sans (with Noto Sans Arabic for all Arabic content)

**Character:** DM Sans is a geometric humanist sans with open apertures and a warm personality — approachable without being playful. Noto Sans Arabic is chosen to match this weight and warmth across scripts. The pairing feels deliberate: professional, unhurried, and legible at both display and body sizes. Both are loaded at weights 400, 500, and 700 so Arabic and Latin text maintain the same visual mass.

### Hierarchy
- **Display** (700, clamp(2rem, 5vw, 3.5rem), line-height 1.1): Landing page hero and splash loader. Not used within admin pages.
- **Headline** (700, responsive `text-2xl sm:text-3xl lg:text-4xl`, line-height 1.2): Section title on each admin page. Exactly one per view — not used for subsections.
- **Title** (700, 1.25rem, line-height 1.3): Card headings, panel labels, modal titles, form section headers.
- **Body** (400, 1rem, line-height 1.6): Table content, descriptions, form values, help text. Prose blocks cap at 65–75ch.
- **Label** (700, 0.75rem, line-height 1.4, normal letter-spacing): Category labels, status chips, form field labels, table headers. Always 700 weight for readability at small size.

**The No-Tracking Rule.** Letter-spacing is prohibited on Arabic text. Connected Arabic letterforms are broken by forced character gaps — `tracking-wide`, `tracking-wider`, and `tracking-widest` on Arabic content destroy the script's natural ligatures. Latin uppercase labels may use `tracking-wide` (max 0.05em). Arabic text uses `letter-spacing: normal` without exception.

## 4. Elevation

Elevation is always-on and ambient, not a state signal. Cards carry their shadow at rest. State changes shift shadow depth — they do not introduce elevation from nothing.

In light mode, shadows are gentle and directional: a large-radius, low-opacity diffuse drop on pressed linen. The very low opacity (`rgba(0,0,0,0.04)`) reads clearly on the warm white ground. In dark mode, the same approach fails — near-black ink on near-black surface is invisible. Dark mode elevation uses a white-outline glow (1px ring at 4–8% white opacity) combined with a deeper black drop, giving each card a rim-lit quality consistent with Material You's tonal surface layering.

### Shadow Vocabulary
- **card** (rest): Light: `0 20px 40px -15px rgba(0,0,0,0.04)` · Dark: `0 0 0 1px rgba(255,255,255,0.04), 0 2px 8px rgba(0,0,0,0.4)`
- **card-hover**: Light: `0 8px 30px rgba(0,0,0,0.08)` · Dark: `0 0 0 1px rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.5)`
- **card-lift** (elevated/active): Light: `0 12px 40px rgba(0,0,0,0.1)` · Dark: `0 0 0 1px rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.6)`

**The Ambient-Always Rule.** Shadows are properties of elevated surfaces, not responses to pointer events. A card is elevated; its shadow communicates that at rest. Hover changes the shadow level — it never creates a shadow from nothing.

**The Dark Outline Rule.** Every elevated surface in dark mode carries a 1px white-outline glow. Without it, `rgba(0,0,0,X)` shadows are invisible on `#1a1c1a`. A dark-mode shadow without the white ring is a non-shadow.

## 5. Components

### Buttons

Pill-shaped throughout. The primary action is dark-first — Inverse Coal at rest, shifting to Ancient Olive on hover. This is a deliberate inversion of the usual pattern: olive is the reward for intent, not the resting state.

- **Shape:** Full pill (9999px radius)
- **Primary:** Inverse Coal background (#1c1d1d), Warm White text (#f0efee), 14px vertical / 24px horizontal padding, 0.875rem text, 700 weight
- **Primary Hover:** Background transitions to Ancient Olive (#3e5219) over 150ms with `cubic-bezier(0.16, 1, 0.3, 1)` (ease-card)
- **Active:** Scales to 98% via `transform: scale(0.98)`
- **Focus:** 2px Ancient Olive ring at 40% opacity, no default outline ring
- **Ghost:** Transparent background, Olive Stone border (#75796b), Night Olive text, identical shape and padding
- **Disabled:** 50% opacity, `cursor-not-allowed`, active scale suppressed

### Chips / Badges

Pill-shaped status indicators. Display-only — never act as interactive controls.

- **Neutral chip:** Surface-Container-High (#e9e8e7) background, Stone Bark (#45483c) text, full radius, 4px/12px padding, 0.75rem 700 weight
- **Error chip:** Error Blush (#ffdad6) background, Error Red (#ba1a1a) text
- **Order status chips:** Each status maps to a semantic chip color (pending → warning-container, confirmed → info-container, delivered → success-container, cancelled → error-container)

### Cards / Containers

Gently rounded edges. Borders from the surface-container-highest token. No nested cards — a container holds content, not more containers.

- **Corner Style:** Gently rounded edges (16px `rounded-xl` for content rows, 20px `rounded-2xl` for product and feature cards)
- **Background:** Surface (#fbf9f9 light / #1a1c1a dark)
- **Shadow Strategy:** Ambient-always card shadow; lifts to card-hover on pointer-over with `-translate-y-0.5` vertical shift. Transitions only `transform` and `box-shadow` — never `transition-all`.
- **Border:** 1px `surface-container-highest`. No colored accent borders. No side stripes.
- **Internal Padding:** 24px (md) desktop, 16px (sm) mobile

### Inputs / Fields

Underline-only inputs. No box border, no background container. The open-bottom form gives fields an editorial, content-first quality.

- **Style:** Bottom border only, 2px at `on-surface-variant/30` opacity. Text 1.125rem. RTL text direction. No border-radius (`rounded-none`).
- **Focus:** Bottom border color transitions to Ancient Olive (#3e5219). The border alone conveys focus state — no additional ring.
- **Error:** Error message appears below the field as `role="alert"`, linked to the input via `aria-describedby`. Input marked `aria-invalid="true"`.
- **Disabled / Read-only:** Not currently implemented; if added, use 30% opacity on the label and value.

### Navigation (Admin Sidebar)

Compact vertical nav with icon + Arabic label. Active state uses full background fill — no side stripe.

- **Default item:** Transparent background, Stone Bark text and icon
- **Hover item:** Surface-Variant (#e9e8e7) background, Night Olive text and icon, 150ms transition
- **Active item:** Ancient Olive at 10% opacity background, Ancient Olive text and icon — background fill conveys selection without any border accent
- **Mobile:** Collapses to a slide-in drawer from the right edge (RTL-appropriate), with a semi-transparent backdrop overlay. Toggle in the header. Body scroll locks while drawer is open.

### Confirm Dialog

Modal confirmation for destructive and non-destructive actions. Keyboard-trapped with Escape to cancel.

- **Container:** Surface background, 2xl radius (20px), 32px internal padding, `modalIn` entrance (scale 0.96 → 1, fade, 250ms `ease-out`)
- **Destructive variant:** Error-container icon background, error-colored confirm button, cancel as ghost
- **Non-destructive variant:** Ancient Olive/10% icon background, Inverse Surface confirm button

## 6. Do's and Don'ts

### Do:
- **Do** use Ancient Olive (#3e5219) sparingly — active nav state, focus rings, hover state of the primary button. Never the resting button fill.
- **Do** give every admin page exactly one `<h2>` headline, scaled `text-2xl sm:text-3xl lg:text-4xl`. One headline per view.
- **Do** add `min-w-0` to any flex child that contains text — this prevents horizontal overflow in RTL table rows and responsive layouts.
- **Do** use `transition-[transform,box-shadow]` on cards and interactive surfaces. Specify exactly what changes.
- **Do** define both light-mode and dark-mode shadow values for every shadow token. A shadow without a dark twin is incomplete.
- **Do** use underline-only inputs for all form fields. The two-pixel bottom border is the entire affordance.
- **Do** link every form error to its input via `aria-describedby` and `aria-invalid="true"`. Error messages must use `role="alert"`.
- **Do** maintain 44px minimum touch targets on all interactive elements in the admin panel.
- **Do** use pill shapes (9999px) for buttons and chips, and rounded-xl/2xl (16–20px) for cards and panels. Two radii, two purposes.

### Don't:
- **Don't** use a colored left or right border (`border-left` / `border-right` > 1px) as an accent stripe on any list item, card, or nav item. Use background-fill for active/selected states. Side stripes are prohibited.
- **Don't** apply `letter-spacing` to Arabic text. `tracking-wide`, `tracking-wider`, and `tracking-widest` break connected Arabic letterforms. Arabic labels use normal spacing, always.
- **Don't** animate CSS layout properties (`grid-template-rows`, `height`, `width`, `padding`). Use `max-height` with a fixed pixel ceiling, or `transform` and `opacity`.
- **Don't** use `transition-all`. Specify exact properties: `transition-[transform,box-shadow]` on cards, `transition-colors` on text/icon.
- **Don't** define dark-mode shadows as `rgba(0,0,0,X)` without a white-outline glow. Black shadows are invisible on `#1a1c1a`. Use the white-ring pattern.
- **Don't** clutter the interface with excessive cards, decorative gradients, or aimless visual elements. Every element has a job. If you cannot state the job, remove the element.
- **Don't** use glassmorphism (`backdrop-filter: blur`) decoratively. The blur in this system is reserved for the confirm dialog backdrop overlay and image hover overlays.
- **Don't** use WhatsApp Green (#25D366) for generic success or positive states. It is a vendor color reserved for WhatsApp reply actions exclusively.
- **Don't** use pure black (#000000) or pure white (#ffffff). Every neutral in this system is tinted toward the olive hue. Untinted neutrals break the palette's warmth.
- **Don't** nest cards inside cards. A `rounded-2xl` container holds content rows, not more `rounded-xl` containers.
