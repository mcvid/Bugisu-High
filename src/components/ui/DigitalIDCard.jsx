import React, { useState } from 'react';
import { X, ShieldCheck, QrCode, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import './DigitalIDCard.css';

const DigitalIDCard = ({ isOpen, onClose }) => {
    const [verificationInput, setVerificationInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [studentsData, setStudentsData] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);

    if (!isOpen) return null;

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!verificationInput.trim()) return;

        setLoading(true);
        setError('');

        try {
            // Simplified query: check if input matches parent_email OR parent_phone
            // Note: In a real app, we'd use strict RLS and maybe an RPC function.
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .or(`parent_email.eq.${verificationInput.trim()},parent_phone.eq.${verificationInput.trim()}`);

            if (error) throw error;

            if (data && data.length > 0) {
                setStudentsData(data);
                if (data.length === 1) {
                    setSelectedStudent(data[0]);
                }
            } else {
                setError('No student record found for this contact. Please check your email or phone number.');
            }
        } catch (err) {
            console.error('Verification error:', err);
            setError('Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setVerificationInput('');
        setStudentsData([]);
        setSelectedStudent(null);
        setError('');
        onClose();
    };

    return (
        <div className="id-modal-overlay" onClick={handleClose}>
            <div className="id-card-container animate-id-pop" onClick={e => e.stopPropagation()}>
                <button className="id-close-btn" onClick={handleClose}>
                    <X size={24} />
                </button>

                {!selectedStudent ? (
                    // Verification or Selection View
                    <div className="verification-container">
                        {studentsData.length === 0 ? (
                            // Input Step
                            <>
                                <div className="id-header-text" style={{ marginBottom: '20px', color: '#000' }}>
                                    <h3>Parent Verification</h3>
                                    <p>Enter your registered Email or Phone</p>
                                </div>

                                <form onSubmit={handleVerify}>
                                    <input
                                        type="text"
                                        className="verify-input"
                                        placeholder="name@example.com or 077..."
                                        value={verificationInput}
                                        onChange={(e) => setVerificationInput(e.target.value)}
                                        autoFocus
                                    />
                                    <button type="submit" className="verify-btn" disabled={loading}>
                                        {loading ? 'Verifying...' : 'View Student ID'}
                                    </button>
                                </form>

                                {error && <div className="verify-error">{error}</div>}

                                <div style={{ marginTop: '20px', fontSize: '0.7rem', color: '#666' }}>
                                    <p>For demonstration, try: <strong>0700000000</strong></p>
                                </div>
                            </>
                        ) : (
                            // Selection Step (Siblings found)
                            <>
                                <div className="id-header-text" style={{ marginBottom: '20px', color: '#000' }}>
                                    <h3>Multiple Students Found</h3>
                                    <p>Please select the child whose ID you want to view</p>
                                </div>
                                <div className="student-selection-list">
                                    {studentsData.map(student => (
                                        <div
                                            key={student.id}
                                            className="student-select-card"
                                            onClick={() => setSelectedStudent(student)}
                                        >
                                            <div className="student-select-photo">
                                                <img src={student.photo_url || '/placeholder-student.png'} alt={student.student_name} />
                                            </div>
                                            <div className="student-select-info">
                                                <div className="student-select-name">{student.student_name}</div>
                                                <div className="student-select-details">{student.class_grade} • {student.student_reg_number}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="btn btn-outline" style={{ marginTop: '20px', width: '100%' }} onClick={() => setStudentsData([])}>
                                    Back to Search
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    // ID Card View
                    <>
                        <div className="id-card-header">
                            <img src="/logo.png?v=2" alt="BHS" className="school-logo-id" />
                            <div className="id-header-text">
                                <h3>Bugisu High School</h3>
                                <p>Student Identity Card</p>
                            </div>
                        </div>

                        <div className="id-card-body">
                            {studentsData.length > 1 && (
                                <button className="id-back-btn" onClick={() => setSelectedStudent(null)}>
                                    Change Student
                                </button>
                            )}
                            <div className="id-photo-section">
                                <div className="id-photo-frame">
                                    <img src={selectedStudent.photo_url || '/placeholder-student.png'} alt={selectedStudent.student_name} />
                                </div>
                                <div className="id-status">
                                    VERIFIED
                                </div>
                            </div>

                            <div className="id-info-section">
                                <div className="id-info-group">
                                    <label>FULL NAME</label>
                                    <div className="id-value">{selectedStudent.student_name}</div>
                                </div>
                                <div className="id-info-group">
                                    <label>REGISTRATION NO</label>
                                    <div className="id-value highlighted">{selectedStudent.student_reg_number}</div>
                                </div>

                                <div className="id-info-row">
                                    <div className="id-info-group">
                                        <label>HOUSE</label>
                                        <div className="id-value">{selectedStudent.house}</div>
                                    </div>
                                    <div className="id-info-group">
                                        <label>GRADE</label>
                                        <div className="id-value">{selectedStudent.class_grade}</div>
                                    </div>
                                </div>

                                <div className="id-info-row">
                                    <div className="id-info-group">
                                        <label>BLOOD GROUP</label>
                                        <div className="id-value">{selectedStudent.blood_group}</div>
                                    </div>
                                    <div className="id-info-group">
                                        <label>VALID UNTIL</label>
                                        <div className="id-value">{selectedStudent.valid_until}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="id-card-footer">
                            <div className="id-qr-box">
                                <QrCode size={60} color="#000" />
                                <span className="qr-label">Scan to Verify</span>
                            </div>
                            <div className="id-footer-disclaimer">
                                Property of Bugisu High School. If found, please return to the administration.
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DigitalIDCard;
