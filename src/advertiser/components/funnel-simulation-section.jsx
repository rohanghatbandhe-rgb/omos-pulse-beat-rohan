import { useEffect, useMemo, useRef, useState } from 'react';
import { SectionCard, InfoIcon, Icon } from '../../ui';

// ── Accessibility floor: one-time stylesheet injection ────────────────────────
// Adds focus-visible rings (WCAG 2.4.7), prefers-reduced-motion guard (2.3.3),
// dashed ghost-band differentiator (1.4.1 color-not-only-channel),
// and reveal slide-in (Doherty / non-jarring layout shift).
let __fsInjected = false;
function injectFunnelSimStyles() {
  if (__fsInjected || typeof document === 'undefined') return;
  __fsInjected = true;
  const css = `
    .fs-focus:focus-visible {
      outline: 2px solid var(--osmos-brand-primary);
      outline-offset: 2px;
      border-radius: 4px;
    }
    .fs-tier-btn:focus-visible {
      outline: 2px solid var(--osmos-brand-primary);
      outline-offset: -2px;
      border-radius: 6px;
    }
    .fs-ghost-band {
      background-image: repeating-linear-gradient(
        45deg,
        var(--osmos-brand-primary) 0,
        var(--osmos-brand-primary) 2px,
        transparent 2px,
        transparent 5px
      );
      background-color: transparent;
      opacity: 0.55;
    }
    @media (prefers-reduced-motion: reduce) {
      .fs-anim { transition: none !important; animation: none !important; }
    }
    @keyframes fsRejectionSlideIn {
      from { opacity: 0; transform: translateY(-4px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .fs-rejection-row { animation: fsRejectionSlideIn 150ms ease-out both; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
}

// ── Design tokens ─────────────────────────────────────────────────────────────
const FONT     = "'Open Sans', sans-serif";
const TEXT     = 'var(--osmos-fg)';
const TEXT_MID = 'var(--osmos-fg-muted)';
const TEXT_SUB = 'var(--osmos-fg-subtle)';
const BORDER   = 'var(--osmos-border)';
const BG       = 'var(--osmos-bg)';
const BG_SUB   = 'var(--osmos-bg-subtle)';
const ACCENT   = 'var(--osmos-brand-primary)';
const ACCENT_M = 'var(--osmos-brand-primary-muted)';
const GREEN    = 'var(--osmos-brand-green)';
const GREEN_M  = 'var(--osmos-brand-green-muted)';
const AMBER    = 'var(--osmos-brand-amber)';

// ── Icons ─────────────────────────────────────────────────────────────────────
const SparklesIcon = ({ size = 14, color = ACCENT }) => (
  <Icon size={size} color={color}>
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z" />
  </Icon>
);

const CheckCircleIcon = ({ size = 14, color = GREEN }) => (
  <Icon size={size} color={color}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </Icon>
);

const XCircleIcon = ({ size = 14, color = TEXT_SUB }) => (
  <Icon size={size} color={color}>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </Icon>
);

const HourglassIcon = ({ size = 28, color = AMBER }) => (
  <Icon size={size} color={color}>
    <path d="M5 22h14" />
    <path d="M5 2h14" />
    <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
    <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
  </Icon>
);

// ── Format helpers ─────────────────────────────────────────────────────────────
function fmtCompact(v) {
  const abs = Math.abs(v);
  if (abs >= 1_000_000) return (v / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (abs >= 1_000)     return (v / 1_000).toFixed(0) + 'K';
  return String(Math.round(v));
}

function fmtCurrency(v) {
  const abs = Math.abs(v);
  if (abs >= 1_00_000) return '₹' + (v / 1_00_000).toFixed(1).replace(/\.0$/, '') + 'L'; // lakhs
  if (abs >= 1_000)    return '₹' + (v / 1_000).toFixed(0) + 'K';
  return '₹' + Math.round(v);
}

const round100 = (n) => Math.max(100, Math.round(n / 100) * 100);

// ── Tier model ─────────────────────────────────────────────────────────────────
// Anchored to Budgeting PRD §4.3 Spend Flexibility:
//   Conservative = 1.2× ADB cap, Standard = 2.0× ADB cap.
// Recommended sits between (1.64× — Sofie's pick by default).
function buildTiers(currentBudget) {
  // Sublabels use a consistent multiplier-first axis (Nielsen H4: consistency).
  // Anchored to Budgeting PRD §4.3 Spend Flexibility caps: 1.2× / 1.64× (Sofie) / 2.0×.
  return [
    { id: 'conservative', label: 'Conservative', sublabel: '1.2× current',          budget: round100(currentBudget * 1.20) },
    { id: 'recommended',  label: 'Recommended',  sublabel: "1.6× · Sofie's pick",   budget: round100(currentBudget * 1.64) },
    { id: 'aggressive',   label: 'Aggressive',   sublabel: '2.0× · stretch',        budget: round100(currentBudget * 2.00) },
  ];
}

// Funnel projections — band-based, not point-based.
//
// Why bands: the underlying tech (Funnel Predictor + Forecasting API + DeepAR
// model per `Tech Spec: Funnel Predictor Enhancements`) outputs probabilistic
// predictions with a `confidence_score` per item-group, plus explicit
// upper/lower bounds per the bid-range methodology
// (Lower bound / Upper bound / average, gap-clamped). Showing a single point
// would misrepresent the model — every projection is a range with a median.
//
// In production the band comes from the API. Here we derive it from a
// confidence value (default 0.78 = typical post-Learning-Mode prediction):
//   confidence 0.95 → ±6% band     (very tight, mature campaign)
//   confidence 0.78 → ±13% band    (default — 28+ days of signal)
//   confidence 0.60 → ±22% band    (wide — limited history)
//   confidence < 0.40 → Learning Mode upstream (no projection rendered)
function bandOf(mid, confidence) {
  const halfWidth = (1 - confidence) * 0.6;  // 0.78 → ±13%
  return {
    low:  Math.max(0, Math.round(mid * (1 - halfWidth))),
    mid:  Math.round(mid),
    high: Math.round(mid * (1 + halfWidth)),
  };
}

function projectFunnel(b, confidence = 0.78) {
  return {
    confidence,
    reach:   bandOf(b * 840,   confidence),  // total impressions (top of funnel)
    pdp:     bandOf(b * 360,   confidence),  // PDP views (mid)
    orders:  bandOf(b * 0.124, confidence),  // orders (bottom)
    revenue: bandOf(b * 186,   confidence),  // revenue
    roi:     6.2,                             // constant; replaced by Sofie service in v1.5
  };
}

// ── Eligibility / Learning Mode mock ─────────────────────────────────────────
const MOCK_LEARNING = {
  campaignName: 'New Campaign',
  campaignType: 'Smart Shopping',
  criteria: [
    { label: 'Smart Shopping campaign',          met: true,  detail: null },
    { label: 'Campaign active with recent data', met: true,  detail: null },
    { label: 'Product organic activity',         met: false, detail: '12% of 30% threshold' },
    { label: 'Sufficient marketplace signals',   met: false, detail: 'Needs 2–3 more days' },
  ],
};

// ── Tier Segmented Control ────────────────────────────────────────────────────
// Implements ARIA radiogroup APG (WCAG 2.1.1):
//   - selected radio = tabIndex 0; others = tabIndex -1 (roving tabindex)
//   - ArrowLeft/ArrowRight cycles selection
//   - Home/End jump to first/last
function TierSegmented({ tiers, value, onChange }) {
  const buttonsRef = useRef([]);

  const moveSelection = (idx) => {
    const next = (idx + tiers.length) % tiers.length;
    onChange(tiers[next].id);
    requestAnimationFrame(() => buttonsRef.current[next]?.focus());
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); moveSelection(idx + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); moveSelection(idx - 1); }
    else if (e.key === 'Home') { e.preventDefault(); moveSelection(0); }
    else if (e.key === 'End')  { e.preventDefault(); moveSelection(tiers.length - 1); }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Suggested budget tier"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${tiers.length}, 1fr)`,
        gap: 0,
        background: BG_SUB,
        padding: 4,
        borderRadius: 8,
        fontFamily: FONT,
      }}
    >
      {tiers.map((t, idx) => {
        const selected = value === t.id;
        return (
          <button
            key={t.id}
            ref={(el) => { buttonsRef.current[idx] = el; }}
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className="fs-tier-btn fs-anim"
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              padding: '8px 10px',
              minHeight: 44,                  // WCAG 2.5.8 AAA target size
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              background: selected ? BG : 'transparent',
              boxShadow: selected ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              transition: 'background 0.15s ease',
              fontFamily: FONT,
            }}
          >
            <span style={{
              fontSize: 13,
              fontWeight: 600,
              color: selected ? TEXT : TEXT_MID,
            }}>
              {t.label}
            </span>
            <span style={{
              fontSize: 11,
              color: selected ? ACCENT : TEXT_SUB,
              fontWeight: selected ? 600 : 400,
            }}>
              ₹{t.budget.toLocaleString('en-IN')}/day · {t.sublabel}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Band Legend strip (WCAG 1.4.1, Nielsen H6 recognition over recall) ───────
function BandLegend() {
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14,
      padding: '8px 0 0',
      fontSize: 11,
      color: TEXT_MID,
      fontFamily: FONT,
    }}>
      {/* Solid current band */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          display: 'inline-block', width: 22, height: 8, borderRadius: 4, background: ACCENT,
        }} />
        <span>At your current budget</span>
      </div>
      {/* Dashed ghost band */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span
          className="fs-ghost-band"
          style={{ display: 'inline-block', width: 22, height: 8, borderRadius: 4 }}
        />
        <span>Forecast range at new budget</span>
      </div>
      {/* Median tick */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          display: 'inline-block', width: 2, height: 12, background: ACCENT, opacity: 0.75,
        }} />
        <span>Model's median</span>
      </div>
    </div>
  );
}

