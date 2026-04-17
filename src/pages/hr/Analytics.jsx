import { useApp } from '../../context/AppContext';
import { BarChart, StatCard } from '../../components/ui';
import { BarChart3, Users, TrendingUp, Award } from 'lucide-react';

const Analytics = () => {
  const { employees } = useApp();

  const expGroups = [
    { label: '0–2 yrs', value: employees.filter(e => e.yearsExperience <= 2).length, color: '#6366f1' },
    { label: '3–5 yrs', value: employees.filter(e => e.yearsExperience >= 3 && e.yearsExperience <= 5).length, color: '#10b981' },
    { label: '6–9 yrs', value: employees.filter(e => e.yearsExperience >= 6 && e.yearsExperience <= 9).length, color: '#f59e0b' },
    { label: '10+ yrs', value: employees.filter(e => e.yearsExperience >= 10).length, color: '#ec4899' },
  ];

  const deptSkillCounts = {};
  employees.forEach(e => {
    deptSkillCounts[e.department] = deptSkillCounts[e.department] || [];
    deptSkillCounts[e.department].push(e.skills?.length || 0);
  });
  const deptAvgSkills = Object.entries(deptSkillCounts).map(([d, counts]) => ({
    label: d, value: Math.round(counts.reduce((a, b) => a + b, 0) / counts.length),
    color: { Engineering: '#6366f1', Data: '#10b981', Product: '#f59e0b', Design: '#8b5cf6' }[d] || '#64748b'
  }));

  const allSkills = {};
  employees.forEach(e => e.skills?.forEach(s => { allSkills[s] = (allSkills[s] || 0) + 1; }));
  const topSkills = Object.entries(allSkills).sort((a, b) => b[1] - a[1]).slice(0, 8)
    .map(([s, v]) => ({ label: s, value: v, color: '#6366f1' }));

  const behavioralDist = [
    { label: '90–100', value: employees.filter(e => e.behavioralScore >= 90).length, color: '#10b981' },
    { label: '75–89', value: employees.filter(e => e.behavioralScore >= 75 && e.behavioralScore < 90).length, color: '#6366f1' },
    { label: '60–74', value: employees.filter(e => e.behavioralScore >= 60 && e.behavioralScore < 75).length, color: '#f59e0b' },
    { label: '<60', value: employees.filter(e => e.behavioralScore < 60).length, color: '#ef4444' },
  ];

  const promotionReady = employees.filter(e => e.promotionReady).length;
  const avgBehavioral = Math.round(employees.reduce((s, e) => s + e.behavioralScore, 0) / employees.length);
  const avgExp = (employees.reduce((s, e) => s + e.yearsExperience, 0) / employees.length).toFixed(1);

  return (
    <div className="animate-fade-in page-wrapper">
      <div className="page-header">
        <h1 className="page-title">Workforce Analytics</h1>
        <p className="page-subtitle">Macro-level intelligence and organizational health metrics.</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Total Workforce" value={employees.length} sub="active employees" />
        <StatCard icon={Award} label="Promotion Ready" value={promotionReady} accent="var(--success)" sub="near-term candidates" />
        <StatCard icon={TrendingUp} label="Avg Behavioral Score" value={avgBehavioral} sub="out of 100" accent="var(--accent-primary)" />
        <StatCard icon={BarChart3} label="Avg Experience" value={`${avgExp} yrs`} sub="across all employees" />
      </div>

      <div className="grid grid-cols-2 gap-5 mb-5">
        <div className="card p-5">
          <h3 className="font-bold mb-4">Most Common Skills Across Org</h3>
          <BarChart data={topSkills} height={180} />
        </div>
        <div className="card p-5">
          <h3 className="font-bold mb-4">Experience Distribution</h3>
          <BarChart data={expGroups} height={180} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="card p-5">
          <h3 className="font-bold mb-4">Average Skills per Department</h3>
          <BarChart data={deptAvgSkills} height={180} />
        </div>
        <div className="card p-5">
          <h3 className="font-bold mb-4">Behavioral Score Distribution</h3>
          <BarChart data={behavioralDist} height={180} />
          <p className="text-xs text-secondary text-center mt-3">Higher behavioral scores correlate with team collaboration and retention</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
