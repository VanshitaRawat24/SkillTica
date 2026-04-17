import { useApp } from '../../context/AppContext';
import { computeRoleFit, getSkillGap, generateAiInsight, ROLES_DB } from '../../data/employees';
import { InsightBox, ScoreBadge, ProgressBar, RingProgress } from '../../components/ui';
import { AlertTriangle, TrendingUp, BookOpen, Briefcase, Sparkles, Building } from 'lucide-react';

const InsightsPage = () => {
  const { currentUser } = useApp();
  const emp = currentUser;
  if (!emp) return null;

  const roles = Object.keys(ROLES_DB);
  const fits = roles.map(r => ({ role: r, score: computeRoleFit(emp, r), gap: getSkillGap(emp, r) }))
    .sort((a, b) => b.score - a.score);

  const aiText = generateAiInsight(emp);
  const topFit = fits[0];

  const marketAlignment = emp.skills?.length > 4 ? 85 : 55;
  const learningPaths = topFit.gap.map((g, i) => ({ title: `Mastering ${g} in 30 Days`, provider: 'Coursera', roi: `+$${Math.floor(4 + Math.random() * 4)},000` }));
  const recommendedRoles = fits.filter(f => f.score > 60 && f.role !== emp.currentRole).slice(0, 2);

  const skillNetwork = topFit.gap.slice(0, 3);

  return (
    <div className="animate-fade-in page-wrapper">
      <div className="page-header">
        <h1 className="page-title">AI Insights & Role Fit</h1>
        <p className="page-subtitle">Intelligent analysis powered by your profile data.</p>
      </div>

      {/* AI Summary */}
      <div className="mb-6"><InsightBox text={aiText} name={emp.name} /></div>

      {/* Top role fit spotlight */}
      <div className="card mb-6 p-5" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(236,72,153,0.04))', border: '1px solid rgba(99,102,241,0.2)' }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-secondary font-medium mb-1">🏆 Best Role Match</p>
            <h2 className="font-bold text-2xl mb-2">{topFit.role}</h2>
            <ScoreBadge score={topFit.score} size="lg" />
          </div>
          <RingProgress pct={topFit.score} size={130} stroke={10} color={topFit.score >= 80 ? 'var(--success)' : 'var(--warning)'} />
        </div>
        {topFit.gap.length > 0 && (
          <div className="mt-4 p-3 rounded-lg flex gap-2 items-start" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius-md)' }}>
            <AlertTriangle size={16} color="var(--warning)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <span className="text-sm font-semibold text-warning">Skill Gaps to close: </span>
              <span className="text-sm text-secondary">{topFit.gap.join(', ')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Smart Profile Enhancer */}
      {(emp.profileCompletion || 0) < 100 && (
        <div className="card mb-6 p-4" style={{ border: '1px dashed var(--accent-primary)', background: 'rgba(99,102,241,0.05)' }}>
          <h3 className="font-bold mb-2 flex items-center gap-2"><Sparkles size={18} color="var(--accent-primary)" /> Smart Profile Enhancer</h3>
          <p className="text-sm text-secondary">Your profile is {emp.profileCompletion || 0}% complete. Adding explicitly these keywords to your project descriptions can boost your visibility by 24%: <strong>{topFit.gap.join(', ') || 'Leadership, Agile'}</strong>.</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 mb-6">

        {/* Market Alignment Indicator */}
        <div className="card p-5">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><TrendingUp size={18} /> Market Alignment Indicator</h3>
          <div className="flex items-center gap-6">
            <RingProgress pct={marketAlignment} size={100} stroke={8} color={marketAlignment > 75 ? 'var(--success)' : 'var(--warning)'} />
            <div>
              <p className="text-sm text-secondary mb-2">Compared to industry standard for {emp.currentRole || 'your level'} in 2026.</p>
              {marketAlignment > 75 ? (
                <div className="text-success font-bold text-sm">You are highly competitive!</div>
              ) : (
                <div className="text-warning font-bold text-sm">Focus on modern stacks (e.g. Docker, AWS) to stay competitive.</div>
              )}
            </div>
          </div>
        </div>

        {/* Opportunity Recommender */}
        <div className="card p-5">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Briefcase size={18} /> Opportunity Recommender</h3>
          <p className="text-sm text-secondary mb-3">Internal mobility options based on your skills.</p>
          <div className="flex flex-col gap-3">
            {recommendedRoles.length > 0 ? recommendedRoles.map(r => (
              <div key={r.role} className="flex justify-between items-center p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                <div>
                  <div className="font-bold text-sm">{r.role}</div>
                  <div className="text-xs text-secondary flex items-center gap-1"><Building size={12} /> Multiple Teams Hiring</div>
                </div>
                <ScoreBadge score={r.score} />
              </div>
            )) : (
              <div className="text-sm text-tertiary p-3">No direct opportunities identified yet. Gain more skills to unlock roles!</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Learning Path Generator & ROI Simulator */}
        <div className="card p-5">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><BookOpen size={18} /> Skill Gap & Learning Paths</h3>
          {learningPaths.length > 0 ? (
            <div className="flex flex-col gap-3">
              {learningPaths.map((lp, i) => (
                <div key={i} className="p-3 rounded-lg flex justify-between items-center" style={{ border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}>
                  <div>
                    <div className="font-bold text-sm">{lp.title}</div>
                    <div className="text-xs text-secondary">{lp.provider}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-success font-bold uppercase">Estimated ROI</div>
                    <div className="font-bold text-success">{lp.roi} / yr</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-secondary">You have mastered the required skills for your top fit!</p>
          )}
        </div>

        {/* All role fit scores */}
        <div className="card p-5">
          <h3 className="font-bold text-lg mb-5">Role-Fit Overview</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {fits.slice(0, 3).map(({ role, score, gap }) => (
              <div key={role} className="role-fit-row">
                <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                  <span className="font-semibold text-sm">{role}</span>
                  <div className="flex items-center gap-2">
                    <ScoreBadge score={score} />
                  </div>
                </div>
                <ProgressBar pct={score} color={score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--danger)'} showPct={false} height={7} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;
