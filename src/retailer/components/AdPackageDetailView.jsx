import React, { useState, useRef } from 'react';
import { SearchIcon } from '../../ui/atoms/Icon';

// ─── Semantic color constants (single source of truth) ────────────────────────
const C = {
  amber:      '#d97706',
  amberBg:    'rgba(217,119,6,0.08)',
  amberBdr:   'rgba(217,119,6,0.35)',
  // All pending states use amber/orange — no purple
  purple:     '#d97706',
  purpleBg:   'rgba(217,119,6,0.08)',
  purpleBdr:  'rgba(217,119,6,0.35)',
  green:      '#16a34a',
  greenBg:    'rgba(22,163,74,0.08)',
  greenBdr:   '#16a34a',
  red:        '#ef4444',
  redBg:      'rgba(239,68,68,0.08)',
  redBdr:     '#ef4444',
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const BackIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const ChevronDown = ({ open }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
    strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const AlertIcon = ({ color, size = 11 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const CheckCircleIcon = ({ color, size = 11 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const ImageIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--osmos-fg-subtle)" strokeWidth="1.5" strokeLinecap="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
  </svg>
);
const TickIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const CrossIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ─── Shared typography & spacing tokens ───────────────────────────────────────
const FONT = "'Open Sans', sans-serif";

const labelStyle = { fontSize: 11, fontWeight: 700, color: 'var(--osmos-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: FONT };
const valueStyle = { fontSize: 13, fontWeight: 500, color: 'var(--osmos-fg)', fontFamily: FONT };
const sectionTitleStyle = { fontSize: 13, fontWeight: 700, color: 'var(--osmos-fg)', fontFamily: FONT };

// ─── Card shell ───────────────────────────────────────────────────────────────
// Each of the 3 panels is an independent card over the bg
function Card({ style, children }) {
  return (
    <div style={{
      background: 'var(--osmos-bg)',
      border: '1px solid var(--osmos-border)',
      borderRadius: 10,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      ...style,
    }}>
      {children}
    </div>
  );
}

function CardHeader({ children, style }) {
  return (
    <div style={{
      background: '#FAFAFA',
      borderBottom: '1px solid var(--osmos-border)',
      padding: '0 16px',
      minHeight: 52,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
      ...style,
    }}>
      {children}
    </div>
  );
}

function CardBody({ children, style, innerRef }) {
  return (
    <div ref={innerRef} style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg)', ...style }}>
      {children}
    </div>
  );
}

// ─── Status pill ──────────────────────────────────────────────────────────────
function StatusPill({ status }) {
  const map = {
    Pending:  { bg: C.amberBg,  color: C.amber },
    Rejected: { bg: C.redBg,    color: C.red   },
    Approved: { bg: C.greenBg,  color: C.green },
  };
  const s = map[status] || map.Approved;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', borderRadius: 20, padding: '2px 9px', fontSize: 11, fontWeight: 600, background: s.bg, color: s.color, fontFamily: FONT }}>
      {status}
    </span>
  );
}

// ─── Pending badge ────────────────────────────────────────────────────────────
function PendingBadge({ count, type }) {
  if (!count) return null;
  const isKw = type === 'keyword';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600,
      color: isKw ? C.amber : C.purple,
      background: isKw ? C.amberBg : C.purpleBg,
      borderRadius: 20, padding: '2px 8px', fontFamily: FONT }}>
      <AlertIcon color={isKw ? C.amber : C.purple} size={10} />
      {count} {type === 'keyword' ? `keyword${count !== 1 ? 's' : ''}` : `creative${count !== 1 ? 's' : ''}`} pending
    </span>
  );
}

// ─── Accordion ────────────────────────────────────────────────────────────────
function Accordion({ title, children, defaultOpen = false, titleRight }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ border: '1px solid var(--osmos-border)', borderRadius: 8, overflow: 'hidden', marginBottom: 10 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '11px 14px', background: '#FAFAFA',
          border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 13, fontWeight: 600, color: 'var(--osmos-fg)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {title}
          {titleRight}
        </span>
        <ChevronDown open={open} />
      </button>
      {open && (
        <div style={{ padding: '16px 14px', borderTop: '1px solid var(--osmos-border)', background: 'var(--osmos-bg)' }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Flush Accordion (no surrounding border, just header row that toggles) ───
function FlushAccordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', background: 'transparent',
          border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 13, fontWeight: 600, color: 'var(--osmos-fg)' }}>
        <span>{title}</span>
        <ChevronDown open={open} />
      </button>
      {open && (
        <div style={{ padding: '4px 16px 14px', borderTop: '1px solid var(--osmos-border)' }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Review item card (unified visual for Audience / Keywords / Creative) ────
function ReviewItemCard({ name, subtitle, status, selected = false, disabled = false, onClick }) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        padding: '12px 14px', borderRadius: 8, marginBottom: 8,
        cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
        opacity: disabled ? 0.55 : 1,
        border: `1px solid ${selected ? '#1970E1' : 'var(--osmos-border)'}`,
        background: selected ? '#e8f1fc' : 'var(--osmos-bg)',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: selected ? '#1970E1' : 'var(--osmos-fg)', fontFamily: FONT,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, flex: 1 }}>
          {name}
        </span>
        <span style={{ flexShrink: 0 }}>{status}</span>
      </div>
      {subtitle && (
        <span style={{ fontSize: 11, color: 'var(--osmos-fg-muted)', fontFamily: FONT }}>
          {subtitle}
        </span>
      )}
    </div>
  );
}

// ─── Info row ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--osmos-fg-muted)', fontFamily: FONT, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--osmos-fg)', fontFamily: FONT }}>{value}</div>
    </div>
  );
}

// ─── Info group (visual grouping with divider, no title) ─────────────────────
function InfoGroup({ children }) {
  return (
    <div style={{ paddingBottom: 4, marginBottom: 16, borderBottom: '1px solid var(--osmos-border)' }}>
      {children}
    </div>
  );
}

// ─── Section title (used inside Card 1 to group Inventory / Targeting / Campaign) ─
function SectionTitle({ children }) {
  return (
    <div style={{
      fontSize: 12, fontWeight: 600, color: 'var(--osmos-fg)', fontFamily: FONT,
      padding: '8px 12px', marginBottom: 12,
      marginLeft: -14, marginRight: -14,
      background: '#FAFAFA',
      borderTop: '1px solid var(--osmos-border)',
      borderBottom: '1px solid var(--osmos-border)',
    }}>
      <span style={{ paddingLeft: 2 }}>{children}</span>
    </div>
  );
}

// ─── Action button (Approve / Reject) ─────────────────────────────────────────
function ActionBtn({ variant, onClick, children }) {
  const styles = {
    approve: { border: `1px solid ${C.greenBdr}`, background: C.greenBg, color: C.green },
    reject:  { border: `1px solid ${C.redBdr}`,   background: C.redBg,   color: C.red   },
  };
  const s = styles[variant];
  return (
    <button onClick={onClick}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px',
        borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: FONT, ...s }}>
      {children}
    </button>
  );
}

// ─── Bulk approve button ──────────────────────────────────────────────────────
function BulkApproveBtn({ count, onClick }) {
  return (
    <button onClick={onClick}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px',
        borderRadius: 6, border: `1px solid ${C.greenBdr}`, background: C.greenBg,
        color: C.green, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>
      <TickIcon /> Approve All ({count})
    </button>
  );
}

