import React from 'react';
import QRCode from 'react-qr-code';
import './DigitalIDCard.css';

const DigitalIDCard = ({ student }) => {
    // Generate a secure-looking verification URL (mostly for show in this static demo)
    const verifyUrl = `${window.location.origin}/verify/${student.student_reg_number}`;

    return (
        <div className="id-card-container">
            <div className="id-card">
                <div className="id-card-bg"></div>
                <div className="id-card-content">
                    <div className="id-photo-section">
                        <img
                            src={student.photo_url || 'https://via.placeholder.com/150?text=Student'}
                            alt="Student"
                            className="student-photo"
                        />
                        <img src="/logo.png" alt="Logo" className="school-logo-sm" />
                    </div>

                    <div className="id-details-section">
                        <div>
                            <div className="school-name">Bugisu High School</div>
                            <div className="card-title">Student Identity Card</div>

                            <div className="student-info">
                                <h3>{student.student_name}</h3>
                                <p>{student.student_reg_number}</p>
                            </div>

                            <div className="detail-row">
                                <div className="detail-item">
                                    <span className="detail-label">Class</span>
                                    <span className="detail-value">{student.class_grade}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">House</span>
                                    <span className="detail-value">{student.house}</span>
                                </div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-item">
                                    <span className="detail-label">Valid Until</span>
                                    <span className="detail-value" style={{ color: '#ef4444' }}>
                                        {student.valid_until || 'Dec 2026'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="id-qr-section">
                        <QRCode
                            value={verifyUrl}
                            size={64}
                            level="M"
                            fgColor="#1e293b"
                        />
                    </div>
                </div>
                <div className="id-footer"></div>
            </div>
        </div>
    );
};

export default DigitalIDCard;
