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
        <div style={{ minHeight: '80vh', background: 'linear-gradient(to bottom, #fff7ed, #ffffff)' }}>
            {/* Hero Section */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: 'clamp(2rem, 8vw, 4rem) clamp(1rem, 4vw, 2rem)',
                textAlign: 'center'
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#fff7ed',
                    padding: '0.5rem 1rem',
                    borderRadius: '100px',
                    marginBottom: '1.5rem',
                    border: '1px solid #ffedd5'
                }}>
                    <Shield size={18} color="#f97316" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ea580c' }}>
                        Secure Parent Community
                    </span>
                </div>

                <h1 style={{
                    fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '1rem'
                }}>
                    Welcome Parents!
                </h1>

                <p style={{
                    fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
                    color: '#6b7280',
                    maxWidth: '700px',
                    margin: '0 auto 2rem',
                    lineHeight: 1.6
                }}>
                    Your exclusive hub for staying connected with your child's academic journey at Bugisu High School.
                </p>

                <button
                    onClick={() => setShowAuthModal(true)}
                    style={{
                        padding: 'clamp(0.9rem, 3vw, 1.1rem) clamp(1.5rem, 5vw, 2.5rem)',
                        fontSize: 'clamp(1rem, 3vw, 1.1rem)',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #f97316, #ea580c)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        boxShadow: '0 10px 30px rgba(249, 115, 22, 0.3)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}
                    onMouseEnter={e => {
                        e.target.style.transform = 'translateY(-3px)';
                        e.target.style.boxShadow = '0 15px 40px rgba(249, 115, 22, 0.4)';
                    }}
                    onMouseLeave={e => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 10px 30px rgba(249, 115, 22, 0.3)';
                    }}
                >
                    Enter Parent Portal
                    <ArrowRight size={22} />
                </button>

                <p style={{
                    fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)',
                    color: '#94a3b8',
                    marginTop: '1.5rem'
                }}>
                    Have your community key ready. Check your email or contact the school office.
                </p>
            </div>

            {/* Features Grid */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: 'clamp(2rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem)'
            }}>
                <h2 style={{
                    textAlign: 'center',
                    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                    marginBottom: 'clamp(2rem, 5vw, 3rem)',
                    color: '#1f2937'
                }}>
                    What's Inside the Portal
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))',
                    gap: 'clamp(1.5rem, 4vw, 2rem)'
                }}>
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                style={{
                                    background: 'white',
                                    padding: 'clamp(1.5rem, 4vw, 2rem)',
                                    borderRadius: '16px',
                                    border: '1px solid #e5e7eb',
                                    transition: 'all 0.3s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                                    e.currentTarget.style.borderColor = '#f97316';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                }}
                            >
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    background: 'linear-gradient(135deg, #fff7ed, #ffedd5)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1rem'
                                }}>
                                    <Icon size={24} color="#f97316" />
                                </div>
                                <h3 style={{
                                    fontSize: 'clamp(1.1rem, 3vw, 1.2rem)',
                                    marginBottom: '0.5rem',
                                    color: '#1f2937'
                                }}>
                                    {feature.title}
                                </h3>
                                <p style={{
                                    color: '#6b7280',
                                    fontSize: 'clamp(0.9rem, 2.5vw, 0.95rem)',
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

            {/* Trust Badge */}
            <div style={{
                background: '#f97316',
                padding: 'clamp(2rem, 5vw, 3rem) clamp(1rem, 4vw, 2rem)',
                textAlign: 'center'
            }}>
                <Heart size={40} color="white" style={{ marginBottom: '1rem' }} />
                <h2 style={{
                    color: 'white',
                    fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
                    marginBottom: '0.5rem'
                }}>
                    Partnering in Your Child's Success
                </h2>
                <p style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: 'clamp(1rem, 3vw, 1.1rem)',
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    Together, we create a supportive community that nurtures excellence and character.
                </p>
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
