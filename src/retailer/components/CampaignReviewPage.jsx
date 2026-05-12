import React, { useState } from 'react';
import { SearchIcon } from '../../ui/atoms/Icon';
import AdPackagesTable from './AdPackagesTable';
import AdPackageDetailView from './AdPackageDetailView';

// Convert a Display Ads campaign row → pkg-shaped object for AdPackageDetailView (singleMode)
function campaignToPkg(c) {
  return {
    id: c.id,
    status: 'Active',
    bookingName: c.name,
    packageName: c.type,
    advId: c.merchant.replace(/\s*\(.*?\)/, '').replace(/\s+/g, '_').toUpperCase(),
    advName: c.merchant.replace(/\s*\(.*?\)/, ''),
    flightStart: c.createdOn.split(',')[0],
    flightEnd: c.changedOn.split(',')[0],
    cost: '—',
    lineItems: 1,
    createdOn: c.createdOn.split(',')[0],
    createdBy: 'System',
    lastUpdated: c.changedOn.split(',')[0],
    creativeApproved: c.creativeApproved,
    creativeTotal: c.creativeTotal,
    kwApproved: c.keywordApproved,
    kwTotal: c.keywordTotal,
  };
}

const CAMPAIGNS = [
  { id: 1,  name: 'Campaign (6th May | …', type: 'Auction',     merchant: 'Whitakers (Whitakers)', createdOn: '06 May 26, 01:13 PM +05:30', bidding: 'CPC', changedOn: '06 May 26, 01:15 PM +05:30', creativeApproved: 0, creativeTotal: 1, keywordApproved: 0, keywordTotal: null },
  { id: 2,  name: 'Campaign (6th May | …', type: 'Auction',     merchant: 'Whitakers (Whitakers)', createdOn: '06 May 26, 01:10 PM +05:30', bidding: 'CPM', changedOn: '06 May 26, 01:11 PM +05:30', creativeApproved: 0, creativeTotal: 1, keywordApproved: 0, keywordTotal: null },
  { id: 3,  name: 'Campaign (6th May | …', type: 'Guaranteed',  merchant: 'Whitakers (Whitakers)', createdOn: '06 May 26, 12:53 PM +05:30', bidding: 'CPM', changedOn: '06 May 26, 12:56 PM +05:30', creativeApproved: 1, creativeTotal: 1, keywordApproved: 0, keywordTotal: 2 },
  { id: 4,  name: 'Campaign (6th May | …', type: 'Auction',     merchant: 'Whitakers (Whitakers)', createdOn: '06 May 26, 12:49 PM +05:30', bidding: 'CPC', changedOn: '06 May 26, 12:54 PM +05:30', creativeApproved: 1, creativeTotal: 1, keywordApproved: 0, keywordTotal: 1 },
  { id: 5,  name: 'Campaign (6th May | …', type: 'Auction',     merchant: 'Whitakers (Whitakers)', createdOn: '06 May 26, 10:50 AM +05:30', bidding: 'CPC', changedOn: '06 May 26, 10:52 AM +05:30', creativeApproved: 1, creativeTotal: 1, keywordApproved: 0, keywordTotal: 1 },
  { id: 6,  name: 'Campaign (6th May | …', type: 'Auction',     merchant: 'Whitakers (Whitakers)', createdOn: '06 May 26, 10:46 AM +05:30', bidding: 'CPM', changedOn: '06 May 26, 10:47 AM +05:30', creativeApproved: 0, creativeTotal: 1, keywordApproved: 0, keywordTotal: null },
  { id: 7,  name: 'Campaign (6th May | …', type: 'Guaranteed',  merchant: 'Whitakers (Whitakers)', createdOn: '06 May 26, 10:23 AM +05:30', bidding: 'CPM', changedOn: '06 May 26, 10:27 AM +05:30', creativeApproved: 0, creativeTotal: 1, keywordApproved: 0, keywordTotal: 2 },
  { id: 8,  name: 'Campaign (6th May | …', type: 'Auction',     merchant: 'Whitakers (Whitakers)', createdOn: '06 May 26, 10:19 AM +05:30', bidding: 'CPC', changedOn: '06 May 26, 10:24 AM +05:30', creativeApproved: 0, creativeTotal: 1, keywordApproved: 0, keywordTotal: 2 },
  { id: 9,  name: '1112',                  type: 'Auction',     merchant: 'Test Seller 11',        createdOn: '05 May 26, 02:35 PM +05:30', bidding: 'CPM', changedOn: '05 May 26, 02:37 PM +05:30', creativeApproved: 0, creativeTotal: 1, keywordApproved: 0, keywordTotal: 2 },
  { id: 10, name: 'Copy of Campaign (3…',  type: 'Auction',     merchant: 'Whitakers (Whitakers)', createdOn: '30 Apr 26, 06:58 PM +05:30', bidding: 'CPC', changedOn: '30 Apr 26, 06:58 PM +05:30', creativeApproved: 0, creativeTotal: 1, keywordApproved: 0, keywordTotal: 2 },
  { id: 11, name: 'Campaign (30th Apr | …',type: 'Guaranteed',  merchant: 'Whitakers (Whitakers)', createdOn: '30 Apr 26, 06:54 PM +05:30', bidding: 'CPM', changedOn: '30 Apr 26, 06:56 PM +05:30', creativeApproved: 0, creativeTotal: 1, keywordApproved: 0, keywordTotal: 2 },
];

