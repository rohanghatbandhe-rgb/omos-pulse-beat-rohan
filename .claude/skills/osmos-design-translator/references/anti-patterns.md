# Anti-Patterns — What Not to Do

Six generic-SaaS traps and four Osmos-specific traps. Each has the symptom, why it's bad, and the specific fix.

---

## Generic-SaaS traps (industry-wide)

### 1. The Kitchen-Sink Dashboard

**Symptom:** First impression is 4 KPI cards in a row + 2 charts side-by-side + a table below + a sidebar with 5 widgets. Every metric the team wanted to surface, all at equal weight.

**Why it's bad:** Hick's Law (decision time scales log with options) is being violated. Users skim once, get overwhelmed, learn to ignore the dashboard. The "north star" metric is invisible because it's at the same visual weight as everything else.

**Fix:** One hero KPI gets 2x the visual weight (typography size, card area, color emphasis). Other metrics nest below it as supporting context. Charts are tied to that hero KPI, not floating.

**Osmos example done right:** Pulse home shows M%G as the hero metric; ad spend, impressions, ROAS are supporting context. The hero is in a card 2x wider than supporting cards.

---

### 2. The Undifferentiated Card Grid

**Symptom:** A list of items rendered as a 3-column card grid where every card looks identical — same size, same border, same internal layout. Looks "designed" but conveys no signal about which card is most important.

**Why it's bad:** Card grids work for browsing (Pinterest, Dribbble) where every item is equally browseable. They fail for working surfaces where items have meaningful priority (active campaigns vs. paused, error vs. healthy).

**Fix:** Either go to a table (where row order, color, and density convey priority cheaply) OR lean into card variation (active campaigns get a colored left border + pulse animation, paused get muted opacity). Never an undifferentiated grid for working surfaces.

**Osmos signal:** if the card grid contains anything sortable, statusful, or operational, it should be a table.

---

### 3. The Gradient Hero / Aspirational Marketing-on-Product

**Symptom:** A blue-purple gradient banner at the top of a working surface with copy like "Welcome back, ready to grow your business?" 

**Why it's bad:** Confuses marketing surfaces with product surfaces. The user came here to do a task, not be re-marketed to. Wastes prime real estate. Looks dated by 2024 standards.

**Fix:** Working surfaces get a Toolbar / Page Header with the page title, breadcrumb, and primary CTA. No gradient. No motivational copy. If the user needs onboarding nudges, they belong in an EmptyState (when relevant) or a contextual ProgressBar — not a permanent banner.

**Allowed exception:** OsmosX marketing surfaces, success states for milestone moments (first campaign launched), and signed-out / onboarding flows.

---

### 4. Toast for Everything

**Symptom:** Every action (form save, filter change, item delete, fetch error) triggers a toast in the bottom-right corner. Toasts pile up, dismiss themselves, the user misses the important ones.

**Why it's bad:** Toasts are for transient, low-priority confirmation. Using them for errors (which need attention) and for high-frequency actions (which become noise) breaks the pattern.

