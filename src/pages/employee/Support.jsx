import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, ShieldCheck, Send, MessageSquare, Plus, CheckCircle, Clock } from 'lucide-react';

const MOCK_TICKETS = [
    { id: 'T-1029', title: 'Login issue with mobile app', status: 'Resolved', urgency: 'Normal', timestamp: '2 days ago' },
    { id: 'T-1035', title: 'Need access to Figma Pro', status: 'In Progress', urgency: 'Normal', timestamp: 'Yesterday' }
];

const AI_RESPONSES = [
    "I am so sorry you experienced that. Please know that your safety is our top priority. I'm escalating this confidentially to our Lead HR Partner.",
    "I can help with that! It looks like a minor system bug. I've logged the ticket and our IT team will patch it within 2 hours.",
    "Thank you for reaching out. Let me ask a few quick questions to categorize this properly."
];

const SupportPage = () => {
    const { currentUser } = useApp();
    const [tickets, setTickets] = useState(MOCK_TICKETS);
    const [activeTicket, setActiveTicket] = useState(null);

    // Create New Ticket State
    const [isCreating, setIsCreating] = useState(false);
    const [urgency, setUrgency] = useState('Normal');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [issueText, setIssueText] = useState('');

    // Chat State
    const [chatMessages, setChatMessages] = useState([{ sender: 'ai', text: "Hi there. I'm your AI Support Assistant. How can I help you today? You can report technical issues, or confidentially discuss workplace concerns." }]);
    const [chatInput, setChatInput] = useState('');
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    const handleSendChat = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMessage = { sender: 'user', text: chatInput };
        setChatMessages(prev => [...prev, userMessage]);
        setChatInput('');

        // AI Response Simulation
        setTimeout(() => {
            let aiText = "Thank you for explaining. I've noted this down. Would you like me to open a formal ticket for human review?";
            let newUrgency = 'Normal';
            let autoCreateTicket = false;
            
            if (userMessage.text.toLowerCase().includes('harass') || userMessage.text.toLowerCase().includes('safe')) {
                aiText = AI_RESPONSES[0];
                setUrgency('Confidential');
                newUrgency = 'Confidential';
                autoCreateTicket = true;
            } else if (userMessage.text.toLowerCase().includes('bug') || userMessage.text.toLowerCase().includes('access')) {
                aiText = AI_RESPONSES[1];
                autoCreateTicket = true;
            } else if (userMessage.text.toLowerCase() === 'yes' || userMessage.text.toLowerCase() === 'yes please') {
                aiText = "Understood. I have opened a formal ticket for you. A human agent will review it shortly.";
                autoCreateTicket = true;
            }

            if (autoCreateTicket) {
                const newTicket = {
                    id: `T-${Math.floor(1000 + Math.random() * 9000)}`,
                    title: userMessage.text.length > 25 ? userMessage.text.substring(0, 25) + '...' : userMessage.text,
                    status: 'Escalated',
                    urgency: newUrgency,
                    timestamp: 'Just now'
                };
                setTickets(prev => [newTicket, ...prev]);
            }

            setChatMessages(prev => [...prev, { sender: 'ai', text: aiText }]);
        }, 1000);
    };

    const handleCreateTicket = () => {
        if (!issueText.trim()) return;
        const newTicket = {
            id: `T-${Math.floor(1000 + Math.random() * 9000)}`,
            title: issueText.substring(0, 30) + '...',
            status: 'Open',
            urgency: urgency,
            timestamp: 'Just now'
        };
        setTickets([newTicket, ...tickets]);
        setIsCreating(false);
        setIssueText('');
        setChatMessages([{ sender: 'ai', text: `I've successfully created your ticket (${newTicket.id}). You will be updated here.` }]);
    };

    return (
        <div className="animate-fade-in page-wrapper" style={{ height: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column' }}>
            <div className="page-header mb-4">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="page-title flex items-center gap-2"><ShieldCheck style={{ color: 'var(--accent-primary)' }} /> Employee Support & Safety System</h1>
                        <p className="page-subtitle">Instant AI assistance, ticket tracking, and secure, confidential reporting.</p>
                    </div>
                    <button className="btn btn-danger flex items-center gap-2" onClick={() => { setIsCreating(true); setUrgency('Confidential'); }}>
                        <AlertTriangle size={18} /> Emergency / Confidential Report
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem', flex: 1, minHeight: 0 }}>
                {/* LEFT PANEL - TICKETS */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 className="font-bold text-sm">Your Tickets</h3>
                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => setIsCreating(true)}>
                            <Plus size={16} /> New
                        </button>
                    </div>
                    <div style={{ overflowY: 'auto', flex: 1, padding: '0.5rem' }}>
                        {tickets.map(t => (
                            <div key={t.id} onClick={() => { setActiveTicket(t); setIsCreating(false); }}
                                style={{
                                    padding: '0.75rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: '0.5rem',
                                    background: activeTicket?.id === t.id ? 'var(--bg-tertiary)' : 'transparent',
                                    border: '1px solid', borderColor: activeTicket?.id === t.id ? 'var(--border-color)' : 'transparent'
                                }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span className="font-bold text-sm">{t.id}</span>
                                    <span style={{ fontSize: '0.7rem', color: t.status === 'Resolved' ? 'var(--success)' : t.status === 'Open' ? 'var(--accent-primary)' : 'var(--warning)' }}>
                                        {t.status}
                                    </span>
                                </div>
                                <div className="text-sm truncate mb-1" style={{ color: 'var(--text-primary)' }}>{t.title}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                    <span>{t.timestamp}</span>
                                    <span style={{ color: t.urgency === 'Confidential' ? 'var(--danger)' : t.urgency === 'High' ? 'var(--warning)' : 'var(--text-secondary)' }}>
                                        {t.urgency}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT PANEL - CHAT / WORKSPACE */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                    {isCreating ? (
                        <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <MessageSquare size={20} /> Create New Request
                            </h2>
                            {urgency === 'Confidential' && (
                                <div className="p-4 mb-4 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--danger)' }}>
                                    <h4 className="font-bold flex items-center gap-2 mb-1"><ShieldCheck size={16} /> Confidential Reporting Enabled</h4>
                                    <p className="text-sm">Your report will be handled securely and confidentially. Only specialized HR personnel will have access.</p>
                                </div>
                            )}

                            <div className="form-group mb-4">
                                <label className="form-label">How can we help? (AI will automatically categorize)</label>
                                <textarea className="form-control" rows="4" placeholder="Describe your issue or concern..." value={issueText} onChange={e => setIssueText(e.target.value)} />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="form-group">
                                    <label className="form-label">Urgency Level</label>
                                    <select className="form-control" value={urgency} onChange={e => setUrgency(e.target.value)}>
                                        <option value="Normal">Normal (Technical, Minor Requests)</option>
                                        <option value="High">High Priority (Blocking work)</option>
                                        <option value="Confidential">Confidential / Sensitive</option>
                                    </select>
                                </div>
                                {urgency === 'Confidential' && (
                                    <div className="form-group flex justify-center items-center h-full pt-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} />
                                            <span className="font-bold text-sm">Submit Anonymously</span>
                                        </label>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2">
                                <button className="btn btn-secondary" onClick={() => setIsCreating(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleCreateTicket}>Submit Request</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* CHAT INTERFACE */}
                            <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                    <div className="text-xs text-secondary bg-gray-800 rounded-full px-3 py-1 inline-block" style={{ background: 'var(--bg-tertiary)' }}>
                                        AI First-Responder Active. Conversations are secure.
                                    </div>
                                </div>
                                {chatMessages.map((msg, idx) => (
                                    <div key={idx} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                                        <div style={{
                                            padding: '0.75rem 1rem',
                                            borderRadius: 'var(--radius-lg)',
                                            background: msg.sender === 'user' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                                            color: msg.sender === 'user' ? '#fff' : 'var(--text-primary)',
                                            borderBottomRightRadius: msg.sender === 'user' ? 4 : 'var(--radius-lg)',
                                            borderBottomLeftRadius: msg.sender === 'ai' ? 4 : 'var(--radius-lg)'
                                        }}>
                                            <div className="text-sm">{msg.text}</div>
                                        </div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '0.25rem', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                                            {msg.sender === 'user' ? 'You' : 'Support Agent (AI)'}
                                        </div>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>
                            {/* CHAT INPUT */}
                            <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
                                <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input type="text" className="form-control" placeholder="Ask for help or describe an issue..." style={{ flex: 1 }}
                                        value={chatInput} onChange={e => setChatInput(e.target.value)} />
                                    <button type="submit" className="btn btn-primary" style={{ padding: '0 1rem' }} disabled={!chatInput.trim()}>
                                        <Send size={18} />
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupportPage;
