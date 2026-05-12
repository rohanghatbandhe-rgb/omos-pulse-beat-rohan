import { useState } from 'react';
import {
  LuChevronRight,
  LuChevronUp,
} from 'react-icons/lu';

/**
 * NavShell — shared left-nav chrome for all Osmos portals.
 *
 * Item shape:
 *   { id, label, icon, dividerBefore?, badge?,
 *     hasSub?,      // true → renders a › chevron, caller handles via subnavPanel prop
 *     subItems?     // [{ id, label, icon?, active, onClick }] → inline expand inside rail
 *   }
 *
 * ⚠️  icon must now be a React component reference (not a JSX element / SVG fragment).
 *      Example: import { LuRocket } from 'react-icons/lu'; → { icon: LuRocket }
 *      Or use any component from @icons/index (os-icons-v2 brand set).
 *
 * Props:
 *   items         Item[]
 *   bottomItems   Item[]        — pinned above the avatar footer
 *   activeId      string        — currently highlighted top-level item
 *   onSelect      (id) => void  — called for items without subItems
 *   logoMark      ReactNode     — always visible (icon/mark), e.g. <OsmosLogoMark />
 *   logoText      string        — wordmark shown only when expanded, e.g. "OSMOS"
 *   logoBadge     string        — optional pill shown only when expanded, e.g. "PRO"
 *   userInitial   string        — shown in avatar circle (default 'U')
 *   subnavPanel   ReactNode     — rendered beside the rail (retailer side-panel pattern)
 */
