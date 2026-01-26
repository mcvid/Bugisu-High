import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Send, Calendar, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const SubmitLeaveRequest = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        student_id: '',
        parent_name: '',
        parent_contact: '0700000000',
        leave_type: 'sick',
        start_date: '',
        end_date: '',
        reason: ''
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        const { data } = await supabase
            .from('students')
            .select('*')
            .eq('parent_phone', '0700000000');

        setStudents(data || []);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('leave_requests')
                .insert([formData]);

            if (error) throw error;

            setSuccess(true);
            setFormData({
                student_id: '',
                parent_name: '',
                parent_contact: '0700000000',
                leave_type: 'sick',
                start_date: '',
                end_date: '',
                reason: ''
            });

            setTimeout(() => setSuccess(false), 5000);
        } catch (error) {
            alert('Error submitting request: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        container: {
            maxWidth: '600px',
            margin: '0 auto',
            padding: 'clamp(1rem, 4vw, 1.25rem)'
        },
        form: {
            background: 'white',
            padding: 'clamp(1rem, 4vw, 2rem)',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        },
        formGroup: {
            marginBottom: '1.5rem'
        },
        label: {
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 600,
            color: '#374151',
            fontSize: 'clamp(0.9rem, 2.5vw, 0.95rem)'
        },
        input: {
            width: '100%',
            padding: 'clamp(0.65rem, 2vw, 0.75rem)',
            fontSize: 'clamp(0.9rem, 3vw, 1rem)',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            transition: 'all 0.2s',
            fontFamily: 'inherit',
            backgroundColor: 'white'
        },
        gridTwo: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
            gap: '1rem'
        }
    };

    const inputFocusStyle = {
        borderColor: '#f97316',
        outline: 'none',
        boxShadow: '0 0 0 3px rgba(249, 115, 22, 0.1)'
    };

    return (
        <div style={styles.container}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '0.5rem' }}>
                    <FileText size={32} color="var(--color-orange)" />
                    Request Leave of Absence
                </h1>
                <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>
                    Submit a leave request for your child. The school will review and respond within 24 hours.
                </p>
            </div>

            {success && (
                <div style={{
                    background: '#dcfce7',
                    border: '1px solid #22c55e',
                    borderRadius: '8px',
                    padding: 'clamp(0.75rem, 3vw, 1rem)',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <CheckCircle size={24} color="#22c55e" />
                    <div>
                        <strong style={{ color: '#166534' }}>Request Submitted!</strong>
                        <p style={{ margin: '4px 0 0', color: '#166534', fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)' }}>
                            You'll be notified once the school reviews your request.
                        </p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Student *</label>
                    <select
                        required
                        value={formData.student_id}
                        onChange={e => setFormData({ ...formData, student_id: e.target.value })}
                        style={{ ...styles.input, cursor: 'pointer' }}
                        onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                        onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                    >
                        <option value="">Select Student</option>
                        {students.map(s => (
                            <option key={s.id} value={s.id}>
                                {s.student_name} ({s.class_grade})
                            </option>
                        ))}
                    </select>
                </div>

                <div style={styles.gridTwo}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Your Name *</label>
                        <input
                            type="text"
                            required
                            value={formData.parent_name}
                            onChange={e => setFormData({ ...formData, parent_name: e.target.value })}
                            placeholder="Parent/Guardian Name"
                            style={styles.input}
                            onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                            onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Your Contact *</label>
                        <input
                            type="text"
                            required
                            value={formData.parent_contact}
                            onChange={e => setFormData({ ...formData, parent_contact: e.target.value })}
                            placeholder="Phone or Email"
                            style={styles.input}
                            onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                            onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Leave Type *</label>
                    <select
                        value={formData.leave_type}
                        onChange={e => setFormData({ ...formData, leave_type: e.target.value })}
                        style={{ ...styles.input, cursor: 'pointer' }}
                        onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                        onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                    >
                        <option value="sick">Sick Leave</option>
                        <option value="family_emergency">Family Emergency</option>
                        <option value="appointment">Medical Appointment</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div style={styles.gridTwo}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Start Date *</label>
                        <input
                            type="date"
                            required
                            value={formData.start_date}
                            onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                            style={styles.input}
                            onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                            onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>End Date *</label>
                        <input
                            type="date"
                            required
                            value={formData.end_date}
                            onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                            min={formData.start_date}
                            style={styles.input}
                            onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                            onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Reason for Leave *</label>
                    <textarea
                        required
                        rows={4}
                        value={formData.reason}
                        onChange={e => setFormData({ ...formData, reason: e.target.value })}
                        placeholder="Please provide details about the reason for absence..."
                        style={{ ...styles.input, resize: 'vertical', minHeight: '100px' }}
                        onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                        onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                    />
                </div>

                <div style={{
                    background: '#fef3c7',
                    border: '1px solid #fbbf24',
                    borderRadius: '8px',
                    padding: 'clamp(0.75rem, 3vw, 1rem)',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    gap: '0.75rem',
                    fontSize: 'clamp(0.8rem, 2.5vw, 0.85rem)'
                }}>
                    <AlertCircle size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ color: '#92400e' }}>
                        <strong>Important:</strong> For sick leave exceeding 3 days, please attach a medical certificate.
                        For emergencies, the school may contact you for verification.
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: 'clamp(0.85rem, 3vw, 1rem)',
                        fontSize: 'clamp(0.95rem, 3vw, 1rem)',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: loading ? '#cbd5e1' : 'linear-gradient(135deg, #f97316, #ea580c)',
                        color: 'white',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s',
                        boxShadow: loading ? 'none' : '0 4px 12px rgba(249, 115, 22, 0.3)'
                    }}
                >
                    {loading ? 'Submitting...' : (
                        <>
                            <Send size={18} />
                            Submit Leave Request
                        </>
                    )}
                </button>
            </form>

            <div style={{ marginTop: 'clamp(1.5rem, 4vw, 2rem)' }}>
                <h3 style={{ fontSize: 'clamp(1.1rem, 4vw, 1.2rem)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={20} />
                    Previous Requests
                </h3>
                <PreviousRequests parentContact={formData.parent_contact} />
            </div>
        </div>
    );
};

const PreviousRequests = ({ parentContact }) => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchRequests();
    }, [parentContact]);

    const fetchRequests = async () => {
        const { data } = await supabase
            .from('leave_requests')
            .select(`
                *,
                students (student_name, class_grade)
            `)
            .eq('parent_contact', parentContact)
            .order('created_at', { ascending: false })
            .limit(5);

        setRequests(data || []);
    };

    const getStatusBadge = (status) => {
        const config = {
            pending: { color: '#f59e0b', bg: '#fef3c7', label: 'Pending' },
            approved: { color: '#22c55e', bg: '#dcfce7', label: 'Approved' },
            rejected: { color: '#ef4444', bg: '#fee2e2', label: 'Rejected' }
        };
        const { color, bg, label } = config[status] || config.pending;

        return (
            <span style={{
                padding: '4px 12px',
                borderRadius: '100px',
                background: bg,
                color: color,
                fontSize: 'clamp(0.7rem, 2.5vw, 0.75rem)',
                fontWeight: 600,
                whiteSpace: 'nowrap'
            }}>
                {label}
            </span>
        );
    };

    if (requests.length === 0) {
        return <p style={{ color: '#94a3b8', textAlign: 'center', padding: 'clamp(1.5rem, 4vw, 2rem)', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>No previous requests.</p>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {requests.map(req => (
                <div key={req.id} style={{
                    background: 'white',
                    padding: 'clamp(0.75rem, 3vw, 1rem)',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '0.5rem',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                    }}>
                        <div style={{ flex: '1', minWidth: '150px' }}>
                            <strong style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>{req.students?.student_name}</strong>
                            <p style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.85rem)', color: '#64748b', margin: '4px 0' }}>
                                {new Date(req.start_date).toLocaleDateString()} - {new Date(req.end_date).toLocaleDateString()}
                            </p>
                        </div>
                        {getStatusBadge(req.status)}
                    </div>
                    <p style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.85rem)', color: '#64748b', margin: 0 }}>{req.reason}</p>
                </div>
            ))}
        </div>
    );
};

export default SubmitLeaveRequest;
