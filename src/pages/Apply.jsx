import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, AlertCircle, ChevronRight, User, Phone, Book } from 'lucide-react';
import SEO from '../components/SEO';
import '../pages/StudentPortal.css'; // Reusing some portal styles or new ones

const Apply = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        student_name: '',
        date_of_birth: '',
        gender: 'Male',
        previous_school: '',
        parent_name: '',
        parent_email: '',
        parent_phone: '',
        Applying_for_class: 'Senior 1'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.from('admission_applications').insert([formData]);
            if (error) throw error;
            setSuccess(true);
        } catch (error) {
            console.error('Application Error:', error);
            alert('Failed to submit application: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="student-portal-page" style={{ justifyContent: 'center' }}>
                <SEO title="Application Submitted" />
                <div style={{ textAlign: 'center', background: 'white', padding: '3rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', maxWidth: '500px' }}>
                    <div style={{ color: '#22c55e', marginBottom: '1rem' }}>
                        <CheckCircle size={80} />
                    </div>
                    <h2 style={{ color: '#166534' }}>Application Received!</h2>
                    <p style={{ color: '#64748b', margin: '1rem 0' }}>
                        Thank you for applying to Bugisu High School. <br />
                        We have received your details. Our admissions team will review your application and contact you shortly via <strong>{formData.parent_phone}</strong>.
                    </p>
                    <a href="/" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>Return Home</a>
                </div>
            </div>
        );
    }

    return (
        <div className="student-portal-page">
            <SEO title="Apply for Admission | Bugisu High School" description="Online Admission Form" />

            <div className="portal-hero">
                <h1>Online Admission</h1>
                <p>Join the Bugisu High School community today.</p>
            </div>

            <div className="portal-container" style={{ maxWidth: '800px' }}>
                <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', width: '100%', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>

                    <div style={{ display: 'flex', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                        <div style={{ flex: 1, textAlign: 'center', opacity: step >= 1 ? 1 : 0.5, color: step >= 1 ? '#2563eb' : '#94a3b8', fontWeight: 'bold' }}>1. Student Details</div>
                        <div style={{ flex: 1, textAlign: 'center', opacity: step >= 2 ? 1 : 0.5, color: step >= 2 ? '#2563eb' : '#94a3b8', fontWeight: 'bold' }}>2. Parent Info</div>
                        <div style={{ flex: 1, textAlign: 'center', opacity: step === 3 ? 1 : 0.5, color: step === 3 ? '#2563eb' : '#94a3b8', fontWeight: 'bold' }}>3. Review</div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className="form-grid" style={{ display: 'grid', gap: '1.5rem' }}>
                                <h3><User size={20} style={{ verticalAlign: 'middle' }} /> Student Information</h3>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
                                    <input required type="text" name="student_name" value={formData.student_name} onChange={handleChange} className="portal-input" style={{ background: '#f8fafc', border: '1px solid #cbd5e1', width: '100%', borderRadius: '8px' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Date of Birth</label>
                                        <input required type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="portal-input" style={{ background: '#f8fafc', border: '1px solid #cbd5e1', width: '100%', borderRadius: '8px' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Gender</label>
                                        <select name="gender" value={formData.gender} onChange={handleChange} className="portal-input" style={{ background: '#f8fafc', border: '1px solid #cbd5e1', width: '100%', borderRadius: '8px' }}>
                                            <option>Male</option>
                                            <option>Female</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Previous School</label>
                                    <input required type="text" name="previous_school" value={formData.previous_school} onChange={handleChange} className="portal-input" style={{ background: '#f8fafc', border: '1px solid #cbd5e1', width: '100%', borderRadius: '8px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Applying For Class</label>
                                    <select name="Applying_for_class" value={formData.Applying_for_class} onChange={handleChange} className="portal-input" style={{ background: '#f8fafc', border: '1px solid #cbd5e1', width: '100%', borderRadius: '8px' }}>
                                        <option>Senior 1</option>
                                        <option>Senior 2</option>
                                        <option>Senior 3</option>
                                        <option>Senior 4</option>
                                        <option>Senior 5</option>
                                        <option>Senior 6</option>
                                    </select>
                                </div>
                                <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                                    <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>Next Step <ChevronRight size={16} /></button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="form-grid" style={{ display: 'grid', gap: '1.5rem' }}>
                                <h3><Phone size={20} style={{ verticalAlign: 'middle' }} /> Parent/Guardian Contact</h3>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Parent/Guardian Name</label>
                                    <input required type="text" name="parent_name" value={formData.parent_name} onChange={handleChange} className="portal-input" style={{ background: '#f8fafc', border: '1px solid #cbd5e1', width: '100%', borderRadius: '8px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Phone Number</label>
                                    <input required type="tel" name="parent_phone" value={formData.parent_phone} onChange={handleChange} className="portal-input" style={{ background: '#f8fafc', border: '1px solid #cbd5e1', width: '100%', borderRadius: '8px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email Address (Optional)</label>
                                    <input type="email" name="parent_email" value={formData.parent_email} onChange={handleChange} className="portal-input" style={{ background: '#f8fafc', border: '1px solid #cbd5e1', width: '100%', borderRadius: '8px' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                                    <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                                    <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>Review <ChevronRight size={16} /></button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="form-grid" style={{ display: 'grid', gap: '1.5rem' }}>
                                <h3><Book size={20} style={{ verticalAlign: 'middle' }} /> Review & Submit</h3>
                                <div style={{ background: '#f1f5f9', padding: '1.5rem', borderRadius: '8px' }}>
                                    <p><strong>Student:</strong> {formData.student_name}</p>
                                    <p><strong>Class:</strong> {formData.Applying_for_class}</p>
                                    <p><strong>Parent:</strong> {formData.parent_name} ({formData.parent_phone})</p>
                                </div>
                                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                                    By submitting this form, I confirm that the information provided is accurate. I understand that admission is subject to the school's review process.
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                                    <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>Back</button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Submitting...' : 'Submit Application'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Apply;
