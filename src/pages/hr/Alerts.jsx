import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { RiskBadge } from '../../components/ui';
import { AlertTriangle, TrendingDown, Clock, ChevronRight } from 'lucide-react';

const Alerts = () => {
  const navigate = useNavigate();
  const { employees } = useApp();

  const highRisk = employees.filter(e => e.riskLevel === 'high');
  const medRisk = employees.filter(e => e.riskLevel === 'medium');
  const incompleteProfiles = employees.filter(e => e.profileCompletion < 60).sort((a, b) => a.profileCompletion - b.profileCompletion);
  const overloaded = employees.filter(e => e.workloadHours > 50).sort((a, b) => b.workloadHours - a.workloadHours);
  const promotionReady = employees.filter(e => e.promotionReady);

  const AlertCard = ({ emp, type, message, color }) => (
    <div className="emp-pool-card flex items-center gap-3 mb-3 cursor-pointer" onClick={() => navigate(`/hr/employee/${emp.id}`)}>
      <img src={emp.avatar} alt={emp.name} style={{ width: 40, height: 40, borderRadius: '50%' }} />
      <div style={{ flex: 1 }}>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{emp.name}</span>
          <RiskBadge level={emp.riskLevel} />
        </div>
        <p className="text-xs text-secondary">{message}</p>
        <p className="text-xs" style={{ color }}>{type}</p>
      </div>
      <ChevronRight size={16} style={{ color: 'var(--text-tertiary)' }} />
    </div>
  );

  return (
    <div className="animate-fade-in page-wrapper">
      <div className="page-header">
        <h1 className="page-title">Alerts & Recommendations</h1>
        <p className="page-subtitle">Proactive intelligence flags that require HR attention.</p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Burnout / High Risk */}
        <div className="card p-5" style={{ borderLeft: '3px solid var(--danger)' }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} color="var(--danger)" />
            <h3 className="font-bold text-danger m-0">High Burnout Risk ({highRisk.length})</h3>
          </div>
          {highRisk.length === 0 ? <p className="text-sm text-secondary">No high-risk employees. 🎉</p> :
            highRisk.map(e => <AlertCard key={e.id} emp={e} type="🔴 Immediate attention required" message={`${e.workloadHours}h/week · Low collaboration score`} color="var(--danger)" />)}
        </div>

        {/* Medium Risk */}
        <div className="card p-5" style={{ borderLeft: '3px solid var(--warning)' }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} color="var(--warning)" />
            <h3 className="font-bold text-warning m-0">Moderate Risk ({medRisk.length})</h3>
          </div>
          {medRisk.length === 0 ? <p className="text-sm text-secondary">No medium-risk employees.</p> :
            medRisk.map(e => <AlertCard key={e.id} emp={e} type="🟡 Monitor closely" message={`${e.workloadHours}h/week · Stress indicators present`} color="var(--warning)" />)}
        </div>

        {/* Overloaded */}
        <div className="card p-5" style={{ borderLeft: '3px solid var(--accent-secondary)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Clock size={20} color="var(--accent-secondary)" />
            <h3 className="font-bold m-0" style={{ color: 'var(--accent-secondary)' }}>Overloaded (&gt;50h/week) ({overloaded.length})</h3>
          </div>
          {overloaded.length === 0 ? <p className="text-sm text-secondary">All workloads are healthy.</p> :
            overloaded.map(e => (
              <div key={e.id} className="emp-pool-card flex items-center gap-3 mb-3 cursor-pointer" onClick={() => navigate(`/hr/employee/${e.id}`)}>
                <img src={e.avatar} alt={e.name} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                <div style={{ flex: 1 }}>
                  <div className="font-semibold text-sm">{e.name}</div>
                  <div className="text-xs text-secondary">{e.currentRole}</div>
                </div>
                <span className="font-bold text-lg" style={{ color: 'var(--danger)' }}>{e.workloadHours}h</span>
              </div>
            ))}
        </div>

        {/* Promotion Ready */}
        <div className="card p-5" style={{ borderLeft: '3px solid var(--success)' }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown size={20} color="var(--success)" style={{ transform: 'rotate(180deg)' }} />
            <h3 className="font-bold text-success m-0">Promotion Candidates ({promotionReady.length})</h3>
          </div>
          {promotionReady.map(e => (
            <div key={e.id} className="emp-pool-card flex items-center gap-3 mb-3 cursor-pointer" onClick={() => navigate(`/hr/employee/${e.id}`)}>
              <img src={e.avatar} alt={e.name} style={{ width: 40, height: 40, borderRadius: '50%' }} />
              <div style={{ flex: 1 }}>
                <div className="font-semibold text-sm">{e.name}</div>
                <div className="text-xs text-secondary">{e.currentRole}</div>
              </div>
              <span className="badge badge-success">Promote ↑</span>
            </div>
          ))}
        </div>

        {/* Incomplete Profiles */}
        {incompleteProfiles.length > 0 && (
          <div className="card p-5" style={{ gridColumn: 'span 2', borderLeft: '3px solid var(--text-tertiary)' }}>
            <h3 className="font-bold mb-4 text-secondary">Incomplete Profiles (below 60%)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
              {incompleteProfiles.map(e => (
                <div key={e.id} className="emp-pool-card flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/hr/employee/${e.id}`)}>
                  <img src={e.avatar} alt={e.name} style={{ width: 36, height: 36, borderRadius: '50%' }} />
                  <div style={{ flex: 1 }}>
                    <div className="font-semibold text-sm">{e.name}</div>
                    <div style={{ height: 4, background: 'var(--bg-tertiary)', borderRadius: 99, marginTop: 4 }}>
                      <div style={{ width: `${e.profileCompletion}%`, height: '100%', background: 'var(--danger)', borderRadius: 99 }} />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-danger">{e.profileCompletion}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
