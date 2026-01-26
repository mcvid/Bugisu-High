import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Bell, CheckCircle, AlertCircle, Info, X, Calendar, DollarSign, BookOpen, UserCheck } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';

const ParentNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [studentPhone, setStudentPhone] = useState('0700000000'); // Demo

    useEffect(() => {
        fetchNotifications();
    }, [filter, studentPhone]);

    const fetchNotifications = async () => {
        setLoading(true);

        // Get student first
        const { data: students } = await supabase
            .from('students')
            .select('*')
            .eq('parent_phone', studentPhone);

        if (!students || students.length === 0) {
            setLoading(false);
            return;
        }

        const studentIds = students.map(s => s.id);

        let query = supabase
            .from('notifications')
            .select('*')
            .in('student_id', studentIds)
            .order('created_at', { ascending: false });

        if (filter === 'unread') {
            query = query.eq('is_read', false);
        } else if (filter !== 'all') {
            query = query.eq('category', filter);
        }

        const { data } = await query;
        setNotifications(data || []);
        setLoading(false);
    };

    const markAsRead = async (id) => {
        await supabase
            .from('notifications')
            .update({ is_read: true, read_at: new Date().toISOString() })
            .eq('id', id);

        fetchNotifications();
    };

    const markAllAsRead = async () => {
        const { data: students } = await supabase
            .from('students')
            .select('id')
            .eq('parent_phone', studentPhone);

        if (!students) return;

        const studentIds = students.map(s => s.id);

        await supabase
            .from('notifications')
            .update({ is_read: true, read_at: new Date().toISOString() })
            .in('student_id', studentIds)
            .eq('is_read', false);

        fetchNotifications();
    };

    const getIcon = (category) => {
        const icons = {
            fees: DollarSign,
            exams: BookOpen,
            results: CheckCircle,
            attendance: UserCheck,
            announcements: Bell,
            general: Info
        };
        return icons[category] || Info;
    };

    const getColor = (category, priority) => {
        if (priority === 'urgent') return '#ef4444';
        if (priority === 'high') return '#f59e0b';

        const colors = {
            fees: '#10b981',
            exams: '#3b82f6',
            results: '#8b5cf6',
            attendance: '#f59e0b',
            announcements: '#06b6d4',
            general: '#6b7280'
        };
        return colors[category] || '#6b7280';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isToday(date)) return 'Today, ' + format(date, 'HH:mm');
        if (isYesterday(date)) return 'Yesterday, ' + format(date, 'HH:mm');
        return format(date, 'MMM dd, yyyy HH:mm');
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Bell size={32} color="var(--color-orange)" />
                        Notifications
                    </h1>
                    <p style={{ color: '#6b7280', margin: '0.5rem 0 0' }}>
                        {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button className="btn btn-outline btn-sm" onClick={markAllAsRead}>
                        Mark All as Read
                    </button>
                )}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', overflowX: 'auto' }}>
                {['all', 'unread', 'fees', 'exams', 'results', 'attendance', 'announcements'].map(f => (
                    <button
                        key={f}
                        className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setFilter(f)}
                        style={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Notifications List */}
            {loading ? (
                <p style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading...</p>
            ) : notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    <Bell size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                    <p>No notifications found.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {notifications.map(notif => {
                        const Icon = getIcon(notif.category);
                        const color = getColor(notif.category, notif.priority);

                        return (
                            <div
                                key={notif.id}
                                style={{
                                    background: notif.is_read ? 'white' : '#fffbeb',
                                    border: `1px solid ${notif.is_read ? '#e5e7eb' : '#fef3c7'}`,
                                    borderLeft: `4px solid ${color}`,
                                    borderRadius: '8px',
                                    padding: '1.25rem',
                                    cursor: notif.is_read ? 'default' : 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onClick={() => !notif.is_read && markAsRead(notif.id)}
                            >
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: `${color}15`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <Icon size={20} color={color} />
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                            <div>
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    textTransform: 'uppercase',
                                                    fontWeight: 600,
                                                    color: color
                                                }}>
                                                    {notif.category}
                                                </span>
                                                {notif.priority && notif.priority !== 'normal' && (
                                                    <span style={{
                                                        marginLeft: '0.5rem',
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                        background: '#fee2e2',
                                                        color: '#991b1b',
                                                        fontSize: '0.65rem',
                                                        fontWeight: 700,
                                                        textTransform: 'uppercase'
                                                    }}>
                                                        {notif.priority}
                                                    </span>
                                                )}
                                            </div>
                                            {!notif.is_read && (
                                                <div style={{
                                                    width: '8px',
                                                    height: '8px',
                                                    borderRadius: '50%',
                                                    background: color
                                                }} />
                                            )}
                                        </div>
                                        <p style={{
                                            margin: '0.5rem 0',
                                            color: '#1f2937',
                                            lineHeight: 1.5,
                                            fontWeight: notif.is_read ? 400 : 600
                                        }}>
                                            {notif.message}
                                        </p>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Calendar size={12} />
                                            {formatDate(notif.created_at)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ParentNotifications;
