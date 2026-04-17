import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Brain, TrendingUp, Target, Network, Compass, CheckSquare } from 'lucide-react';
import { ScoreBadge, RingProgress, ProgressBar } from '../../components/ui';
import { ROLES_DB } from '../../data/employees';

const CareerHub = () => {
    const { currentUser } = useApp();
    const emp = currentUser;

    const [simRole, setSimRole] = useState(emp?.desiredRole || 'Full Stack Developer');
    const [simSkill, setSimSkill] = useState('');

    if (!emp) return null;

    // Mock DNA Profile
    const dnaTraits = [
        { trait: 'Technical Execution', score: 85 },
        { trait: 'Problem Solving', score: emp.behavioralScore || 70 },
        { trait: 'Leadership', score: emp.teamCollaboration || 60 },
        { trait: 'Adaptability', score: 90 }
    ];

    // Logic for Simulation
    const roleReqs = ROLES_DB[simRole]?.requiredSkills || [];
    const empSkills = Array.isArray(emp.skills) ? emp.skills : [];
    const currentMatched = roleReqs.filter(s => empSkills.includes(s)).length;
    const simMatched = roleReqs.filter(s => empSkills.includes(s) || s === simSkill).length;
    const currentFit = roleReqs.length ? Math.round((currentMatched / roleReqs.length) * 100) : 0;
    const simFit = roleReqs.length ? Math.round((simMatched / roleReqs.length) * 100) : 0;

    // Mock Goals
    const [goals, setGoals] = useState([
        { id: 1, text: `Master ${roleReqs.find(s => !empSkills.includes(s)) || 'a new skill'}`, done: false },
        { id: 2, text: `Lead a cross-functional meeting`, done: false },
        { id: 3, text: `Update Profile Certifications`, done: true }
    ]);

    const toggleGoal = (id) => {
        setGoals(goals.map(g => g.id === id ? { ...g, done: !g.done } : g));
    };

    const completedGoals = goals.filter(g => g.done).length;

    return (
        <div className="animate-fade-in page-wrapper">
            <div className="page-header mb-6">
                <h1 className="page-title flex items-center gap-2"><Compass color="var(--accent-primary)" /> Personal Career Intelligence Engine</h1>
                <p className="page-subtitle">Your strategic career compass, powered by AI.</p>
            </div>

            <div className="grid gap-6 mb-6" style={{ gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)' }}>
                {/* Left Column: DNA & Simulator */}
                <div className="flex flex-col gap-6">

                    {/* Career DNA */}
                    <div className="card p-5">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Network size={18} /> Career DNA Profile</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {dnaTraits.map(t => (
                                <div key={t.trait} className="p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-semibold">{t.trait}</span>
                                        <ScoreBadge score={t.score} />
                                    </div>
                                    <ProgressBar pct={t.score} height={6} showPct={false} color="var(--accent-primary)" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Future Role Sim */}
                    <div className="card p-5" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(16,185,129,0.04))' }}>
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Brain size={18} /> Future Role Simulator</h3>
                        <p className="text-sm text-secondary mb-4">Select a target role and choose a skill to learn to see your predicted fit increase instantly.</p>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="form-group">
                                <label className="form-label">Target Role</label>
                                <select className="form-control" value={simRole} onChange={(e) => { setSimRole(e.target.value); setSimSkill(''); }}>
                                    {Object.keys(ROLES_DB).map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">If I learned...</label>
                                <select className="form-control" value={simSkill} onChange={(e) => setSimSkill(e.target.value)}>
                                    <option value="">-- Choose Skill --</option>
                                    {roleReqs.filter(s => !empSkills.includes(s)).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl flex items-center justify-between" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                            <div>
                                <div className="text-xs text-secondary mb-1 uppercase font-bold tracking-wider">Current Fit</div>
                                <div className="text-2xl font-bold">{currentFit}%</div>
                            </div>
                            <div style={{ color: 'var(--success)' }}>
                                <TrendingUp size={24} />
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div className="text-xs text-secondary mb-1 uppercase font-bold tracking-wider">Simulated Fit</div>
                                <div className="text-2xl font-bold text-success">{Math.max(currentFit, simFit)}%</div>
                                {simFit > currentFit && <div className="text-xs text-success font-bold mt-1">+{simFit - currentFit}% Boost!</div>}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column: Timeline & Progress */}
                <div className="flex flex-col gap-6">

                    {/* Motivation & Progress */}
                    <div className="card p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2"><Target size={18} /> One-Click Upgrade Plan</h3>
                            <RingProgress pct={Math.round((completedGoals / goals.length) * 100)} size={50} stroke={4} showLabel={false} color="var(--success)" />
                        </div>
                        <p className="text-sm text-secondary mb-3">AI-Generated daily goals to keep you motivated and on track for promotion.</p>

                        <div className="flex flex-col gap-2">
                            {goals.map(g => (
                                <div key={g.id} className="p-3 rounded-lg flex gap-3 items-start cursor-pointer hover:bg-white/5 transition-colors"
                                    onClick={() => toggleGoal(g.id)} style={{ border: '1px solid var(--border-color)', background: g.done ? 'rgba(16,185,129,0.1)' : 'transparent' }}>
                                    <div style={{ color: g.done ? 'var(--success)' : 'var(--text-tertiary)', marginTop: 2 }}>
                                        <CheckSquare size={18} fill={g.done ? "currentColor" : "none"} color={g.done ? "#fff" : "currentColor"} />
                                    </div>
                                    <span className={`text-sm ${g.done ? 'text-secondary line-through' : 'font-medium'}`}>{g.text}</span>
                                </div>
                            ))}
                        </div>
                        {completedGoals === goals.length && (
                            <div className="mt-4 text-center text-sm font-bold text-accent">Confidence Score +10! All tasks complete.</div>
                        )}
                    </div>

                    {/* Growth Timeline */}
                    <div className="card p-5">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><TrendingUp size={18} /> Growth Timeline Predictor</h3>
                        <div className="relative pl-6" style={{ borderLeft: '2px dashed var(--border-color)' }}>

                            <div className="mb-6 relative">
                                <div className="absolute w-3 h-3 rounded-full" style={{ background: 'var(--success)', left: -31, top: 4 }}></div>
                                <div className="text-xs text-secondary font-bold mb-1">CURRENT</div>
                                <div className="font-bold">{emp.currentRole}</div>
                            </div>

                            <div className="mb-6 relative">
                                <div className="absolute w-3 h-3 rounded-full" style={{ background: 'var(--warning)', left: -31, top: 4 }}></div>
                                <div className="text-xs text-warning font-bold mb-1">IN 6 MONTHS</div>
                                <div className="font-bold">{simRole} Project Lead</div>
                                <div className="text-xs text-secondary mt-1">Requires completing: {goals[0].text}</div>
                            </div>

                            <div className="relative">
                                <div className="absolute w-3 h-3 rounded-full" style={{ background: 'var(--bg-tertiary)', border: '2px solid var(--text-tertiary)', left: -31, top: 4 }}></div>
                                <div className="text-xs text-tertiary font-bold mb-1">12-18 MONTHS</div>
                                <div className="font-bold text-tertiary">{emp.desiredRole || 'Senior Role'}</div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CareerHub;
