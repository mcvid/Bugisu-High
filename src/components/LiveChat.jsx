import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MessageSquare, X, Send, User, Minus, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './LiveChat.css';

const LiveChat = () => {
    const { t } = useTranslation(['chat', 'common']);
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userInfo, setUserInfo] = useState({ name: '', email: '' });
    const [hasJoined, setHasJoined] = useState(false);
    const messagesEndRef = useRef(null);

    // Initialize session from local storage or create new
    useEffect(() => {
        const storedSession = localStorage.getItem('chat_session_id');
        if (storedSession) {
            setSessionId(storedSession);
            setHasJoined(true);
            fetchSession(storedSession);
            fetchMessages(storedSession);
            subscribeToMessages(storedSession);
        }
    }, []);

    // Scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    // External Trigger: Listen for custom event to open chat
    useEffect(() => {
        const handleOpenChat = () => {
            setIsOpen(true);
            setIsMinimized(false);
        };
        window.addEventListener('open-live-chat', handleOpenChat);
        return () => window.removeEventListener('open-live-chat', handleOpenChat);
    }, []);

    const fetchSession = async (sid) => {
        const { data } = await supabase
            .from('chat_sessions')
            .select('user_name, user_email')
            .eq('id', sid)
            .single();

        if (data) {
            setUserInfo({ name: data.user_name, email: data.user_email || '' });
        }
    };

    const fetchMessages = async (sid) => {
        const { data } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('session_id', sid)
            .order('created_at', { ascending: true });

        if (data) setMessages(data);
    };

    const subscribeToMessages = (sid) => {
        const subscription = supabase
            .channel(`chat:${sid}`)
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${sid}` },
                (payload) => {
                    setMessages(prev => [...prev, payload.new]);
                }
            )
            .subscribe();

        return () => supabase.removeChannel(subscription);
    };

    const handleStartChat = async (e) => {
        e.preventDefault();
        try {
            // Create session
            const { data, error } = await supabase
                .from('chat_sessions')
                .insert([{ user_name: userInfo.name, user_email: userInfo.email }])
                .select()
                .single();

            if (error) throw error;

            setSessionId(data.id);
            localStorage.setItem('chat_session_id', data.id);
            setHasJoined(true);

            // Add welcome message
            await supabase.from('chat_messages').insert([{
                session_id: data.id,
                sender_type: 'admin',
                content: `Hi ${userInfo.name}! 👋 ${t('chat:intro_desc')}`,
                is_read: true
            }]);

            subscribeToMessages(data.id);
        } catch (error) {
            console.error('Error starting chat:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !sessionId) return;

        try {
            const { error } = await supabase.from('chat_messages').insert([{
                session_id: sessionId,
                sender_type: 'user',
                content: newMessage
            }]);

            if (error) throw error;
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Visibility logic
    const priorityPaths = ['/admissions', '/apply', '/contact'];
    const isPriorityPath = priorityPaths.some(path => location.pathname === path);
    const isHome = location.pathname === '/';

    // Hide on mobile if not priority or home
    const isVisibleOnMobile = isPriorityPath || isHome;

    if (!isVisibleOnMobile) {
        return (
            <div className="chat-mobile-hidden">
                {!isOpen && (
                    <button className="chat-launcher desktop-only" onClick={() => setIsOpen(true)}>
                        <MessageSquare size={24} />
                        <span>{t('chat:launcher')}</span>
                    </button>
                )}
            </div>
        );
    }

    if (!isOpen) {
        return (
            <button className="chat-launcher desktop-only" onClick={() => setIsOpen(true)}>
                <MessageSquare size={24} />
                <span className="launcher-text">{t('chat:launcher')}</span>
            </button>
        );
    }

    return (
        <div className={`chat-window ${isMinimized ? 'minimized' : ''}`}>
            <div className="chat-header">
                <div className="chat-title" onClick={() => setIsMinimized(!isMinimized)}>
                    <div className="status-dot"></div>
                    <span>{t('chat:header')}</span>
                </div>
                <div className="chat-controls">
                    <button onClick={() => setIsMinimized(!isMinimized)}>
                        <Minus size={18} />
                    </button>
                    <button onClick={() => setIsOpen(false)}>
                        <X size={18} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {!hasJoined ? (
                        <div className="chat-intro">
                            <h3>{t('chat:intro_title')}</h3>
                            <p>{t('chat:intro_desc')}</p>
                            <form onSubmit={handleStartChat}>
                                <input
                                    type="text"
                                    placeholder={t('chat:input_name')}
                                    required
                                    value={userInfo.name}
                                    onChange={e => setUserInfo({ ...userInfo, name: e.target.value })}
                                />
                                <input
                                    type="email"
                                    placeholder={t('chat:input_email')}
                                    value={userInfo.email}
                                    onChange={e => setUserInfo({ ...userInfo, email: e.target.value })}
                                />
                                <button type="submit" className="btn-start-chat">{t('chat:btn_start')}</button>
                            </form>
                        </div>
                    ) : (
                        <>
                            <div className="chat-response-notice">
                                <Info size={14} />
                                <span>
                                    {userInfo.email
                                        ? t('chat:response_notice_email', { email: userInfo.email })
                                        : t('chat:response_notice_no_email')}
                                </span>
                            </div>
                            <div className="chat-messages">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`message ${msg.sender_type}`}>
                                        <div className="message-bubble">
                                            {msg.content}
                                        </div>
                                        <span className="message-time">
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <form className="chat-input" onSubmit={handleSendMessage}>
                                <input
                                    type="text"
                                    placeholder={t('chat:placeholder')}
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                />
                                <button type="submit" disabled={!newMessage.trim()}>
                                    <Send size={18} />
                                </button>
                            </form>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default LiveChat;
