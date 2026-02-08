import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Info, AlertTriangle, FileText, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import './NotificationCenter.css';

const NotificationCenter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const menuRef = useRef(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (!error && data) {
                setNotifications(data);
                const readIds = JSON.parse(localStorage.getItem('read_notifications') || '[]');
                const unread = data.filter(n => !readIds.includes(n.id)).length;
                setUnreadCount(unread);
            }
        };

        fetchNotifications();

        const subscription = supabase
            .channel('notifications-db-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, fetchNotifications)
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAllAsRead = () => {
        const allIds = notifications.map(n => n.id);
        localStorage.setItem('read_notifications', JSON.stringify(allIds));
        setUnreadCount(0);
    };

    const isRead = (id) => {
        const readIds = JSON.parse(localStorage.getItem('read_notifications') || '[]');
        return readIds.includes(id);
    };

    const toggleNotification = (id) => {
        const readIds = JSON.parse(localStorage.getItem('read_notifications') || '[]');
        if (!readIds.includes(id)) {
            readIds.push(id);
            localStorage.setItem('read_notifications', JSON.stringify(readIds));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'emergency': return <AlertTriangle size={18} color="#ef4444" />;
            case 'result': return <FileText size={18} color="#10b981" />;
            default: return <Info size={18} color="#3b82f6" />;
        }
    };

    return (
        <div className="notification-center-container" ref={menuRef}>
            <button
                className="notif-bell-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Notifications"
            >
                <Bell size={22} />
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className="notif-dropdown-panel">
                    <div className="notif-header">
                        <h3>School Alerts</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllAsRead} className="mark-read-all">
                                <Check size={14} /> Mark all read
                            </button>
                        )}
                    </div>

                    <div className="notif-list">
                        {notifications.length === 0 ? (
                            <div className="notif-empty">
                                <p>No notifications found.</p>
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div
                                    key={notif.id}
                                    className={`notif-item ${isRead(notif.id) ? 'read' : 'unread'}`}
                                    onClick={() => toggleNotification(notif.id)}
                                >
                                    <div className="notif-icon-box">
                                        {getIcon(notif.type)}
                                    </div>
                                    <div className="notif-content">
                                        <p className="notif-title">{notif.title}</p>
                                        <p className="notif-text">{notif.content}</p>
                                        <span className="notif-time">
                                            {new Date(notif.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {!isRead(notif.id) && <div className="unread-dot" />}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
