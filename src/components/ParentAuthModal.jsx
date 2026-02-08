import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { parentAuth } from '../utils/parentAuth.jsx';

const ParentAuthModal = ({ isOpen, onClose, onSuccess }) => {
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [showForgot, setShowForgot] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (parentAuth.authenticate(password)) {
            // Save phone number for linking students in the portal
            if (phone) {
                sessionStorage.setItem('parentPhone', phone);
            }
            onSuccess();
        } else {
            setError('Incorrect community key. Please check your school newsletter or email.');
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError('');

        // In production: Check database and send email
        // For now: Show success message
        setSuccessMsg(`If ${email} is registered, you'll receive the community key shortly.`);
        setTimeout(() => {
            setShowForgot(false);
            setSuccessMsg('');
            setEmail('');
        }, 3000);
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(4px)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                animation: 'fadeIn 0.3s ease-out'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'white',
                    borderRadius: '16px',
                    maxWidth: '450px',
                    width: '100%',
                    padding: 'clamp(1.5rem, 5vw, 2.5rem)',
                    position: 'relative',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    animation: 'slideUp 0.3s ease-out'
                }}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#6b7280',
                        padding: '8px'
                    }}
                >
                    <X size={24} />
                </button>

                {!showForgot ? (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                                borderRadius: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.25rem',
                                boxShadow: '0 10px 20px rgba(220, 38, 38, 0.2)',
                                transform: 'rotate(-3deg)'
                            }}>
                                <Lock size={30} color="white" />
                            </div>
                            <h2 style={{
                                fontFamily: "'Barlow Condensed', sans-serif",
                                margin: 0,
                                fontSize: '2rem',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                color: '#0f172a'
                            }}>
                                Parent Access
                            </h2>
                            <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '0.95rem', fontWeight: 500 }}>
                                Enter your school community key
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: 700,
                                    color: '#1e293b',
                                    fontSize: '0.8rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    Registered Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    placeholder="e.g. 0700000000"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.85rem',
                                        fontSize: '1rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                        transition: 'all 0.2s',
                                        fontFamily: 'inherit',
                                        background: '#f8fafc'
                                    }}
                                    onFocus={e => {
                                        e.target.style.borderColor = '#dc2626';
                                        e.target.style.background = 'white';
                                        e.target.style.boxShadow = '0 0 0 4px rgba(220, 38, 38, 0.1)';
                                    }}
                                    onBlur={e => {
                                        e.target.style.borderColor = '#e2e8f0';
                                        e.target.style.background = '#f8fafc';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px', display: 'block', fontWeight: 500 }}>
                                    Used to verify your identity in our records
                                </span>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: 700,
                                    color: '#1e293b',
                                    fontSize: '0.8rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    Community Key
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Enter school key..."
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.85rem',
                                            paddingRight: '3rem',
                                            fontSize: '1rem',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '12px',
                                            transition: 'all 0.2s',
                                            fontFamily: 'inherit',
                                            background: '#f8fafc'
                                        }}
                                        onFocus={e => {
                                            e.target.style.borderColor = '#dc2626';
                                            e.target.style.background = 'white';
                                            e.target.style.boxShadow = '0 0 0 4px rgba(220, 38, 38, 0.1)';
                                        }}
                                        onBlur={e => {
                                            e.target.style.borderColor = '#e2e8f0';
                                            e.target.style.background = '#f8fafc';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#94a3b8',
                                            padding: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            transition: 'color 0.2s'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#dc2626'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div style={{
                                    background: '#fef2f2',
                                    border: '1px solid #fee2e2',
                                    borderRadius: '12px',
                                    padding: '0.85rem',
                                    marginBottom: '1.5rem',
                                    color: '#b91c1c',
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    display: 'flex',
                                    gap: '0.5rem',
                                    alignItems: 'center'
                                }}>
                                    <X size={16} />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                style={{
                                    width: '100%',
                                    padding: '1.1rem',
                                    background: '#0f172a',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.2)'
                                }}
                                onMouseEnter={e => {
                                    e.target.style.background = '#dc2626';
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 15px 30px rgba(220, 38, 38, 0.3)';
                                }}
                                onMouseLeave={e => {
                                    e.target.style.background = '#0f172a';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 10px 25px rgba(15, 23, 42, 0.2)';
                                }}
                            >
                                Enter Portal
                                <ArrowRight size={20} />
                            </button>
                        </form>

                        <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
                            <button
                                onClick={() => setShowForgot(true)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#64748b',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    transition: 'color 0.2s'
                                }}
                                onMouseEnter={e => e.target.style.color = '#dc2626'}
                                onMouseLeave={e => e.target.style.color = '#64748b'}
                            >
                                Forgot your community key?
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                                borderRadius: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.25rem',
                                boxShadow: '0 10px 20px rgba(15, 23, 42, 0.2)',
                                transform: 'rotate(3deg)'
                            }}>
                                <Mail size={30} color="white" />
                            </div>
                            <h2 style={{
                                fontFamily: "'Barlow Condensed', sans-serif",
                                margin: 0,
                                fontSize: '2rem',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                color: '#0f172a'
                            }}>
                                Get Reminder
                            </h2>
                            <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '0.95rem', fontWeight: 500 }}>
                                Enter your registered email address
                            </p>
                        </div>

                        <form onSubmit={handleForgotPassword}>
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: 700,
                                    color: '#1e293b',
                                    fontSize: '0.8rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="parent@example.com"
                                    required
                                    autoFocus
                                    style={{
                                        width: '100%',
                                        padding: '0.85rem',
                                        fontSize: '1rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                        transition: 'all 0.2s',
                                        fontFamily: 'inherit',
                                        background: '#f8fafc'
                                    }}
                                    onFocus={e => {
                                        e.target.style.borderColor = '#0f172a';
                                        e.target.style.background = 'white';
                                        e.target.style.boxShadow = '0 0 0 4px rgba(15, 23, 42, 0.1)';
                                    }}
                                    onBlur={e => {
                                        e.target.style.borderColor = '#e2e8f0';
                                        e.target.style.background = '#f8fafc';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            {successMsg && (
                                <div style={{
                                    background: '#f0fdf4',
                                    border: '1px solid #dcfce7',
                                    borderRadius: '12px',
                                    padding: '0.85rem',
                                    marginBottom: '1.5rem',
                                    color: '#166534',
                                    fontSize: '0.9rem',
                                    fontWeight: 500
                                }}>
                                    {successMsg}
                                </div>
                            )}

                            <button
                                type="submit"
                                style={{
                                    width: '100%',
                                    padding: '1.1rem',
                                    background: '#0f172a',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}
                                onMouseEnter={e => {
                                    e.target.style.background = '#dc2626';
                                    e.target.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={e => {
                                    e.target.style.background = '#0f172a';
                                    e.target.style.transform = 'translateY(0)';
                                }}
                            >
                                <Mail size={20} />
                                Send Key Reminder
                            </button>
                        </form>

                        <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
                            <button
                                onClick={() => setShowForgot(false)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#64748b',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                ← Back to login
                            </button>
                        </div>
                    </>
                )}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { 
                        transform: translateY(30px);
                        opacity: 0;
                    }
                    to { 
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default ParentAuthModal;
