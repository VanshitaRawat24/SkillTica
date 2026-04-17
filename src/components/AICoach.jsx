import { useState, useRef, useEffect } from 'react';
import { Target, X, MessageCircle, Send, Sparkles } from 'lucide-react';

const AICoach = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'ai', text: "Hey! I'm your AI Career Coach. Ready to figure out your next big move, or want to discuss a skill you're trying to learn?" }
    ]);
    const [input, setInput] = useState('');
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userText = input;
        setMessages(p => [...p, { sender: 'user', text: userText }]);
        setInput('');

        setTimeout(() => {
            const lowerInput = userText.toLowerCase();
            const fallbacks = [
                "That's an interesting thought! Keep updating your profile so I can give you more tailored advice.",
                "I see what you mean. Have you considered discussing this with your direct manager in your next 1-on-1?",
                "Great question! Exploring different career paths is always beneficial. Let me know if you need specific resources.",
                "I've noted that down. Exploring new areas is the best way to uncover hidden strengths!"
            ];
            
            let response = fallbacks[Math.floor(Math.random() * fallbacks.length)];

            if (lowerInput.includes('react') || lowerInput.includes('code') || lowerInput.includes('design') || lowerInput.includes('python') || lowerInput.includes('java') || lowerInput.includes('programming')) {
                response = "Technical skills like that are highly valued. I recommend taking a new certification and adding it to your profile to boost your promotion readiness!";
            } else if (lowerInput.includes('skill') || lowerInput.includes('learn') || lowerInput.includes('course')) {
                response = "Focusing on new skills is great! Have you checked out the 'Team Builder' section to see what skills are currently in high demand on other projects?";
            } else if (lowerInput.includes('salary') || lowerInput.includes('pay') || lowerInput.includes('raise')) {
                response = "Salary and compensation are important. To maximize your value, make sure your 'Experience' and 'Skills' sections are 100% up-to-date so HR can map you correctly.";
            } else if (lowerInput.includes('manager') || lowerInput.includes('lead') || lowerInput.includes('promote')) {
                response = "Transitioning to a leadership role requires behavioral maturity. Try updating your 'Behavioral' profile section—it greatly impacts your role fit score for management!";
            } else if (lowerInput.includes('leave') || lowerInput.includes('quit') || lowerInput.includes('vacation')) {
                response = "If you're feeling burned out or need time off, please make sure you coordinate with your manager. Your well-being is important.";
            }

            setMessages(p => [...p, { sender: 'ai', text: response }]);
        }, 1200);
    };

    return (
        <>
            {/* Floating Button */}
            <button
                className="fixed bottom-6 right-6 p-4 rounded-full shadow-lg hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', color: 'white', zIndex: 50 }}
                onClick={() => setIsOpen(true)}
            >
                <MessageCircle size={28} />
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 rounded-2xl shadow-xl flex flex-col overflow-hidden animate-fade-in"
                    style={{ height: '420px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', zIndex: 50 }}>

                    <div className="p-4 flex justify-between items-center text-white" style={{ background: 'var(--accent-primary)' }}>
                        <div className="font-bold flex items-center gap-2"><Sparkles size={16} /> AI Career Coach</div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-black/20 p-1 rounded"><X size={18} /></button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3" style={{ background: 'var(--bg-body)' }}>
                        {messages.map((m, i) => (
                            <div key={i} className={`p-3 rounded-lg text-sm ${m.sender === 'ai' ? 'mr-6' : 'ml-6'}`}
                                style={{
                                    background: m.sender === 'user' ? 'rgba(99,102,241,0.1)' : 'var(--bg-tertiary)',
                                    border: `1px solid ${m.sender === 'user' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                                    alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start'
                                }}>
                                {m.text}
                            </div>
                        ))}
                        <div ref={endRef} />
                    </div>

                    <form onSubmit={handleSend} className="p-3 border-t flex gap-2" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
                        <input type="text" className="form-control text-sm" placeholder="Ask for career advice..." style={{ flex: 1, padding: '0.5rem' }} value={input} onChange={e => setInput(e.target.value)} />
                        <button type="submit" className="btn btn-primary" style={{ padding: '0 0.75rem' }} disabled={!input.trim()}><Send size={15} /></button>
                    </form>

                </div>
            )}
        </>
    );
};

export default AICoach;
