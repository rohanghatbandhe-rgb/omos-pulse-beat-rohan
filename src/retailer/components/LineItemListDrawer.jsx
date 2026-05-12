import React, { useState } from 'react';

const FONT = "'Open Sans', sans-serif";

// ─── Icons ────────────────────────────────────────────────────────────────────
const CloseIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const UnderReviewIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--osmos-fg-subtle)', cursor: 'pointer' }}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const SortIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4, opacity: 0.6 }}>
    <line x1="12" y1="5" x2="12" y2="19"/><polyline points="5 12 12 5 19 12"/>
  </svg>
);

// ─── Status bar (creative / keyword approval progress) ────────────────────────
function StatusBar({ approved, total }) {
  if (total === null || total === undefined) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 80, height: 4, borderRadius: 99, background: 'var(--osmos-border)' }} />
        <InfoIcon />
      </div>
    );
  }
  const pct = total === 0 ? 0 : (approved / total) * 100;
  const isComplete = approved > 0 && approved === total;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 80, height: 4, borderRadius: 99, background: 'var(--osmos-border)', position: 'relative', overflow: 'hidden' }}>
        {pct > 0 && <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, borderRadius: 99, background: isComplete ? '#16a34a' : '#4ade80' }} />}
      </div>
      <span style={{ fontSize: 12, color: 'var(--osmos-fg-muted)', whiteSpace: 'nowrap', fontFamily: FONT }}>{approved}/{total}</span>
      <InfoIcon />
    </div>
  );
}

// ─── Mock line items in Display-Ads-row shape ─────────────────────────────────
function makeLineItemRows(pkg) {
  const count = Math.max(pkg.lineItems, 5);
  const names = ['Homepage Banner', 'Category Page', 'Search Results', 'Product Detail', 'Checkout Page', 'App Banner', 'Email Newsletter', 'Push Notification'];
  const types = ['Auction', 'Auction', 'Guaranteed'];
  return Array.from({ length: count }, (_, i) => {
    const crT = 1 + (i % 2);
    const kwT = i === 0 ? null : 1 + (i % 3);
    const crA = i < 2 ? 0 : Math.min(crT, 1);
    const kwA = kwT === null ? 0 : (i < 3 ? 0 : Math.min(kwT, 1));
    return {
      id: i + 1,
      name: names[i % names.length],
      type: types[i % types.length],
      merchant: pkg.advName.replace(/\s*\(.*?\)/, ''),
      createdOn: pkg.createdOn + ', 01:1' + (i % 9) + ' PM +05:30',
      bidding: i % 2 === 0 ? 'CPC' : 'CPM',
      changedOn: pkg.lastUpdated + ', 02:1' + (i % 9) + ' PM +05:30',
      creativeApproved: crA,
      creativeTotal: crT,
      keywordApproved: kwA,
      keywordTotal: kwT,
    };
  });
}

// ─── Sticky styles ────────────────────────────────────────────────────────────
const TH = { padding: '10px 14px', fontSize: 11, fontWeight: 700, color: 'var(--osmos-fg-muted)', background: 'var(--osmos-bg)', borderBottom: '1px solid var(--osmos-border)', whiteSpace: 'nowrap', textAlign: 'left', fontFamily: FONT };
const TD = { padding: '11px 14px', fontSize: 13, color: 'var(--osmos-fg)', borderBottom: '1px solid var(--osmos-border)', verticalAlign: 'middle', fontFamily: FONT, whiteSpace: 'nowrap' };

const STATUS_W = 95;
const NAME_W   = 180;
const VIEW_W   = 60;
const KW_W     = 140;
const CR_W     = 140;

const sLeft0  = { position: 'sticky', left: 0,                       zIndex: 2, background: 'var(--osmos-bg)' };
const sLeft1  = { position: 'sticky', left: STATUS_W,                zIndex: 2, background: 'var(--osmos-bg)', boxShadow: '2px 0 4px rgba(0,0,0,0.04)' };
const sRight2 = { position: 'sticky', right: VIEW_W + KW_W,          zIndex: 2, background: 'var(--osmos-bg)' };
const sRight1 = { position: 'sticky', right: VIEW_W,                 zIndex: 2, background: 'var(--osmos-bg)' };
const sRight  = { position: 'sticky', right: 0,                      zIndex: 2, background: 'var(--osmos-bg)', boxShadow: '-2px 0 4px rgba(0,0,0,0.04)' };

