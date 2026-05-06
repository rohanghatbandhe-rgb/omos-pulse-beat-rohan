# Osmos Constraints — Read First, Every Invocation

These are the non-negotiables. If a recipe violates one of these without explicit, named justification, it's wrong.

---

## 1. Portal context determines density

| Portal | User | Density | Vibe |
|---|---|---|---|
| **Pulse** (retailer / ad ops / media sales) | Power user managing 100-500 campaigns | **High** — 12+ visible columns acceptable, 32px row height, hover-revealed actions | Operational, dark nav, dense |
| **Advertiser Portal** | Brand or agency advertiser, mid-frequency user | **Medium** — 6-8 columns default, 40px row height, primary actions always visible | Guided but not hand-holding |
| **OsmosX** (brand-side) | New, exploratory, marketing-budget-holder | **Lower density, marketing-grade polish** acceptable | Premium, ample whitespace where it doesn't hurt task speed |

**Rule:** the same component looks different across these portals. Same Card primitive, different padding scale (`spacing-3` on Pulse, `spacing-4` on Advertiser, `spacing-5` on OsmosX). Same Button, different sizing.

If the user doesn't say which portal, ASK. Don't assume.

---

## 2. The nav shell is fixed

- **Left nav** is `NavShell` from `src/ui/`. It can collapse to icon-only (44px wide) or expand (240px wide). It does not move.
- **Top bar** is `Header` from `src/ui/`. It can change content but not structure.
- **Account switcher** lives top-left in `Header`. **User menu** lives top-right.
- **Page-level CTAs** live in the Page Header (a Toolbar inside the main content area), NOT in the top bar.

If a recipe proposes a nav structure change, kick it back to `ux-ideator` — that's an IA decision, not a visual craft decision.

---

## 3. Tokens — only `--osmos-*` (no raw values, ever)

