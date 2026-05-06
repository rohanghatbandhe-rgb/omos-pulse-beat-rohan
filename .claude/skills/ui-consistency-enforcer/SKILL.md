---
name: ui-consistency-enforcer
description: >
  Cross-page UI consistency auditor and auto-fixer for the Osmos Pulse portal. Scans multiple JSX pages in a section (Control Center, Finance, Analytics, etc.) and enforces a single visual standard across table headers, table rows, page wrappers, status badges, border radius, and spacing. Use whenever someone says "make the UI consistent", "check consistency", "pages look different", "standardize the design", "UI drift", or when reviewing a section before a release. Also run after any batch of new pages is shipped. Produces a diff-table of violations and auto-applies fixes file by file. Distinct from token-enforcer (which fixes individual color values) and component-reuse-enforcer (which fixes duplicate components) — this skill fixes *structural layout drift* across pages.
---

# UI Consistency Enforcer

Scans a set of JSX pages against the **Osmos Control Center Standard** and auto-fixes every deviation. The standard is derived from the most recent reference-quality page in the section (`AdvertiserManagementPage.jsx` as of May 2026).

## The Two Other Skills This Complements

- **`token-enforcer`** — fixes hardcoded hex/rgba values → run it first or after this skill to catch color drift
- **`component-reuse-enforcer`** — fixes locally-defined components that duplicate `src/ui/` exports → run it to fix badge/button duplication

This skill fixes everything in between: the structural layout values that aren't component choices and aren't token violations, but drift from page to page because each was written independently.

---

## The Osmos Control Center Standard

These values are the single source of truth. Every page in Pulse Control Center must match these exactly.

### Page Layout
| Property | Standard value |
|---|---|
| Outer wrapper padding | `padding: '20px 24px'` |
| Outer wrapper background | `background: 'var(--osmos-bg-subtle)'` |
| Section card border-radius | `borderRadius: 10` |
| Section card border | `border: '1px solid var(--osmos-border)'` |
| Section card background | `background: 'var(--osmos-bg)'` |

### Table Headers (`<th>`)
| Property | Standard value |
|---|---|
| padding | `'9px 14px'` |
| fontSize | `11` |
| fontWeight | `600` |
| textTransform | `'uppercase'` |
| letterSpacing | `'0.04em'` |
| color | `'var(--osmos-fg-muted)'` |
| background | `'var(--osmos-bg-subtle)'` |
| borderBottom | `'1px solid var(--osmos-border)'` |
| whiteSpace | `'nowrap'` |
| textAlign | `'left'` |

### Table Rows (`<td>`)
| Property | Standard value |
|---|---|
| padding | `'10px 14px'` |
| fontSize | `13` |
| color | `'var(--osmos-fg)'` |
| borderBottom | `'1px solid var(--osmos-border)'` |
| verticalAlign | `'middle'` |

### Table Row Hover
| Property | Standard value |
|---|---|
| background (default) | `'var(--osmos-bg)'` |
| background (hover) | `'var(--osmos-bg-subtle)'` |
| background (selected) | `'var(--osmos-brand-primary-muted)'` |
| cursor | `'pointer'` |
| transition | `'background 0.1s'` |

### Toolbar / Section Header
| Property | Standard value |
|---|---|
| padding | `'12px 16px'` |
| borderBottom | `'1px solid var(--osmos-border)'` |
| display | `'flex'` |
| alignItems | `'center'` |
| justifyContent | `'space-between'` |

### Empty State (inside table)
```jsx
<tr>
  <td colSpan={N} style={{
    padding: '48px 24px',
    textAlign: 'center',
    color: 'var(--osmos-fg-muted)',
    fontSize: 13,
  }}>
    No [entities] found.
  </td>
</tr>
```

### Status Badges
- Always use `<Badge status={value}>` imported from `'../../ui'`
- Never use inline `<span>` with hardcoded background/color for status
- For custom type badges (persona, segment type, etc.): use `<TypeBadge type={value} colorMap={LOCAL_MAP}>`

### Buttons
- Primary CTA: `<Button variant="primary">`
- Secondary / filter actions: `<Button variant="outline">`
- Destructive: `<Button variant="outline" style={{ color: '#EF4444', borderColor: '#EF4444' }}>` (intentional semantic exception)
- Never use raw `<button>` elements — always `Button` from `'../../ui'`

### Typography (page-level)
| Element | Standard |
|---|---|
| Page section title | `fontSize: 14, fontWeight: 600, color: 'var(--osmos-fg)'` |
| Toolbar label / field label | `fontSize: 12, fontWeight: 600, color: 'var(--osmos-fg-muted)'` |
| Table cell body text | `fontSize: 13, color: 'var(--osmos-fg)'` |
| Table cell secondary | `fontSize: 12, color: 'var(--osmos-fg-muted)'` |
| Badge / chip text | `fontSize: 11, fontWeight: 600` |

---

## Arguments

