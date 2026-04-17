// Reusable stat/KPI card
export const StatCard = ({ icon: Icon, label, value, sub, accent, trend, onClick }) => (
  <div className="stat-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default', borderLeft: accent ? `3px solid ${accent}` : undefined }}>
    <div className="stat-card-top">
      <div>
        <p className="stat-card-label">{label}</p>
        <h2 className="stat-card-value" style={{ color: accent || 'var(--text-primary)' }}>{value}</h2>
      </div>
      <div className="stat-card-icon" style={{ background: accent ? `${accent}20` : 'var(--bg-tertiary)', color: accent || 'var(--text-secondary)' }}>
        <Icon size={22} />
      </div>
    </div>
    {(sub || trend) && (
      <p className="stat-card-sub">{sub}{trend && <span style={{ color: trend.startsWith('+') ? 'var(--success)' : 'var(--danger)', marginLeft: '6px' }}>{trend}</span>}</p>
    )}
  </div>
);

// Progress ring
export const RingProgress = ({ pct, size = 110, stroke = 9, color = 'var(--accent-primary)', label }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg-tertiary)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.8s ease' }} />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
          style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%', fill: 'var(--text-primary)', fontSize: size * 0.16, fontWeight: 700, fontFamily: 'Outfit' }}>
          {pct}%
        </text>
      </svg>
      {label && <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>}
    </div>
  );
};

// Progress bar
export const ProgressBar = ({ pct, color = 'var(--accent-primary)', height = 6, label, showPct = true }) => (
  <div style={{ width: '100%' }}>
    {(label || showPct) && (
      <div className="flex justify-between mb-2">
        {label && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{label}</span>}
        {showPct && <span style={{ fontSize: '0.8rem', fontWeight: 600, color }}>{pct}%</span>}
      </div>
    )}
    <div style={{ width: '100%', background: 'var(--bg-tertiary)', borderRadius: '99px', height }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '99px', transition: 'width 0.8s ease' }} />
    </div>
  </div>
);

// Score badge  
export const ScoreBadge = ({ score, size = 'sm' }) => {
  const color = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--danger)';
  const bg = score >= 80 ? 'rgba(16,185,129,0.1)' : score >= 60 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';
  const label = score >= 80 ? 'Strong' : score >= 60 ? 'Moderate' : 'Needs Work';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: size === 'lg' ? '0.4rem 0.9rem' : '0.2rem 0.6rem',
      borderRadius: '999px', background: bg, color, border: `1px solid ${color}30`,
      fontSize: size === 'lg' ? '0.9rem' : '0.75rem', fontWeight: 600 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {score}% · {label}
    </span>
  );
};

// Section checklist item
export const SectionItem = ({ label, done, pct, onClick }) => (
  <div className="section-item" onClick={onClick}>
    <div className="flex items-center gap-3">
      <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: done ? 'var(--success)' : 'var(--bg-tertiary)', flexShrink: 0 }}>
        {done ? <span style={{ color: 'white', fontSize: 13 }}>✓</span> : <span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>○</span>}
      </div>
      <div style={{ flex: 1 }}>
        <div className="flex justify-between items-center mb-1">
          <span style={{ fontSize: '0.875rem', fontWeight: 500, color: done ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{label}</span>
          {!done && <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{pct}%</span>}
        </div>
        <div style={{ height: 3, background: 'var(--bg-tertiary)', borderRadius: 99 }}>
          <div style={{ width: done ? '100%' : `${pct}%`, height: '100%', background: done ? 'var(--success)' : 'var(--accent-primary)', borderRadius: 99, transition: 'width 0.5s' }} />
        </div>
      </div>
    </div>
  </div>
);

// AI Insight Box
export const InsightBox = ({ text, name }) => (
  <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(236,72,153,0.05))',
    border: '1px solid rgba(99,102,241,0.2)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
    <div className="flex items-center gap-2 mb-3">
      <span style={{ fontSize: 18 }}>✦</span>
      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>AI Intelligence Summary</span>
    </div>
    <p style={{ color: 'var(--text-primary)', fontSize: '0.925rem', lineHeight: 1.7, margin: 0 }}>"{text}"</p>
    {name && <p style={{ margin: '0.75rem 0 0', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Analysis for {name}</p>}
  </div>
);

// Bar chart (pure CSS/SVG)
export const BarChart = ({ data, height = 160 }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height, padding: '0 0.25rem' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{d.value}</span>
          <div style={{ width: '100%', height: `${(d.value / max) * (height - 40)}px`, minHeight: 4,
            background: d.color || 'var(--accent-primary)', borderRadius: '4px 4px 0 0',
            transition: 'height 0.6s ease', opacity: 0.9 }} />
          <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textAlign: 'center', lineHeight: 1.2 }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
};

// Risk badge
export const RiskBadge = ({ level }) => {
  const map = { low: { color: 'var(--success)', bg: 'rgba(16,185,129,0.1)', label: 'Low Risk' },
    medium: { color: 'var(--warning)', bg: 'rgba(245,158,11,0.1)', label: 'Medium Risk' },
    high: { color: 'var(--danger)', bg: 'rgba(239,68,68,0.1)', label: 'High Risk' } };
  const s = map[level] || map.low;
  return <span className="badge" style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}40` }}>{s.label}</span>;
};

// Empty state
export const EmptyState = ({ message = 'No data available' }) => (
  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>
    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
    <p>{message}</p>
  </div>
);