// ─── Drawer ───────────────────────────────────────────────────────────────────
export default function LineItemListDrawer({ pkg, onClose, onViewLineItem }) {
  const [hoveredRow, setHoveredRow] = useState(null);
  const rows = makeLineItemRows(pkg);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, fontFamily: FONT }}>
      {/* Backdrop */}
      <div onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.45)', animation: 'fadeIn 0.15s ease' }} />

      {/* Drawer panel */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: '78%', maxWidth: 1200, minWidth: 720,
        background: 'var(--osmos-bg)', boxShadow: '-8px 0 24px rgba(0,0,0,0.12)',
        display: 'flex', flexDirection: 'column', animation: 'slideIn 0.18s ease',
      }}>

        {/* Header */}
        <div style={{ height: 64, background: '#e8f1fc', borderBottom: '1px solid var(--osmos-border)',
          display: 'flex', alignItems: 'center', padding: '0 20px', gap: 14, flexShrink: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.35 }}>
            <span style={{ fontSize: 11, color: 'var(--osmos-fg-muted)', fontWeight: 500 }}>
              Ad Packages › {pkg.bookingName}
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--osmos-fg)' }}>
              Line Items ({rows.length})
            </span>
          </div>
          <button onClick={onClose}
            title="Close"
            style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 32, height: 32, border: '1px solid var(--osmos-border)', borderRadius: 6,
              background: 'rgba(255,255,255,0.7)', cursor: 'pointer', color: 'var(--osmos-fg-muted)', flexShrink: 0 }}>
            <CloseIcon />
          </button>
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflow: 'auto', background: 'var(--osmos-bg-subtle)', padding: 16 }}>
          <div style={{ background: 'var(--osmos-bg)', border: '1px solid var(--osmos-border)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: 1000, borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ ...TH, ...sLeft0,  width: STATUS_W }}>Status</th>
                    <th style={{ ...TH, ...sLeft1,  width: NAME_W }}>Line Item Name</th>
                    <th style={TH}>Type</th>
                    <th style={TH}>Merchant Name</th>
                    <th style={{ ...TH, borderBottom: '2px solid var(--osmos-brand-primary)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                        Created On <SortIcon />
                      </span>
                    </th>
                    <th style={TH}>Bidding Strategy</th>
                    <th style={TH}>Last Changed On</th>
                    <th style={{ ...TH, ...sRight2, width: CR_W }}>Creative Status</th>
                    <th style={{ ...TH, ...sRight1, width: KW_W }}>Keyword Status</th>
                    <th style={{ ...TH, ...sRight,  width: VIEW_W }}></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(row => {
                    const rowBg = hoveredRow === row.id ? 'var(--osmos-bg-subtle)' : 'var(--osmos-bg)';
                    return (
                      <tr key={row.id}
                        onMouseEnter={() => setHoveredRow(row.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                        style={{ background: rowBg, transition: 'background 0.12s' }}>
                        <td style={{ ...TD, ...sLeft0, background: rowBg }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: '#d97706' }}>
                            <UnderReviewIcon />
                            <span style={{ fontSize: 10, fontWeight: 600, color: '#d97706', fontFamily: FONT, whiteSpace: 'nowrap' }}>Under Review</span>
                          </div>
                        </td>
                        <td style={{ ...TD, ...sLeft1, background: rowBg }}>{row.name}</td>
                        <td style={{ ...TD, color: 'var(--osmos-fg-muted)' }}>{row.type}</td>
                        <td style={{ ...TD, color: 'var(--osmos-fg-muted)' }}>{row.merchant}</td>
                        <td style={{ ...TD, color: 'var(--osmos-fg-muted)' }}>{row.createdOn}</td>
                        <td style={{ ...TD, color: 'var(--osmos-fg-muted)' }}>{row.bidding}</td>
                        <td style={{ ...TD, color: 'var(--osmos-fg-muted)' }}>{row.changedOn}</td>
                        <td style={{ ...TD, ...sRight2, background: rowBg }}><StatusBar approved={row.creativeApproved} total={row.creativeTotal} /></td>
                        <td style={{ ...TD, ...sRight1, background: rowBg }}><StatusBar approved={row.keywordApproved} total={row.keywordTotal} /></td>
                        <td style={{ ...TD, ...sRight, background: rowBg }}>
                          <span onClick={() => onViewLineItem(row)}
                            style={{ color: 'var(--osmos-brand-primary)', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: FONT }}>
                            View
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
