---
name: Institutional Intelligence System
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363941'
  surface-container-lowest: '#0b0e15'
  surface-container-low: '#191b23'
  surface-container: '#1d2027'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e1e2ec'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e1e2ec'
  inverse-on-surface: '#2e3038'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#ffb786'
  on-tertiary: '#502400'
  tertiary-container: '#df7412'
  on-tertiary-container: '#461f00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb786'
  on-tertiary-fixed: '#311400'
  on-tertiary-fixed-variant: '#723600'
  background: '#10131a'
  on-background: '#e1e2ec'
  surface-variant: '#32353c'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 24px
  card-gap: 16px
  element-gap: 12px
  inner-padding: 20px
---

## Brand & Style

This design system is engineered for **Institutional Grievance Intelligence**, balancing high-stakes professional rigor with cutting-edge AI clarity. The aesthetic is a fusion of **Corporate Modernism** and **Glassmorphism**, specifically optimized for high-density dashboard environments.

The brand personality is authoritative yet calm—an "Institutional OS" that distills complex data into actionable insights. It prioritizes legibility, structured hierarchy, and a premium "dark-mode first" experience. By utilizing deep charcoal surfaces and precise vibrant accents, the system creates a focused, non-distracting workspace for resolving critical issues.

**Visual Principles:**
- **Calm Authority:** Use dark, low-contrast surfaces to reduce cognitive load during prolonged use.
- **AI-Native Context:** Intelligence is never hidden; it is highlighted through distinctive blue/violet glass overlays and specific iconography.
- **Bento Logic:** Information is compartmentalized into logical modules with consistent corner radii, reflecting a systematic approach to data.

## Colors

The palette is built on a foundation of **Deep Charcoal and Graphite**. The "Electric Blue" primary color is reserved strictly for interactive elements and primary AI indicators, ensuring it retains its communicative power without overwhelming the dark interface.

- **Primary (#3b82f6):** Used for primary actions, focus states, and the core AI "Intelligence" identity.
- **Secondary/AI Pulse (#8b5cf6):** A violet tint used exclusively in gradients with the primary blue to denote generative AI processes or advanced analytics.
- **Surface Layering:**
    - **Base:** `#0a0a0a` (The deepest background layer).
    - **Surface:** `#171717` (Standard card/bento containers).
    - **Overlay:** `#262626` with 60% opacity (Hover states and translucent headers).
- **Functional Semantics:**
    - **Success (Emerald):** Resolution reached, compliance met.
    - **Warning (Amber):** SLA risks, pending review.
    - **Danger (Rose):** Overdue grievances, critical breaches.

## Typography

This design system employs a dual-font strategy to maximize clarity in data-heavy environments.

1.  **Geist:** Used for headlines and functional labels. Its geometric precision conveys a technical, institutional feel.
2.  **Inter:** Used for all body text and grievance descriptions. Its high x-height ensures readability at small sizes in dense tables.
3.  **JetBrains Mono (Optional):** Used for ID numbers, timestamps, and metadata to provide a distinct visual anchor for institutional records.

**Type Hierarchy Rules:**
- **Compactness:** Use `body-sm` for secondary metadata and table rows to maximize information density.
- **Emphasis:** Use `label-md` (uppercase) for section headers within bento cards.
- **Mobile Scaling:** Headlines above 24px should scale down by 15% on mobile devices to prevent excessive wrapping.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid Grid** based on a 12-column system for desktop. It utilizes a **Bento-style container logic**, where content is grouped into cards that reflow based on priority.

- **Desktop (1440px+):** 12 columns, 16px gutter, 24px margins. Content is organized in a modular grid where cards typically span 3, 4, 6, or 12 columns.
- **Tablet (768px - 1024px):** 8 columns, 16px gutter. Sidebars collapse into icons or a hamburger menu.
- **Mobile (Below 768px):** 4 columns, 12px gutter. Bento cards stack vertically, maintaining their internal 20px padding.

**Spacing Rhythm:**
All spacing must be a multiple of **4px**. Use `element-gap` (12px) for spacing between inputs and labels, and `card-gap` (16px) for the gutters between bento modules.

## Elevation & Depth

Depth is established through **Tonal Layering and Glassmorphism** rather than traditional high-opacity shadows.

1.  **Layer 0 (Base):** Deep black (`#0a0a0a`). No shadow.
2.  **Layer 1 (Cards):** Graphite surface (`#171717`) with a 1px solid border (`#262626`).
3.  **Layer 2 (Overlays/Popovers):** Semi-transparent glass (`rgba(38, 38, 38, 0.8)`) with a 12px backdrop-blur. Use a subtle outer glow of the primary color (opacity 10%) to indicate AI-driven popovers.
4.  **Shadows:** When used, shadows are "Ambient"—large blur radius (24px+), extremely low opacity (15%), and tinted with the primary blue to prevent a "dirty" look on dark surfaces.

## Shapes

The system uses a **Rounded** language to soften the institutional nature of the platform.

- **Standard Radius:** `0.5rem (8px)` for buttons and input fields.
- **Bento Card Radius:** `0.75rem (12px)` for all main containers and dashboard modules.
- **Pill Radius:** Used exclusively for Status Badges, Chips, and AI Confidence indicators to differentiate them from actionable buttons.

## Components

### Buttons
- **Primary:** Solid `#3b82f6` with white text. 8px radius.
- **Secondary:** Ghost style with `#262626` border and white text.
- **AI Action:** Gradient background (Primary Blue to Secondary Violet) with a subtle 1px white inner-glow at the top edge.

### Bento Cards
- **Structure:** 1px border (`#262626`), 20px internal padding.
- **Headers:** `label-md` typography.
- **AI Context:** Cards containing AI insights feature a vertical 2px blue accent bar on the left edge or a subtle `0.5px` blue inner-border.

### Input Fields
- **Default:** Dark background (`#0a0a0a`), 1px border (`#262626`).
- **Focus:** Border changes to Primary Blue with a 2px outer glow (15% opacity).

### Status Badges
- **Resolved:** Emerald text on `rgba(16, 185, 129, 0.1)` background.
- **At Risk:** Amber text on `rgba(245, 158, 11, 0.1)` background.
- **AI Recommendation:** Blue text on `rgba(59, 130, 246, 0.1)` background with a small Sparkle icon.

### Tables (High Density)
- **Header:** Background `#171717`, sticky, `label-md` text.
- **Rows:** Alternating subtle background or 1px bottom border. Hover state should brighten the row background to `#262626`.