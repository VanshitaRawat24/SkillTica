import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ScoreBadge, RiskBadge, ProgressBar } from '../../components/ui';
import { Search, Filter } from 'lucide-react';

const DEPARTMENTS = ['All', 'Engineering', 'Data', 'Product', 'Design'];

const Directory = () => {
  const navigate = useNavigate();
  const { employees } = useApp();
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [riskFilter, setRiskFilter] = useState('All');

  const filtered = employees
    .filter(e => dept === 'All' || e.department === dept)
    .filter(e => riskFilter === 'All' || e.riskLevel === riskFilter.toLowerCase())
    .filter(e =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.currentRole.toLowerCase().includes(search.toLowerCase()) ||
      e.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'completion') return b.profileCompletion - a.profileCompletion;
      if (sortBy === 'experience') return b.yearsExperience - a.yearsExperience;
      if (sortBy === 'behavioral') return b.behavioralScore - a.behavioralScore;
      return 0;
    });

  return (
    <div className="animate-fade-in page-wrapper">
      <div className="page-header">
        <h1 className="page-title">Employee Directory</h1>
        <p className="page-subtitle">Search, filter, and explore your workforce intelligence.</p>
      </div>

      {/* Filters */}
      <div className="card mb-5 p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2" style={{ flex: '1 1 200px' }}>
          <Search size={17} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <input className="form-control" placeholder="Search by name, role, or skill..." value={search} onChange={e => setSearch(e.target.value)} style={{ border: 'none', background: 'transparent', padding: '0.3rem 0' }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {DEPARTMENTS.map(d => (
            <button key={d} onClick={() => setDept(d)} className="btn" style={{
              background: dept === d ? 'rgba(99,102,241,0.15)' : 'var(--bg-tertiary)',
              color: dept === d ? 'var(--accent-primary)' : 'var(--text-secondary)',
              border: `1px solid ${dept === d ? 'rgba(99,102,241,0.4)' : 'var(--border-color)'}`,
              padding: '0.35rem 0.85rem', fontSize: '0.83rem',
            }}>{d}</button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Low', 'Medium', 'High'].map(r => (
            <button key={r} onClick={() => setRiskFilter(r)} className="btn" style={{
              background: riskFilter === r ? 'rgba(239,68,68,0.12)' : 'var(--bg-tertiary)',
              color: riskFilter === r ? 'var(--danger)' : 'var(--text-secondary)',
              border: `1px solid ${riskFilter === r ? 'rgba(239,68,68,0.35)' : 'var(--border-color)'}`,
              padding: '0.35rem 0.85rem', fontSize: '0.83rem',
            }}>{r} Risk</button>
          ))}
        </div>
        <select className="form-control" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ maxWidth: 180, padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>
          <option value="name">Sort: Name</option>
          <option value="completion">Sort: Completion</option>
          <option value="experience">Sort: Experience</option>
          <option value="behavioral">Sort: Behavioral Score</option>
        </select>
      </div>

      <p className="text-sm text-secondary mb-4">{filtered.length} employee(s) found</p>

      {/* Table */}
      <div className="card p-0" style={{ overflow: 'hidden' }}>
        <div className="emp-table-wrapper">
          <table className="emp-table">
            <thead>
              <tr>
                <th>Employee</th><th>Department</th><th>Experience</th><th>Profile</th><th>Top Role Fit</th><th>Risk</th><th>Behavioral</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => {
                const topFit = Math.max(...Object.values(e.roleFitScores || { x: 0 }));
                return (
                  <tr key={e.id} className="emp-table-row" onClick={() => navigate(`/hr/employee/${e.id}`)}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img src={e.avatar} alt={e.name} style={{ width: 36, height: 36, borderRadius: '50%' }} />
                        <div>
                          <div className="font-semibold text-sm">{e.name}</div>
                          <div className="text-xs text-secondary">{e.currentRole}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-accent">{e.department}</span></td>
                    <td className="text-sm">{e.yearsExperience} yrs</td>
                    <td style={{ minWidth: 120 }}><ProgressBar pct={e.profileCompletion} showPct height={5} /></td>
                    <td><ScoreBadge score={topFit} /></td>
                    <td><RiskBadge level={e.riskLevel} /></td>
                    <td className="text-sm font-semibold">{e.behavioralScore}</td>
                    <td><button className="btn btn-secondary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>View →</button></td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-tertiary)' }}>No employees found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Directory;
