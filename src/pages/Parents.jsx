import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Bell, FileText, BookOpen, Heart, Shield, ArrowRight } from 'lucide-react';
import ParentAuthModal from '../components/ParentAuthModal';

const Parents = () => {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const navigate = useNavigate();

    const handleAuthSuccess = () => {
        setShowAuthModal(false);
        navigate('/parents/portal');
    };

    const features = [
        {
            icon: Bell,
            title: 'Notifications',
            description: 'Stay updated with school announcements and important alerts'
        },
        {
            icon: Calendar,
            title: 'Events Calendar',
            description: 'View upcoming events, exams, and important dates'
        },
        {
            icon: FileText,
            title: 'Leave Requests',
            description: 'Submit and track absence requests for your child'
        },
        {
            icon: BookOpen,
            title: 'Academic Progress',
            description: 'Monitor grades, attendance, and performance reports'
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
                boxShadow: '0 0 40px rgba(0,0,0,0.05)'
            }}>
                {/* Hero Section */}
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: 'clamp(3rem, 10vw, 6rem) clamp(1rem, 4vw, 2rem)',
                    textAlign: 'center'
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: '#fee2e2',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '100px',
                        marginBottom: '2rem',
                        border: '1px solid #fecaca'
                    }}>
                        <Shield size={18} color="#dc2626" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Secure Parent Community
                        </span>
                    </div>

                    <h1 style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: 'clamp(3rem, 10vw, 5.5rem)',
                        fontWeight: 900,
                        lineHeight: 0.9,
                        textTransform: 'uppercase',
                        color: '#0f172a',
                        marginBottom: '1.5rem'
                    }}>
                        Welcome <span style={{ color: '#dc2626' }}>Parents!</span>
                    </h1>

                    <p style={{
                        fontSize: 'clamp(1.1rem, 3vw, 1.25rem)',
                        color: '#475569',
                        maxWidth: '700px',
                        margin: '0 auto 2.5rem',
                        lineHeight: 1.6
                    }}>
                        Your exclusive hub for staying connected with your child's academic journey at Bugisu High School.
                    </p>

                    <button
                        onClick={() => setShowAuthModal(true)}
                        style={{
                            padding: '1.2rem 2.5rem',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            background: '#0f172a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.3)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}
                        onMouseEnter={e => {
                            e.target.style.transform = 'translateY(-3px)';
                            e.target.style.background = '#dc2626';
                            e.target.style.boxShadow = '0 15px 40px rgba(220, 38, 38, 0.4)';
                        }}
                        onMouseLeave={e => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.background = '#0f172a';
                            e.target.style.boxShadow = '0 10px 30px rgba(15, 23, 42, 0.3)';
                        }}
                    >
                        Enter Parent Portal
                        <ArrowRight size={22} />
                    </button>

                    <p style={{
                        fontSize: '0.9rem',
                        color: '#94a3b8',
                        marginTop: '2rem',
                        fontWeight: 500
                    }}>
                        Have your community key ready.
                    </p>
                </div>

                {/* Features Grid */}
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '2rem clamp(1rem, 4vw, 2rem) 6rem'
                }}>
                    <h2 style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        textAlign: 'center',
                        fontSize: 'clamp(2rem, 5vw, 3rem)',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        marginBottom: '3rem',
                        color: '#1e293b'
                    }}>
                        What's Inside
                    </h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem'
                    }}>
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    style={{
                                        background: 'white',
                                        padding: '2.5rem',
                                        borderRadius: '24px',
                                        border: '1px solid #e2e8f0',
                                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateY(-8px)';
                                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                                        e.currentTarget.style.borderColor = '#dc2626';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                    }}
                                >
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        background: '#f8fafc',
                                        borderRadius: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '1.5rem',
                                        border: '1px solid #f1f5f9'
                                    }}>
                                        <Icon size={28} color="#dc2626" />
                                    </div>
                                    <h3 style={{
                                        fontFamily: "'Barlow Condensed', sans-serif",
                                        fontSize: '1.5rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        marginBottom: '0.75rem',
                                        color: '#0f172a'
                                    }}>
                                        {feature.title}
                                    </h3>
                                    <p style={{
                                        color: '#64748b',
                                        fontSize: '1rem',
                                        lineHeight: 1.6,
                                        margin: 0
                                    }}>
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CTA Section */}
                <div style={{
                    background: '#0f172a',
                    padding: '6rem 2rem',
                    textAlign: 'center',
                    color: 'white'
                }}>
                    <div style={{
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}>
                        <Heart size={48} color="#dc2626" style={{ marginBottom: '1.5rem' }} />
                        <h2 style={{
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            lineHeight: 1,
                            marginBottom: '1.5rem'
                        }}>
                            Partnering in Your Child's Success
                        </h2>
                        <p style={{
                            color: '#94a3b8',
                            fontSize: '1.2rem',
                            margin: '0 auto 3rem',
                            lineHeight: 1.6
                        }}>
                            Together, we create a supportive community that nurtures excellence and character.
                        </p>
                        <button
                            onClick={() => setShowAuthModal(true)}
                            style={{
                                padding: '1.2rem 2.5rem',
                                background: '#dc2626',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                        >
                            Get Started
                            <ArrowRight size={22} />
                        </button>
                    </div>
                </div>
            </div>
            <ParentAuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={handleAuthSuccess}
            />
        </div>
    );
};

export default Parents;