| Category | Tokens | Use |
|---|---|---|
| **Spacing** | `--osmos-spacing-1` (4) → `--osmos-spacing-12` (48) | Padding, gap, margin — always |
| **Color (semantic)** | `--osmos-fg`, `--osmos-fg-muted`, `--osmos-fg-subtle`, `--osmos-bg`, `--osmos-bg-subtle`, `--osmos-bg-muted`, `--osmos-border`, `--osmos-border-muted` | All neutrals — light/dark mode adaptive |
| **Color (brand)** | `--osmos-brand-primary` (#636CFF), `--osmos-brand-primary-muted`, `--osmos-brand-green`, `--osmos-brand-green-muted`, `--osmos-brand-amber`, `--osmos-brand-secondary` | Status, KPI, accents |
| **Radii** | `--osmos-radii-sm` (4) → `--osmos-radii-2xl` (24), `--osmos-radii-full` | Cards 8-12, pills full, modals 12-16 |
| **Shadows** | `--osmos-shadows-xs` → `--osmos-shadows-2xl` | Cards rest at xs, hover at sm, modals at lg |
| **Type sizes** | `--osmos-fontSizes-xs` (11) → `--osmos-fontSizes-3xl` (28) | Body 13, label 12, heading 16-20 |

**Forbidden:** raw hex (`#636CFF`), raw px (`16px`), raw rgba, opacity classes that aren't tokenized, hardcoded `box-shadow` or `border-radius`.

---

## 4. Components — `src/ui/` only, never invent

The Osmos product UI uses hand-rolled atoms/molecules in `src/ui/` with inline CSS variables. Imports look like:

```jsx
import { Button, Card, Input, Badge, Drawer, Modal, Toolbar, SectionCard, EmptyState } from '../../ui';
```

**Rule:** if the recipe needs a component that doesn't exist in `src/ui/`, do NOT invent one. Either:
- Compose from existing atoms (preferred), or
- Hand off to `component-reuse-enforcer` to extend `src/ui/` with a new variant first

**Available primitives** (curated, not exhaustive):
- Atoms: Button, Input, Badge, Tag, Checkbox, Toast, Icon
- Molecules: Drawer, Modal, EmptyState, SectionCard, Toolbar
- Patterns: NavShell, Header, FilterBar, Pagination

When the recipe needs an unfamiliar primitive, write a one-line spec ("needs Stepper component — not in `src/ui/` yet, propose adding 3-step / 5-step variants") rather than inventing inline.

---

## 5. Density rules for ad ops surfaces (Pulse)

If the surface is in Pulse and the persona is ad ops:

- **Tables MUST have**: bulk-select column, hover row highlight, sticky header on scroll, column sort, pagination (no infinite scroll), 32-36px row height
- **Filter bar MUST be**: persistent (not collapsible), supports keyboard tab, shows applied count
- **Bulk actions MUST be**: visible when rows selected, not hidden in a kebab menu
- **Keyboard shortcuts MUST exist for**: navigation between rows (j/k), bulk-select (shift+click range), edit-in-place (enter), pagination (n/p)

If the recipe omits any of these, it's wrong for ad ops. Dev's reference file has the full list.

---

## 6. Dark mode parity is non-negotiable

Every recipe must work in both modes. If the inspiration is light-mode-only:

- Color tokens are already adaptive — no extra work for `--osmos-fg`, `--osmos-bg`, etc.
- **Brand colors** stay the same hue but the muted variants shift: `--osmos-brand-primary-muted` is `rgba(99,108,255,0.12)` in light, `rgba(99,108,255,0.18)` in dark
- **Shadows** are weaker in dark mode (rely on borders + bg-subtle layering instead)
- **Images / illustrations** must have a dark variant or tolerate both backgrounds
- **Borders** become more important than shadows for separation in dark

Test dark mode mentally. If you can't, say so explicitly in the recipe.

---

## 7. State coverage is part of the recipe, not an afterthought

Every recipe must specify these states. Missing states = incomplete recipe.

| State | When | What |
|---|---|---|
| **Default** | Normal load with data | The main visual |
| **Empty** | No data exists yet (first-time, filter hits nothing) | EmptyState component with explanatory copy + primary CTA |
| **Loading** | Data fetching | Skeleton (preferred) or spinner — never a blank screen |
| **Error** | Fetch failed, action failed | Inline error with retry, NOT a toast for fetch errors |
| **Hover** (interactive) | Mouse over row/button | Token-defined hover state, never invented |
| **Focus** (keyboard) | Tab focus | Visible focus ring (2px outline `--osmos-brand-primary` + 2px offset) |
| **Disabled** | Action unavailable | Reduced opacity (0.6), `cursor: not-allowed`, tooltip explaining why |

---

## 8. Animation: meaningful only

- **Allowed**: 150-200ms ease-out on hover, opacity transitions, height transitions on collapse, stagger on data table rows (60ms delay per row, max 10 rows then snap)
- **Allowed**: skeleton shimmer (1500ms cycle, ease-in-out)
- **Allowed**: slide-in for drawers (250ms cubic-bezier(0.16,1,0.3,1))
- **Forbidden**: bouncy spring on UI chrome, decorative motion on B2B surfaces, autoplaying animations, parallax on dashboards
- **Forbidden**: animation that delays task completion (e.g. 500ms button press feedback before action fires)

Zara's reference file has the delight catalog — pull from there for animation decisions, but the constraint above takes precedence on Pulse.

---

## 9. Typography ramp

The product UI uses ONE family — `'Open Sans', sans-serif` — set on the page root. Don't propose a different family unless the surface is OsmosX marketing, in which case the brand skill applies.

Type ramp on Pulse:

| Use | Size | Weight | Line height |
|---|---|---|---|
| Page title | 20 | 600 | 1.4 |
| Section heading | 16 | 600 | 1.4 |
| Subsection | 14 | 600 | 1.5 |
| Body | 13 | 400 | 1.5 |
| Label | 13 | 500 | 1.4 |
| Caption / meta | 12 | 400 | 1.4 |
| Tabular number | 13 | 500 | 1 (no leading) |

OsmosX may go up to 24/600 page title with 32-40 hero. Pulse never exceeds 20.

---

## 11. Accessibility Floor — non-negotiable, every recipe

A recipe that doesn't clear this floor isn't a recipe. It's a draft. WCAG 2.2 AA is the minimum bar; the lapses below were the ones that actually shipped past us in the past, so they're called out explicitly.

### 11.1 Focus rings on every interactive — always

Every `<button>`, radio, checkbox, custom-tab, and clickable card MUST have a visible `:focus-visible` ring. The Osmos default is `outline: 2px solid var(--osmos-brand-primary); outline-offset: 2px;` (segmented controls use `offset: -2px` to keep the ring inside the segment). If the recipe styles a button with `border: none`, the recipe MUST also include the focus-visible rule — `border: none` suppresses the browser default and produces an invisible focus state. **No silent suppression.**

### 11.2 Keyboard navigation per ARIA APG — match the role

If a recipe declares `role="radiogroup"`, it MUST implement arrow-key navigation per the ARIA Authoring Practices Guide: ArrowLeft/ArrowRight cycle selection, Home/End jump to first/last, selected radio gets `tabIndex={0}` while unselected siblings get `tabIndex={-1}` (roving tabindex). Same applies to `tablist`, `menu`, `listbox`, `tree`, `combobox`. **Declaring an ARIA role is a contract; the keyboard pattern that comes with the role is part of the contract.**

### 11.3 Target size — WCAG 2.5.8 AA = 24×24, AAA = 44×44

Every interactive element MUST be at least 24×24 CSS pixels. Default to 44×44 for primary CTAs, 32×32 for icon-only buttons, 24×24 for inline link-style buttons / chips / dismiss icons. **Wrap small icons in a button with padding** to expand the hit target — never set `padding: 0` on a button. The InfoIcon-as-clickable-13×13 mistake is the canonical example: it fails AA, fails Fitts's Law, fails motor-impaired users on touch.

### 11.4 Color is never the only channel — WCAG 1.4.1

If a recipe distinguishes two states via color (or color saturation, or opacity of the same hue) — that's color-only encoding. Add a second channel: pattern (dashed border, repeating-linear-gradient stripes), shape (circle vs square), label, or position. **The "ghost band vs solid band" mistake** (current vs ideal differentiated only by 0.18 opacity vs 1.0) is the canonical example: low-vision and CVD users can't tell which is which. Add dashed pattern to the ghost.

### 11.5 Status messages — WCAG 4.1.3

State changes the user can't see otherwise (form submission accepted, projection recomputed, item dismissed, undo countdown ticking) MUST be announced via either `role="status"` on the visible state element or a separate visually-hidden `aria-live="polite"` region. A celebratory green "Saved" pill that screen readers can't hear is a celebration only sighted users get.

### 11.6 Reduced motion — WCAG 2.3.3 + parental respect

Any animation longer than 150ms or distance greater than 8px MUST be wrapped in `@media (prefers-reduced-motion: no-preference)` OR `@media (prefers-reduced-motion: reduce) { .anim { transition: none !important; animation: none !important; } }`. Vestibular-disorder users get migraines from animations they didn't ask for. **Default-on motion is an accessibility violation.**

### 11.7 Tooltips that don't lock out keyboard / screen-reader

`title="..."` attributes are mouse-hover-only. They don't fire on keyboard focus. They are spotty in screen readers. If a tooltip carries information the user needs to make a decision (the confidence score's source, the "why this band" explanation), it MUST be reachable via either: (a) `aria-label` on the trigger that contains the same text, (b) a properly-coded popover that pairs `aria-describedby` with a focus-trapping panel, or (c) a click-revealed Drawer. **Do not put load-bearing copy in `title=`.**

