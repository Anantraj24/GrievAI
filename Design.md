# GrievAI — Design.md (Frontend Design System)

**Source:** Stitch mockups — Login screen, AI Case Analysis / Grievance Intelligence
Workspace screen (2 of the 18 screens in `Appflow.md`; the rest are pending export).
**Companion docs:** `Appflow.md` (screen inventory + navigation), `techspec.md` /
`Schema.md` (what data actually backs each field — see §12 for gaps found while
writing this).

Color values below are **read off the screenshots by eye, not extracted from CSS** —
treat them as a close approximation and replace with exact tokens once you export
real values from Stitch (or inspect the rendered HTML/CSS it generates).

---

## 1. Design Direction

The mockups land the brief from `prd.md` §23 well: dark, dense, data-forward,
no glowing/gimmicky AI chrome. Specific things worth preserving as you build more
screens:

- **AI output looks like instrumentation, not a chat bubble.** Confidence scores,
  entity tables, and a monospace execution trace read like a diagnostics panel — this
  is exactly the "AI integrated into the workflow, not pasted on top of it" goal.
- **The deterministic layer is visualized, not just implemented.** The "Recommended
  Routing" card shows a terminal-style trace (`executing logic_tree: node_42`,
  `match: "HVAC" && "Science Building"`, `route_assigned: dep_facilities_02`). This is
  a genuinely good way to make "AI recommends → deterministic rules execute" visible
  to the user, not just true in the backend. Reuse this pattern for the priority
  engine and SLA/escalation engine outputs elsewhere in the Workspace — right now only
  routing gets it.
- **Restraint on accent color.** Blue is reserved for "trustworthy AI output"
  (confidence numbers, primary actions, links); amber/orange is reserved for
  attention/elevated states; red only appears as a small sentiment indicator. Keep
  this discipline as more screens are built — don't let every card sprout its own
  accent color.

---

## 2. Color System

| Token | Approx. value | Usage |
|---|---|---|
| `--bg-app` | `#0A0A0D` (near-black) | Page background |
| `--bg-surface` | `#131318` | Sidebar, top nav bar |
| `--bg-card` | `#16171D` | Card backgrounds |
| `--bg-card-inset` | `#1C1D24` | Nested/highlighted rows (e.g. Primary Domain box, table header) |
| `--border-subtle` | `#26272E` | Card borders, input borders, dividers |
| `--accent-blue` | `#3B6EF6` (primary) | Confidence numbers, primary buttons, links, active nav state, card left-accent bar |
| `--accent-blue-muted-bg` | `rgba(59,110,246,0.12)` | "High Reliability" pill background |
| `--accent-amber` | `#E8A33D` | "Elevated" badge, entity-type labels (LOCATION, DATE_REF, etc.), warning icon |
| `--accent-red` | `#E8543D` (approx) | Sentiment-negative indicator only — used sparingly |
| `--text-primary` | `#F4F4F6` | Headlines, primary values |
| `--text-secondary` | `#B3B4BC` | Body copy, descriptions |
| `--text-muted` | `#7A7B85` | Uppercase section labels, placeholders, metadata |

Two accent bars appear consistently on data-heavy cards (AI Confidence, Extracted
Intelligence): a **1–2px solid blue left border** on the card container. Treat this as
the visual marker for "this card is AI-attributed content" — cards showing purely
deterministic output (e.g. a plain status field) shouldn't carry it.

---

## 3. Typography

| Role | Style | Example |
|---|---|---|
| Page title | Bold, large (~32–40px), tight tracking, sans-serif grotesk | "AI Case Analysis", "GrievAI" |
| Card/metric hero number | Extra bold, large (~48px), `--accent-blue` | "94%", "17" |
| Section label | Uppercase, small (~11px), letter-spacing wide, `--text-muted` | "AI CONFIDENCE SCORE", "INSTITUTIONAL EMAIL" |
| Body text | Regular, ~14px, `--text-secondary` | Reasoning paragraphs, descriptions |
| Table/list primary value | Medium weight, ~14px, `--text-primary` | "Science Building, Lab 402" |
| Monospace / system trace | Monospace font, ~13px, `--text-muted`/`--accent-blue` | `> executing logic_tree: node_42` |
| Button label | Semibold, often uppercase with letter-spacing on primary CTAs | "AUTHENTICATE →" |

Confirm the actual typeface Stitch exported (looks like Inter, General Sans, or a
similar geometric grotesk) rather than guessing further — lock it in the Tailwind
config once known so headings and body don't silently drift to the browser default.

