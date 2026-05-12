import React, { useState } from 'react';
import { SearchIcon } from '../../ui/atoms/Icon';
import AdPackageDetailView from './AdPackageDetailView';
import LineItemListDrawer from './LineItemListDrawer';

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--osmos-fg-subtle)', cursor: 'pointer', flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);

const ColumnsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="3" x2="12" y2="21"/>
  </svg>
);

function ProgressBar({ approved, total }) {
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
      <span style={{ fontSize: 12, color: 'var(--osmos-fg-muted)', whiteSpace: 'nowrap', fontFamily: "'Open Sans', sans-serif" }}>{approved}/{total}</span>
      <InfoIcon />
    </div>
  );
}

const PACKAGES = [
  { id: 1,  status: 'Active',    bookingName: 'some bookign 1',       packageName: 'navi',                    advId: 'TEST_SELLER_ID_1', advName: 'Test Seller 11',       flightStart: '15 Dec 25', flightEnd: '15 Dec 25', cost: '₹1,200', lineItems: 1, createdOn: '04 Dec 25', createdBy: 'Vivek',            lastUpdated: '15 Dec 25', creativeApproved: 1, creativeTotal: 1, kwApproved: 1, kwTotal: 1 },
  { id: 2,  status: 'Active',    bookingName: 'naya booking 1',       packageName: 'Demo PCKG RW Regression', advId: 'TEST_SELLER_ID_1', advName: 'Test Seller 11',       flightStart: '14 Nov 25', flightEnd: '21 Nov 25', cost: '₹800',   lineItems: 1, createdOn: '18 Nov 25', createdBy: 'Ayan Khokhar',     lastUpdated: '21 Nov 25', creativeApproved: 1, creativeTotal: 1, kwApproved: 1, kwTotal: 1 },
  { id: 3,  status: 'Cancelled', bookingName: 'pp test 271',          packageName: 'QA_automation_Package',   advId: 'TEST_SELLER_ID_1', advName: 'Test Seller 11',       flightStart: '01 Oct 26', flightEnd: '02 Oct 26', cost: '₹60',    lineItems: 1, createdOn: '27 Jan 26', createdBy: 'Priyanshu Pandey', lastUpdated: '27 Apr 26', creativeApproved: 1, creativeTotal: 1, kwApproved: 1, kwTotal: 1 },
  { id: 4,  status: 'Cancelled', bookingName: 'sdsdd',                packageName: 'AASASS',                  advId: 'TEST_SELLER_ID_1', advName: 'Test Seller 11',       flightStart: '21 Apr 26', flightEnd: '30 Apr 26', cost: '₹1,000', lineItems: 2, createdOn: '31 Mar 26', createdBy: 'Rahul Waghmare',   lastUpdated: '20 Apr 26', creativeApproved: 1, creativeTotal: 1, kwApproved: 0, kwTotal: 1 },
  { id: 5,  status: 'Cancelled', bookingName: 'pp test 271 2',        packageName: 'QA_automation_Package',   advId: 'TEST_SELLER_ID_1', advName: 'Test Seller 11',       flightStart: '01 Oct 26', flightEnd: '02 Oct 26', cost: '₹60',    lineItems: 3, createdOn: '27 Jan 26', createdBy: 'Priyanshu Pandey', lastUpdated: '18 Apr 26', creativeApproved: 1, creativeTotal: 1, kwApproved: 0, kwTotal: 2 },
  { id: 6,  status: 'Cancelled', bookingName: 'Test12312',            packageName: "QA SPA Package Don't Delete", advId: 'TEST_SELLER_ID_1', advName: 'Test Seller 11',  flightStart: '16 Apr 26', flightEnd: '17 Apr 26', cost: '₹37',    lineItems: 2, createdOn: '06 Apr 26', createdBy: 'Parth Patel',      lastUpdated: '14 Apr 26', creativeApproved: 0, creativeTotal: null, kwApproved: 0, kwTotal: null },
  { id: 7,  status: 'Cancelled', bookingName: 'AIO Booking 3',        packageName: 'All in one [DO NOT USE]', advId: 'Whitakers',        advName: 'Whitakers (Whitakers)', flightStart: '01 Apr 26', flightEnd: '02 Apr 26', cost: '₹500',   lineItems: 4, createdOn: '31 Mar 26', createdBy: 'Shabbar Adamjee',  lastUpdated: '31 Mar 26', creativeApproved: 0, creativeTotal: 2,    kwApproved: 0, kwTotal: 2 },
  { id: 8,  status: 'Cancelled', bookingName: 'AIO Booking 2',        packageName: 'All in one [DO NOT USE]', advId: 'Whitakers',        advName: 'Whitakers (Whitakers)', flightStart: '01 Apr 26', flightEnd: '02 Apr 26', cost: '₹500',   lineItems: 4, createdOn: '31 Mar 26', createdBy: 'Shabbar Adamjee',  lastUpdated: '31 Mar 26', creativeApproved: 0, creativeTotal: 2,    kwApproved: 0, kwTotal: 2 },
  { id: 9,  status: 'Cancelled', bookingName: 'AIO Booking 1',        packageName: 'All in one [DO NOT USE]', advId: 'Whitakers',        advName: 'Whitakers (Whitakers)', flightStart: '01 Apr 26', flightEnd: '02 Apr 26', cost: '₹500',   lineItems: 4, createdOn: '31 Mar 26', createdBy: 'Shabbar Adamjee',  lastUpdated: '31 Mar 26', creativeApproved: 2, creativeTotal: 2,    kwApproved: 2, kwTotal: 2 },
  { id: 10, status: 'Cancelled', bookingName: 'test cancel booking',  packageName: 'AASASS',                  advId: 'TEST_SELLER_ID_1', advName: 'Test Seller 11',       flightStart: '21 May 26', flightEnd: '30 May 26', cost: '₹1,000', lineItems: 1, createdOn: '23 Mar 26', createdBy: 'Darshak Talaviya', lastUpdated: '23 Mar 26', creativeApproved: 1, creativeTotal: 1, kwApproved: 1, kwTotal: 1 },
  { id: 11, status: 'Cancelled', bookingName: 'ohmkay',               packageName: 'NEW Regression test PCG', advId: 'Whitakers',        advName: 'Whitakers (Whitakers)', flightStart: '19 Mar 26', flightEnd: '19 Mar 26', cost: '₹10K',   lineItems: 1, createdOn: '16 Mar 26', createdBy: 'Darshak Talaviya', lastUpdated: '16 Mar 26', creativeApproved: 1, creativeTotal: 1, kwApproved: 1, kwTotal: 1 },
  { id: 12, status: 'Cancelled', bookingName: 'QaBooking_V348B',      packageName: 'QA_automation_Package',   advId: 'Whitakers',        advName: 'Whitakers (Whitakers)', flightStart: '03 Oct 26', flightEnd: '04 Oct 26', cost: '₹60',    lineItems: 8, createdOn: '05 Feb 26', createdBy: 'Rajesh',           lastUpdated: '09 Mar 26', creativeApproved: 0, creativeTotal: 1, kwApproved: 0, kwTotal: 1 },
];

