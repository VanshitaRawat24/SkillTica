import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { RingProgress, ProgressBar, InsightBox, ScoreBadge, StatCard } from '../../components/ui';
import { computeRoleFit, generateAiInsight, ROLES_DB } from '../../data/employees';
import { Target, Award, Layers, BrainCircuit, ArrowRight } from 'lucide-react';

const PROFILE_SECTIONS = [
  { key: 'personal', label: 'Personal Details' },
  { key: 'education', label: 'Education' },
  { key: 'skills', label: 'Skills' },
  { key: 'experience', label: 'Experience' },
  { key: 'certifications', label: 'Certifications' },
  { key: 'projects', label: 'Projects / Achievements' },
  { key: 'behavioral', label: 'Behavioral Assessment' },
  { key: 'careerInterests', label: 'Career Interests' },
];

const isSectionDone = (emp, key) => {
  if (key === 'personal') return !!(emp.personal?.phone && emp.personal?.location);
  if (key === 'education') return (emp.education?.length || 0) > 0;
  if (key === 'skills') return (emp.skills?.length || 0) >= 3;
  if (key === 'experience') return emp.yearsExperience > 0;
  if (key === 'certifications') return (emp.certifications?.length || 0) > 0;
  if (key === 'projects') return (emp.projects?.length || 0) > 0;
  if (key === 'behavioral') return emp.behavioralScore > 0;
  if (key === 'careerInterests') return (emp.careerInterests?.length || 0) > 0;
  return false;
};

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const emp = currentUser;
  if (!emp) return null;

  const doneSections = PROFILE_SECTIONS.filter(s => isSectionDone(emp, s.key)).length;
  const completion = Math.round((doneSections / PROFILE_SECTIONS.length) * 100);
  const roles = Object.keys(ROLES_DB || {});
  const calculatedFits = roles.map(r => [r, computeRoleFit(emp, r)]).sort((a, b) => b[1] - a[1]);

  const topRole = emp.desiredRole || (calculatedFits.length > 0 ? calculatedFits[0][0] : "Role");
  const fitScore = computeRoleFit(emp, topRole);
  const aiText = generateAiInsight(emp);

  const roleColor = fitScore >= 80 ? 'var(--success)' : fitScore >= 60 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div className="animate-fade-in page-wrapper">
      {/* Header */}
      <div className="page-header flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="page-title">Welcome back, {emp.name.split(' ')[0]}! 👋</h1>
          <p className="page-subtitle">{emp.currentRole} · {emp.department} Department</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/employee/profile')}>
          <Layers size={16} /> Build Profile <ArrowRight size={15} />
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={Target} label="Role Fit Score" value={`${fitScore}%`} sub={topRole} accent={roleColor} />
        <StatCard icon={Award} label="Skills Logged" value={emp.skills?.length || 0} sub="documented skills" />
        <StatCard icon={BrainCircuit} label="Behavioral Score" value={emp.behavioralScore || '—'} sub={emp.behavioralScore ? 'out of 100' : 'Not assessed'} />
        <StatCard icon={Layers} label="Profile Complete" value={`${completion}%`} sub={`${doneSections}/${PROFILE_SECTIONS.length} sections done`} />
      </div>

      {/* Profile ring + section list */}
      <div className="grid gap-6 mb-6" style={{ gridTemplateColumns: '280px 1fr' }}>
        <div className="card flex-col items-center justify-center gap-4 p-6">
          <RingProgress pct={completion} size={140} stroke={11} color={completion >= 80 ? 'var(--success)' : 'var(--accent-primary)'} />
          <div style={{ textAlign: 'center' }}>
            <div className="font-bold mb-1">Profile Completion</div>
            <div className="text-sm text-secondary">{PROFILE_SECTIONS.length - doneSections} section(s) remaining</div>
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/employee/profile')}>
            Complete Profile
          </button>
        </div>

        <div className="card p-5">
          <h3 className="font-bold mb-4 text-lg">Profile Sections</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
            {PROFILE_SECTIONS.map(s => {
              const done = isSectionDone(emp, s.key);
              return (
                <div key={s.key} className="section-pill" style={{ borderColor: done ? 'rgba(16,185,129,0.35)' : 'var(--border-color)', background: done ? 'rgba(16,185,129,0.05)' : 'var(--bg-card)' }}
                  onClick={() => navigate('/employee/profile')}>
                  <span style={{ color: done ? 'var(--success)' : 'var(--text-tertiary)', fontSize: 16, lineHeight: 1 }}>
                    {done ? '✓' : '○'}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, color: done ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Insight + Skills */}
      <div className="grid grid-cols-2 gap-6">
        <div className="card p-5">
          <InsightBox text={aiText} name={emp.name} />
          <button className="btn btn-secondary mt-4" style={{ width: '100%' }} onClick={() => navigate('/employee/insights')}>
            View Full AI Analysis <ArrowRight size={15} />
          </button>
        </div>

        <div className="card p-5">
          <h3 className="font-bold mb-4 text-lg">Role Fit Predictions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {calculatedFits.slice(0, 4).map(([role, score]) => (
              <div key={role}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{role}</span>
                  <ScoreBadge score={score} />
                </div>
                <ProgressBar pct={score} color={score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--danger)'} showPct={false} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
