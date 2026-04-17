import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { computeRoleFit } from '../../data/employees';
import { ScoreBadge, ProgressBar, RingProgress, BarChart } from '../../components/ui';

const Comparison = () => {
  const navigate = useNavigate();
  const { employees } = useApp();
  const [selected, setSelected] = useState([employees[0]?.id, employees[1]?.id, '']);

  const empObjects = selected.map(id => employees.find(e => e.id === id)).filter(Boolean);

  const METRICS = [
    { label: 'Profile Completion', key: 'profileCompletion', color: 'var(--accent-primary)' },
    { label: 'Behavioral Score', key: 'behavioralScore', color: 'var(--accent-secondary)' },
    { label: 'Assessment Score', key: 'assessmentScore', color: 'var(--success)' },
    { label: 'Team Collaboration', key: 'teamCollaboration', color: 'var(--warning)' },
  ];

  const topRole = 'Full Stack Developer';
  const fitScores = empObjects.map(e => ({ name: e.name, value: computeRoleFit(e, topRole), color: e.avatar }));

  return (
    <div className="animate-fade-in page-wrapper">
      <div className="page-header">
        <h1 className="page-title">Employee Comparison</h1>
        <p className="page-subtitle">Compare up to 3 employees side by side across all intelligence dimensions.</p>
      </div>

      {/* Selectors */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {[0, 1, 2].map(i => (
          <div key={i} style={{ flex: '1 1 200px' }}>
            <label className="form-label">Employee {i + 1}</label>
            <select className="form-control" value={selected[i] || ''} onChange={e => {
              const next = [...selected]; next[i] = e.target.value; setSelected(next);
            }}>
              <option value="">— Select Employee —</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
        ))}
      </div>

      {empObjects.length < 2 && (
        <div className="card text-center p-8 text-secondary">Select at least 2 employees to compare.</div>
      )}

      {empObjects.length >= 2 && (
        <>
          {/* Hero row */}
          <div className="grid mb-6" style={{ gridTemplateColumns: `repeat(${empObjects.length}, 1fr)`, gap: '1.25rem' }}>
            {empObjects.map(e => {
              const fit = computeRoleFit(e, topRole);
              return (
                <div key={e.id} className="card p-5 text-center" style={{ cursor: 'pointer' }} onClick={() => navigate(`/hr/employee/${e.id}`)}>
                  <img src={e.avatar} alt={e.name} style={{ width: 70, height: 70, borderRadius: '50%', margin: '0 auto 1rem', border: '3px solid rgba(99,102,241,0.35)' }} />
                  <h3 className="font-bold text-lg mb-1">{e.name}</h3>
                  <p className="text-secondary text-sm mb-3">{e.currentRole}</p>
                  <RingProgress pct={e.profileCompletion} size={90} stroke={8} label="Profile" />
                  <div className="mt-3"><ScoreBadge score={fit} size="lg" /></div>
                  <p className="text-xs text-secondary mt-1">{topRole} fit</p>
                </div>
              );
            })}
          </div>

          {/* Metrics comparison */}
          <div className="card mb-5 p-5">
            <h3 className="font-bold text-lg mb-5">Metric Comparison</h3>
            {METRICS.map(m => (
              <div key={m.key} className="mb-5">
                <p className="font-semibold text-sm mb-3" style={{ color: m.color }}>{m.label}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {empObjects.map(e => (
                    <div key={e.id} className="flex items-center gap-3">
                      <span className="text-sm text-secondary" style={{ width: 130, flexShrink: 0 }}>{e.name.split(' ')[0]}</span>
                      <ProgressBar pct={e[m.key] || 0} color={m.color} height={8} showPct />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Skills comparison */}
          <div className="card p-5">
            <h3 className="font-bold text-lg mb-4">Skills Breakdown</h3>
            <div className="grid mb-4" style={{ gridTemplateColumns: `repeat(${empObjects.length}, 1fr)`, gap: '1.25rem' }}>
              {empObjects.map(e => (
                <div key={e.id}>
                  <p className="font-semibold text-sm mb-2">{e.name.split(' ')[0]}'s Skills ({e.skills?.length || 0})</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {e.skills?.map(s => <span key={s} className="badge badge-accent" style={{ fontSize: '0.72rem' }}>{s}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Comparison;
