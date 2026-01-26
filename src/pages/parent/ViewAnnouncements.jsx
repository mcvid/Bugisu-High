import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Megaphone, Calendar, User, AlertTriangle, Info } from 'lucide-react';
import { format } from 'date-fns';

const ViewAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('announcements')
            .select('*')
            .eq('status', 'published')
            .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
            .order('created_at', { ascending: false });

        setAnnouncements(data || []);
        setLoading(false);
    };

    const getPriorityIcon = (priority) => {
        if (priority === 'urgent') return <AlertTriangle size={20} color="#ef4444" />;
        if (priority === 'high') return <AlertTriangle size={20} color="#f59e0b" />;
        return <Info size={20} color="#3b82f6" />;
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' },
            normal: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
            high: { bg: '#fef3c7', text: '#92400e', border: '#fbbf24' },
            urgent: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' }
        };
        return colors[priority] || colors.normal;
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Megaphone size={32} color="var(--color-orange)" />
                    School Announcements
                </h1>
                <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                    Stay updated with the latest news and important information from Bugisu High School.
                </p>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading announcements...</p>
            ) : announcements.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    <Megaphone size={48} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
                    <p>No announcements at this time.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {announcements.map(ann => {
                        const priorityColor = getPriorityColor(ann.priority);

                        return (
                            <div
                                key={ann.id}
                                style={{
                                    background: 'white',
                                    border: `2px solid ${priorityColor.border}`,
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: selectedAnnouncement?.id === ann.id ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                                }}
                                onClick={() => setSelectedAnnouncement(ann)}
                            >
                                {/* Header */}
                                <div style={{
                                    background: priorityColor.bg,
                                    padding: '1rem 1.5rem',
                                    borderBottom: `1px solid ${priorityColor.border}`
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                {getPriorityIcon(ann.priority)}
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase',
                                                    color: priorityColor.text
                                                }}>
                                                    {ann.priority} Priority
                                                </span>
                                            </div>
                                            <h2 style={{ margin: 0, fontSize: '1.4rem', color: priorityColor.text }}>
                                                {ann.title}
                                            </h2>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div style={{ padding: '1.5rem' }}>
                                    <p style={{
                                        color: '#374151',
                                        lineHeight: 1.7,
                                        margin: 0,
                                        whiteSpace: selectedAnnouncement?.id === ann.id ? 'pre-wrap' : 'normal'
                                    }}>
                                        {selectedAnnouncement?.id === ann.id
                                            ? ann.content
                                            : ann.content.substring(0, 200) + (ann.content.length > 200 ? '...' : '')
                                        }
                                    </p>

                                    {selectedAnnouncement?.id !== ann.id && ann.content.length > 200 && (
                                        <button
                                            className="btn btn-outline btn-sm"
                                            style={{ marginTop: '1rem' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedAnnouncement(ann);
                                            }}
                                        >
                                            Read More
                                        </button>
                                    )}

                                    {/* Footer */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginTop: '1.5rem',
                                        paddingTop: '1rem',
                                        borderTop: '1px solid #e5e7eb',
                                        fontSize: '0.85rem',
                                        color: '#6b7280'
                                    }}>
                                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                                            <span>
                                                <Calendar size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                                {format(new Date(ann.created_at), 'MMM dd, yyyy')}
                                            </span>
                                            <span>
                                                <User size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                                {ann.target_audience === 'all' ? 'All Parents' : ann.target_audience}
                                            </span>
                                        </div>
                                        {ann.expires_at && (
                                            <span style={{ fontSize: '0.75rem', fontStyle: 'italic' }}>
                                                Valid until {format(new Date(ann.expires_at), 'MMM dd')}
                                            </span>
                                        )}
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

export default ViewAnnouncements;
