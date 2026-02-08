import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Send, Calendar, FileText, LogOut, User, MessageSquare, BookOpen, TrendingUp, CreditCard } from 'lucide-react';
import { parentAuth } from '../../utils/parentAuth.jsx';
import { supabase } from '../../lib/supabase';
import ReportCard from '../../components/ReportCard';
import { X, Download } from 'lucide-react';
import PortalFAB from '../../components/ui/PortalFAB';

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
            icon: CreditCard,
            title: 'Fee Payment',
            description: 'Check balance and pay fees online',
            link: '/parent/fees',
            color: '#f97316'
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
        <div style={{
            minHeight: '100vh',
            backgroundImage: 'url("/images/parent-portal-bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            paddingBottom: '4rem'
        }}>
            <div style={{
                minHeight: '100vh',
                background: 'rgba(241, 245, 249, 0.85)',
                backdropFilter: 'blur(12px)',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 4vw, 2rem)',
                boxShadow: '0 0 40px rgba(0,0,0,0.05)'
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
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '0.25rem'
                        }}>
                            Parent Portal
                        </h1>
                        <p style={{
                            color: '#64748b',
                            fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
                            fontWeight: 500
                        }}>
                            Welcome back! Manage your child's school journey.
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            color: '#64748b',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                        onMouseEnter={e => {
                            e.target.style.borderColor = '#dc2626';
                            e.target.style.color = '#dc2626';
                        }}
                        onMouseLeave={e => {
                            e.target.style.borderColor = '#e2e8f0';
                            e.target.style.color = '#64748b';
                        }}
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>

                {/* Students Cards */}
                {students.length > 0 && (
                    <div style={{ marginBottom: 'clamp(3rem, 6vw, 4rem)' }}>
                        <h2 style={{
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontSize: '1.8rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            marginBottom: '1.5rem',
                            color: '#1e293b'
                        }}>
                            Your Children
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))',
                            gap: '2rem'
                        }}>
                            {students.map(student => (
                                <div
                                    key={student.id}
                                    style={{
                                        background: 'white',
                                        padding: '2rem',
                                        borderRadius: '24px',
                                        border: '1px solid #e2e8f0',
                                        transition: 'all 0.3s',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = '#dc2626';
                                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.05)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                                        <div style={{
                                            width: '56px',
                                            height: '56px',
                                            borderRadius: '16px',
                                            background: '#f8fafc',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '1px solid #f1f5f9'
                                        }}>
                                            <User size={28} color="#dc2626" />
                                        </div>
                                        <div>
                                            <h3 style={{
                                                margin: 0,
                                                fontSize: '1.2rem',
                                                color: '#0f172a',
                                                fontWeight: 700
                                            }}>
                                                {student.student_name}
                                            </h3>
                                            <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
                                                {student.student_reg_number}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '1rem',
                                        fontSize: '0.9rem',
                                        padding: '1.25rem',
                                        background: '#f8fafc',
                                        borderRadius: '16px',
                                        marginBottom: '1.5rem'
                                    }}>
                                        <div>
                                            <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>Class</span>
                                            <strong style={{ color: '#0f172a' }}>{student.class_grade}</strong>
                                        </div>
                                        <div>
                                            <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>House</span>
                                            <strong style={{ color: '#0f172a' }}>{student.house}</strong>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleViewReport(student)}
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            borderRadius: '12px',
                                            border: 'none',
                                            background: '#0f172a',
                                            color: 'white',
                                            fontWeight: 700,
                                            fontSize: '0.9rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={e => {
                                            e.target.style.background = '#dc2626';
                                        }}
                                        onMouseLeave={e => {
                                            e.target.style.background = '#0f172a';
                                        }}
                                    >
                                        <FileText size={18} />
                                        View Report
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Links */}
                <div>
                    <h2 style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: '1.8rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        marginBottom: '1.5rem',
                        color: '#1e293b'
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
                            // Ensure color is red or matching the theme
                            const themeColor = item.color === '#f59e0b' || item.color === '#f97316' ? '#dc2626' : item.color;
                            return (
                                <Link
                                    key={index}
                                    to={item.link}
                                    style={{
                                        background: 'white',
                                        padding: '1.5rem',
                                        borderRadius: '20px',
                                        border: '1px solid #e2e8f0',
                                        textDecoration: 'none',
                                        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        position: 'relative',
                                        display: 'block'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateY(-6px)';
                                        e.currentTarget.style.borderColor = themeColor;
                                        e.currentTarget.style.boxShadow = `0 12px 24px ${themeColor}15`;
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    {item.badge && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '12px',
                                            right: '12px',
                                            background: '#dc2626',
                                            color: 'white',
                                            width: '22px',
                                            height: '22px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.7rem',
                                            fontWeight: 900
                                        }}>
                                            {item.badge}
                                        </div>
                                    )}

                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        background: '#f8fafc',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '1rem',
                                        border: '1px solid #f1f5f9'
                                    }}>
                                        <Icon size={22} color={themeColor} />
                                    </div>

                                    <h3 style={{
                                        fontFamily: "'Barlow Condensed', sans-serif",
                                        margin: '0 0 0.5rem',
                                        fontSize: '1.3rem',
                                        color: '#0f172a',
                                        fontWeight: 700,
                                        textTransform: 'uppercase'
                                    }}>
                                        {item.title}
                                    </h3>
                                    <p style={{
                                        margin: 0,
                                        color: '#64748b',
                                        fontSize: '0.9rem',
                                        lineHeight: 1.5,
                                        fontWeight: 500
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
                                padding: '1.25rem 2rem',
                                borderBottom: '1px solid #e2e8f0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: '#f8fafc'
                            }}>
                                <div>
                                    <h2 style={{
                                        fontFamily: "'Barlow Condensed', sans-serif",
                                        margin: 0,
                                        fontSize: '1.5rem',
                                        fontWeight: 800,
                                        color: '#0f172a',
                                        textTransform: 'uppercase'
                                    }}>
                                        Academic Report Card
                                    </h2>
                                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
                                        Previewing student results
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button
                                        onClick={() => window.print()}
                                        style={{
                                            padding: '0.6rem 1.25rem',
                                            borderRadius: '8px',
                                            border: '1px solid #e2e8f0',
                                            background: 'white',
                                            color: '#0f172a',
                                            fontSize: '0.85rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            transition: 'all 0.2s',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}
                                        onMouseEnter={e => { e.target.style.background = '#f1f5f9'; }}
                                        onMouseLeave={e => { e.target.style.background = 'white'; }}
                                    >
                                        <FileText size={16} />
                                        Print
                                    </button>
                                    <button
                                        onClick={() => setSelectedStudent(null)}
                                        style={{
                                            padding: '0.6rem',
                                            borderRadius: '8px',
                                            border: '1px solid #fee2e2',
                                            background: '#fef2f2',
                                            color: '#dc2626',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={e => { e.target.style.background = '#fee2e2'; }}
                                        onMouseLeave={e => { e.target.style.background = '#fef2f2'; }}
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
            <PortalFAB
                role="parent"
                onAction={(id) => {
                    if (id === 'report' && students.length > 0) handleViewReport(students[0]);
                    if (id === 'fees') navigate('/parent/fees');
                    if (id === 'idcard' && students.length > 0) navigate('/student-portal');
                }}
            />
        </div >
    );
};

export default ParentPortal;