const TABS = ['Display Ads', 'Ad Packages', 'In-Store Ads', 'Offsite Ads'];
const PAGE_SIZE = 10;

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--osmos-fg-subtle)', cursor: 'pointer' }}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

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
        {pct > 0 && (
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, borderRadius: 99, background: isComplete ? '#16a34a' : '#4ade80' }} />
        )}
      </div>
      <span style={{ fontSize: 12, color: 'var(--osmos-fg-muted)', fontFamily: "'Open Sans', sans-serif", whiteSpace: 'nowrap' }}>{approved}/{total}</span>
      <InfoIcon />
    </div>
  );
}

const UnderReviewIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <polyline points="1 20 1 14 7 14"/>
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
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <line x1="12" y1="3" x2="12" y2="21"/>
  </svg>
);

const SortIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4, opacity: 0.6 }}>
    <line x1="12" y1="5" x2="12" y2="19"/><polyline points="5 12 12 5 19 12"/>
  </svg>
);

const TH = {
  padding: '10px 14px',
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--osmos-fg-muted)',
  background: 'var(--osmos-bg)',
  borderBottom: '1px solid var(--osmos-border)',
  whiteSpace: 'nowrap',
  textAlign: 'left',
  fontFamily: "'Open Sans', sans-serif",
};

const TD = {
  padding: '11px 14px',
  fontSize: 13,
  color: 'var(--osmos-fg)',
  borderBottom: '1px solid var(--osmos-border)',
  verticalAlign: 'middle',
  fontFamily: "'Open Sans', sans-serif",
  whiteSpace: 'nowrap',
};

// Sticky column helpers
const STICKY_STATUS_W   = 95;
const STICKY_NAME_W     = 180;
const STICKY_VIEW_W     = 60;
const STICKY_KW_W       = 140;
const STICKY_CR_W       = 140;

const stickyLeft0  = { position: 'sticky', left: 0,                                                    zIndex: 2, background: 'var(--osmos-bg)', boxShadow: '2px 0 4px rgba(0,0,0,0.04)' };
const stickyLeft1  = { position: 'sticky', left: STICKY_STATUS_W,                                      zIndex: 2, background: 'var(--osmos-bg)', boxShadow: '2px 0 4px rgba(0,0,0,0.04)' };
const stickyRight2 = { position: 'sticky', right: STICKY_VIEW_W + STICKY_KW_W,                         zIndex: 2, background: 'var(--osmos-bg)' };
const stickyRight1 = { position: 'sticky', right: STICKY_VIEW_W,                                       zIndex: 2, background: 'var(--osmos-bg)' };
const stickyRight  = { position: 'sticky', right: 0,                                                   zIndex: 2, background: 'var(--osmos-bg)', boxShadow: '-2px 0 4px rgba(0,0,0,0.04)' };

function TabBar({ activeTab, setActiveTab }) {
  return (
    <div style={{ display: 'flex', gap: 4, background: 'var(--osmos-bg-subtle)', borderRadius: 8, padding: 3, border: '1px solid var(--osmos-border)' }}>
      {TABS.map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          style={{
            padding: '6px 14px', fontSize: 13,
            fontWeight: activeTab === tab ? 600 : 400,
            fontFamily: "'Open Sans', sans-serif",
            border: 'none', borderRadius: 6, cursor: 'pointer',
            background: activeTab === tab ? 'var(--osmos-bg)' : 'transparent',
            color: activeTab === tab ? 'var(--osmos-fg)' : 'var(--osmos-fg-muted)',
            boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.15s', whiteSpace: 'nowrap',
          }}
        >{tab}</button>
      ))}
    </div>
  );
}