| Argument | Behavior |
|---|---|
| `--dir <path>` | Scan all `.jsx` files under that directory (default: `src/retailer/components/`) |
| `--section <name>` | Only fix pages belonging to a nav section (e.g. `control-center`, `finance`) |
| `--file <path>` | Fix a single named file |
| `--no-fix` | Audit only — produce the violation table, apply zero edits |
| `--standard <path>` | Override the reference standard with a different page (default: `AdvertiserManagementPage.jsx`) |

---

## Phase 0 — Identify scope

**Before scanning any files, read `obsidian-vault/Patterns/control-center-standard.md`** to load the current canonical standard. The Standard tables in this skill file are the source of truth, but the Obsidian registry may contain newer T4 exceptions or component additions discovered in recent runs. Merge any additions into your working standard before proceeding.

Parse arguments. Default scope: all `.jsx` files in `src/retailer/components/` that contain an HTML `<table>` or `<Table` element (i.e. are data pages, not utility components or helpers).

Exclude:
- `LeftNav.jsx`, `TopBar.jsx`, `StatCards.jsx`, `Charts.jsx` — shell/layout components
- `DataTable.jsx` — shared utility
- Files under `src/advertiser/` — different portal, different standard

---

## Phase 1 — Scan and classify violations

For each file in scope, check every property in the Standard table above. Classify each violation:

| Tier | Condition | Action |
|---|---|---|
| **T1 — Auto-fix** | Wrong value for a Standard property (wrong padding, wrong font-weight, wrong text-transform, etc.) | Edit directly |
| **T2 — Auto-fix with import** | Inline `<span>` badge where `<Badge>` or `<TypeBadge>` should be used | Add import, replace span |
| **T3 — Auto-fix with import** | Raw `<button>` where `<Button>` should be used | Add import, replace button |
| **T4 — Flag only** | Structural layout issue that requires understanding business logic to fix (e.g. a different number of columns, a conditional empty state with domain text) | Flag in report, don't auto-fix |

---

## Phase 2 — Report

Before applying any fixes, emit the violation table:

```
## UI Consistency Audit — [Section Name]

**Standard:** AdvertiserManagementPage.jsx
**Files scanned:** N
**Violations found:** X (T1: A, T2: B, T3: C, T4: D flagged-only)

| File | Property | Current value | Standard value | Tier |
|------|----------|--------------|----------------|------|
| ManageSegmentsPage.jsx | th padding | 10px 12px | 9px 14px | T1 |
| ManageSegmentsPage.jsx | th textTransform | (none) | uppercase | T1 |
| ActivityLogPage.jsx | status badge | inline <span> | <Badge status={}> | T2 |
| ...

### T4 — Flagged, not auto-fixed
- ManageCPMRulesPage.jsx: gradient slider uses #EF4444/#22C55E — intentional semantic colors, confirm before replacing
```

If `--no-fix`, stop here.

---

## Phase 3 — Apply fixes (T1, T2, T3)

Process files one at a time. For each file:

1. Read the file in full
2. Apply all T1 fixes (style value replacements) via `Edit`
3. Apply T2/T3 fixes (add imports if not already present, replace components)
4. Run `pnpm build` after every **3 files** to catch cascading errors early

After all files:
```bash
cd "/Users/rishikeshjoshi/OMOS TEST" && pnpm build 2>&1 | tail -5
```

Must show `✓ built in` with 0 errors.

---

## Phase 4 — Summary

```
## UI Consistency Enforcer — Done

**Files fixed:** N
**T1 fixes applied:** A (style value standardisation)
**T2 fixes applied:** B (inline badge → Badge component)
**T3 fixes applied:** C (raw button → Button component)
**T4 flagged:** D (manual review needed)

**Build:** ✓ clean

### What changed (per file)
- ManageSegmentsPage.jsx: th padding, th textTransform, th letterSpacing, td fontSize
- ManageAttributesPage.jsx: borderRadius 8→10, th textTransform, td fontSize
- ...

### T4 items still pending (action required from you)
- ...
```

---

## Cross-skill handoff

After this skill completes, the following should also be run if not done recently:
- **`token-enforcer`** — catches any remaining hardcoded hex values this skill didn't touch
- **`component-reuse-enforcer`** — catches locally-defined StatusBadge/TypeBadge functions this skill's T2 pass may have missed

---

## Obsidian Pattern Registry Integration

After every consistency pass (whether fixes were applied or audit-only), update the pattern registry at `obsidian-vault/Patterns/control-center-standard.md`.

**What to update:**
- `last-updated` frontmatter field → today's date (ISO format)
- `updated-by` → `ui-consistency-enforcer`
- If any T4 exceptions were newly discovered → add them to the "T4 — Known exceptions" table
- If any new component was promoted from inline to library usage → update the Atoms/Molecules inventory tables
- If a new page was fixed → add it to the "Used by:" list under the relevant pattern

**What NOT to overwrite:**
- The Standard values tables (those are the source of truth, only change via deliberate team decision)
- The wikilink structure ([[Pages/X]], [[Components/X]])
- The T4 exceptions already documented

The pattern registry is the handoff point to ux-ideator. Keep it accurate so every new screen starts from current knowledge, not from scratch.
