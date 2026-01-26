import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Send, Calendar, FileText, LogOut, User, MessageSquare, BookOpen, TrendingUp } from 'lucide-react';
import { parentAuth } from '../../utils/parentAuth.jsx';
import { supabase } from '../../lib/supabase';
import ReportCard from '../../components/ReportCard';
import { X, Download } from 'lucide-react';

const ParentPortal = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [reportGrades, setReportGrades] = useState([]);
    const [reportMeta, setReportMeta] = useState({});
    const [reportComps, setReportComps] = useState([]);
    const [loadingReport, setLoadingReport] = useState(false);

    useEffect(() => {
        // Check auth
        if (!parentAuth.isAuthenticated()) {
            navigate('/parents');
            return;
        }

        // Load student data
        fetchStudentData();
    }, [navigate]);

    const fetchStudentData = async () => {
        const parentPhone = sessionStorage.getItem('parentPhone');
        if (!parentPhone) {
            console.error('No parent phone found in session');
            return;
        }

        const { data } = await supabase
            .from('students')
            .select('*')
            .eq('parent_phone', parentPhone);

        setStudents(data || []);

        // Get unread notifications count
        if (data && data.length > 0) {
            const studentIds = data.map(s => s.id);
            const { data: notifications } = await supabase
                .from('notifications')
                .select('id')
                .in('student_id', studentIds)
                .eq('is_read', false);

            setUnreadCount(notifications?.length || 0);
        }
    };

    const handleLogout = () => {
        parentAuth.logout();
        sessionStorage.removeItem('parentPhone');
        navigate('/parents');
    };

    const handleViewReport = async (student) => {
        setSelectedStudent(student);
        setLoadingReport(true);
        try {
            const currentYear = new Date().getFullYear();
            const { data, error } = await supabase
                .from('grades')
                .select('*, subjects(name, category)')
                .eq('student_id', student.id)
                .eq('year', currentYear)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReportGrades(data || []);

            // Fetch Metadata
            const { data: metaData } = await supabase
                .from('report_metadata')
                .select('*')
                .eq('student_id', student.id)
                .eq('term', 'Term 1') // Should be dynamic in full version
                .eq('year', currentYear)
                .single();
            setReportMeta(metaData || {});

            // Fetch Competencies
            const { data: compData } = await supabase
                .from('competencies')
                .select('*')
                .eq('student_id', student.id)
                .eq('term', 'Term 1')
                .eq('year', currentYear);
            setReportComps(compData || []);
        } catch (error) {
            console.error('Error fetching report:', error);
            alert('Failed to load report card.');
        } finally {
            setLoadingReport(false);
        }
    };

    const quickLinks = [
        {
            icon: Bell,
            title: 'Notifications',
            description: 'View all alerts and updates',
            link: '/parent/notifications',
            color: '#f59e0b',
            badge: unreadCount > 0 ? unreadCount : null
        },
        {
            icon: FileText,
            title: 'Announcements',
            description: 'School news and important info',
            link: '/parent/announcements',
            color: '#06b6d4'
        },
        {
            icon: Send,
            title: 'Leave Request',
            description: 'Submit absence requests',
            link: '/parent/leave-request',
            color: '#8b5cf6'
        },
        {
            icon: Calendar,
            title: 'Events Calendar',
            description: 'Upcoming school events',
            link: '/calendar',
            color: '#22c55e'
        },
        {
            icon: BookOpen,
            title: 'Academic Resources',
            description: 'Study materials and past papers',
            link: '/resources',
            color: '#3b82f6'
        },
        {
            icon: MessageSquare,
            title: 'Contact School',
            description: 'Get in touch with us',
            link: '/contact',
            color: '#ef4444'
        }
    ];

    return (
        <div style={{ minHeight: '85vh', background: 'linear-gradient(to bottom, #fff7ed, #ffffff)' }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 4vw, 2rem)'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 'clamp(2rem, 5vw, 3rem)',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div>
                        <h1 style={{
                            fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #f97316, #ea580c)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '0.5rem'
                        }}>
                            Parent Portal
                        </h1>
                        <p style={{
                            color: '#6b7280',
                            fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)'
                        }}>
                            Welcome back! Manage your child's school journey.
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '0.75rem 1.25rem',
                            background: 'white',
                            border: '2px solid #e5e7eb',
                            borderRadius: '10px',
                            color: '#6b7280',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => {
                            e.target.style.borderColor = '#ef4444';
                            e.target.style.color = '#ef4444';
                        }}
                        onMouseLeave={e => {
                            e.target.style.borderColor = '#e5e7eb';
                            e.target.style.color = '#6b7280';
                        }}
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>

                {/* Students Cards */}
                {students.length > 0 && (
                    <div style={{ marginBottom: 'clamp(2rem, 5vw, 3rem)' }}>
                        <h2 style={{
                            fontSize: 'clamp(1.2rem, 3vw, 1.4rem)',
                            marginBottom: '1.5rem',
                            color: '#1f2937'
                        }}>
                            Your Children
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
                            gap: '1.5rem'
                        }}>
                            {students.map(student => (
                                <div
                                    key={student.id}
                                    style={{
                                        background: 'white',
                                        padding: 'clamp(1.25rem, 4vw, 1.75rem)',
                                        borderRadius: '16px',
                                        border: '2px solid #e5e7eb',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = '#f97316';
                                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(249, 115, 22, 0.1)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = '#e5e7eb';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                        <div style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #fff7ed, #ffedd5)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <User size={24} color="#f97316" />
                                        </div>
                                        <div>
                                            <h3 style={{
                                                margin: 0,
                                                fontSize: 'clamp(1.05rem, 3vw, 1.15rem)',
                                                color: '#1f2937',
                                                fontWeight: 700
                                            }}>
                                                {student.student_name}
                                            </h3>
                                            <p style={{ margin: '2px 0 0', color: '#6b7280', fontSize: '0.9rem' }}>
                                                {student.student_reg_number}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '0.75rem',
                                        fontSize: '0.9rem'
                                    }}>
                                        <div>
                                            <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.8rem', marginBottom: '2px' }}>Class</span>
                                            <strong style={{ color: '#1f2937' }}>{student.class_grade}</strong>
                                        </div>
                                        <div>
                                            <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.8rem', marginBottom: '2px' }}>House</span>
                                            <strong style={{ color: '#1f2937' }}>{student.house}</strong>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleViewReport(student)}
                                        style={{
                                            marginTop: '1.5rem',
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '10px',
                                            border: 'none',
                                            background: '#f8fafc',
                                            color: '#6366f1',
                                            fontWeight: 600,
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={e => {
                                            e.target.style.background = '#6366f1';
                                            e.target.style.color = 'white';
                                        }}
                                        onMouseLeave={e => {
                                            e.target.style.background = '#f8fafc';
                                            e.target.style.color = '#6366f1';
                                        }}
                                    >
                                        <FileText size={18} />
                                        View Report Card
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Links */}
                <div>
                    <h2 style={{
                        fontSize: 'clamp(1.2rem, 3vw, 1.4rem)',
                        marginBottom: '1.5rem',
                        color: '#1f2937'
                    }}>
                        Quick Actions
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
                        gap: '1.5rem'
                    }}>
                        {quickLinks.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={index}
                                    to={item.link}
                                    style={{
                                        background: 'white',
                                        padding: 'clamp(1.25rem, 4vw, 1.75rem)',
                                        borderRadius: '16px',
                                        border: '2px solid #e5e7eb',
                                        textDecoration: 'none',
                                        transition: 'all 0.3s',
                                        position: 'relative',
                                        display: 'block'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.borderColor = item.color;
                                        e.currentTarget.style.boxShadow = `0 10px 30px ${item.color}20`;
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.borderColor = '#e5e7eb';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    {item.badge && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '12px',
                                            right: '12px',
                                            background: '#ef4444',
                                            color: 'white',
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.75rem',
                                            fontWeight: 700
                                        }}>
                                            {item.badge}
                                        </div>
                                    )}

                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        background: `${item.color}15`,
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '1rem'
                                    }}>
                                        <Icon size={24} color={item.color} />
                                    </div>

                                    <h3 style={{
                                        margin: '0 0 0.5rem',
                                        fontSize: 'clamp(1.05rem, 3vw, 1.15rem)',
                                        color: '#1f2937',
                                        fontWeight: 700
                                    }}>
                                        {item.title}
                                    </h3>
                                    <p style={{
                                        margin: 0,
                                        color: '#6b7280',
                                        fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)',
                                        lineHeight: 1.5
                                    }}>
                                        {item.description}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Report Card Modal */}
                {selectedStudent && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.7)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 1000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '1.5rem'
                        }}
                        onClick={() => setSelectedStudent(null)}
                    >
                        <div
                            style={{
                                background: 'white',
                                width: '100%',
                                maxWidth: '900px',
                                maxHeight: '90vh',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative'
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{
                                padding: '1rem 1.5rem',
                                borderBottom: '1px solid #e5e7eb',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: '#f8fafc'
                            }}>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1f2937' }}>Report Card Preview</h3>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button
                                        onClick={() => window.print()}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: '#f97316',
                                            color: 'white',
                                            fontWeight: 600,
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <Download size={16} /> Print
                                    </button>
                                    <button
                                        onClick={() => setSelectedStudent(null)}
                                        style={{
                                            padding: '0.5rem',
                                            borderRadius: '8px',
                                            border: '1px solid #e5e7eb',
                                            background: 'white',
                                            cursor: 'pointer',
                                            color: '#6b7280'
                                        }}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
                                {loadingReport ? (
                                    <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                                        Loading report card...
                                    </div>
                                ) : (
                                    <ReportCard
                                        student={selectedStudent}
                                        grades={reportGrades}
                                        metadata={reportMeta}
                                        competencies={reportComps}
                                        term="Term 1"
                                        year={new Date().getFullYear()}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .report-card-container, .report-card-container * {
                        visibility: visible;
                    }
                    .report-card-container {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default ParentPortal;
