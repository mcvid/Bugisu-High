import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CheckCircle, XCircle, Search, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

const VerifyStudent = () => {
    const { regNo } = useParams();
    // Decode the regNo in case it has slashes that were encoded
    const decodedRegNo = decodeURIComponent(regNo || '');

    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const verifyStudent = async () => {
            if (!decodedRegNo) {
                setError('No Registration Number provided.');
                setLoading(false);
                return;
            }

            try {
                // We search flexibly. The route param might truncate slashes if not careful, 
                // but usually React Router handles it if encoded properly.
                // We'll try exact match first.
                const { data, error } = await supabase
                    .from('students')
                    .select('*')
                    .eq('student_reg_number', decodedRegNo)
                    .single();

                if (error) throw error;

                setStudent(data);

                // Check validity date
                const validUntil = new Date(data.valid_until || '2099-12-31');
                const now = new Date();

                if (validUntil >= now) {
                    setIsValid(true);
                } else {
                    setIsValid(false);
                    setError('Student ID has expired.');
                }

            } catch (err) {
                console.error('Verification error:', err);
                setError('Student NOT FOUND in database.');
                setIsValid(false);
            } finally {
                setLoading(false);
            }
        };

        verifyStudent();
    }, [decodedRegNo]);

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <SEO title="Verify Student ID" description="Official Student Verification System" />

            <div style={{
                background: 'white',
                padding: '3rem 2rem',
                borderRadius: '16px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                maxWidth: '400px',
                width: '100%',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem'
            }}>
                {loading ? (
                    <div className="spinner" style={{
                        width: '50px',
                        height: '50px',
                        border: '5px solid #e2e8f0',
                        borderTopColor: '#3b82f6',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                ) : isValid ? (
                    <>
                        <div style={{ color: '#22c55e' }}>
                            <CheckCircle size={80} fill="#dcfce7" />
                        </div>
                        <h2 style={{ color: '#15803d', margin: 0 }}>ACTIVE STUDENT</h2>

                        <div style={{ width: '100%', marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                            <img
                                src={student.photo_url || 'https://via.placeholder.com/150'}
                                alt="Student"
                                style={{ width: '120px', height: '140px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #e2e8f0', marginBottom: '1rem' }}
                            />
                            <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>{student.student_name}</h3>
                            <p style={{ margin: 0, color: '#64748b', fontWeight: '600' }}>{student.student_reg_number}</p>
                            <p style={{ margin: '0.5rem 0 0 0', color: '#64748b' }}>{student.class_grade} | {student.house}</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{ color: '#ef4444' }}>
                            <XCircle size={80} fill="#fee2e2" />
                        </div>
                        <h2 style={{ color: '#b91c1c', margin: 0 }}>INVALID ID</h2>
                        <p style={{ color: '#ef4444', fontWeight: '500' }}>{error}</p>
                        {decodedRegNo && (
                            <p style={{ fontSize: '0.9rem', color: '#94a3b8', background: '#f1f5f9', padding: '0.5rem', borderRadius: '4px' }}>
                                Scanned: {decodedRegNo}
                            </p>
                        )}
                    </>
                )}

                <Link to="/" style={{
                    marginTop: '2rem',
                    color: '#64748b',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem'
                }}>
                    <ArrowLeft size={16} /> Back to Home
                </Link>
            </div>

            <p style={{ marginTop: '2rem', color: '#94a3b8', fontSize: '0.8rem' }}>
                Bugisu High School Digital Verification System
            </p>
        </div>
    );
};

export default VerifyStudent;