### 11.8 Contrast ratios — verify, don't trust

Body text 4.5:1 against background. Large text (18+ or 14+ bold) 3:1. Non-text UI (button border, focus ring, status indicator) 3:1. The Osmos token system gets you most of the way for body text, but small (10–11px) chips on `--osmos-bg-subtle` are right at the edge in light mode and can fail in dark mode. **Use a contrast checker on every chip / pill / small-type ramp before declaring the recipe done.**

### 11.9 Quick checklist (paste into the recipe's "Anti-patterns avoided" section)

- [ ] `:focus-visible` on every button, radio, link
- [ ] ARIA role → matching keyboard pattern
- [ ] Hit target ≥ 24×24 for every clickable
- [ ] Color always paired with a second channel
- [ ] State changes announced via `role="status"` or `aria-live`
- [ ] All animation respects `prefers-reduced-motion`
- [ ] No load-bearing copy inside `title=`
- [ ] Contrast verified at 4.5:1 / 3:1 thresholds

If any item is "no", the recipe goes back to translation. This list is the difference between Honeycomb-Accessible C+ and B+.

---

## 12. The "B2B SaaS lookalike" risk

What makes Osmos look like every other B2B SaaS — to actively avoid:

- Identical 3-card metric row at top of every dashboard
- Generic stock-photo empty states ("Empty box illustration")
- Centered modal with title + description + two-button footer (this is fine 80% of the time but is the *default* trap)
- Linear gradient backgrounds on cards
- "Beautiful" charts that are unreadable in dark mode
- Toast for everything (use inline error / success / drawer where appropriate)
- Sidebar nav with 12 top-level items (Osmos has 6 — Campaigns, Packages, Finance, Activity, Help, Settings)

What Osmos does instead:

- Variable card sizes based on what data they hold (a chart card is wider than a KPI card)
- Empty states with **specific, contextual** copy referencing the user's last action
- Drawer-over-modal for any flow with >3 fields (campaign edit, budget adjust, audience target)
- Flat surfaces with `--osmos-border` separation, not gradients
- Charts with explicit dark-mode color tokens
- Inline status (Badge component) for row-level state, Toast only for transient post-action confirmation
