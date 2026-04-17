import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { computeTeamScore } from '../../data/employees';
import { RingProgress, InsightBox } from '../../components/ui';
import { Plus, X, Users } from 'lucide-react';

const TeamBuilder = () => {
  const { employees } = useApp();
  const [teamName, setTeamName] = useState('Project Alpha');
  const [team, setTeam] = useState([]);
  const [search, setSearch] = useState('');

  const addMember = (emp) => {
    if (!team.find(m => m.id === emp.id) && team.length < 8) {
      setTeam(prev => [...prev, emp]);
    }
  };
  const removeMember = (id) => setTeam(prev => prev.filter(m => m.id !== id));

  const stats = computeTeamScore(team);
  const scoreColor = stats.score >= 75 ? 'var(--success)' : stats.score >= 50 ? 'var(--warning)' : 'var(--danger)';

  const filtered = employees.filter(e =>
    !team.find(m => m.id === e.id) &&
    (e.name.toLowerCase().includes(search.toLowerCase()) || e.skills.some(s => s.toLowerCase().includes(search.toLowerCase())))
  );

  const teamAiInsight = team.length >= 2
    ? `Team "${teamName}" has ${stats.memberCount} members covering ${stats.skills.length} unique skills. ${stats.warning || `Behavioral compatibility is ${stats.behavioralAvg >= 80 ? 'excellent' : 'moderate'} (avg ${stats.behavioralAvg}/100). This team has ${stats.score >= 75 ? 'a strong foundation' : 'some balance gaps to address'}.`}`
    : "Add at least 2 members to generate a team intelligence report.";

  return (
    <div className="animate-fade-in page-wrapper">
      <div className="page-header flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="page-title">Team Builder</h1>
          <p className="page-subtitle">Build balanced, high-performance teams using intelligence data.</p>
        </div>
        <div className="flex items-center gap-3">
          <input className="form-control" value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="Team name..." style={{ maxWidth: 200 }} />
        </div>
      </div>

      <div className="team-builder-layout">
        {/* Left: Employee pool */}
        <div className="card p-4" style={{ maxHeight: '75vh', display: 'flex', flexDirection: 'column' }}>
          <h3 className="font-bold mb-3">Employee Pool</h3>
          <input className="form-control mb-3" placeholder="Search employees or skills…" value={search} onChange={e => setSearch(e.target.value)} />
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {filtered.map(e => (
              <div key={e.id} className="emp-pool-card flex items-center gap-3" onClick={() => addMember(e)}>
                <img src={e.avatar} alt={e.name} style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div className="font-semibold text-sm">{e.name}</div>
                  <div className="text-xs text-secondary">{e.currentRole}</div>
                </div>
                <Plus size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              </div>
            ))}
            {filtered.length === 0 && <p className="text-sm text-secondary text-center p-4">All employees added.</p>}
          </div>
        </div>

        {/* Center: Team roster */}
        <div className="card p-4" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 className="font-bold flex items-center gap-2"><Users size={18} /> {teamName} <span className="badge badge-accent">{team.length}/8</span></h3>
          {team.length === 0 ? (
            <div className="flex items-center justify-center" style={{ flex: 1, color: 'var(--text-tertiary)', flexDirection: 'column', gap: '0.5rem', padding: '2rem', textAlign: 'center' }}>
              <Users size={40} opacity={0.2} />
              <p>Click employees to add them to this team.</p>
            </div>
          ) : (
            team.map(m => (
              <div key={m.id} className="team-member-card flex items-center gap-3">
                <img src={m.avatar} alt={m.name} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                <div style={{ flex: 1 }}>
                  <div className="font-semibold text-sm">{m.name}</div>
                  <div className="text-xs text-secondary">{m.currentRole}</div>
                  <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                    {m.skills.slice(0, 3).map(s => <span key={s} className="badge badge-accent" style={{ fontSize: '0.62rem' }}>{s}</span>)}
                  </div>
                </div>
                <button onClick={() => removeMember(m.id)} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                  <X size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Right: Team analytics */}
        <div className="card p-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 className="font-bold">Team Intelligence</h3>
          {team.length >= 2 ? (
            <>
              <div className="flex justify-center">
                <RingProgress pct={stats.score} size={120} stroke={10} color={scoreColor} label="Team Score" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg text-center" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                  <div className="font-bold text-xl" style={{ color: 'var(--accent-primary)' }}>{stats.skills.length}</div>
                  <div className="text-xs text-secondary">Unique Skills</div>
                </div>
                <div className="p-3 rounded-lg text-center" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                  <div className="font-bold text-xl" style={{ color: 'var(--accent-secondary)' }}>{stats.behavioralAvg}</div>
                  <div className="text-xs text-secondary">Behavioral Avg</div>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-secondary mb-2">TEAM SKILLS</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {stats.skills.slice(0, 14).map(s => <span key={s} className="badge badge-accent" style={{ fontSize: '0.7rem' }}>{s}</span>)}
                  {stats.skills.length > 14 && <span className="badge">+{stats.skills.length - 14} more</span>}
                </div>
              </div>
              {stats.warning && (
                <div className="p-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius-md)' }}>
                  <p className="text-xs text-warning font-semibold">⚠ {stats.warning}</p>
                </div>
              )}
              <InsightBox text={teamAiInsight} />
            </>
          ) : (
            <div style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '2rem' }}>
              <p>Add 2+ members to see team analytics.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamBuilder;