// ─── Keyword table ────────────────────────────────────────────────────────────
function KeywordTable({ keywords, onAction, onApproveAll, innerRef }) {
  const pending = keywords.filter(k => k.status === 'Pending').length;
  const TH = { padding: '9px 14px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--osmos-fg-muted)', background: 'var(--osmos-bg-subtle)', borderBottom: '1px solid var(--osmos-border)', whiteSpace: 'nowrap', textAlign: 'left', fontFamily: FONT };
  const TD = { padding: '10px 14px', fontSize: 13, color: 'var(--osmos-fg)', borderBottom: '1px solid var(--osmos-border)', verticalAlign: 'middle', fontFamily: FONT };

  return (
    <div ref={innerRef} style={{ marginBottom: 12 }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <span style={sectionTitleStyle}>Keyword Targeting</span>
        {pending === 0 && keywords.length > 0 && (
          <span style={{ marginLeft: 8, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: C.green, fontFamily: FONT }}>
            <CheckCircleIcon color={C.green} size={11} /> All reviewed
          </span>
        )}
      </div>

      {/* Table */}
      <div style={{ borderRadius: 8, border: '1px solid var(--osmos-border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={TH}>Keyword</th>
              <th style={TH}>Match Type</th>
              <th style={TH}>Max Bid</th>
              <th style={TH}>Status</th>
              <th style={{ ...TH, textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {keywords.length === 0 ? (
              <tr><td colSpan={5} style={{ ...TD, textAlign: 'center', color: 'var(--osmos-fg-muted)', padding: '24px 14px' }}>No keywords for this line item.</td></tr>
            ) : keywords.map((kw, i) => (
              <tr key={kw.id} style={{ background: i % 2 === 0 ? 'var(--osmos-bg)' : 'rgba(0,0,0,0.012)' }}>
                <td style={{ ...TD, fontWeight: 500 }}>{kw.keyword}</td>
                <td style={{ ...TD, color: 'var(--osmos-fg-muted)' }}>{kw.matchType}</td>
                <td style={{ ...TD, color: 'var(--osmos-fg-muted)' }}>{kw.bid}</td>
                <td style={TD}><StatusPill status={kw.status} /></td>
                <td style={{ ...TD, textAlign: 'center' }}>
                  {kw.status === 'Pending' ? (
                    <span style={{ display: 'inline-flex', gap: 6 }}>
                      <ActionBtn variant="approve" onClick={() => onAction('keyword', kw.id, 'approve')}><TickIcon /> Approve</ActionBtn>
                      <ActionBtn variant="reject"  onClick={() => onAction('keyword', kw.id, 'reject')} ><CrossIcon /> Reject</ActionBtn>
                    </span>
                  ) : <span style={{ color: 'var(--osmos-fg-subtle)', fontSize: 12 }}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Creative card ────────────────────────────────────────────────────────────
function CreativeCard({ creative, onAction }) {
  return (
    <div style={{ border: '1px solid var(--osmos-border)', borderRadius: 8, overflow: 'hidden', background: 'var(--osmos-bg)' }}>
      <div style={{ background: 'var(--osmos-bg-subtle)', height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--osmos-border)' }}>
        <ImageIcon />
      </div>
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--osmos-fg)', fontFamily: FONT, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{creative.name}</div>
        <div style={{ fontSize: 11, color: 'var(--osmos-fg-muted)', fontFamily: FONT, marginBottom: 8 }}>{creative.format}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <StatusPill status={creative.status} />
          {creative.status === 'Pending' && (
            <span style={{ display: 'inline-flex', gap: 5 }}>
              <button onClick={() => onAction('creative', creative.id, 'approve')}
                style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 5, border: `1px solid ${C.greenBdr}`, background: C.greenBg, color: C.green, cursor: 'pointer' }}>
                <TickIcon />
              </button>
              <button onClick={() => onAction('creative', creative.id, 'reject')}
                style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 5, border: `1px solid ${C.redBdr}`, background: C.redBg, color: C.red, cursor: 'pointer' }}>
                <CrossIcon />
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Mock data factory ─────────────────────────────────────────────────────────
function makeLineItems(pkg) {
  const count = pkg._exactCount ?? Math.max(pkg.lineItems, 5);
  const names = ['Homepage Banner', 'Category Page', 'Search Results', 'Product Detail', 'Checkout Page', 'App Banner', 'Email Newsletter', 'Push Notification'];
  const formats = ['Display 300×250', 'Display 728×90', 'Display 160×600', 'Video 15s', 'Native'];
  const matchTypes = ['Exact', 'Broad', 'Phrase'];
  const kwPool = ['running shoes', 'sport shoes', 'men shoes', 'casual wear', 'summer collection', 'branded shoes', 'sneakers', 'footwear'];

  return Array.from({ length: count }, (_, i) => {
    const kwCount = 2 + (i % 4);
    const creativeCount = 2 + (i % 2);
    const kwPending = i < 2 ? kwCount : Math.max(0, kwCount - i);
    const crPending = i < 1 ? creativeCount : Math.max(0, creativeCount - i);
    return {
      id: i + 1,
      name: names[i % names.length],
      budget: `₹${(500 + i * 250).toLocaleString()}`,
      impressions: `${(10 + i * 5).toLocaleString()}K`,
      status: i % 3 === 2 ? 'Paused' : 'Active',
      keywords: Array.from({ length: kwCount }, (_, k) => ({
        id: k,
        keyword: kwPool[(i + k) % kwPool.length],
        matchType: matchTypes[k % matchTypes.length],
        bid: `₹${(1.5 + k * 0.5).toFixed(2)}`,
        status: k < kwPending ? 'Pending' : 'Approved',
      })),
      creatives: Array.from({ length: creativeCount }, (_, c) => ({
        id: c,
        name: `Creative ${c + 1} — ${formats[c % formats.length]}`,
        format: formats[c % formats.length],
        status: c < crPending ? 'Pending' : 'Approved',
      })),
    };
  });
}

// ─── Root component ───────────────────────────────────────────────────────────
export default function AdPackageDetailView({ pkg, onClose, initialLineItem, singleMode = false }) {
  const lineItems = singleMode
    ? makeLineItems({ ...pkg, _exactCount: 1 })
    : makeLineItems(pkg);
  const initial = initialLineItem
    ? (lineItems.find(li => li.id === initialLineItem.id || li.name === initialLineItem.name) || lineItems[0])
    : lineItems[0];
  const [activeItem, setActiveItem] = useState(initial);
  const [lineSearch, setLineSearch] = useState('');
  const [itemData, setItemData] = useState(() => {
    const map = {};
    lineItems.forEach(li => { map[li.id] = { keywords: [...li.keywords], creatives: [...li.creatives] }; });
    return map;
  });

  const [showComments, setShowComments] = useState(false);
  const [approveMode, setApproveMode] = useState('keywords');  // 'keywords' | 'ads'
  const [currentAdIdx, setCurrentAdIdx] = useState(0);
  const [showLiDropdown, setShowLiDropdown] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [rejectingAd, setRejectingAd] = useState(null);   // { id, name } when rejection comment is open
  const [rejectReason, setRejectReason] = useState('');
  const [detailsCollapsed, setDetailsCollapsed] = useState(false);
  const [ex2OpenId, setEx2OpenId] = useState(null);  // null = all accordions closed (EX2/EX3)
  const [hoveredInvIdx, setHoveredInvIdx] = useState(null);  // for inventory thumbnail preview
  const [experience, setExperience] = useState('ex1');  // 'ex1' | 'ex2'

  const pushToast = (kind, message) => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, kind, message }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2800);
  };
  const kwRef     = useRef(null);
  const crRef     = useRef(null);
  const detailRef = useRef(null);
  const commentBtnRef = useRef(null);

  const currentKw = itemData[activeItem.id]?.keywords || activeItem.keywords;
  const currentCr = itemData[activeItem.id]?.creatives || activeItem.creatives;
  const kwPending = currentKw.filter(k => k.status === 'Pending').length;
  const crPending = currentCr.filter(c => c.status === 'Pending').length;

  const totalKwPending = lineItems.reduce((s, li) => s + (itemData[li.id]?.keywords || li.keywords).filter(k => k.status === 'Pending').length, 0);
  const totalCrPending = lineItems.reduce((s, li) => s + (itemData[li.id]?.creatives || li.creatives).filter(c => c.status === 'Pending').length, 0);

  function handleAction(type, id, action) {
    let label = '';
    setItemData(prev => {
      const copy = { ...prev, [activeItem.id]: { ...prev[activeItem.id] } };
      const nextStatus = action === 'approve' ? 'Approved' : 'Rejected';
      if (type === 'keyword') {
        const kw = copy[activeItem.id].keywords.find(k => k.id === id);
        label = kw ? `Keyword "${kw.keyword}"` : 'Keyword';
        copy[activeItem.id].keywords = copy[activeItem.id].keywords.map(k => k.id === id ? { ...k, status: nextStatus } : k);
      } else {
        const cr = copy[activeItem.id].creatives.find(c => c.id === id);
        label = cr ? `Creative "${cr.name}"` : 'Creative';
        copy[activeItem.id].creatives = copy[activeItem.id].creatives.map(c => c.id === id ? { ...c, status: nextStatus } : c);
      }
      return copy;
    });
    pushToast(action === 'approve' ? 'success' : 'error', `${label} ${action === 'approve' ? 'approved' : 'rejected'}`);
  }

  function handleApproveAll(type) {
    let count = 0;
    setItemData(prev => {
      const copy = { ...prev, [activeItem.id]: { ...prev[activeItem.id] } };
      if (type === 'keyword') {
        count = copy[activeItem.id].keywords.filter(k => k.status === 'Pending').length;
        copy[activeItem.id].keywords = copy[activeItem.id].keywords.map(k => k.status === 'Pending' ? { ...k, status: 'Approved' } : k);
      } else {
        count = copy[activeItem.id].creatives.filter(c => c.status === 'Pending').length;
        copy[activeItem.id].creatives = copy[activeItem.id].creatives.map(c => c.status === 'Pending' ? { ...c, status: 'Approved' } : c);
      }
      return copy;
    });
    if (count > 0) pushToast('success', `${count} ${type === 'keyword' ? 'keyword' : 'creative'}${count !== 1 ? 's' : ''} approved`);
  }

  function switchItem(li) {
    setActiveItem(li);
    detailRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const filteredLineItems = lineItems.filter(li => li.name.toLowerCase().includes(lineSearch.toLowerCase()));

  // ── Shared 3-card body (used in EX1 directly + inside open accordion of EX2) ──
  const threeCardBody = (
    <>
      {/* CARD 1 — Line Item Details (collapsible) */}
      {detailsCollapsed ? (
        <Card style={{ width: 44, flexShrink: 0 }}>
          <button onClick={() => setDetailsCollapsed(false)} title="Expand Line Item Details"
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
              gap: 14, padding: '14px 0', border: 'none', background: 'transparent', cursor: 'pointer',
              color: 'var(--osmos-fg-muted)', fontFamily: FONT }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>
            </svg>
            <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 12, fontWeight: 600,
              color: 'var(--osmos-fg)', whiteSpace: 'nowrap' }}>
              Line item details
            </span>
          </button>
        </Card>
      ) : (
        <Card style={{ width: '22%', minWidth: 240, flexShrink: 0 }}>
          <CardHeader>
            <span style={{ ...labelStyle, textTransform: 'none', letterSpacing: 0, fontSize: 13, fontWeight: 600, color: 'var(--osmos-fg)' }}>Line item details</span>
            <button onClick={() => setDetailsCollapsed(true)} title="Collapse"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24,
                border: 'none', borderRadius: 4, background: 'transparent', cursor: 'pointer', color: 'var(--osmos-fg-muted)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>
              </svg>
            </button>
          </CardHeader>
          <CardBody style={{ padding: '16px 14px' }}>
            {/* ── Section 1: Inventory ───────────────────────────────────── */}
            <SectionTitle>Inventory</SectionTitle>
            <InfoRow label="Selected Page" value={activeItem.name} />
            <div style={{ marginTop: 4, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--osmos-fg-muted)', fontFamily: FONT, marginBottom: 6 }}>
                Inventories
              </div>
              {[
                { name: 'Text Ad Box',                       bid: '₹0' },
                { name: 'Home Page MJ',                      bid: '₹10' },
                { name: 'Pre-auction-automation',            bid: '₹10 K' },
                { name: '[SDK USE ONLY] Home Page Banner Ad',bid: '₹1' },
              ].map((inv, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
                  borderTop: i === 0 ? 'none' : '1px solid rgba(0,0,0,0.06)' }}>
                  <div
                    onMouseEnter={() => setHoveredInvIdx(i)}
                    onMouseLeave={() => setHoveredInvIdx(null)}
                    style={{ position: 'relative', width: 24, height: 24, flexShrink: 0, background: '#f1f5f9',
                    border: '1px solid rgba(0,0,0,0.06)', borderRadius: 4,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-in' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--osmos-fg-subtle)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    {hoveredInvIdx === i && (
                      <div style={{ position: 'absolute', left: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)',
                        width: 180, height: 130, background: '#ffffff', borderRadius: 8,
                        border: '1px solid var(--osmos-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        zIndex: 100, padding: 8, pointerEvents: 'none' }}>
                        <div style={{ flex: 1, width: '100%', background: '#f1f5f9', borderRadius: 4,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--osmos-fg-subtle)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--osmos-fg)', fontFamily: FONT,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                          Preview
                        </span>
                      </div>
                    )}
                  </div>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--osmos-fg)', fontFamily: FONT,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }} title={inv.name}>
                    {inv.name}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--osmos-fg)', fontFamily: FONT, whiteSpace: 'nowrap' }}>
                    {inv.bid}
                  </span>
                </div>
              ))}
            </div>

            {/* ── Section 2: Targeting ───────────────────────────────────── */}
            <SectionTitle>Targeting</SectionTitle>
            <div style={{ marginBottom: 16 }}>
              {/* Audience Segments — list, one per line with reach highlight */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--osmos-fg-muted)', fontFamily: FONT, marginBottom: 6 }}>
                  Audience Segments
                </div>
                {[
                  { name: 'All Shoppers',       reach: '1.2M' },
                  { name: 'High Intent',        reach: '480K' },
                  { name: 'Returning Visitors', reach: '320K' },
                ].map((seg, i) => (
                  <div key={i} style={{ padding: '12px 0',
                    borderTop: i === 0 ? 'none' : '1px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--osmos-fg)', fontFamily: FONT,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 6 }}>
                      {seg.name}
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '2px 8px', borderRadius: 20,
                      background: 'rgba(25,112,225,0.08)', color: '#1970E1',
                      fontSize: 11, fontWeight: 600, fontFamily: FONT, whiteSpace: 'nowrap' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
                        <circle cx="17" cy="7" r="4"/>
                      </svg>
                      {seg.reach} reach
                    </span>
                  </div>
                ))}
              </div>

              <InfoRow label="Device Targeting"  value="Mobile, Desktop" />
              <InfoRow label="Geo Targeting"     value="India — All Regions" />
              <InfoRow label="Dayparting"        value="All Day" />
              <InfoRow label="Frequency Cap"     value="3 / user / day" />
              <InfoRow label="Brand Safety"      value="Standard" />
            </div>

            {/* ── Section 3: Campaign Setting ────────────────────────────── */}
            <SectionTitle>Campaign setting</SectionTitle>
            <div>
              {/* Wallet */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--osmos-fg-muted)', fontFamily: FONT, marginBottom: 2 }}>Wallet</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--osmos-fg)', fontFamily: FONT }}>Default</div>
                <div style={{ fontSize: 11, fontStyle: 'italic', color: 'var(--osmos-fg-muted)', fontFamily: FONT, marginTop: 2 }}>
                  Wallet Balance: ₹22,086.25
                </div>
              </div>

              {/* Chargeable / Biddable CPM (side-by-side) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 12, marginBottom: 12 }}>
                <InfoRow label="Chargeable CPM" value="₹0" />
                <InfoRow label="Biddable CPM"   value="₹10" />
              </div>

              {/* Start / End Date */}
              <InfoRow label="Start Date" value="04 Apr 26, 12:00 AM +05:30" />
              <InfoRow label="End Date"   value="06 Apr 26, 11:59 PM +05:30" />

              {/* Custom Attribution Window */}
              <div style={{ marginBottom: 14, paddingTop: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--osmos-fg)', fontFamily: FONT }}>
                    Custom Attribution Window
                  </span>
                  {/* Toggle (visual only) */}
                  <span style={{ display: 'inline-flex', width: 28, height: 16, borderRadius: 999,
                    background: 'var(--osmos-border)', position: 'relative' }}>
                    <span style={{ position: 'absolute', top: 2, left: 2, width: 12, height: 12,
                      borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.12)' }} />
                  </span>
                </div>
                <div style={{ fontSize: 11, fontStyle: 'italic', color: 'var(--osmos-fg-muted)', fontFamily: FONT, lineHeight: 1.45 }}>
                  Default attribution is set by the retailer. Turn on the toggle to customise.
                </div>
              </div>

              {/* Customized CPM table */}
              <div style={{ marginBottom: 14, paddingTop: 4, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--osmos-fg)', fontFamily: FONT, marginTop: 10, marginBottom: 8 }}>
                  Customized Chargeable &amp; Biddable CPM
                </div>
                <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 6, overflow: 'hidden' }}>
                  {/* Header */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.7fr 0.7fr 0.7fr',
                    background: '#FAFAFA', padding: '7px 10px',
                    fontSize: 10, fontWeight: 600, color: 'var(--osmos-fg-muted)', fontFamily: FONT,
                    letterSpacing: '0.04em', textTransform: 'uppercase', columnGap: 6,
                    borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <span>Inventory</span>
                    <span style={{ textAlign: 'right' }}>Min</span>
                    <span style={{ textAlign: 'right' }}>Chrg</span>
                    <span style={{ textAlign: 'right' }}>Bid</span>
                  </div>
                  {[
                    { name: 'Text Ad Box',  min: '₹0',  chrg: '-', bid: '-' },
                    { name: 'Home Page MJ', min: '₹10', chrg: '-', bid: '-' },
                  ].map((r, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.7fr 0.7fr 0.7fr',
                      padding: '8px 10px', fontSize: 12, color: 'var(--osmos-fg)', fontFamily: FONT, columnGap: 6,
                      borderTop: i === 0 ? 'none' : '1px solid rgba(0,0,0,0.06)' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={r.name}>{r.name}</span>
                      <span style={{ textAlign: 'right' }}>{r.min}</span>
                      <span style={{ textAlign: 'right', color: 'var(--osmos-fg-muted)' }}>{r.chrg}</span>
                      <span style={{ textAlign: 'right', color: 'var(--osmos-fg-muted)' }}>{r.bid}</span>
                    </div>
                  ))}
                </div>
              </div>

              <InfoRow label="Campaign Priority" value="900" />
              <InfoRow label="Biddable CPM"      value="₹10" />
            </div>
          </CardBody>
        </Card>
      )}

      {/* CARD 2 — Review list */}
      <Card style={{ width: '16%', minWidth: 200, flexShrink: 0 }}>
        <CardHeader>
          <span style={{ ...labelStyle, textTransform: 'none', letterSpacing: 0, fontSize: 13, fontWeight: 600, color: 'var(--osmos-fg)' }}>Review list</span>
        </CardHeader>
        <CardBody style={{ padding: '16px 14px' }}>
          {/* Targeting subheader */}
          <div style={{ margin: '0 4px 8px' }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--osmos-fg-muted)', fontFamily: FONT, letterSpacing: '0.04em' }}>
              Targeting
            </span>
          </div>

          {/* Audience (disabled) */}
          <ReviewItemCard
            name="Audience"
            subtitle="Review audience segments"
            status={<span style={{ fontSize: 10, fontWeight: 600, color: 'var(--osmos-fg-muted)', fontFamily: FONT, letterSpacing: '0.05em' }}>SOON</span>}
            disabled
          />

          {/* Keywords */}
          <ReviewItemCard
            name="Keywords"
            subtitle={`${currentKw.length} total`}
            status={
              kwPending > 0
                ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, color: C.amber, background: C.amberBg, borderRadius: 20, padding: '2px 8px', fontFamily: FONT, whiteSpace: 'nowrap' }}>
                    <AlertIcon color={C.amber} size={10} /> {kwPending} pending
                  </span>
                : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, color: C.green, fontFamily: FONT, whiteSpace: 'nowrap' }}>
                    <CheckCircleIcon color={C.green} size={10} /> All reviewed
                  </span>
            }
            selected={approveMode === 'keywords'}
            onClick={() => { setApproveMode('keywords'); setCurrentAdIdx(0); }}
          />

          {/* Ad upload subheader */}
          <div style={{ margin: '14px 4px 8px' }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--osmos-fg-muted)', fontFamily: FONT, letterSpacing: '0.04em' }}>
              Ad upload ({currentCr.length})
            </span>
          </div>

          {/* Creative cards */}
          {currentCr.map((cr, idx) => {
            const isSel = approveMode === 'ads' && currentAdIdx === idx;
            return (
              <ReviewItemCard
                key={cr.id}
                name={cr.name.split(' — ')[0]}
                subtitle={cr.format}
                status={<StatusPill status={cr.status} />}
                selected={isSel}
                onClick={() => { setApproveMode('ads'); setCurrentAdIdx(idx); }}
              />
            );
          })}
        </CardBody>
      </Card>

      {/* CARD 3 — Active approval surface */}
      <Card style={{ flex: 1, minWidth: 0, position: 'relative' }}>
        <CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--osmos-fg)', fontFamily: FONT }}>
              {approveMode === 'keywords' ? 'Keywords' : 'Ads Upload'}
            </div>
            {approveMode === 'keywords' && kwPending > 0 && <PendingBadge count={kwPending} type="keyword" />}
            {approveMode === 'ads' && crPending > 0 && <PendingBadge count={crPending} type="creative" />}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {((approveMode === 'keywords' && kwPending === 0) || (approveMode === 'ads' && crPending === 0)) && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: C.green, fontFamily: FONT }}>
                <CheckCircleIcon color={C.green} size={12} /> All reviewed
              </span>
            )}
            <button onClick={() => setShowComments(o => !o)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30,
                border: `1px solid ${showComments ? 'var(--osmos-brand-primary)' : 'var(--osmos-border)'}`,
                borderRadius: 6,
                background: showComments ? 'rgba(99,108,255,0.08)' : 'var(--osmos-bg)',
                cursor: 'pointer',
                color: showComments ? 'var(--osmos-brand-primary)' : 'var(--osmos-fg-muted)', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
          </div>
        </CardHeader>

        {/* Comments floater */}
        {showComments && (
          <div style={{
            position: 'absolute', top: 52, right: 16, bottom: 16, width: 320, zIndex: 50,
            background: 'var(--osmos-bg)',
            border: `1px solid ${rejectingAd ? C.redBdr : 'var(--osmos-border)'}`,
            borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -7, right: 8, width: 12, height: 12, background: 'var(--osmos-bg)',
              border: `1px solid ${rejectingAd ? C.redBdr : 'var(--osmos-border)'}`,
              borderBottom: 'none', borderRight: 'none', transform: 'rotate(45deg)' }} />
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--osmos-border)',
              background: rejectingAd ? C.redBg : '#FAFAFA',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: rejectingAd ? C.red : 'var(--osmos-fg)', fontFamily: FONT }}>
                {rejectingAd ? `Reject — ${rejectingAd.name}` : 'Comments'}
              </span>
              <button onClick={() => { setShowComments(false); setRejectingAd(null); setRejectReason(''); }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24,
                  border: 'none', borderRadius: 4, background: 'transparent', cursor: 'pointer', color: 'var(--osmos-fg-muted)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            {rejectingAd ? (
              <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--osmos-fg)', fontFamily: FONT, marginBottom: 8 }}>Reason for rejection</label>
                <textarea autoFocus value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                  placeholder="Explain why this creative is being rejected. The advertiser will see this comment."
                  style={{ flex: 1, width: '100%', minHeight: 0, resize: 'none', padding: '10px 12px', fontSize: 13, lineHeight: 1.5,
                    border: '1px solid var(--osmos-border)', borderRadius: 6, outline: 'none',
                    background: 'var(--osmos-bg-subtle)', color: 'var(--osmos-fg)', fontFamily: FONT, boxSizing: 'border-box' }} />
              </div>
            ) : (
              <div style={{ flex: 1, padding: '12px 14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { user: 'Priyanshu Pandey', time: '2 hrs ago', text: 'Please review the keyword bids — max bid seems high for broad match.' },
                  { user: 'Rahul Waghmare', time: 'Yesterday', text: 'Creative 2 banner size does not match the placement spec.' },
                ].map((c, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--osmos-fg)', fontFamily: FONT }}>{c.user}</span>
                      <span style={{ fontSize: 11, color: 'var(--osmos-fg-muted)', fontFamily: FONT }}>{c.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--osmos-fg-muted)', fontFamily: FONT, lineHeight: 1.5 }}>{c.text}</p>
                  </div>
                ))}
              </div>
            )}
            {rejectingAd ? (
              <div style={{ padding: '10px 14px', borderTop: '1px solid var(--osmos-border)', display: 'flex', gap: 8, flexShrink: 0, background: '#FAFAFA' }}>
                <button onClick={() => { handleAction('creative', rejectingAd.id, 'reject'); setShowComments(false); setRejectingAd(null); setRejectReason(''); if (currentAdIdx < currentCr.length - 1) setCurrentAdIdx(i => i + 1); }}
                  disabled={!rejectReason.trim()}
                  style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '8px 12px', borderRadius: 6, border: 'none', background: C.red, color: '#fff',
                    fontSize: 13, fontWeight: 600, fontFamily: FONT,
                    cursor: rejectReason.trim() ? 'pointer' : 'not-allowed',
                    opacity: rejectReason.trim() ? 1 : 0.55 }}>
                  <CrossIcon /> Comment and Reject
                </button>
              </div>
            ) : (
              <div style={{ padding: '10px 14px', borderTop: '1px solid var(--osmos-border)', display: 'flex', gap: 8, flexShrink: 0 }}>
                <input placeholder="Add a comment…" style={{ flex: 1, padding: '7px 10px', fontSize: 12, border: '1px solid var(--osmos-border)', borderRadius: 6, outline: 'none', background: 'var(--osmos-bg-subtle)', color: 'var(--osmos-fg)', fontFamily: FONT }} />
                <button style={{ padding: '7px 12px', borderRadius: 6, border: 'none', background: 'var(--osmos-brand-primary)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>Send</button>
              </div>
            )}
          </div>
        )}

        {approveMode === 'keywords' ? (
          <CardBody style={{ padding: '16px 20px', paddingBottom: 24 }}>
            <KeywordTable keywords={currentKw} onAction={handleAction} onApproveAll={() => handleApproveAll('keyword')} />
          </CardBody>
        ) : (
          <>
            <CardBody style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column' }}>
              {currentCr.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--osmos-fg-muted)', fontSize: 13, fontFamily: FONT }}>
                  No creatives uploaded for this line item.
                </div>
              ) : (() => {
                const ad = currentCr[currentAdIdx] || currentCr[0];
                return (
                  <>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                      <div style={{ flex: 1, minHeight: 280, background: 'var(--osmos-bg-subtle)', border: '1px solid var(--osmos-border)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ImageIcon />
                      </div>
                      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px 32px' }}>
                        <InfoRow label="Ad Name"     value={ad.name} />
                        <InfoRow label="Format"      value={ad.format} />
                        <InfoRow label="Status"      value={<StatusPill status={ad.status} />} />
                        <InfoRow label="Size"        value={ad.format.includes('×') ? ad.format.split(' ')[1] : '—'} />
                      </div>
                    </div>
                  </>
                );
              })()}
            </CardBody>
            {currentCr.length > 0 && (() => {
              const ad = currentCr[currentAdIdx] || currentCr[0];
              const isReviewed = ad.status !== 'Pending';
              return (
                <div style={{ borderTop: '1px solid var(--osmos-border)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FAFAFA', flexShrink: 0 }}>
                  <div style={{ fontSize: 12, color: 'var(--osmos-fg-muted)', fontFamily: FONT }}>
                    {isReviewed ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircleIcon color={ad.status === 'Approved' ? C.green : C.red} size={12} />
                      {ad.status}
                    </span> : 'Awaiting your decision'}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setRejectingAd({ id: ad.id, name: ad.name }); setRejectReason(''); setShowComments(true); }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '8px 18px', borderRadius: 6,
                        border: `1px solid ${C.redBdr}`, background: C.redBg, color: C.red,
                        fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>
                      <CrossIcon /> Reject
                    </button>
                    <button onClick={() => { handleAction('creative', ad.id, 'approve'); if (currentAdIdx < currentCr.length - 1) setCurrentAdIdx(i => i + 1); }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '8px 22px', borderRadius: 6,
                        border: 'none', background: C.green, color: '#fff',
                        fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>
                      <TickIcon /> Approve
                    </button>
                  </div>
                </div>
              );
            })()}
          </>
        )}
      </Card>
    </>
  );

  // ── EX3 body — Card 1 (collapsed details + approve items), Card 2 (approval surface), Card 3 (comments) ──
  const threeCardBodyEx3 = (
    <>
      {/* CARD 1 — Details & Review */}
      <Card style={{ width: '24%', minWidth: 260, flexShrink: 0 }}>
        <CardHeader>
          <span style={{ ...labelStyle, textTransform: 'none', letterSpacing: 0, fontSize: 13, fontWeight: 600, color: 'var(--osmos-fg)' }}>Details & review</span>
        </CardHeader>
        <CardBody style={{ padding: 0 }}>
          {/* Details — full-width row with just a bottom stroke (no surrounding border) */}
          <div style={{ borderBottom: '1px solid var(--osmos-border)' }}>
            <FlushAccordion title="Details" defaultOpen={false}>
              <InfoGroup>
                <InfoRow label="Line Item"     value={activeItem.name} />
                <InfoRow label="Budget"        value={activeItem.budget} />
                <InfoRow label="Impressions"   value={activeItem.impressions} />
                <InfoRow label="Status"        value={activeItem.status} />
              </InfoGroup>
              <InfoGroup>
                <InfoRow label="Ad Format"        value="Display Banner" />
                <InfoRow label="Placement"        value="Homepage, Category, Search" />
                <InfoRow label="Ad Size"          value="300×250, 728×90, 160×600" />
                <InfoRow label="Bidding Strategy" value={pkg.advName === 'Whitakers (Whitakers)' ? 'CPM' : 'CPC'} />
                <InfoRow label="Floor Price"      value="₹12.00 CPM" />
                <InfoRow label="Priority"         value="Standard" />
              </InfoGroup>
              <InfoGroup>
                <InfoRow label="Audience Segments" value="All Shoppers, High Intent" />
                <InfoRow label="Device Targeting"  value="Mobile, Desktop" />
                <InfoRow label="Geo Targeting"     value="India — All Regions" />
                <InfoRow label="Dayparting"        value="All Day" />
                <InfoRow label="Frequency Cap"     value="3 / user / day" />
                <InfoRow label="Brand Safety"      value="Standard" />
              </InfoGroup>
              <div>
                <InfoRow label="Booking Name"  value={pkg.bookingName} />
                <InfoRow label="Package"       value={pkg.packageName} />
                <InfoRow label="Advertiser"    value={pkg.advName} />
                <InfoRow label="Flight Start"  value={pkg.flightStart} />
                <InfoRow label="Flight End"    value={pkg.flightEnd} />
              </div>
            </FlushAccordion>
          </div>

          <div style={{ padding: '14px 14px' }}>
            {/* Review — top-level section header (grouped with Targeting subheader below) */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--osmos-fg)', fontFamily: FONT, lineHeight: 1.3 }}>
                Review
              </div>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--osmos-fg-muted)', fontFamily: FONT, letterSpacing: '0.04em', marginTop: 2 }}>
                Targeting
              </div>
            </div>

            {/* Audience (disabled) */}
            <ReviewItemCard
              name="Audience"
              subtitle="Review audience segments"
              status={<span style={{ fontSize: 10, fontWeight: 600, color: 'var(--osmos-fg-muted)', fontFamily: FONT, letterSpacing: '0.05em' }}>SOON</span>}
              disabled
            />

            {/* Keywords */}
            <ReviewItemCard
              name="Keywords"
              subtitle={`${currentKw.length} total`}
              status={
                kwPending > 0
                  ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, color: C.amber, background: C.amberBg, borderRadius: 20, padding: '2px 8px', fontFamily: FONT, whiteSpace: 'nowrap' }}>
                      <AlertIcon color={C.amber} size={10} /> {kwPending} pending
                    </span>
                  : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, color: C.green, fontFamily: FONT, whiteSpace: 'nowrap' }}>
                      <CheckCircleIcon color={C.green} size={10} /> All reviewed
                    </span>
              }
              selected={approveMode === 'keywords'}
              onClick={() => { setApproveMode('keywords'); setCurrentAdIdx(0); }}
            />

            {/* Ad Upload subheader */}
            <div style={{ margin: '14px 4px 8px' }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--osmos-fg-muted)', fontFamily: FONT, letterSpacing: '0.04em' }}>
                Ad upload ({currentCr.length})
              </span>
            </div>

            {currentCr.map((cr, idx) => {
              const isSel = approveMode === 'ads' && currentAdIdx === idx;
              return (
                <ReviewItemCard
                  key={cr.id}
                  name={cr.name.split(' — ')[0]}
                  subtitle={cr.format}
                  status={<StatusPill status={cr.status} />}
                  selected={isSel}
                  onClick={() => { setApproveMode('ads'); setCurrentAdIdx(idx); }}
                />
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* CARD 2 — Approval surface (the bigger one, was Card 3) */}
      <Card style={{ flex: 1, minWidth: 0 }}>
        <CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--osmos-fg)', fontFamily: FONT }}>
              {approveMode === 'keywords' ? 'Keywords' : 'Ads Upload'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {((approveMode === 'keywords' && kwPending === 0) || (approveMode === 'ads' && crPending === 0)) && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: C.green, fontFamily: FONT }}>
                <CheckCircleIcon color={C.green} size={12} /> All reviewed
              </span>
            )}
          </div>
        </CardHeader>

        {approveMode === 'keywords' ? (
          <CardBody style={{ padding: '16px 20px', paddingBottom: 24 }}>
            <KeywordTable keywords={currentKw} onAction={handleAction} onApproveAll={() => handleApproveAll('keyword')} />
          </CardBody>
        ) : (
          <>
            <CardBody style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column' }}>
              {currentCr.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--osmos-fg-muted)', fontSize: 13, fontFamily: FONT }}>
                  No creatives uploaded for this line item.
                </div>
              ) : (() => {
                const ad = currentCr[currentAdIdx] || currentCr[0];
                return (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <div style={{ flex: 1, minHeight: 280, background: 'var(--osmos-bg-subtle)', border: '1px solid var(--osmos-border)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ImageIcon />
                    </div>
                    <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px 32px' }}>
                      <InfoRow label="Ad Name"     value={ad.name} />
                      <InfoRow label="Format"      value={ad.format} />
                      <InfoRow label="Status"      value={<StatusPill status={ad.status} />} />
                      <InfoRow label="Size"        value={ad.format.includes('×') ? ad.format.split(' ')[1] : '—'} />
                    </div>
                  </div>
                );
              })()}
            </CardBody>
            {currentCr.length > 0 && (() => {
              const ad = currentCr[currentAdIdx] || currentCr[0];
              const isReviewed = ad.status !== 'Pending';
              return (
                <div style={{ borderTop: '1px solid var(--osmos-border)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FAFAFA', flexShrink: 0 }}>
                  <div style={{ fontSize: 12, color: 'var(--osmos-fg-muted)', fontFamily: FONT }}>
                    {isReviewed ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircleIcon color={ad.status === 'Approved' ? C.green : C.red} size={12} />
                      {ad.status}
                    </span> : 'Awaiting your decision'}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setRejectingAd({ id: ad.id, name: ad.name }); setRejectReason(''); setShowComments(true); }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '8px 18px', borderRadius: 6,
                        border: `1px solid ${C.redBdr}`, background: C.redBg, color: C.red,
                        fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>
                      <CrossIcon /> Reject
                    </button>
                    <button onClick={() => { handleAction('creative', ad.id, 'approve'); if (currentAdIdx < currentCr.length - 1) setCurrentAdIdx(i => i + 1); }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '8px 22px', borderRadius: 6,
                        border: 'none', background: C.green, color: '#fff',
                        fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>
                      <TickIcon /> Approve
                    </button>
                  </div>
                </div>
              );
            })()}
          </>
        )}
      </Card>

      {/* CARD 3 — Comments (collapsible) — reused for rejection comment */}
      <Card style={{ width: showComments ? '24%' : 48, minWidth: showComments ? 280 : 48, flexShrink: 0,
        transition: 'width 0.2s',
        border: `1px solid ${rejectingAd ? C.redBdr : 'var(--osmos-border)'}` }}>
        {showComments ? (
          <>
            <CardHeader style={{ background: rejectingAd ? C.redBg : '#FAFAFA' }}>
              <span style={{ ...labelStyle, textTransform: 'none', letterSpacing: 0, fontSize: 13, fontWeight: 600, color: rejectingAd ? C.red : 'var(--osmos-fg)' }}>
                {rejectingAd ? `Reject — ${rejectingAd.name}` : 'Comments'}
              </span>
              <button onClick={() => { setShowComments(false); setRejectingAd(null); setRejectReason(''); }}
                title="Collapse"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24,
                  border: 'none', borderRadius: 4, background: 'transparent', cursor: 'pointer', color: 'var(--osmos-fg-muted)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>
                </svg>
              </button>
            </CardHeader>
            {rejectingAd ? (
              <>
                <CardBody style={{ padding: 14, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--osmos-fg)', fontFamily: FONT, marginBottom: 8 }}>
                    Reason for rejection
                  </label>
                  <textarea autoFocus value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                    placeholder="Explain why this creative is being rejected. The advertiser will see this comment."
                    style={{ flex: 1, width: '100%', minHeight: 0, resize: 'none', padding: '10px 12px', fontSize: 13, lineHeight: 1.5,
                      border: '1px solid var(--osmos-border)', borderRadius: 6, outline: 'none',
                      background: 'var(--osmos-bg-subtle)', color: 'var(--osmos-fg)', fontFamily: FONT, boxSizing: 'border-box' }} />
                </CardBody>
                <div style={{ padding: '10px 14px', borderTop: '1px solid var(--osmos-border)', display: 'flex', gap: 8, flexShrink: 0, background: '#FAFAFA' }}>
                  <button onClick={() => {
                      handleAction('creative', rejectingAd.id, 'reject');
                      setRejectingAd(null);
                      setRejectReason('');
                      if (currentAdIdx < currentCr.length - 1) setCurrentAdIdx(i => i + 1);
                    }}
                    disabled={!rejectReason.trim()}
                    style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      padding: '8px 12px', borderRadius: 6, border: 'none',
                      background: C.red, color: '#fff',
                      fontSize: 13, fontWeight: 600, fontFamily: FONT,
                      cursor: rejectReason.trim() ? 'pointer' : 'not-allowed',
                      opacity: rejectReason.trim() ? 1 : 0.55 }}>
                    <CrossIcon /> Comment and Reject
                  </button>
                </div>
              </>
            ) : (
              <>
                <CardBody style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { user: 'Priyanshu Pandey', time: '2 hrs ago', text: 'Please review the keyword bids — max bid seems high for broad match.' },
                    { user: 'Rahul Waghmare',   time: 'Yesterday', text: 'Creative 2 banner size does not match the placement spec.' },
                  ].map((c, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--osmos-fg)', fontFamily: FONT }}>{c.user}</span>
                        <span style={{ fontSize: 11, color: 'var(--osmos-fg-muted)', fontFamily: FONT }}>{c.time}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 12, color: 'var(--osmos-fg-muted)', fontFamily: FONT, lineHeight: 1.5 }}>{c.text}</p>
                    </div>
                  ))}
                </CardBody>
                <div style={{ padding: '10px 14px', borderTop: '1px solid var(--osmos-border)', display: 'flex', gap: 8, flexShrink: 0 }}>
                  <input placeholder="Add a comment…" style={{
                    flex: 1, padding: '7px 10px', fontSize: 12, border: '1px solid var(--osmos-border)',
                    borderRadius: 6, outline: 'none', background: 'var(--osmos-bg-subtle)',
                    color: 'var(--osmos-fg)', fontFamily: FONT, boxSizing: 'border-box',
                  }} />
                  <button style={{ padding: '7px 12px', borderRadius: 6, border: 'none',
                    background: 'var(--osmos-brand-primary)', color: '#fff',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>Send</button>
                </div>
              </>
            )}
          </>
        ) : (
          <button onClick={() => setShowComments(true)} title="Expand Comments"
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
              gap: 14, padding: '14px 0', border: 'none', background: 'transparent', cursor: 'pointer',
              color: 'var(--osmos-fg-muted)', fontFamily: FONT }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>
            </svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 12, fontWeight: 600,
              color: 'var(--osmos-fg)', whiteSpace: 'nowrap' }}>
              Comments
            </span>
          </button>
        )}
      </Card>
    </>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', background: experience === 'ex1' ? '#EDF0F5' : '#ffffff', fontFamily: FONT }}>

      {/* ── Toast stack (top-center) ─────────────────────────────────────────── */}
      <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 2000,
        display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none', alignItems: 'center' }}>
        {toasts.map(t => {
          const isOk = t.kind === 'success';
          return (
            <div key={t.id}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 16px', borderRadius: 8,
                background: '#ffffff',
                border: `1px solid ${isOk ? C.greenBdr : C.redBdr}`,
                borderLeft: `4px solid ${isOk ? C.green : C.red}`,
                boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                fontSize: 13, fontWeight: 500, color: 'var(--osmos-fg)',
                fontFamily: FONT, animation: 'toastIn 0.18s ease',
                pointerEvents: 'auto', maxWidth: 480,
              }}>
              {isOk
                ? <CheckCircleIcon color={C.green} size={16} />
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="18" y1="6" x2="6" y2="18"/></svg>}
              <span>{t.message}</span>
            </div>
          );
        })}
        <style>{`@keyframes toastIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </div>

      {/* ── Top bar ──────────────────────────────────────────────────────────── */}
      {(() => {
        const currentIdx = lineItems.findIndex(li => li.id === activeItem.id);
        const prevLi = currentIdx > 0 ? lineItems[currentIdx - 1] : null;
        const nextLi = currentIdx < lineItems.length - 1 ? lineItems[currentIdx + 1] : null;
        const navTo = (li) => { if (!li) return; switchItem(li); setApproveMode('keywords'); setCurrentAdIdx(0); };
        return (
      <div style={{ background: '#e8f1fc', borderBottom: '1px solid var(--osmos-border)', display: 'flex', alignItems: 'center', padding: '16px', gap: 12, flexShrink: 0, position: 'relative' }}>

        {/* Experience tabs — absolutely centered */}
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
          display: 'flex', gap: 4, background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(25,112,225,0.18)',
          borderRadius: 8, padding: 3 }}>
          {[
            { key: 'ex1', label: 'EX 1' },
            { key: 'ex2', label: 'EX 2' },
            { key: 'ex3', label: 'EX 3' },
          ].map(t => {
            const isActive = experience === t.key;
            return (
              <button key={t.key} onClick={() => setExperience(t.key)}
                style={{ padding: '6px 18px', fontSize: 12, fontWeight: isActive ? 600 : 500,
                  fontFamily: FONT, border: 'none', borderRadius: 6, cursor: 'pointer',
                  background: isActive ? '#ffffff' : 'transparent',
                  color: isActive ? '#1970E1' : 'var(--osmos-fg-muted)',
                  boxShadow: isActive ? '0 1px 3px rgba(25,112,225,0.18)' : 'none',
                  transition: 'all 0.15s' }}>
                {t.label}
              </button>
            );
          })}
        </div>


        {/* Breadcrumb + title with line item dropdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, lineHeight: 1.35, position: 'relative' }}>
          <span style={{ fontSize: 11, color: 'var(--osmos-fg-muted)', fontWeight: 500 }}>
            {singleMode ? 'Campaign Review › Display Ads' : `Ad Packages › ${pkg.bookingName} › Line Items`}
          </span>
          <button onClick={() => !singleMode && experience === 'ex1' && setShowLiDropdown(o => !o)}
            disabled={singleMode || (experience === 'ex2' || experience === 'ex3')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: 0,
              background: 'transparent', border: 'none',
              cursor: (singleMode || (experience === 'ex2' || experience === 'ex3')) ? 'default' : 'pointer', textAlign: 'left' }}>
            <span style={{ fontSize: 14, fontWeight: 600,
              color: (singleMode || (experience === 'ex2' || experience === 'ex3')) ? 'var(--osmos-fg)' : '#1970E1', fontFamily: FONT }}>
              {(experience === 'ex2' || experience === 'ex3')
                ? pkg.bookingName
                : (singleMode ? pkg.bookingName : activeItem.name)}
            </span>
            {!singleMode && experience === 'ex1' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', color: '#1970E1' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: showLiDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </span>
            )}
          </button>

          {!singleMode && showLiDropdown && (
            <>
              {/* Backdrop to close */}
              <div onClick={() => setShowLiDropdown(false)}
                style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'transparent' }} />
              {/* Dropdown panel */}
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', left: 0, width: 320, zIndex: 50,
                background: 'var(--osmos-bg)', border: '1px solid var(--osmos-border)',
                borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
              }}>
                <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--osmos-border)', background: '#FAFAFA',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--osmos-fg-muted)', fontFamily: FONT, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Line Items ({lineItems.length})
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--osmos-fg-subtle)', fontFamily: FONT }}>Jump to</span>
                </div>
                <div style={{ maxHeight: 360, overflowY: 'auto', padding: 8 }}>
                  {lineItems.map(li => {
                    const liKw = itemData[li.id]?.keywords || li.keywords;
                    const liCr = itemData[li.id]?.creatives || li.creatives;
                    const liKwP = liKw.filter(k => k.status === 'Pending').length;
                    const liCrP = liCr.filter(c => c.status === 'Pending').length;
                    const allDone = liKwP === 0 && liCrP === 0;
                    const isActive = li.id === activeItem.id;
                    return (
                      <div key={li.id}
                        onClick={() => { switchItem(li); setShowLiDropdown(false); setApproveMode('keywords'); setCurrentAdIdx(0); }}
                        style={{ padding: '10px 12px', borderRadius: 6, cursor: 'pointer', marginBottom: 4,
                          background: isActive ? '#e8f1fc' : 'transparent',
                          border: isActive ? '1px solid #1970E1' : '1px solid transparent',
                          transition: 'all 0.12s' }}>
                        <div style={{ marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: isActive ? '#1970E1' : 'var(--osmos-fg)', fontFamily: FONT }}>{li.name}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: 11, fontFamily: FONT }}>
                          {liKwP > 0 && <span style={{ color: C.amber, whiteSpace: 'nowrap' }}>{liKwP} Keyword{liKwP !== 1 ? 's' : ''} Pending</span>}
                          {liCrP > 0 && <span style={{ color: C.amber, whiteSpace: 'nowrap' }}>{liCrP} Creative{liCrP !== 1 ? 's' : ''} Pending</span>}
                          {allDone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: C.green, whiteSpace: 'nowrap' }}><CheckCircleIcon color={C.green} size={10} /> Reviewed</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          {totalKwPending === 0 && totalCrPending === 0 && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: C.green }}>
              <CheckCircleIcon color={C.green} size={13} /> All items reviewed
            </span>
          )}

          {/* Overall review status — now shown inside the package summary card in EX2/EX3; keep this branch off */}
          {false && (experience === 'ex2' || experience === 'ex3') && (() => {
            const pendingLis = lineItems.filter(li => {
              const liKw = itemData[li.id]?.keywords || li.keywords;
              const liCr = itemData[li.id]?.creatives || li.creatives;
              return liKw.some(k => k.status === 'Pending') || liCr.some(c => c.status === 'Pending');
            }).length;
            const isAllDone = pendingLis === 0;
            return (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px',
                borderRadius: 20, background: isAllDone ? C.greenBg : C.amberBg,
                color: isAllDone ? C.green : C.amber,
                fontSize: 12, fontWeight: 600, fontFamily: FONT, whiteSpace: 'nowrap' }}>
                {isAllDone
                  ? <><CheckCircleIcon color={C.green} size={12} /> All {lineItems.length} line items reviewed</>
                  : <><AlertIcon color={C.amber} size={12} /> {pendingLis}/{lineItems.length} pending</>}
              </span>
            );
          })()}

          {!singleMode && experience === 'ex1' && (
            <>
              {/* Prev line item */}
              <button onClick={() => navTo(prevLi)} disabled={!prevLi}
                title={prevLi ? `Previous: ${prevLi.name}` : 'No previous line item'}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 6,
                  border: '1px solid var(--osmos-border)', background: prevLi ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)',
                  color: prevLi ? 'var(--osmos-fg)' : 'var(--osmos-fg-subtle)',
                  fontSize: 12, fontWeight: 600, fontFamily: FONT,
                  cursor: prevLi ? 'pointer' : 'not-allowed', opacity: prevLi ? 1 : 0.5 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                Previous
              </button>

              {/* Pagination indicator */}
              <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0 8px',
                fontSize: 12, fontWeight: 600, color: 'var(--osmos-fg)', fontFamily: FONT, whiteSpace: 'nowrap' }}>
                <span style={{ color: '#1970E1' }}>{currentIdx + 1}</span>
                <span style={{ margin: '0 4px', color: 'var(--osmos-fg-subtle)' }}>/</span>
                <span style={{ color: 'var(--osmos-fg-muted)' }}>{lineItems.length}</span>
              </span>

              {/* Next line item */}
              <button onClick={() => navTo(nextLi)} disabled={!nextLi}
                title={nextLi ? `Next: ${nextLi.name}` : 'No next line item'}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 6,
                  border: '1px solid var(--osmos-border)', background: nextLi ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)',
                  color: nextLi ? 'var(--osmos-fg)' : 'var(--osmos-fg-subtle)',
                  fontSize: 12, fontWeight: 600, fontFamily: FONT,
                  cursor: nextLi ? 'pointer' : 'not-allowed', opacity: nextLi ? 1 : 0.5 }}>
                Next
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </>
          )}

          {/* Close (X) — extreme right */}
          <button onClick={onClose}
            title="Close"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30,
              border: '1px solid var(--osmos-border)', borderRadius: 6, background: 'rgba(255,255,255,0.7)',
              cursor: 'pointer', color: 'var(--osmos-fg-muted)', flexShrink: 0, marginLeft: 4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
        );
      })()}

      {/* ── Body (EX1: 3-card | EX2: stacked accordions) ─────────────────────── */}
      {(experience === 'ex2' || experience === 'ex3') ? (
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* ── Package summary card ─────────────────────────────────────── */}
          <div style={{ background: 'var(--osmos-bg)', border: '1px solid var(--osmos-border)',
            borderRadius: 10, padding: 20, display: 'flex', gap: 24, flexShrink: 0 }}>
            {/* Image */}
            <div style={{ position: 'relative', width: 160, height: 160, flexShrink: 0,
              background: '#e8f1fc', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(25,112,225,0.18)' }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(25,112,225,0.55)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span style={{ position: 'absolute', bottom: 8, right: 8, padding: '2px 7px', borderRadius: 4,
                fontSize: 10, fontWeight: 700, color: '#fff', background: '#1970E1', fontFamily: FONT, letterSpacing: '0.04em' }}>
                AD
              </span>
            </div>

            {/* Right column — title + flat info grid */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              {/* Title row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--osmos-fg)', fontFamily: FONT, lineHeight: 1.2 }}>
                  {pkg.packageName}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 9px', borderRadius: 4,
                  fontSize: 11, fontWeight: 600, fontFamily: FONT,
                  background: pkg.status === 'Active' ? C.greenBg : 'rgba(148,163,184,0.18)',
                  color: pkg.status === 'Active' ? C.green : 'var(--osmos-fg-muted)',
                  border: `1px solid ${pkg.status === 'Active' ? C.greenBdr : 'var(--osmos-border)'}` }}>
                  {pkg.status}
                </span>

                {/* Overall pending status — moved from top bar */}
                {(() => {
                  const pendingLis = lineItems.filter(li => {
                    const liKw = itemData[li.id]?.keywords || li.keywords;
                    const liCr = itemData[li.id]?.creatives || li.creatives;
                    return liKw.some(k => k.status === 'Pending') || liCr.some(c => c.status === 'Pending');
                  }).length;
                  const isAllDone = pendingLis === 0;
                  return (
                    <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px',
                      borderRadius: 20, background: isAllDone ? C.greenBg : C.amberBg,
                      color: isAllDone ? C.green : C.amber,
                      fontSize: 12, fontWeight: 600, fontFamily: FONT, whiteSpace: 'nowrap' }}>
                      {isAllDone
                        ? <><CheckCircleIcon color={C.green} size={12} /> All {lineItems.length} line items reviewed</>
                        : <><AlertIcon color={C.amber} size={12} /> {pendingLis}/{lineItems.length} pending</>}
                    </span>
                  );
                })()}
              </div>

              {/* Info grid — all fields, equal weight, 5 cols × 2 rows */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', columnGap: 24, rowGap: 16 }}>
                {[
                  { label: 'Booking Name',     value: pkg.bookingName },
                  { label: 'Advertiser',       value: pkg.advName.replace(/\s*\(.*?\)/, '') },
                  { label: 'Advertiser ID',    value: pkg.advId },
                  { label: 'Booking Cost',     value: pkg.cost },
                  { label: 'Total Line Items', value: lineItems.length },
                  { label: 'Flight Start',     value: pkg.flightStart },
                  { label: 'Flight End',       value: pkg.flightEnd },
                  { label: 'Created By',       value: pkg.createdBy },
                  { label: 'Created On',       value: pkg.createdOn },
                  { label: 'Last Updated',     value: pkg.lastUpdated },
                ].map((item, i) => (
                  <div key={i} style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: 'var(--osmos-fg-muted)', fontFamily: FONT, marginBottom: 4 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--osmos-fg)', fontFamily: FONT,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.value}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {lineItems.map(li => {
            const liKw = itemData[li.id]?.keywords || li.keywords;
            const liCr = itemData[li.id]?.creatives || li.creatives;
            const liKwP = liKw.filter(k => k.status === 'Pending').length;
            const liCrP = liCr.filter(c => c.status === 'Pending').length;
            const allDone = liKwP === 0 && liCrP === 0;
            const isOpen = ex2OpenId === li.id;
            return (
              <div key={li.id}
                style={{ border: `1px solid ${isOpen ? '#1970E1' : 'var(--osmos-border)'}`, borderRadius: 10,
                  background: 'var(--osmos-bg)', overflow: 'hidden', flexShrink: 0,
                  boxShadow: isOpen ? '0 2px 8px rgba(25,112,225,0.08)' : 'none', transition: 'all 0.15s' }}>
                {/* Accordion header */}
                <button onClick={() => {
                    if (isOpen) {
                      setEx2OpenId(null);
                    } else {
                      setEx2OpenId(li.id);
                      switchItem(li);
                      setApproveMode('keywords');
                      setCurrentAdIdx(0);
                    }
                  }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 18px',
                    background: '#FAFAFA',
                    border: 'none', cursor: 'pointer', fontFamily: FONT, textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: isOpen ? '#1970E1' : 'var(--osmos-fg)' }}>
                      {li.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {allDone ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: C.green }}>
                        <CheckCircleIcon color={C.green} size={13} /> All Reviewed
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: C.amber }}>
                        <AlertIcon color={C.amber} size={12} />
                        {liKwP + liCrP} pending
                      </span>
                    )}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isOpen ? '#1970E1' : 'var(--osmos-fg-muted)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </button>

                {/* Accordion body — full 3-card layout for this line item */}
                {isOpen && (
                  <div style={{ display: 'flex', gap: 16, padding: 16, background: '#EDF0F5',
                    borderTop: '1px solid var(--osmos-border)',
                    height: 'calc(100vh - 243px)', minHeight: 480, overflow: 'hidden' }}>
                    {experience === 'ex3' ? threeCardBodyEx3 : threeCardBody}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
      <div style={{ flex: 1, display: 'flex', gap: 16, padding: 16, overflow: 'hidden' }}>
        {threeCardBody}
      </div>
      )}


    </div>
  );
}