// ── Funnel Row (band-based: low–high range, not a single point) ─────────────
// `current` and `ideal` are { low, mid, high } triples produced by bandOf().
function FunnelRow({ label, sublabel, current, ideal, format, emphasis = false }) {
  const fmt    = format === 'currency' ? fmtCurrency : fmtCompact;
  const trackH = emphasis ? 14 : 10;

  // Axis spans 0 → ideal.high. Both bands map to it.
  const axisMax    = Math.max(ideal.high, 1);
  const cLowPct    = Math.min((current.low  / axisMax) * 100, 100);
  const cHighPct   = Math.min((current.high / axisMax) * 100, 100);
  const cMidPct    = Math.min((current.mid  / axisMax) * 100, 100);
  const iLowPct    = Math.min((ideal.low    / axisMax) * 100, 100);
  const iMidPct    = Math.min((ideal.mid    / axisMax) * 100, 100);
  // ideal.high == axisMax → 100%

  // Delta range: low end = ideal.low − current.high (worst-case unlock),
  //              high end = ideal.high − current.low (best-case unlock).
  const deltaLow  = Math.max(0, ideal.low  - current.high);
  const deltaHigh = Math.max(0, ideal.high - current.low);

  return (
    <div style={{ padding: '14px 0', borderBottom: `1px solid ${BORDER}` }}>
      {/* Label + value-range row */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8, gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
          <span style={{
            fontSize: emphasis ? 14 : 13,
            fontWeight: emphasis ? 700 : 600,
            color: TEXT,
          }}>
            {label}
          </span>
          {sublabel && (
            <span style={{ fontSize: 11, color: TEXT_SUB }}>{sublabel}</span>
          )}
        </div>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1,
          fontVariantNumeric: 'tabular-nums',
        }}>
          <span style={{ fontSize: 11, color: TEXT_SUB }}>
            now {fmt(current.low)}–{fmt(current.high)}
          </span>
          <span style={{
            fontSize: emphasis ? 15 : 13,
            fontWeight: 700,
            color: TEXT,
          }}>
            {fmt(ideal.low)}–{fmt(ideal.high)}
          </span>
        </div>
      </div>

      {/* Band track: ghost = ideal range (dashed pattern), solid = current range, ticks at medians */}
      <div style={{
        position: 'relative',
        height: trackH,
        borderRadius: trackH / 2,
        background: BG_SUB,
        overflow: 'hidden',
      }}>
        {/* Ideal band ghost (low → high) — dashed pattern (WCAG 1.4.1 not color-only) */}
        <div
          className="fs-ghost-band fs-anim"
          style={{
            position: 'absolute',
            left:  `${iLowPct}%`,
            width: `${100 - iLowPct}%`,
            top: 0, bottom: 0,
            transition: 'left 280ms cubic-bezier(0.16, 1, 0.3, 1), width 280ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
        {/* Current band solid (low → high) */}
        <div
          className="fs-anim"
          style={{
            position: 'absolute',
            left:  `${cLowPct}%`,
            width: `${Math.max(2, cHighPct - cLowPct)}%`,
            top: 0, bottom: 0,
            background: ACCENT,
            transition: 'left 280ms cubic-bezier(0.16, 1, 0.3, 1), width 280ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
        {/* Ideal median tick */}
        <div
          className="fs-anim"
          style={{
            position: 'absolute',
            left: `${iMidPct}%`,
            top: -2, bottom: -2,
            width: 2,
            background: ACCENT,
            opacity: 0.75,
            transform: 'translateX(-50%)',
            transition: 'left 280ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
        {/* Current median tick (white sliver inside solid) */}
        <div
          className="fs-anim"
          style={{
            position: 'absolute',
            left: `${cMidPct}%`,
            top: 2, bottom: 2,
            width: 2,
            background: BG,
            transform: 'translateX(-50%)',
            transition: 'left 280ms cubic-bezier(0.16, 1, 0.3, 1),',
          }}
        />
      </div>

      {/* Delta range pill */}
      {deltaHigh > 0 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '2px 8px',
            borderRadius: 999,
            background: GREEN_M,
            color: GREEN,
            fontSize: 11,
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
          }}>
            +{fmt(deltaLow)}–{fmt(deltaHigh)} unlocked
          </span>
        </div>
      )}
    </div>
  );
}

// ── FunnelSimulationSection ───────────────────────────────────────────────────
export function FunnelSimulationSection({
  budgetPerDay,
  onUseIdealBudget,
  onAdjustBudget,
  lastActionedAt = null,
}) {
  const [tier, setTier]                       = useState('recommended');
  const [showRejection, setShowRejection]     = useState(false);
  const [applied, setApplied]                 = useState(null); // { value, at }
  const [isLearning]                          = useState(false);
  const [liveMessage, setLiveMessage]         = useState('');   // aria-live announcement

  // Inject focus-visible + reduced-motion + dashed-band styles once
  useEffect(() => { injectFunnelSimStyles(); }, []);

  const currentBudget = parseFloat(budgetPerDay) || 0;

  const tiers          = useMemo(() => buildTiers(currentBudget), [currentBudget]);
  const selectedTier   = tiers.find((t) => t.id === tier) ?? tiers[1];
  const idealBudget    = selectedTier.budget;

  const currentFunnel  = useMemo(() => projectFunnel(currentBudget), [currentBudget]);
  const idealFunnel    = useMemo(() => projectFunnel(idealBudget), [idealBudget]);

  // Band-aware revenue delta range — used in CTA sublabel.
  const deltaRevLow    = Math.max(0, idealFunnel.revenue.low  - currentFunnel.revenue.high);
  const deltaRevHigh   = Math.max(0, idealFunnel.revenue.high - currentFunnel.revenue.low);
  const confidencePct  = Math.round(idealFunnel.confidence * 100);

  const handleTierChange = (id) => {
    setTier(id);
    const t = tiers.find((x) => x.id === id);
    if (t) setLiveMessage(`Projection updated for ${t.label} budget at ₹${t.budget.toLocaleString('en-IN')} per day.`);
  };

  const handleUse = () => {
    if (onUseIdealBudget) onUseIdealBudget(String(idealBudget));
    setApplied({ value: idealBudget, at: Date.now() });
    setShowRejection(false);
    setLiveMessage(`Daily budget set to ₹${idealBudget.toLocaleString('en-IN')}. You can undo this within five minutes.`);
  };

  const handleUseOwn = () => {
    setShowRejection((prev) => !prev);
  };

  const handleRejectionReason = (reason) => {
    // emit('sofie.suggestion.rejected', { reason }); // wire later
    setShowRejection(false);
    setLiveMessage(`Suggestion dismissed. Reason: ${reason}.`);
    if (onAdjustBudget) onAdjustBudget();
  };

  const handleUndo = () => {
    setApplied(null);
    setLiveMessage(`Budget change undone. Reverted to ₹${currentBudget.toLocaleString('en-IN')} per day.`);
    if (onUseIdealBudget) onUseIdealBudget(String(currentBudget));
  };

  // Last-actioned banner copy
  const actionedLabel = lastActionedAt
    ? (() => {
        const days = Math.floor((Date.now() - lastActionedAt.getTime()) / 86_400_000);
        if (days === 0) return 'You adjusted your budget today';
        if (days === 1) return 'You adjusted your budget yesterday';
        return `You adjusted your budget ${days} days ago`;
      })()
    : null;

  return (
    <SectionCard bodyBg={BG} bodyPad={0} style={{ fontFamily: FONT }} title={undefined}>

      {/* ── Sofie tier header ────────────────────────────────────────────── */}
      <div style={{
        padding: '12px 20px',
        borderBottom: `1px solid ${BORDER}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Growth tier badge */}
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '2px 8px',
            borderRadius: 4,
            background: ACCENT_M,
            color: ACCENT,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
          }}>
            Growth
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: TEXT_MID, fontWeight: 500 }}>
            <SparklesIcon size={13} color={ACCENT} />
            Sofie recommends
          </span>
          {/* Model confidence chip — promoted to medium emphasis (Hick's: trust-pivot signal). */}
          <button
            type="button"
            className="fs-focus"
            aria-label={`Forecast confidence ${confidencePct} percent. Based on the Funnel Predictor model.`}
            title={`Forecast confidence: ${confidencePct}%. Based on ${confidencePct >= 75 ? '28+' : 'limited'} days of marketplace signals, organic activity per Funnel Simulation PRD eligibility, and the bid–impressions curve from the Funnel Predictor model.`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '3px 8px',
              minHeight: 24,                      // WCAG 2.5.8 target size
              borderRadius: 4,
              background: ACCENT_M,
              fontSize: 11,
              fontWeight: 600,
              color: ACCENT,
              fontVariantNumeric: 'tabular-nums',
              cursor: 'help',
              border: 'none',
              fontFamily: FONT,
            }}
          >
            {confidencePct}% confidence
          </button>
          <button
            type="button"
            className="fs-focus"
            aria-label="About this forecast: bands are low–high probability ranges, not point estimates. Eligibility per Funnel Simulation PRD."
            title="Eligibility per Funnel Simulation PRD: at least 30% of products selected under the campaign have recorded organic views or add-to-cart events. Forecasts are probability bands — every metric below is a low–high range from the Funnel Predictor model, not a single point."
            style={{
              background: 'none', border: 'none', cursor: 'help',
              padding: 4,                         // expands hit target to 24×24
              minWidth: 24, minHeight: 24,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <InfoIcon size={14} color={TEXT_SUB} />
          </button>
        </div>
        <button
          type="button"
          className="fs-focus"
          aria-label="Why this number — opens an explanation of how the forecast was generated"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 600, color: ACCENT,
            fontFamily: FONT,
            padding: '6px 8px',                   // expands hit target ≥ 24×24
            minHeight: 24,
            borderRadius: 4,
          }}
        >
          Why this number?
        </button>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      {isLearning ? (
        <LearningModeState data={MOCK_LEARNING} />
      ) : (
        <>
          {/* Last-actioned indicator */}
          {actionedLabel && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: TEXT_SUB, padding: '8px 20px 0' }}>
              <CheckCircleIcon size={12} color={GREEN} />
              {actionedLabel} · here's how the projection updated
            </div>
          )}

          {/* Title block */}
          <div style={{ padding: '14px 20px 8px' }}>
            <h3 style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: TEXT,
              fontFamily: FONT,
            }}>
              Lift your daily budget to ₹{idealBudget.toLocaleString('en-IN')}/day
            </h3>
            <p style={{
              margin: '4px 0 0',
              fontSize: 13,
              color: TEXT_MID,
              lineHeight: 1.55,
            }}>
              Your current ₹{currentBudget.toLocaleString('en-IN')}/day captures part of the demand band we forecast for your products. {selectedTier.label === 'Recommended' ? "Sofie's recommended budget" : `A ${selectedTier.label.toLowerCase()} budget`} could unlock the upper end of the range.
            </p>
          </div>

          {/* Tier picker */}
          <div style={{ padding: '8px 20px 4px' }}>
            <TierSegmented tiers={tiers} value={tier} onChange={handleTierChange} />
          </div>

          {/* Funnel evidence */}
          <div style={{ padding: '8px 20px 0' }}>
            <BandLegend />
            <FunnelRow
              label="Reach"
              sublabel="Impressions → PDP views → adds to cart"
              current={currentFunnel.reach}
              ideal={idealFunnel.reach}
              format="compact"
            />
            <FunnelRow
              label="Orders"
              current={currentFunnel.orders}
              ideal={idealFunnel.orders}
              format="compact"
            />
            <FunnelRow
              label="Revenue (30 days)"
              current={currentFunnel.revenue}
              ideal={idealFunnel.revenue}
              format="currency"
              emphasis
            />
          </div>

          {/* Footnote line */}
          <div style={{
            padding: '12px 20px',
            display: 'flex', flexWrap: 'wrap', gap: 16,
            fontSize: 11, color: TEXT_SUB, lineHeight: 1.6,
          }}>
            <span>Est. ROI: <strong style={{ color: TEXT_MID }}>{idealFunnel.roi}x</strong></span>
            <span>·</span>
            <span>Bands shown are the model's {confidencePct}% confidence interval (Funnel Predictor).</span>
            <span>·</span>
            <span>Halo and cross-channel attribution measured separately in BYOT.</span>
          </div>

          {/* CTA row — applied vs default. role=status announces completion to AT. */}
          {applied ? (
            <div
              role="status"
              style={{
                padding: '14px 20px',
                borderTop: `1px solid ${BORDER}`,
                background: GREEN_M,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 12, flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircleIcon size={16} color={GREEN} />
                <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>
                  Budget set to ₹{applied.value.toLocaleString('en-IN')}/day
                </span>
              </div>
              <button
                type="button"
                onClick={handleUndo}
                className="fs-focus"
                aria-label={`Undo: revert daily budget to ₹${currentBudget.toLocaleString('en-IN')}`}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 600, color: ACCENT, fontFamily: FONT,
                  padding: '6px 10px',                  // hit target ≥ 24×24
                  minHeight: 24,
                  borderRadius: 4,
                }}
              >
                Undo
              </button>
            </div>
          ) : (
            <div style={{
              padding: '14px 20px',
              borderTop: `1px solid ${BORDER}`,
              display: 'flex', flexDirection: 'column', gap: 10,
              minHeight: showRejection ? undefined : 78,    // reserve space so chip reveal doesn't push wallet card
            }}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleUse}
                  className="fs-focus fs-anim"
                  aria-label={`Use Sofie's recommended budget of ₹${idealBudget.toLocaleString('en-IN')} per day`}
                  style={{
                    flex: '1 1 280px',
                    minHeight: 44,
                    background: ACCENT,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontFamily: FONT,
                    padding: '8px 16px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 1,
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'color-mix(in srgb, var(--osmos-brand-primary) 90%, black)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = ACCENT; }}
                >
                  <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>
                    Use ₹{idealBudget.toLocaleString('en-IN')}/day
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.9, lineHeight: 1.2, fontVariantNumeric: 'tabular-nums' }}>
                    Est. +{fmtCurrency(deltaRevLow)}–{fmtCurrency(deltaRevHigh)} over 30 days
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleUseOwn}
                  className="fs-focus fs-anim"
                  aria-expanded={showRejection}
                  aria-controls="fs-rejection-row"
                  style={{
                    flex: '0 1 auto',
                    minHeight: 44,
                    padding: '10px 16px',
                    background: 'none',
                    color: TEXT_MID,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontFamily: FONT,
                    fontSize: 13,
                    fontWeight: 500,
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = BG_SUB; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  Use my own number
                </button>
              </div>

              {/* Rejection-reason chips — 150ms slide-in (Doherty), space reserved by parent minHeight */}
              {showRejection && (
                <div
                  id="fs-rejection-row"
                  className="fs-rejection-row"
                  style={{
                    display: 'flex', flexWrap: 'wrap', gap: 6,
                    paddingTop: 4,
                    fontSize: 11,
                  }}
                >
                  <span style={{ fontSize: 11, color: TEXT_SUB, alignSelf: 'center', marginRight: 4 }}>Quick reason:</span>
                  {['Too aggressive', 'Already optimized', "Don't trust the projection", 'Other'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRejectionReason(r)}
                      className="fs-focus"
                      style={{
                        padding: '6px 10px',
                        minHeight: 24,                  // WCAG 2.5.8 target size
                        borderRadius: 999,
                        border: `1px solid ${BORDER}`,
                        background: BG,
                        color: TEXT_MID,
                        fontSize: 11,
                        fontWeight: 500,
                        cursor: 'pointer',
                        fontFamily: FONT,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = BG_SUB; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = BG; }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* aria-live region for tier / apply / reject announcements */}
          <div
            aria-live="polite"
            aria-atomic="true"
            style={{
              position: 'absolute',
              width: 1, height: 1, padding: 0, margin: -1,
              overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
            }}
          >
            {liveMessage}
          </div>
        </>
      )}
    </SectionCard>
  );
}

// ── LearningModeState ─────────────────────────────────────────────────────────
// Preserved verbatim from prior implementation — strong alignment with PRD eligibility criteria.
function LearningModeState({ data }) {
  const metMet    = data.criteria.filter(c => c.met).length;
  const totalCrit = data.criteria.length;
  const pct       = Math.round((metMet / totalCrit) * 100);

  return (
    <div style={{
      padding: '32px 24px', textAlign: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: 'var(--osmos-brand-amber-muted)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <HourglassIcon size={28} color={AMBER} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 400 }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>
          Your campaign is building momentum
        </span>
        <span style={{ fontSize: 13, color: TEXT_MID, lineHeight: 1.6 }}>
          We're gathering enough data to make your first forecast. Here's where things stand:
        </span>
      </div>

      <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ width: '100%', height: 6, borderRadius: 99, background: BORDER, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', borderRadius: 99, background: AMBER, transition: 'width 0.5s ease' }} />
        </div>
        <span style={{ fontSize: 11, color: TEXT_SUB, textAlign: 'right' }}>
          {metMet} of {totalCrit} signals collected
        </span>
      </div>

      <div style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left' }}>
        {data.criteria.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <div style={{ flexShrink: 0, marginTop: 1 }}>
              {c.met
                ? <CheckCircleIcon size={15} color={GREEN} />
                : <XCircleIcon    size={15} color={TEXT_SUB} />
              }
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontSize: 13, color: c.met ? TEXT : TEXT_MID }}>{c.label}</span>
              {c.detail && <span style={{ fontSize: 11, color: TEXT_SUB }}>{c.detail}</span>}
            </div>
          </div>
        ))}
      </div>

      <span style={{ fontSize: 12, color: TEXT_SUB, maxWidth: 360, lineHeight: 1.6 }}>
        Estimates typically appear within 2–3 days of consistent campaign activity.
      </span>
    </div>
  );
}