const PAGE_SIZE = 10;

const STATUS_CONFIG = {
  Active:    { dot: '#16a34a', text: '#16a34a', bg: 'rgba(22,163,74,0.08)',  label: 'Active' },
  Cancelled: { dot: '#ef4444', text: '#ef4444', bg: 'rgba(239,68,68,0.08)', label: 'Cancelled', icon: true },
};

function StatusCell({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Cancelled;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      {cfg.icon ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cfg.dot} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      ) : (
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot }} />
      )}
      <span style={{ fontSize: 10, fontWeight: 600, color: cfg.text, fontFamily: "'Open Sans', sans-serif" }}>{cfg.label}</span>
    </div>
  );
}

const STICKY_BG = 'var(--osmos-bg)';
const STICKY_SHADOW_L = '4px 0 8px -2px rgba(0,0,0,0.08)';
const STICKY_SHADOW_R = '-4px 0 8px -2px rgba(0,0,0,0.08)';

const TH_BASE = { padding: '10px 14px', fontSize: 11, fontWeight: 700, color: 'var(--osmos-fg-muted)', background: STICKY_BG, borderBottom: '1px solid var(--osmos-border)', whiteSpace: 'nowrap', textAlign: 'left', fontFamily: "'Open Sans', sans-serif" };
const TD_BASE = { padding: '11px 14px', fontSize: 13, color: 'var(--osmos-fg)', borderBottom: '1px solid var(--osmos-border)', verticalAlign: 'middle', fontFamily: "'Open Sans', sans-serif", background: 'inherit' };

const stickyLeft  = (left, isLast) => ({ position: 'sticky', left, zIndex: 2, background: STICKY_BG, boxShadow: isLast ? STICKY_SHADOW_L : 'none' });
const stickyRight = (right, isFirst) => ({ position: 'sticky', right, zIndex: 2, background: STICKY_BG, boxShadow: isFirst ? STICKY_SHADOW_R : 'none' });

const SortIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 3, opacity: 0.55 }}>
    <line x1="12" y1="5" x2="12" y2="19"/><polyline points="5 12 12 5 19 12"/>
  </svg>
);

