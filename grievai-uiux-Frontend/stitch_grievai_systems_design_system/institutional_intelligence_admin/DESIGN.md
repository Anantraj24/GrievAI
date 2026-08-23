---
name: Institutional Intelligence Admin
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363941'
  surface-container-lowest: '#0b0e15'
  surface-container-low: '#191b23'
  surface-container: '#1d2027'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e0e2ec'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e0e2ec'
  inverse-on-surface: '#2d3038'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#d0bcff'
  on-secondary: '#37265e'
  secondary-container: '#503f79'
  on-secondary-container: '#c2aef0'
  tertiary: '#ffb785'
  on-tertiary: '#502500'
  tertiary-container: '#c28255'
  on-tertiary-container: '#451f00'
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
  on-secondary-fixed: '#210f48'
  on-secondary-fixed-variant: '#4d3d76'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb785'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#6b3a13'
  background: '#10131a'
  on-background: '#e0e2ec'
  surface-variant: '#32353c'
  surface-card: '#171717'
  border-subtle: '#363941'
  border-muted: '#262626'
  on-surface-muted: '#8C909F'
  status-critical: '#FFB4AB'
  status-warning: '#F59E0B'
  glass-fill: rgba(23, 23, 23, 0.6)
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
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
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: '0'
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: '0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-desktop: 24px
  margin-mobile: 16px
  card-padding: 20px
  component-gap: 12px
---

## Brand & Style
This design system is engineered for high-stakes institutional administration. The brand personality is **authoritative, analytical, and futuristic**, designed to evoke a sense of absolute control and machine-precision clarity.

The visual direction follows a **Modern Bento** approach influenced by **Glassmorphism**. It utilizes a deep charcoal foundation to reduce eye strain for long-duration monitoring, while "Electric Blue" accents signal AI-driven insights and critical system performance. The interface should feel like a premium command center—dense with information but strictly organized through a modular architecture that separates complex grievance data into digestible units.

## Colors
The palette is built on a "Deep Charcoal" base (`#10131A`) to establish a sophisticated, high-fidelity environment. 

- **Primary (Electric Blue):** Used for critical insights, primary actions, and "AI Active" states. It should often be paired with a subtle 20px blur outer glow to simulate a screen-emitted light.
- **Secondary (Muted Violet):** Applied to institutional categorization and secondary data streams.
- **Surface Strategy:** The background uses the darkest shade, while "Bento" cards use `surface-card`. Borders are critical for separation; use `border-subtle` for primary containers and `border-muted` for internal dividers.
- **Functional Colors:** High-chroma red and amber are used sparingly for SLA breaches and performance warnings, ensuring they pop against the low-saturation background.

## Typography
The system employs a three-tiered font strategy to reinforce the "Institutional Intelligence" narrative. 

**Geist** is used for all structural headers and navigational elements, providing a modern, technical aesthetic. **Inter** handles all long-form grievance text and body content for maximum readability. **JetBrains Mono** is strictly reserved for quantitative data—system performance metrics, case IDs, timestamps, and SLA counters—to emphasize the data-driven nature of the admin panel.

For labels and small headings, use `label-caps` in all-caps to create a clear visual distinction from body text.

## Layout & Spacing
This design system uses a **Fluid Bento Grid** model optimized for high information density. 

The layout is anchored by a fixed 80px sidebar on the left. The main content area utilizes a 12-column grid system.
- **Desktop (1440px+):** 12 columns, 16px gutters. Bento cards should span 3, 4, 6, or 12 columns depending on data complexity.
- **Tablet (768px - 1439px):** 6 columns. Cards reflow to stack, typically spanning 3 or 6 columns.
- **Mobile (<768px):** 1 column. All cards stack vertically to 100% width.

Consistent internal padding within bento cards (`card-padding`) is mandatory to maintain the "modular" appearance without the UI feeling cluttered.

## Elevation & Depth
In this design system, depth is achieved through **Tonal Layering** and **Glassmorphism** rather than traditional drop shadows.

- **Background:** Level 0. Use `#10131A`.
- **Bento Cards:** Level 1. Use `surface-card` with a 1px border of `border-muted`. No shadow.
- **Modals & Overlays:** Level 2. Use `glass-fill` with a `backdrop-blur` of 24px and a `border-subtle` stroke.
- **Active Insights:** To indicate AI-processed or high-priority items, use a "Lifted State" consisting of a subtle inner glow (Primary Blue at 10% opacity) and a high-contrast border on the left edge.

## Shapes
The shape language is strictly defined as **Rounded Eight**. All primary bento containers, buttons, and inputs follow an 8px (`0.5rem`) corner radius. 

- **Bento Cards:** Always 8px.
- **Inner Elements:** When nesting elements (like status chips inside a card), use 4px (`0.25rem`) to maintain visual nesting logic.
- **Interactive States:** Buttons should remain 8px to maintain the technical, geometric look of the system.

## Components
- **Bento Cards:** The foundational container. Each card must have a header section (using `label-caps`) and a body. Performance metric cards should feature a minimalist SVG sparkline.
- **Buttons:** Primary buttons are solid `#3B82F6` with white text and a subtle 15% opacity glow shadow. Secondary buttons are ghost-styled with a `border-subtle` outline.
- **Status Chips:** Use a subtle background (15% opacity of the status color) and high-contrast text. Use `data-mono` for any numbers inside chips.
- **Inputs:** Search and filter bars use `surface-card` with a `border-muted` stroke. On focus, the border transitions to Primary Blue with a soft outer glow.
- **Institutional Issue Cards:** A specialized list item. It includes a `border-left` accent (2px width) indicating priority, a Geist-font title, and JetBrains Mono case ID metadata.
- **Performance Gauges:** Use semi-circular tracks with Primary Blue fills. Use `backdrop-blur` behind the gauge labels for a glassmorphic effect.