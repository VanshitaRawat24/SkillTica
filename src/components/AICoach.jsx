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