export default function CampaignReviewPage() {
  const [activeTab, setActiveTab] = useState('Display Ads');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [viewCampaign, setViewCampaign] = useState(null);

  // If viewing a campaign in Display Ads, render the detail view (singleMode)
  if (viewCampaign) {
    return <AdPackageDetailView pkg={campaignToPkg(viewCampaign)} singleMode onClose={() => setViewCampaign(null)} />;
  }

  // Non-Display-Ads tabs render their own layout
  if (activeTab !== 'Display Ads') {
    const tabBar = <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />;
    return (
      <div style={{ fontFamily: "'Open Sans', sans-serif", background: 'var(--osmos-bg-subtle)', minHeight: '100vh' }}>
        {activeTab === 'Ad Packages' && <AdPackagesTable tabBarSlot={tabBar} />}
        {(activeTab === 'In-Store Ads' || activeTab === 'Offsite Ads') && (
          <div style={{ padding: '20px 24px', background: 'var(--osmos-bg-subtle)', minHeight: '100vh' }}>
            <div style={{ background: 'var(--osmos-bg)', border: '1px solid var(--osmos-border)', borderRadius: 10, overflow: 'hidden' }}>
              {/* Toolbar — same structure as Display Ads / Ad Packages */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--osmos-border)', gap: 12, flexWrap: 'wrap' }}>
                {tabBar}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
                  <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, border: '1px solid var(--osmos-border)', borderRadius: 6, background: 'var(--osmos-bg)', cursor: 'pointer', color: 'var(--osmos-fg-muted)' }}>
                    <RefreshIcon />
                  </button>
                  <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, border: '1px solid var(--osmos-border)', borderRadius: 6, background: 'var(--osmos-bg)', cursor: 'pointer', color: 'var(--osmos-fg-muted)' }}>
                    <FilterIcon />
                  </button>
                  <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, border: '1px solid var(--osmos-border)', borderRadius: 6, background: 'var(--osmos-bg)', cursor: 'pointer', color: 'var(--osmos-fg-muted)' }}>
                    <ColumnsIcon />
                  </button>
                </div>
              </div>
              {/* Empty state */}
              <div style={{ padding: '72px 24px', textAlign: 'center', color: 'var(--osmos-fg-subtle)', fontSize: 13, fontFamily: "'Open Sans', sans-serif" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🚧</div>
                <div style={{ fontWeight: 600, color: 'var(--osmos-fg-muted)', marginBottom: 6 }}>{activeTab}</div>
                <div>This section is coming soon.</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const filtered = CAMPAIGNS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.merchant.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div style={{ fontFamily: "'Open Sans', sans-serif", padding: '20px 24px', background: 'var(--osmos-bg-subtle)', minHeight: '100vh' }}>
      <div style={{ background: 'var(--osmos-bg)', border: '1px solid var(--osmos-border)', borderRadius: 10, overflow: 'hidden' }}>

      {/* Toolbar row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid var(--osmos-border)',
        gap: 12,
        flexWrap: 'wrap',
      }}>

        {/* Tabs */}
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          {/* Refresh */}
          <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, border: '1px solid var(--osmos-border)', borderRadius: 6, background: 'var(--osmos-bg)', cursor: 'pointer', color: 'var(--osmos-fg-muted)' }}>
            <RefreshIcon />
          </button>

          {/* Filter with badge */}
          <div style={{ position: 'relative' }}>
            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, border: '1px solid var(--osmos-border)', borderRadius: 6, background: 'var(--osmos-bg)', cursor: 'pointer', color: 'var(--osmos-fg-muted)' }}>
              <FilterIcon />
            </button>
            <span style={{
              position: 'absolute', top: -6, right: -6,
              background: '#ef4444', color: '#fff',
              borderRadius: '50%', width: 16, height: 16,
              fontSize: 10, fontWeight: 700, fontFamily: "'Open Sans', sans-serif",
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>4</span>
          </div>

          {/* Columns */}
          <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, border: '1px solid var(--osmos-border)', borderRadius: 6, background: 'var(--osmos-bg)', cursor: 'pointer', color: 'var(--osmos-fg-muted)' }}>
            <ColumnsIcon />
          </button>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
              <SearchIcon size={14} color="var(--osmos-fg-muted)" />
            </span>
            <input
              type="text"
              placeholder="Search Campaign Name"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{
                paddingLeft: 32, paddingRight: 12, paddingTop: 7, paddingBottom: 7,
                border: '1px solid var(--osmos-border)', borderRadius: 6,
                fontSize: 13, outline: 'none',
                background: 'var(--osmos-bg)', color: 'var(--osmos-fg)',
                fontFamily: "'Open Sans', sans-serif",
                width: 240,
              }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: 1000, borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...TH, ...stickyLeft0, width: STICKY_STATUS_W }}>Status</th>
              <th style={{ ...TH, ...stickyLeft1, width: STICKY_NAME_W }}>Campaign Name</th>
              <th style={TH}>Campaign Type</th>
              <th style={TH}>Merchant Name</th>
              <th style={{ ...TH, borderBottom: '2px solid var(--osmos-brand-primary)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  Campaign Created On <SortIcon />
                </span>
              </th>
              <th style={TH}>Bidding Strategy</th>
              <th style={TH}>Last Changed On</th>
              <th style={{ ...TH, ...stickyRight2, width: STICKY_CR_W }}>Creative Status</th>
              <th style={{ ...TH, ...stickyRight1, width: STICKY_KW_W }}>Keyword Status</th>
              <th style={{ ...TH, ...stickyRight, width: STICKY_VIEW_W }}></th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ ...TD, textAlign: 'center', color: 'var(--osmos-fg-subtle)', padding: '40px 16px' }}>
                  No campaigns found.
                </td>
              </tr>
            ) : pageRows.map(row => (
              <tr
                key={row.id}
                onMouseEnter={() => setHoveredRow(row.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{ background: hoveredRow === row.id ? 'var(--osmos-bg-subtle)' : 'var(--osmos-bg)', transition: 'background 0.12s' }}
              >
                {/* Status — sticky left 0 */}
                <td style={{ ...TD, ...stickyLeft0, background: hoveredRow === row.id ? 'var(--osmos-bg-subtle)' : 'var(--osmos-bg)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: '#d97706' }}>
                    <UnderReviewIcon />
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#d97706', fontFamily: "'Open Sans', sans-serif", whiteSpace: 'nowrap' }}>Under Review</span>
                  </div>
                </td>
                {/* Campaign Name — sticky left 1 */}
                <td style={{ ...TD, ...stickyLeft1, background: hoveredRow === row.id ? 'var(--osmos-bg-subtle)' : 'var(--osmos-bg)' }}>{row.name}</td>
                <td style={{ ...TD, color: 'var(--osmos-fg-muted)' }}>{row.type}</td>
                <td style={{ ...TD, color: 'var(--osmos-fg-muted)' }}>{row.merchant.replace(/\s*\(.*?\)/, '')}</td>
                <td style={{ ...TD, color: 'var(--osmos-fg-muted)' }}>{row.createdOn}</td>
                <td style={{ ...TD, color: 'var(--osmos-fg-muted)' }}>{row.bidding}</td>
                <td style={{ ...TD, color: 'var(--osmos-fg-muted)' }}>{row.changedOn}</td>
                <td style={{ ...TD, ...stickyRight2, background: hoveredRow === row.id ? 'var(--osmos-bg-subtle)' : 'var(--osmos-bg)' }}><StatusBar approved={row.creativeApproved} total={row.creativeTotal} /></td>
                <td style={{ ...TD, ...stickyRight1, background: hoveredRow === row.id ? 'var(--osmos-bg-subtle)' : 'var(--osmos-bg)' }}><StatusBar approved={row.keywordApproved} total={row.keywordTotal} /></td>
                {/* View — sticky right */}
                <td style={{ ...TD, ...stickyRight, background: hoveredRow === row.id ? 'var(--osmos-bg-subtle)' : 'var(--osmos-bg)' }}>
                  <span onClick={() => setViewCampaign(row)}
                    style={{ color: 'var(--osmos-brand-primary)', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: "'Open Sans', sans-serif" }}>
                    View
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer pagination */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px', borderTop: '1px solid var(--osmos-border)',
        fontSize: 13, color: 'var(--osmos-fg-muted)',
      }}>
        <span>Showing {pageRows.length} of {filtered.length} campaigns</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            disabled={safePage === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            style={{ padding: '4px 10px', border: '1px solid var(--osmos-border)', borderRadius: 5, background: 'var(--osmos-bg)', cursor: safePage === 1 ? 'not-allowed' : 'pointer', opacity: safePage === 1 ? 0.4 : 1, fontSize: 12, fontFamily: "'Open Sans', sans-serif", color: 'var(--osmos-fg)' }}
          >‹ Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
            <button
              key={pg}
              onClick={() => setPage(pg)}
              style={{
                width: 28, height: 28, borderRadius: 5,
                border: '1px solid var(--osmos-border)',
                background: pg === safePage ? 'var(--osmos-brand-primary)' : 'var(--osmos-bg)',
                color: pg === safePage ? '#fff' : 'var(--osmos-fg)',
                cursor: 'pointer', fontSize: 12, fontWeight: 600,
                fontFamily: "'Open Sans', sans-serif",
              }}
            >{pg}</button>
          ))}
          <button
            disabled={safePage === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            style={{ padding: '4px 10px', border: '1px solid var(--osmos-border)', borderRadius: 5, background: 'var(--osmos-bg)', cursor: safePage === totalPages ? 'not-allowed' : 'pointer', opacity: safePage === totalPages ? 0.4 : 1, fontSize: 12, fontFamily: "'Open Sans', sans-serif", color: 'var(--osmos-fg)' }}
          >Next ›</button>
        </div>
      </div>
      </div>
    </div>
  );
}
