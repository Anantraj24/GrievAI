---
name: Institutional Precision
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363940'
  surface-container-lowest: '#0b0e14'
  surface-container-low: '#191c22'
  surface-container: '#1d2026'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e1e2eb'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e1e2eb'
  inverse-on-surface: '#2e3037'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#c4c6ce'
  on-secondary: '#2d3037'
  secondary-container: '#464950'
  on-secondary-container: '#b6b8c0'
  tertiary: '#c3c6d1'
  on-tertiary: '#2c3038'
  tertiary-container: '#8d919a'
  on-tertiary-container: '#262a32'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e1e2ea'
  secondary-fixed-dim: '#c4c6ce'
  on-secondary-fixed: '#191c22'
  on-secondary-fixed-variant: '#44474d'
  tertiary-fixed: '#dfe2ed'
  tertiary-fixed-dim: '#c3c6d1'
  on-tertiary-fixed: '#181c23'
  on-tertiary-fixed-variant: '#43474f'
  background: '#10131a'
  on-background: '#e1e2eb'
  surface-variant: '#32353c'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
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
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered for **GrievAI**, a platform where institutional gravity meets modern technological efficiency. The brand personality is authoritative, calm, and highly organized. It avoids the "playfulness" of consumer apps in favor of a **Corporate Modern** aesthetic that borrows from high-end developer tools.

The visual language focuses on depth through tonal layering rather than shadows. It evokes a sense of "command center" reliability. Every element is designed to feel substantial and permanent, reflecting the serious nature of grievance management. The interface is intentionally dark to reduce cognitive load during long sessions of data analysis and case review.

**Key Principles:**
- **Calculated Density:** Maximizing information display without sacrificing clarity.
- **Architectural Hierarchy:** Using monochromatic shifts to define boundaries.
- **Subtle Precision:** High-contrast typography paired with low-contrast UI borders.

## Colors

The palette is anchored in a monochromatic "Deep Charcoal" spectrum to create a premium, focused environment. 

- **Base Surface:** `#0B0E14` (Deep Charcoal) is used for the lowest application layer.
- **Elevated Surface:** `#1A1D23` (Graphite) is used for cards, sidebars, and modular containers.
- **Borders/Dividers:** `#2D3139` provides structural definition without visual noise.
- **Accent:** `#3B82F6` (Electric Blue) is the sole driver of action and status, used sparingly to maintain its impact.
- **Typography:** Pure soft whites for primary content and muted grays for metadata ensure a clear reading hierarchy.

## Typography

This design system utilizes **Geist** for its primary typeface, offering a technical, minimal, and highly legible feel that aligns with modern SaaS standards. For technical metadata, ticket IDs, and status labels, **JetBrains Mono** is introduced to provide a distinctive "data-driven" character.

- **Scale:** High contrast between display sizes and body text to create immediate hierarchy in data-heavy screens.
- **Tracking:** Tightened slightly on large headlines for a more "designed" look; loosened on labels for readability at small sizes.
- **Color:** Headlines utilize `text_primary`, while descriptive text and secondary labels use `text_secondary`.

## Layout & Spacing

The layout philosophy follows a **fixed-fluid hybrid grid**. Main navigation and side-panels are fixed-width to ensure tool consistency, while the primary content area uses a fluid 12-column grid.

- **Rhythm:** A strict 4px baseline grid governs all spacing.
- **Margins:** Generous 24px external margins prevent the UI from feeling cramped against the screen edges.
- **Density:** While margins are large, internal component padding is tight (e.g., list items, table rows) to allow for high information density—essential for grievance tracking.
- **Breakpoints:** 
  - Desktop: 1200px+ (12 columns)
  - Tablet: 768px - 1199px (8 columns, sidebars collapse to icons)
  - Mobile: <767px (4 columns, vertical stacking)

## Elevation & Depth

This design system rejects traditional drop shadows in favor of **Tonal Elevation**. Depth is communicated through color luminance and hair-line borders.

1.  **Level 0 (Background):** `#0B0E14` - The canvas.
2.  **Level 1 (Default Surface):** `#1A1D23` - Main cards and navigation elements.
3.  **Level 2 (Active/Hover):** `#2D3139` - Hover states for interactive elements or nested containers.

**Borders:** Every elevated surface must have a 1px solid border of `#2D3139`. This creates a crisp, "machined" look that defines edges more effectively than soft shadows in a dark UI.

## Shapes

The shape language is characterized by **large corner radii**, creating a sophisticated "squircle" feel that softens the technical nature of the application.

- **Primary Containers:** `rounded-xl` (24px) for main dashboard cards and layout sections.
- **Standard Components:** `rounded-lg` (16px) for buttons, input fields, and modal dialogs.
- **Small Elements:** 8px for chips and small status indicators.
- **Selection States:** Use a 4px radius for internal menu selection highlights to maintain a distinct visual language from containers.

## Components

### Buttons
- **Primary:** Background `#3B82F6`, text white. High contrast.
- **Secondary:** Border `#2D3139`, background transparent, text `text_primary`.
- **Ghost:** No background/border, text `text_secondary`. Active on hover with `#1A1D23`.

### Input Fields
- Background: `#1A1D23`.
- Border: `#2D3139`.
- Focus State: Border color shifts to `#3B82F6` with a subtle 2px outer glow of the same color (10% opacity).

### Cards
- Always use the `#1A1D23` background.
- 1px border of `#2D3139`.
- Internal padding should be a consistent 24px for dashboard widgets.

### Status Chips
- Use monochromatic backgrounds with low opacity (e.g., 10% Blue for "In Progress") and high-contrast text. 
- Use **JetBrains Mono** for the text within chips.

### Lists & Tables
- Remove all vertical dividers.
- Use horizontal dividers (`#2D3139`) only.
- Row hover state: Background shift to `#2D3139` (50% opacity).