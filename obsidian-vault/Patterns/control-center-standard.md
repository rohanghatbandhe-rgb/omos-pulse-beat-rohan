---
type: pattern-registry
section: control-center
last-updated: 2026-05-06
updated-by: ui-consistency-enforcer
status: canonical
---

# Osmos Pulse — Control Center UI Pattern Registry

> **Auto-maintained** by `ui-consistency-enforcer` after every consistency pass.  
> **Read by** `ux-ideator` (Phase 2 IA Map + Phase 3 Lo-fi) before proposing any new screen layout.  
> Do not edit manually — run `/ui-consistency-enforcer --update-patterns` to regenerate.

---

## Pattern 1 — Data Management List (most common screen type)

Used by: [[Pages/AdvertiserManagementPage]], [[Pages/ManageSegmentsPage]], [[Pages/ManageAttributesPage]], [[Pages/ManageCPMRulesPage]], [[Pages/AutomatedRulesPage]], [[Pages/OpsUsersPage]], [[Pages/ActivityLogPage]]

### Outer wrapper
```jsx
<div style={{
  fontFamily: "'Open Sans', sans-serif",
  background: 'var(--osmos-bg-subtle)',
  minHeight: '100vh',
  padding: '20px 24px',
}}>
```

### Section card container
```jsx
<div style={{
  background: 'var(--osmos-bg)',
  border: '1px solid var(--osmos-border)',
  borderRadius: 10,
  overflow: 'hidden',
}}>
```
Component: [[Components/molecules/SectionCard]] — use `SectionCard` from `src/ui` when available.

### Toolbar (search + filters + actions)
```jsx
<div style={{
  padding: '12px 16px',
  borderBottom: '1px solid var(--osmos-border)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
}}>
  {/* left: search + filters */}
  {/* right: secondary actions + primary CTA */}
</div>
```
Components: [[Components/molecules/SearchBar]], [[Components/molecules/Toolbar]]

### Table header `<th>`
```jsx
style={{
  padding: '9px 14px',
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: 'var(--osmos-fg-muted)',
  background: 'var(--osmos-bg-subtle)',
  borderBottom: '1px solid var(--osmos-border)',
  whiteSpace: 'nowrap',
  textAlign: 'left',
}}
```

### Table row `<td>`
```jsx
style={{
  padding: '10px 14px',
  fontSize: 13,
  color: 'var(--osmos-fg)',
  borderBottom: '1px solid var(--osmos-border)',
  verticalAlign: 'middle',
}}
```

### Table row hover states
```jsx
// default background: 'var(--osmos-bg)'
// hover:             'var(--osmos-bg-subtle)'
// selected:          'var(--osmos-brand-primary-muted)'
// cursor: 'pointer', transition: 'background 0.1s'
```

### Empty state (inside table)
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

### Pagination
Component: [[Components/molecules/Pagination]] — always at bottom of SectionCard, below table.

---

## Pattern 2 — Status Badges

| Use case | Component | Import |
|---|---|---|
| Standard entity status (Active/Inactive/Paused/Live/Draft/Error) | `<Badge status={value}>` | `import { Badge } from '../../ui'` |
| Custom type labels with domain colors (persona, segment type, access level) | `<TypeBadge type={value} colorMap={LOCAL_MAP}>` | `import { TypeBadge } from '../../ui/atoms/Badge'` |
| Never | inline `<span>` with hardcoded hex | — |

Component: [[Components/atoms/Badge]]

---

## Pattern 3 — Buttons

| Use case | Variant | Notes |
|---|---|---|
| Primary CTA (Create, Save, Confirm) | `<Button variant="primary">` | One per toolbar max |
| Secondary / filter actions | `<Button variant="outline">` | |
| Ghost actions (icon-only, row actions) | `<Button variant="ghost">` | |
| Destructive (Delete, Remove) | `<Button variant="outline" style={{ color: '#EF4444', borderColor: '#EF4444' }}>` | Intentional semantic hex — not a token violation |
| Never | raw `<button>` | Always use Button from `src/ui` |