---

## 4. Layout & Grid

- **App shell:** fixed icon-only left sidebar (~64px wide) + top nav bar (~64px tall)
  + scrollable content area. This shell is shared by all authenticated screens
  (Authority Dashboard, Grievance Queue, Workspace, Admin screens per `Appflow.md`).
- **Content grid:** 2-column card grid on desktop for the Workspace
  (`AI Confidence` / `Priority Signal` in row 1, `Classification Map` /
  `Extracted Intelligence` in row 2, `Recommended Routing` / `Historical Context` in
  row 3). Cards do not attempt equal height forcing — content drives height.
- **Card anatomy (consistent across all cards):** uppercase label + small icon
  top-right → primary content → optional divider → supporting text/action. This
  template should be the one reusable `<Card>` component, not six bespoke layouts.
- **Login screen:** single centered card (~520px wide) on a full-bleed dark
  background with a faint decorative node/constellation graphic — purely
  atmospheric, not interactive, low opacity so it never competes with the form.

---

## 5. Navigation

### Sidebar (icon-only, left rail)
Order observed, top to bottom: Home/Dashboard → Grid (module switcher) → active
module (highlighted with a filled rounded-square background in `--accent-blue`-tinted
dark) → Search/Analytics → People/Users → Institution/Departments → Settings — with
Notifications bell and a user avatar pinned to the bottom. Only one icon is ever in
the "active" filled state at a time. No text labels — needs tooltips on hover for
accessibility, not shown in the mockup but should be added.

### Top bar
Product/section title top-left (bold), horizontal tab set (`Queue`, `In-Review`,
`Resolved`, `Urgent` — active tab gets an underline in `--accent-blue`), a search
input with icon, a filter icon, a help icon, and a primary CTA button pinned right
(`+ New Case`). This tab set is specific to the Authority's case-queue context — the
Student and Admin shells will need their own tab sets, not a reused copy of this one.

---

## 6. Core Components

### Card
Header row (uppercase label + muted icon) → main content → optional footer action.
Optional 1–2px left accent bar in `--accent-blue` for AI-attributed cards.

### Badge / Pill
Rounded-full, small, colored background at ~12% opacity of the accent with
full-opacity text of the same hue, plus a small leading icon. Two variants observed:
`info` (blue, e.g. "High Reliability") and `warning` (amber, e.g. "Elevated"). A
`critical` (red) variant will be needed once `CRITICAL` priority cases render here —
not shown in these two screens but implied by `techspec.md` §4.3.

### Confidence Score Display
Hero number + `%` sign (smaller, muted) + badge, with a one-line explanatory caption
below a divider. Reused pattern for both the top-level "AI Confidence Score" and the
per-field confidence values in Extracted Intelligence/Classification Map — keep the
same numeric formatting (2 decimal places, e.g. `0.98`) at the field level and a plain
integer percentage at the summary level; don't mix formats.

### Classification Map (nested hierarchy)
A "primary" row in a slightly lighter inset background, with 1–2 further rows
indented and connected visually (implied tree, not literal lines). Each row shows a
label + value pair on the left and a confidence score on the right.

### Data Table (Extracted Intelligence)
Header row in `--text-muted`, three columns (Entity Type / Extracted Value /
Confidence). Entity type rendered in `--accent-amber` as a short, code-like tag
(`LOCATION`, `DATE_REF`) rather than a plain label — a nice touch that visually
separates "field name" from "field value" in a dense table.

### Terminal / System Trace Block
Monospace, muted-blue text on the card's own background (no separate box needed),
each line prefixed with `>`. Used to show deterministic rule execution. **Extend this
component to the priority engine and SLA/escalation engine** (see §1) rather than
inventing a new visualization for each deterministic system.

### Routing / Assignment Card
Avatar/icon circle + bold primary line (team/department name) + muted secondary line
(sub-team) + a secondary-style action button (`Edit Route`) — plus the trace block
above.

### Buttons
- **Primary:** solid `--accent-blue`, rounded-lg, white text, optional icon
  (sparkle for AI-driven actions like "Apply Routing", plain plus for "New Case",
  arrow for "Authenticate"). Reserve the sparkle icon specifically for actions that
  trigger AI processing — don't decorate ordinary primary buttons with it.
- **Secondary:** transparent/dark background, `--border-subtle` border, `--text-primary`
  text. Used for lower-emphasis actions ("Export Report", "Edit Route").