export function NavShell({
  items = [],
  bottomItems = [],
  activeId,
  onSelect,
  logoMark,
  logoText,
  logoBadge,
  userInitial = 'U',
  subnavPanel,
}) {
  const [isHovered, setIsHovered] = useState(false);
  // Track which items with subItems are open
  const [openIds, setOpenIds] = useState(() => {
    // Auto-open item whose subItem is currently active
    const active = items.find(i => i.subItems?.some(s => s.active));
    return active ? new Set([active.id]) : new Set();
  });

  const wide = isHovered || !!subnavPanel;

  function handleItemClick(item) {
    if (item.subItems?.length) {
      setOpenIds(prev => {
        const next = new Set(prev);
        next.has(item.id) ? next.delete(item.id) : next.add(item.id);
        return next;
      });
    } else {
      onSelect?.(item.id);
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', flexShrink: 0 }}>

      {/* ── Main rail ─────────────────────────────────────────────── */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: wide ? 256 : 68,
          minHeight: '100vh',
          background: 'var(--osmos-nav-bg)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          overflow: 'hidden',
          transition: 'width 0.25s ease',
          fontFamily: "'Open Sans', sans-serif",
        }}
      >
        {/* Logo header */}
        <div style={{
          height: 80, flexShrink: 0,
          display: 'flex', alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '0 16px',
          gap: 10,
          borderBottom: '1px solid var(--osmos-nav-border)',
        }}>
          {/* Mark — always visible; clicking navigates to landing */}
          <a href="/" style={{ display: 'flex', flexShrink: 0, cursor: 'pointer' }}>
            {logoMark}
          </a>

          {/* Wordmark + badge — only when expanded */}
          {wide && logoText && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{
                fontSize: 15, fontWeight: 700, color: '#fff',
                letterSpacing: 0.5, whiteSpace: 'nowrap',
              }}>
                {logoText}
              </span>
              {logoBadge && (
                <span style={{
                  fontSize: 9, fontWeight: 700, color: '#fff',
                  background: 'var(--osmos-brand-amber)', borderRadius: 3,
                  padding: '1px 6px', letterSpacing: 0.3, alignSelf: 'flex-start',
                  whiteSpace: 'nowrap',
                }}>
                  {logoBadge}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Main items */}
        <div style={{
          flex: 1, padding: '8px 6px',
          overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: 2,
        }}>
          {items.map(item => (
            <div key={item.id}>
              <NavRailItem
                item={item}
                active={activeId === item.id}
                wide={wide}
                isOpen={openIds.has(item.id)}
                onClick={() => handleItemClick(item)}
              />

              {/* Inline sub-items (advertiser pattern) */}
              {wide && openIds.has(item.id) && item.subItems?.length > 0 && (
                <div style={{
                  marginLeft: 8, marginTop: 4,
                  display: 'flex', flexDirection: 'column', gap: 2,
                }}>
                  {item.subItems.map(sub => (
                    <SubRailItem key={sub.id} item={sub} onClick={sub.onClick} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom items + avatar */}
        <div style={{
          padding: '8px 6px 12px', flexShrink: 0,
          borderTop: '1px solid var(--osmos-nav-border)',
          display: 'flex', flexDirection: 'column', gap: 2,
        }}>
          {bottomItems.map(item => (
            <NavRailItem
              key={item.id}
              item={item}
              active={false}
              wide={wide}
              isOpen={false}
              onClick={() => onSelect?.(item.id)}
              muted
            />
          ))}

          {/* User avatar */}
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'var(--osmos-nav-accent)',
            margin: '4px 12px 2px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {userInitial}
          </div>
        </div>
      </div>

      {/* ── Optional side sub-nav panel (retailer pattern) ────────── */}
      {subnavPanel}
    </div>
  );
}

// ── NavIcon helper ────────────────────────────────────────────────────────────
// Renders a react-icons / os-icons-v2 component reference with size + color.
function NavIcon({ icon: Ic, size, color }) {
  if (!Ic) return null;
  return <Ic size={size} color={color} />;
}

// ── NavRailItem ───────────────────────────────────────────────────────────────
function NavRailItem({ item, active, wide, isOpen, onClick, muted = false }) {
  const [hover, setHover] = useState(false);

  const iconColor = muted
    ? 'rgba(255,255,255,0.45)'
    : active ? 'var(--osmos-nav-accent)' : 'rgba(255,255,255,0.5)';

  const labelColor = muted
    ? 'rgba(255,255,255,0.65)'
    : active ? '#fff' : 'rgba(255,255,255,0.75)';

  const bg = active
    ? 'var(--osmos-nav-active-bg)'
    : hover ? 'rgba(255,255,255,0.08)' : 'transparent';

  const ChevronIcon = isOpen ? LuChevronUp : LuChevronRight;

  return (
    <>
      {item.dividerBefore && (
        <div style={{ height: 1, background: 'var(--osmos-nav-border)', margin: '6px 0' }} />
      )}
      <button
        title={!wide ? item.label : undefined}
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          width: '100%', height: 44, flexShrink: 0,
          display: 'flex', alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 12,
          padding: '0 12px',
          background: bg,
          border: 'none', borderRadius: 8, cursor: 'pointer',
          transition: 'background 0.15s',
          textAlign: 'left',
          whiteSpace: 'nowrap', overflow: 'hidden',
        }}
      >
        {/* Icon — always left-pinned, never centred. size=20 matches nav density. */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <NavIcon icon={item.icon} size={20} color={iconColor} />
        </div>

        {/* Label + badge + chevron — visible only when wide */}
        {wide && (
          <>
            <span style={{
              flex: 1, fontSize: 13,
              fontWeight: active ? 600 : 400,
              color: labelColor,
            }}>
              {item.label}
            </span>

            {item.badge && (
              <span style={{
                padding: '2px 7px',
                background: 'var(--osmos-brand-amber)',
                color: '#fff', fontSize: 11,
                borderRadius: 999, flexShrink: 0,
              }}>
                {item.badge}
              </span>
            )}

            {(item.hasSub || item.subItems?.length > 0) && (
              <ChevronIcon
                size={13}
                color={active ? 'var(--osmos-nav-accent)' : 'rgba(255,255,255,0.3)'}
              />
            )}
          </>
        )}
      </button>
    </>
  );
}

// ── SubRailItem — indented inline sub-item (advertiser pattern) ───────────────
function SubRailItem({ item, onClick }) {
  const [hover, setHover] = useState(false);
  const color = item.active || hover ? '#fff' : 'rgba(255,255,255,0.7)';

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '0 12px', height: 40, borderRadius: 8,
        cursor: 'pointer', transition: 'background 0.15s',
        background: item.active ? 'var(--osmos-nav-accent)' : hover ? 'rgba(255,255,255,0.08)' : 'transparent',
        whiteSpace: 'nowrap', overflow: 'hidden',
      }}
    >
      {item.icon && (
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <NavIcon icon={item.icon} size={18} color={color} />
        </div>
      )}
      <span style={{ fontSize: 13, fontWeight: item.active ? 600 : 400, color }}>
        {item.label}
      </span>
    </div>
  );
}
