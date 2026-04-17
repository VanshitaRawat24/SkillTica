import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatCard, ProgressBar, ScoreBadge, RiskBadge, RingProgress, BarChart } from '../../components/ui';
import { Users, TrendingUp, Star, AlertTriangle, ChevronRight } from 'lucide-react';

const HrDashboard = () => {
  const navigate = useNavigate();
  const { employees } = useApp();

  const totalEmp = employees.length;
  const avgCompletion = totalEmp > 0 ? Math.round(employees.reduce((s, e) => s + (e.profileCompletion || 0), 0) / totalEmp) : 0;
  const highPotential = employees.filter(e => e.highPotential).length;
  const burnout = employees.filter(e => e.riskLevel === 'high' || e.riskLevel === 'medium').length;
  const promotionReady = employees.filter(e => e.promotionReady).length;

  const deptCount = employees.reduce((acc, e) => { acc[e.department] = (acc[e.department] || 0) + 1; return acc; }, {});
  const deptColors = { Engineering: '#6366f1', Data: '#10b981', Product: '#f59e0b', Design: '#8b5cf6' };
  const deptData = Object.entries(deptCount).map(([d, v]) => ({ label: d, value: v, color: deptColors[d] || '#64748b' }));

  const completionBands = [
    { label: '90–100%', value: employees.filter(e => e.profileCompletion >= 90).length, color: 'var(--success)' },
    { label: '70–89%', value: employees.filter(e => e.profileCompletion >= 70 && e.profileCompletion < 90).length, color: 'var(--accent-primary)' },
    { label: '50–69%', value: employees.filter(e => e.profileCompletion >= 50 && e.profileCompletion < 70).length, color: 'var(--warning)' },
    { label: '<50%', value: employees.filter(e => e.profileCompletion < 50).length, color: 'var(--danger)' },
  ];

  return (
    <div className="animate-fade-in page-wrapper">
      <div className="page-header flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="page-title">Master Dashboard</h1>
          <p className="page-subtitle">Workforce intelligence overview — {totalEmp} employees tracked</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary" onClick={() => navigate('/hr/analytics')}>Analytics</button>
          <button className="btn btn-primary" onClick={() => navigate('/hr/team-builder')}>Build Team</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Total Employees" value={totalEmp} trend="+3 this month" onClick={() => navigate('/hr/directory')} />
        <StatCard icon={TrendingUp} label="Avg Profile Completion" value={`${avgCompletion}%`} sub="across all employees" accent="var(--accent-primary)" />
        <StatCard icon={Star} label="High Potential" value={highPotential} sub="ready for growth" accent="var(--success)" onClick={() => navigate('/hr/directory')} />
        <StatCard icon={AlertTriangle} label="Burnout / Risk" value={burnout} sub="need attention" accent="var(--danger)" onClick={() => navigate('/hr/alerts')} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Completion ring + breakdown */}
        <div className="card p-5 flex-col items-center gap-4">
          <RingProgress pct={avgCompletion} size={120} stroke={10} color="var(--accent-primary)" label="Org Completion" />
          <div style={{ width: '100%' }}>
            {completionBands.map(b => (
              <div key={b.label} className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: b.color, display: 'inline-block' }} />
                  <span className="text-xs text-secondary">{b.label}</span>
                </div>
                <span className="text-xs font-bold">{b.value} emp</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dept bar chart */}
        <div className="card p-5">
          <h3 className="font-semibold mb-4">Employees by Department</h3>
          <BarChart data={deptData} height={180} />
        </div>

        {/* Promotion + highest performers */}
        <div className="card p-5">
          <h3 className="font-semibold mb-4 flex justify-between">Promotion Ready <span className="badge badge-accent">{promotionReady}</span></h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {employees.filter(e => e.promotionReady).slice(0, 4).map(e => (
              <div key={e.id} className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/hr/employee/${e.id}`)}>
                <img src={e.avatar} alt={e.name} style={{ width: 36, height: 36, borderRadius: '50%' }} />
                <div style={{ flex: 1 }}>
                  <div className="text-sm font-semibold">{e.name}</div>
                  <div className="text-xs text-secondary">{e.currentRole}</div>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--text-tertiary)' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Employee table preview */}
      <div className="card p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Recent Employees</h3>
          <button className="btn btn-secondary text-sm" onClick={() => navigate('/hr/directory')}>View All →</button>
        </div>
        <div className="emp-table-wrapper">
          <table className="emp-table">
            <thead>
              <tr>
                <th>Employee</th><th>Department</th><th>Completion</th><th>Role Fit</th><th>Risk</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.slice(0, 6).map(e => {
                const topFit = Math.max(...Object.values(e.roleFitScores || { x: 0 }));
                return (
                  <tr key={e.id} className="emp-table-row" onClick={() => navigate(`/hr/employee/${e.id}`)}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img src={e.avatar} alt={e.name} style={{ width: 34, height: 34, borderRadius: '50%' }} />
                        <div>
                          <div className="font-semibold text-sm">{e.name}</div>
                          <div className="text-xs text-secondary">{e.currentRole}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm text-secondary">{e.department}</td>
                    <td><ProgressBar pct={e.profileCompletion} height={5} showPct={true} /></td>
                    <td><ScoreBadge score={topFit} /></td>
                    <td><RiskBadge level={e.riskLevel} /></td>
                    <td>{e.promotionReady ? <span className="badge badge-success">✓ Promo Ready</span> : <span className="badge">Active</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HrDashboard;