### Inputs
Dark filled background, subtle border, leading icon (envelope, lock), muted
placeholder text. Label pattern: uppercase muted label above the field, with an
optional inline right-aligned link (e.g. "Forgot Token?") on the same line as the
label — not below the field.

### Avatar
Simple filled circle placeholder (icon or initials), used consistently at small size
in both the sidebar (current user) and inline in cards (assigned team/person).

---

## 7. Screen Notes: Login

Maps to `Appflow.md` screen 1. Centered single-card layout, `GrievAI` wordmark,
tagline "Welcome back. Secure access to institutional AI." Two fields
(`Institutional Email`, `Access Token`) and a full-width primary CTA.

**Flag:** the copy here (`Institutional Email`, `Access Token`, placeholder
`admin@institution.edu`) reads as an authority/admin-oriented login, not a student
one. Decide before P2 (`Implementationplan.md`) whether:
(a) this is intentionally the shared login for all three roles and the copy should be
role-neutral (`Email`, `Password`), or
(b) student and staff get distinct, differently-worded login screens.
Either is fine architecturally — RBAC doesn't care — but the copy needs to be
deliberate, not accidental.

---

## 8. Screen Notes: AI Case Analysis (Grievance Intelligence Workspace)

Maps to `Appflow.md` screens 9–10 (Workspace + AI Analysis, shown here combined into
one scroll rather than separate tabs — worth deciding if that's the final pattern or
if Related/Duplicate Review get their own tab once that content is added, since this
mockup doesn't yet show the Duplicate Review panel from screen 11).

Section-by-section, top to bottom: header (case ID, generated timestamp, Export/Apply
Routing actions) → AI Confidence Score + Priority Signal (row 1) → Classification Map
+ Extracted Intelligence (row 2) → Recommended Routing + Historical Context (row 3).

**Override controls are not yet visible in this mockup.** `techspec.md` §4 and
`rules.md` §2 require every AI-populated field (category, subcategory, priority,
routing) to have a visible accept/override control — this screen currently shows
"Apply Routing" and "Edit Route" but no explicit override affordance on the
Classification Map or Priority Signal cards. Add that before treating this screen as
implementation-ready; it's the single most important architectural requirement this
project has (§2 of `rules.md`), and right now the visual design doesn't yet surface it
everywhere it needs to.

---

## 9. Open Issues / Decisions Needed

1. **Branding inconsistency:** the top nav on the Workspace screen reads
   "Case Intelligence" while the login screen reads "GrievAI". Pick one product name
   for the shipped UI and update whichever screen is wrong — `prd.md` §1 and
   `rules.md` §7 both fix the name as **GrievAI**, so "Case Intelligence" is most
   likely a placeholder from early Stitch iteration rather than a deliberate rename.
2. **New fields introduced here aren't in the extraction schema yet.** The mockup
   shows `Sentiment`, `Urgency Vectors` (a count), and a `Violation Type` /
   `Policy Reference` pair (e.g. "Lab Safety Standards Sec 4.1") that don't exist in
   the NLU output schema in `techspec.md` §4.1 or the category/subcategory model in
   `Schema.md`. Two of these are easy: fold `Sentiment` and `Urgency Vectors` into the
   existing signal set if you want to keep them. The **policy reference field is the
   one to be careful with** — citing a specific policy section is exactly the kind of
   claim `techspec.md` §4.7 forbids the model from inventing. If this field ships, it
   must be grounded against a real, indexed policy-document corpus (retrieval, not
   generation) — otherwise it's a hallucination risk sitting right next to a
   confidence score that implies it's verified.
3. **Dark-theme contrast:** `--text-muted` on `--bg-card` is a fairly low-contrast
   pairing at a glance. Run the real exported colors through a contrast checker
   (WCAG AA, 4.5:1 for body text) before this ships — easy to fix now, annoying to
   retrofit across every screen later.
4. **Sidebar has no visible labels or tooltips.** Icon-only nav needs either
   hover-tooltips or `aria-label`s for accessibility — not present in the static
   mockup, needs to exist in the build.

---

## 10. Screen → Appflow Coverage

| `Appflow.md` screen | Status |
|---|---|
| 1. Login | Designed (this doc §7) — copy decision pending |
| 9–10. Workspace / AI Analysis | Designed (this doc §8) — override controls pending |
| All other screens (2–8, 11–18) | Not yet exported from Stitch — extend this doc's component list (§6) to them rather than introducing new patterns per screen |