**Fix:** Inline confirmation for in-context save ("Saved 2 seconds ago" next to the field). Toast for *cross-context* confirmation (you saved on one screen, the toast confirms while you've moved on). Inline error for fetch failures (with retry). Modal for destructive confirmation.

**Rule of thumb:** If the user is still on the same screen, use inline. If they've navigated away, use toast.

---

### 5. The Centered-Modal Default

**Symptom:** Every action opens a centered modal with a title, body, and two-button footer (Cancel + Confirm).

**Why it's bad:** Centered modals tear the user out of context. They're appropriate for focused, terminal decisions ("Are you sure you want to delete?"). They're inappropriate for editing flows where the user needs to refer to the surrounding data.

**Fix:** Drawer (right side) for editing flows that need row context. Inline edit for single fields. Page for multi-step. Centered modal ONLY for: confirmation, simple info display, single decisions ≤3 fields.

**Litmus test:** Will the user need to look at the surrounding screen while in this UI? If yes, drawer. If no, modal.

---

### 6. The "Empty Box" Empty State

**Symptom:** No data → a stock illustration of an empty box, magnifying glass, or sad cloud, with copy "Nothing here yet" and a generic "Create" button.

**Why it's bad:** It's a missed product moment. The empty state is when the user is most uncertain about what to do next — generic copy fails them. Stock illustrations make the product look templated.

**Fix:** Specific copy referencing what should be here and why ("No campaigns yet. Once you create your first campaign, you'll see ad spend and impression trends here."). Custom illustration or icon (Osmos has a brand icon library — use it). Primary CTA labeled with the action verb, not "Create" / "Get started."

**Test:** Cover the page title — can you tell what feature this empty state is for? If not, the copy is too generic.

---

## Osmos-specific traps

### 7. Hidden Bulk Actions

**Symptom:** A table where bulk-select is enabled, but bulk actions are inside a kebab menu or only revealed after a row is selected.

**Why it's bad:** Dev's reference file is explicit: ad ops managers expect bulk actions to be **discoverable before** they select rows, not after. Hidden bulk actions force them to select first, then hunt for the action — slower than the alternative they have today (CSV export, edit in Excel, re-import).

**Fix:** Bulk action bar appears with the table, all actions visible. When 0 rows selected, actions are disabled with a tooltip ("Select rows to enable"). When ≥1 row selected, count appears next to the actions ("3 selected · Pause · Update budget · Export").

---

### 8. Advertiser-Portal Density on Pulse

**Symptom:** A Pulse table with 40px+ row height, 5 columns, big icons, gentle whitespace.

**Why it's bad:** Pulse users have 100-500 campaigns. Whitespace that looks "premium" on Advertiser portal is friction here — every line of whitespace = one less campaign visible per screen.

**Fix:** 32-36px row height, 8-12+ columns, hover-revealed actions, sticky header. The recipe should never look like Stripe Dashboard for ad ops surfaces. It should look like Linear Issues or GitHub Pull Requests — designed for high-frequency operators.

---

### 9. Dark Mode Afterthought

**Symptom:** A recipe that specifies colors as `#FFFFFF` for background, `#000000` for text, with a comment "TODO: dark mode."

**Why it's bad:** Dark mode in Osmos is not optional. ~40% of users are on dark mode. Designing for light-mode-only and porting later means dark mode always feels like an afterthought (low contrast, awkward shadow handling, illustration that disappears on dark bg).

**Fix:** Every recipe uses semantic tokens (`--osmos-fg`, `--osmos-bg`) that adapt automatically. The recipe explicitly tests one tricky case mentally — usually shadows (which are weaker in dark) and brand-muted backgrounds (which need more saturation in dark).

---

### 10. Infinite Scroll on Operational Tables

**Symptom:** A campaign list that loads 50 rows, then loads more on scroll forever.

**Why it's bad:** Operational surfaces need pagination because users need predictable position ("page 3, row 47") to refer to in conversations with teammates, in support tickets, in screenshots. Infinite scroll destroys the URL contract — you can't share "this exact list state."

**Fix:** Pagination component (already in `src/ui/`) at the bottom of the table. Page size 25, 50, 100. URL params reflect current page. `n` and `p` keyboard shortcuts to navigate.

**Allowed:** Infinite scroll on browse-style surfaces (image galleries, marketplace listings) where order doesn't matter and items are roughly equivalent.

---

### 11. Novel Visualization Without a Legend

**Symptom:** A custom data visualization (range bands, twin-track bars, sparkline-with-overlay, dot-and-whisker, heatmap, etc.) ships without an inline legend explaining what each visual layer means.

**Why it's bad:** Standard chart conventions (line = trend, bar = magnitude, pie = composition) are pre-loaded in users' heads. Novel visualizations are not. A user looking at a four-layer band track for the first time has to reverse-engineer the encoding: *is the dark band current or ideal? what's the light band? what are the two tick marks?* They will guess wrong, lose trust, and dismiss the surface. Nielsen H6 (recognition over recall) is being violated for the sake of saving 15 vertical pixels.

**Fix:** Above (or below) the first instance of the novel viz, render a one-line legend with **a swatch + label per visual layer**. For range bands: solid pill ("At your current budget") + dashed pill ("Forecast range at new budget") + tick mark icon ("Model's median"). The legend is part of the recipe — not an afterthought.

**Osmos signal:** if the recipe uses a viz that isn't already in `component-recipes.md`, the recipe MUST include a `BandLegend`-style strip. No exceptions for "the bars are self-explanatory" — they're not.

---

### 12. Layout-Shift Reveal

**Symptom:** Clicking a "Show more" / "Use my own number" / "Advanced options" button reveals new content that appears instantly, pushing every neighbor down/sideways. The wallet card just dropped 40px. The user lost their scroll position.

**Why it's bad:** Doherty Threshold says interactions feel responsive under 400ms. Layout shift IS a response — but it's the wrong response. The eye tracks the jump as motion, the brain registers it as friction, the user pauses to re-orient. Cumulative Layout Shift (CLS) is also a Core Web Vital that Google penalizes for ranking. Beyond that: this is the canonical anti-delight beat — a moment that should feel additive (the user asked for the affordance) instead feels like the page broke.

**Fix:** Reserve the vertical space for the to-be-revealed content via `min-height` on the parent (or use CSS Grid with implicit rows). Animate the reveal with a 150ms slide-in (`from { opacity: 0; transform: translateY(-4px) } to { opacity: 1; transform: translateY(0) }`). The neighbor doesn't move; the new content fades-and-slides into the reserved slot. Wrap in `prefers-reduced-motion` per the constraints file.

**Osmos signal:** any `{conditional && <Block />}` that mounts/unmounts a chunk taller than 24px needs space reservation OR a slide-in animation. Both are better.

---

### 13. Quiet Trust Signal

**Symptom:** The piece of information most relevant to the user's decision is rendered as the smallest, lowest-contrast type on the surface. The "78% confidence" chip on a forecast. The "based on 28 days of data" caveat under a recommendation. The "synced 2 minutes ago" indicator on a dashboard. The decision-pivot signal that the entire recipe is asking the user to trust — buried as a 10px muted gray afterthought.

**Why it's bad:** Hick's Law penalises adding options at equal weight, but the inverse failure mode is also real: when the *most* decision-relevant signal is at *less* visual weight than peripheral chrome (the section title, the section icon, the breadcrumb), the user's eye never lands on it. They skip the signal that would have built trust, then later complain "I didn't know how confident the AI was." It was on the screen, but it wasn't designed to be read.

**Fix:** Identify the trust pivot — the one piece of information that, if the user notices it, makes the rest of the recipe credible. Promote it to medium emphasis: 11px (not 10), `--osmos-brand-primary-muted` background instead of `--osmos-bg-subtle`, `--osmos-brand-primary` text instead of `--osmos-fg-muted`. Make it interactive (`:hover`/`:focus`) — give the user something to click to learn more. The chip should look like an affordance, not a footnote.

**Osmos signal:** every Sofie suggestion has a confidence score. Every projection has a confidence interval. Every BYOT funnel stage has an attribution-quality flag. These are the trust pivots. They are NOT footnotes. Promote them.

---

## How to use this file

When checking a recipe at Phase 4:

1. Walk down all 10 traps
2. For each trap, ask "Does this recipe trigger this trap?"
3. If yes, NAME the trap in the recipe's anti-pattern section, explain how the recipe avoids it (specifically, not vaguely)
4. If the recipe DOES trigger a trap, propose the specific fix from this file before producing final output

Don't silently fix. Naming the trap is part of teaching the user — and part of building Osmos's design discipline over time.
