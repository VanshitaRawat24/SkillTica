import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { computeRoleFit, getSkillGap, generateAiInsight, ROLES_DB } from '../../data/employees';
import { ScoreBadge, RiskBadge, ProgressBar, InsightBox, RingProgress } from '../../components/ui';
import { ArrowLeft, MapPin, Mail, Phone, Globe, Link2 } from 'lucide-react';

const EmployeeProfileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employees } = useApp();
  const emp = employees.find(e => e.id === id);

  if (!emp) return <div className="page-wrapper"><p className="text-secondary">Employee not found.</p></div>;

  const topRole = emp.desiredRole || Object.keys(emp.roleFitScores || {})[0];
  const fitScore = computeRoleFit(emp, topRole);
  const gap = getSkillGap(emp, topRole);
  const aiText = generateAiInsight(emp);

  const allFits = Object.keys(ROLES_DB).map(r => ({ role: r, score: computeRoleFit(emp, r) })).sort((a, b) => b.score - a.score);

  return (
    <div className="animate-fade-in page-wrapper">
      <button className="btn btn-secondary mb-5" onClick={() => navigate(-1)}>
        <ArrowLeft size={15} /> Back
      </button>

      {/* Profile Hero */}
      <div className="card mb-5 p-6" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.07), rgba(236,72,153,0.04))', border: '1px solid rgba(99,102,241,0.15)' }}>
        <div className="flex items-start gap-5 flex-wrap">
          <img src={emp.avatar} alt={emp.name} style={{ width: 88, height: 88, borderRadius: '50%', border: '3px solid rgba(99,102,241,0.4)' }} />
          <div style={{ flex: 1 }}>
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="font-bold text-2xl m-0">{emp.name}</h1>
              <RiskBadge level={emp.riskLevel} />
              {emp.promotionReady && <span className="badge badge-success">✓ Promotion Ready</span>}
              {emp.highPotential && <span className="badge badge-accent">⭐ High Potential</span>}
            </div>
            <p className="text-secondary mb-3">{emp.currentRole} · {emp.department} · {emp.yearsExperience} yrs exp.</p>
            <div className="flex gap-4 flex-wrap text-sm text-secondary">
              {emp.personal?.location && <span className="flex items-center gap-1"><MapPin size={14} />{emp.personal.location}</span>}
              {emp.email && <span className="flex items-center gap-1"><Mail size={14} />{emp.email}</span>}
              {emp.personal?.phone && <span className="flex items-center gap-1"><Phone size={14} />{emp.personal.phone}</span>}
              {emp.personal?.linkedin && <span className="flex items-center gap-1"><Globe size={14} />linkedin.com/in/{emp.personal.linkedin}</span>}
            </div>
          </div>
          <div className="flex gap-5 items-center">
            <RingProgress pct={emp.profileCompletion} size={100} stroke={9} color={emp.profileCompletion >= 80 ? 'var(--success)' : 'var(--accent-primary)'} label="Profile" />
            <RingProgress pct={fitScore} size={100} stroke={9} color={fitScore >= 80 ? 'var(--success)' : 'var(--warning)'} label="Role Fit" />
            <RingProgress pct={emp.behavioralScore} size={100} stroke={9} color="var(--accent-secondary)" label="Behavioral" />
          </div>
        </div>
      </div>

      {/* 3-col grid */}
      <div className="grid grid-cols-3 gap-5 mb-5">
        {/* Skills */}
        <div className="card p-4">
          <h3 className="font-bold mb-3">⚡ Skills ({emp.skills?.length || 0})</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {emp.skills?.map(s => <span key={s} className="badge badge-accent">{s}</span>)}
          </div>
          {gap.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-warning mb-2">Gaps for {topRole}:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {gap.map(g => <span key={g} className="badge badge-warning">⚠ {g}</span>)}
              </div>
            </div>
          )}
        </div>

        {/* Education + Certifications */}
        <div className="card p-4">
          <h3 className="font-bold mb-3">🎓 Education</h3>
          {emp.education?.map((e, i) => (
            <div key={i} className="mb-3">
              <p className="font-semibold text-sm m-0">{e.degree}</p>
              <p className="text-xs text-secondary m-0">{e.institution} · {e.year}</p>
            </div>
          ))}
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1rem 0' }} />
          <h3 className="font-bold mb-3">📜 Certifications</h3>
          {emp.certifications?.length ? emp.certifications.map((c, i) => (
            <div key={i} className="flex items-center gap-2 mb-2 text-sm">
              <span style={{ color: 'var(--success)' }}>✓</span> {c}
            </div>
          )) : <p className="text-sm text-secondary">No certifications added.</p>}
        </div>

        {/* Projects */}
        <div className="card p-4">
          <h3 className="font-bold mb-3">🚀 Projects</h3>
          {emp.projects?.map((p, i) => (
            <div key={i} className="mb-4 p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <p className="font-semibold text-sm m-0 mb-1">{p.name}</p>
              <p className="text-xs text-secondary m-0">{p.description}</p>
              <span className="badge badge-success mt-2">{p.impact} Impact</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insight */}
      <div className="mb-5"><InsightBox text={aiText} name={emp.name} /></div>

      {/* Role fit breakdown */}
      <div className="card p-5 mb-5">
        <h3 className="font-bold text-lg mb-4">Role Fit Analysis — All Roles</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {allFits.slice(0, 5).map(({ role, score }) => (
            <div key={role}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{role}</span>
                <ScoreBadge score={score} />
              </div>
              <ProgressBar pct={score} color={score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--danger)'} showPct={false} height={6} />
            </div>
          ))}
        </div>
      </div>

      {/* Score breakdown */}
      <div className="grid grid-cols-3 gap-5">
        <div className="card p-4 text-center">
          <p className="text-secondary text-sm mb-1">Weekly Workload</p>
          <h2 className="font-bold text-3xl" style={{ color: emp.workloadHours > 50 ? 'var(--danger)' : 'var(--success)' }}>{emp.workloadHours}h</h2>
          <p className="text-xs text-secondary mt-1">{emp.workloadHours > 50 ? '⚠ Above healthy range' : '✓ Healthy workload'}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-secondary text-sm mb-1">Team Collaboration</p>
          <h2 className="font-bold text-3xl" style={{ color: 'var(--accent-primary)' }}>{emp.teamCollaboration}</h2>
          <p className="text-xs text-secondary mt-1">out of 100</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-secondary text-sm mb-1">Assessment Score</p>
          <h2 className="font-bold text-3xl" style={{ color: 'var(--accent-secondary)' }}>{emp.assessmentScore || '—'}</h2>
          <p className="text-xs text-secondary mt-1">out of 100</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfileView;
