import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight } from 'lucide-react';
import { parentAuth } from '../utils/parentAuth.jsx';

const ParentAuthModal = ({ isOpen, onClose, onSuccess }) => {
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [showForgot, setShowForgot] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

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
            setPassword('');
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
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem'
                            }}>
                                <Lock size={28} color="white" />
                            </div>
                            <h2 style={{ margin: 0, fontSize: 'clamp(1.3rem, 4vw, 1.6rem)', color: '#1f2937' }}>
                                Parent Portal Access
                            </h2>
                            <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: 'clamp(0.9rem, 2.5vw, 0.95rem)' }}>
                                Enter your school community key
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.4rem',
                                    fontWeight: 600,
                                    color: '#374151',
                                    fontSize: '0.9rem'
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
                                        padding: '0.75rem',
                                        fontSize: '0.95rem',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '8px',
                                        transition: 'all 0.2s',
                                        fontFamily: 'inherit'
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#f97316'}
                                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                                />
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                                    Used to find your children in our system
                                </span>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.4rem',
                                    fontWeight: 600,
                                    color: '#374151',
                                    fontSize: '0.9rem'
                                }}>
                                    Community Key
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Enter school key..."
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        fontSize: '0.95rem',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '8px',
                                        transition: 'all 0.2s',
                                        fontFamily: 'inherit'
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#f97316'}
                                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                                />
                            </div>

                            {error && (
                                <div style={{
                                    background: '#fee2e2',
                                    border: '1px solid #fca5a5',
                                    borderRadius: '8px',
                                    padding: '0.75rem',
                                    marginBottom: '1rem',
                                    color: '#991b1b',
                                    fontSize: '0.9rem'
                                }}>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                style={{
                                    width: '100%',
                                    padding: '0.95rem',
                                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                                onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
                                onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
                            >
                                Enter Portal
                                <ArrowRight size={20} />
                            </button>
                        </form>

                        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                            <button
                                onClick={() => setShowForgot(true)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#f97316',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    textDecoration: 'underline'
                                }}
                            >
                                Forgot your key?
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem'
                            }}>
                                <Mail size={28} color="white" />
                            </div>
                            <h2 style={{ margin: 0, fontSize: 'clamp(1.3rem, 4vw, 1.6rem)', color: '#1f2937' }}>
                                Remind Me
                            </h2>
                            <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: 'clamp(0.9rem, 2.5vw, 0.95rem)' }}>
                                Enter your registered email address
                            </p>
                        </div>

                        <form onSubmit={handleForgotPassword}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: 600,
                                    color: '#374151',
                                    fontSize: '0.95rem'
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
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '8px',
                                        transition: 'all 0.2s',
                                        fontFamily: 'inherit'
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#3b82f6'}
                                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                                />
                            </div>

                            {successMsg && (
                                <div style={{
                                    background: '#dcfce7',
                                    border: '1px solid #22c55e',
                                    borderRadius: '8px',
                                    padding: '0.75rem',
                                    marginBottom: '1rem',
                                    color: '#166534',
                                    fontSize: '0.9rem'
                                }}>
                                    {successMsg}
                                </div>
                            )}

                            <button
                                type="submit"
                                style={{
                                    width: '100%',
                                    padding: '0.95rem',
                                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <Mail size={20} />
                                Send Reminder
                            </button>
                        </form>

                        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                            <button
                                onClick={() => setShowForgot(false)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#6b7280',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer'
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