export default function AdPackagesTable({ tabBarSlot }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [drawerPkg, setDrawerPkg] = useState(null);          // shows line items drawer
  const [detailCtx, setDetailCtx] = useState(null);          // { pkg, lineItem } → full detail view

  const filtered = PACKAGES.filter(p =>
    p.bookingName.toLowerCase().includes(search.toLowerCase()) ||
    p.packageName.toLowerCase().includes(search.toLowerCase()) ||
    p.advName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  if (detailCtx) {
    return <AdPackageDetailView pkg={detailCtx.pkg} initialLineItem={detailCtx.lineItem} onClose={() => setDetailCtx(null)} />;
  }

  return (
    <div style={{ fontFamily: "'Open Sans', sans-serif", padding: '20px 24px', background: 'var(--osmos-bg-subtle)', minHeight: '100vh' }}>
      <div style={{ background: 'var(--osmos-bg)', border: '1px solid var(--osmos-border)', borderRadius: 10, overflow: 'hidden' }}>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--osmos-border)', gap: 12, flexWrap: 'wrap' }}>
          {tabBarSlot}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, border: '1px solid var(--osmos-border)', borderRadius: 6, background: 'var(--osmos-bg)', cursor: 'pointer', color: 'var(--osmos-fg-muted)' }}>
              <RefreshIcon />
            </button>
            <div style={{ position: 'relative' }}>
              <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, border: '1px solid var(--osmos-border)', borderRadius: 6, background: 'var(--osmos-bg)', cursor: 'pointer', color: 'var(--osmos-fg-muted)' }}>
                <FilterIcon />
              </button>
              <span style={{ position: 'absolute', top: -6, right: -6, background: '#ef4444', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: 10, fontWeight: 700, fontFamily: "'Open Sans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>4</span>
            </div>
            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, border: '1px solid var(--osmos-border)', borderRadius: 6, background: 'var(--osmos-bg)', cursor: 'pointer', color: 'var(--osmos-fg-muted)' }}>
              <ColumnsIcon />
            </button>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
                <SearchIcon size={14} color="var(--osmos-fg-muted)" />
              </span>
              <input
                type="text"
                placeholder="Search booking or package…"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 7, paddingBottom: 7, border: '1px solid var(--osmos-border)', borderRadius: 6, fontSize: 13, outline: 'none', background: 'var(--osmos-bg)', color: 'var(--osmos-fg)', fontFamily: "'Open Sans', sans-serif", width: 240 }}
              />
            </div>
          </div>
        </div>

        {/* Scrollable table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' }}>
            <thead>
              <tr>
                {/* STICKY LEFT */}
                <th style={{ ...TH_BASE, ...stickyLeft(0, false), width: 80, textAlign: 'center' }}>Status</th>
                <th style={{ ...TH_BASE, ...stickyLeft(80, true), minWidth: 160 }}>Booking Name</th>
                {/* SCROLLABLE */}
                <th style={{ ...TH_BASE, minWidth: 180 }}>Package Name</th>
                <th style={{ ...TH_BASE, minWidth: 80 }}>No. of Line Items</th>
                <th style={{ ...TH_BASE, minWidth: 140 }}>Advertiser ID</th>
                <th style={{ ...TH_BASE, minWidth: 150 }}>Advertiser Name</th>
                <th style={{ ...TH_BASE, minWidth: 120 }}>Flight Start Date</th>
                <th style={{ ...TH_BASE, minWidth: 120 }}>Flight End Date</th>
                <th style={{ ...TH_BASE, minWidth: 110 }}>Booking Cost</th>
                <th style={{ ...TH_BASE, minWidth: 110 }}>Creation Date</th>
                <th style={{ ...TH_BASE, minWidth: 150 }}>Created By</th>
                <th style={{ ...TH_BASE, minWidth: 150, borderBottom: '2px solid var(--osmos-brand-primary)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>Last Update Date <SortIcon /></span>
                </th>
                {/* STICKY RIGHT */}
                <th style={{ ...TH_BASE, ...stickyRight(200, true), minWidth: 160 }}>Total Creative Status</th>
                <th style={{ ...TH_BASE, ...stickyRight(80, false), minWidth: 140 }}>Total Keyword Status</th>
                <th style={{ ...TH_BASE, ...stickyRight(0, false), width: 80, textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={15} style={{ ...TD_BASE, textAlign: 'center', color: 'var(--osmos-fg-subtle)', padding: '40px 16px' }}>
                    No packages found.
                  </td>
                </tr>
              ) : pageRows.map(row => {
                const hovered = hoveredRow === row.id;
                const bg = hovered ? 'var(--osmos-bg-subtle)' : 'var(--osmos-bg)';
                const tdHover = { ...TD_BASE, background: bg, transition: 'background 0.1s' };
                return (
                  <tr key={row.id} onMouseEnter={() => setHoveredRow(row.id)} onMouseLeave={() => setHoveredRow(null)} style={{ background: bg, transition: 'background 0.1s' }}>
                    {/* STICKY LEFT */}
                    <td style={{ ...tdHover, ...stickyLeft(0, false), background: bg, textAlign: 'center' }}>
                      <StatusCell status={row.status} />
                    </td>
                    <td style={{ ...tdHover, ...stickyLeft(80, true), background: bg }}>
                      <span style={{ color: 'var(--osmos-brand-primary)', fontWeight: 600, cursor: 'pointer' }}>{row.bookingName}</span>
                    </td>
                    {/* SCROLLABLE */}
                    <td style={{ ...tdHover, color: 'var(--osmos-fg-muted)' }}>{row.packageName}</td>
                    <td style={{ ...tdHover, color: 'var(--osmos-fg-muted)', textAlign: 'center' }}>{Math.max(row.lineItems, 5)}</td>
                    <td style={{ ...tdHover, color: 'var(--osmos-fg-muted)', fontSize: 11 }}>{row.advId}</td>
                    <td style={{ ...tdHover, color: 'var(--osmos-fg-muted)' }}>{row.advName}</td>
                    <td style={{ ...tdHover, color: 'var(--osmos-fg-muted)' }}>{row.flightStart}</td>
                    <td style={{ ...tdHover, color: 'var(--osmos-fg-muted)' }}>{row.flightEnd}</td>
                    <td style={{ ...tdHover, fontWeight: 600 }}>{row.cost}</td>
                    <td style={{ ...tdHover, color: 'var(--osmos-fg-muted)' }}>{row.createdOn}</td>
                    <td style={{ ...tdHover, color: 'var(--osmos-fg-muted)' }}>{row.createdBy}</td>
                    <td style={{ ...tdHover, color: 'var(--osmos-fg-muted)' }}>{row.lastUpdated}</td>
                    {/* STICKY RIGHT */}
                    <td style={{ ...tdHover, ...stickyRight(200, true), background: bg }}>
                      <ProgressBar approved={row.creativeApproved} total={row.creativeTotal} />
                    </td>
                    <td style={{ ...tdHover, ...stickyRight(80, false), background: bg }}>
                      <ProgressBar approved={row.kwApproved} total={row.kwTotal} />
                    </td>
                    <td style={{ ...tdHover, ...stickyRight(0, false), background: bg, textAlign: 'center' }}>
                      <span
                        onClick={() => setDrawerPkg(row)}
                        style={{ color: 'var(--osmos-brand-primary)', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: "'Open Sans', sans-serif" }}
                      >View</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderTop: '1px solid var(--osmos-border)', fontSize: 13, color: 'var(--osmos-fg-muted)' }}>
          <span>Showing {pageRows.length} of {filtered.length} packages</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button disabled={safePage === 1} onClick={() => setPage(p => Math.max(1, p - 1))}
              style={{ padding: '4px 10px', border: '1px solid var(--osmos-border)', borderRadius: 5, background: 'var(--osmos-bg)', cursor: safePage === 1 ? 'not-allowed' : 'pointer', opacity: safePage === 1 ? 0.4 : 1, fontSize: 12, fontFamily: "'Open Sans', sans-serif", color: 'var(--osmos-fg)' }}>
              ‹ Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
              <button key={pg} onClick={() => setPage(pg)}
                style={{ width: 28, height: 28, borderRadius: 5, border: '1px solid var(--osmos-border)', background: pg === safePage ? 'var(--osmos-brand-primary)' : 'var(--osmos-bg)', color: pg === safePage ? '#fff' : 'var(--osmos-fg)', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: "'Open Sans', sans-serif" }}>
                {pg}
              </button>
            ))}
            <button disabled={safePage === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              style={{ padding: '4px 10px', border: '1px solid var(--osmos-border)', borderRadius: 5, background: 'var(--osmos-bg)', cursor: safePage === totalPages ? 'not-allowed' : 'pointer', opacity: safePage === totalPages ? 0.4 : 1, fontSize: 12, fontFamily: "'Open Sans', sans-serif", color: 'var(--osmos-fg)' }}>
              Next ›
            </button>
          </div>
        </div>
      </div>

      {/* Line Items drawer */}
      {drawerPkg && (
        <LineItemListDrawer
          pkg={drawerPkg}
          onClose={() => setDrawerPkg(null)}
          onViewLineItem={(lineItem) => setDetailCtx({ pkg: drawerPkg, lineItem })}
        />
      )}
    </div>
  );
}
