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

        setMessages(p => [...p, { sender: 'user', text: input }]);
        setInput('');

        setTimeout(() => {
            setMessages(p => [...p, { sender: 'ai', text: 'That is a great direction! Based on your profile, focusing on system architecture projects next quarter will directly boost your readiness for that path.' }]);
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