Component: [[Components/atoms/Button]]

---

## Pattern 4 — Drawers

| Size | Use case | Width |
|---|---|---|
| Standard | Single-entity edit (6 tabs max) | `560px` |
| Wide | Bulk edit / upload flows | `700px` |

Structure: Tab bar at top → Tab content below → Footer with Save/Cancel always visible.  
Component: [[Components/molecules/Drawer]]

**Tabbed drawer pattern** (established in [[Pages/AdvertiserManagementPage]]):
- 6 tabs max per drawer
- Each tab is independently saveable
- Attribution/high-risk tabs: read-only → Edit gate → form
- Simple dropdown tabs: immediately editable on open

---

## Pattern 5 — Bulk Action Bar

Appears when checkbox selection count > 0. Slides in from bottom of table.

```jsx
// Trigger: selected.length > 0
// Actions: limited to non-risky bulk operations only
// Attribution changes: file-only (never bulk via UI in v1)
// Persona + AM changes: bulk UI supported
```

Established in: [[Pages/AdvertiserManagementPage]]

---

## Pattern 6 — Upload / Bulk Edit Flow

3-step pattern (established in AdvertiserManagementPage BulkEditDrawer):
1. Download pre-filled template (CSV)
2. Upload filled file → drag-drop or file picker
3. Validation table → errors highlighted → confirm

Component: [[Components/molecules/UploadDropzone]]

---

## Pattern 7 — History / Audit Log Tab

Two surfaces always ship together:
- **Portfolio-level**: tab on the list screen (page-level tab with badge count)
- **Per-entity**: tab inside the detail drawer

Column standard: Timestamp · Changed Field · Change Type · Old Value → New Value · Changed By

Filters: Field Name, User, Date Range

---

## Atoms inventory (relevant to Control Center screens)

| Atom | Import path | Used for |
|---|---|---|
| `Button` | `../../ui/atoms/Button` | All CTAs and actions |
| `Badge` | `../../ui/atoms/Badge` | Status labels |
| `TypeBadge` | `../../ui/atoms/Badge` | Custom type labels |
| `Checkbox` | `../../ui/atoms/Checkbox` | Row selection, bulk select |
| `Input` | `../../ui/atoms/Input` | Search fields, form fields |
| `Select` | `../../ui/atoms/Input` | Filter dropdowns, form selects |
| Named icons | `../../ui/atoms/Icon` | All icon usage — never raw SVG |

## Molecules inventory (relevant to Control Center screens)

| Molecule | Import path | Used for |
|---|---|---|
| `SearchBar` | `../../ui/molecules/SearchBar` | Page-level search |
| `Toolbar` | `../../ui/molecules/Toolbar` | Filter + action bar |
| `Drawer` | `../../ui/molecules/Drawer` | All side panels |
| `Pagination` | `../../ui/molecules/Pagination` | Table pagination |
| `SectionCard` | `../../ui/molecules/SectionCard` | Card containers |
| `InfoBanner` | `../../ui/molecules/InfoBanner` | Alerts and warnings |
| `UploadDropzone` | `../../ui/molecules/UploadDropzone` | File upload areas |
| `EmptyState` | `../../ui/molecules/EmptyState` | No-data states |

---

## T4 — Known exceptions (not violations)

These patterns deviate from the standard intentionally and should never be flagged:

| File | Pattern | Reason |
|---|---|---|
| Any page | `'#EF4444'` for destructive/churned states | Semantic red — no osmos token for this |
| ManageCPMRulesPage | Gradient slider using `#EF4444`/`#22C55E` | Audience reach visualization — intentional data-viz palette |
| AdvertiserManagementPage | `RETAILER_ATTR_LIMITS` ceiling clamp with amber flash | Delight pattern from Zara pass |
