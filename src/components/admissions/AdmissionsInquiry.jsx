import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { Send, CheckCircle } from 'lucide-react';

const AdmissionsInquiry = () => {
    const { t } = useTranslation(['admissions', 'common']);
    const [formData, setFormData] = useState({
        parent_name: '',
        email: '',
        phone: '',
        student_level: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.from('admissions_inquiries').insert([formData]);
            if (error) throw error;
            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting inquiry:', error);
            alert(t('common:common.error_generic') || 'There was an error submitting your inquiry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="dept-item reveal-on-scroll" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <div style={{ display: 'inline-flex', padding: '1rem', background: '#eff6ff', borderRadius: '50%', marginBottom: '1.5rem' }}>
                    <CheckCircle size={48} color="var(--academics-primary)" />
                </div>
                <h3>{t('admissions:inquiry.received_title')}</h3>
                <p style={{ color: '#64748b', maxWidth: '400px', margin: '1rem auto' }}>
                    {t('admissions:inquiry.received_desc')}
                </p>
                <button className="btn btn-outline" onClick={() => setSubmitted(false)}>{t('admissions:inquiry.another_inquiry')}</button>
            </div>
        );
    }

    return (
        <section className="academics-section reveal-on-scroll" id="inquiry-form">
            <div className="academics-section-title">
                <h2>{t('admissions:inquiry.title')}</h2>
                <p>{t('admissions:inquiry.subtitle')}</p>
            </div>

            <div style={{
                maxWidth: '700px',
                margin: '2rem auto',
                padding: '3rem',
                background: 'white',
                borderRadius: '1.5rem',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
            }}>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b', fontSize: '0.95rem' }}>{t('admissions:form.parent_info')}</label>
                            <input
                                type="text"
                                required
                                value={formData.parent_name}
                                onChange={e => setFormData({ ...formData, parent_name: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.85rem 1rem',
                                    borderRadius: '12px',
                                    border: '1.5px solid #e2e8f0',
                                    outline: 'none',
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s ease'
                                }}
                                onFocus={e => e.target.style.borderColor = '#f97316'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                                placeholder={t('admissions:inquiry.p_name_placeholder')}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b', fontSize: '0.95rem' }}>{t('admissions:form.email_address')}</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.85rem 1rem',
                                    borderRadius: '12px',
                                    border: '1.5px solid #e2e8f0',
                                    outline: 'none',
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s ease'
                                }}
                                onFocus={e => e.target.style.borderColor = '#f97316'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                                placeholder={t('admissions:inquiry.email_placeholder')}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b', fontSize: '0.95rem' }}>{t('admissions:form.phone_number')}</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.85rem 1rem',
                                    borderRadius: '12px',
                                    border: '1.5px solid #e2e8f0',
                                    outline: 'none',
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s ease'
                                }}
                                onFocus={e => e.target.style.borderColor = '#f97316'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                                placeholder="+256 ..."
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b', fontSize: '0.95rem' }}>{t('admissions:inquiry.intended_level')}</label>
                            <select
                                required
                                value={formData.student_level}
                                onChange={e => setFormData({ ...formData, student_level: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.85rem 1rem',
                                    borderRadius: '12px',
                                    border: '1.5px solid #e2e8f0',
                                    outline: 'none',
                                    background: 'white',
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s ease'
                                }}
                                onFocus={e => e.target.style.borderColor = '#f97316'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            >
                                <option value="">{t('admissions:inquiry.select_level')}</option>
                                <option value="S.1">{t('admissions:form.senior_1')}</option>
                                <option value="S.2">{t('admissions:form.senior_2')}</option>
                                <option value="S.3">{t('admissions:form.senior_3')}</option>
                                <option value="S.4">Senior 4</option>
                                <option value="S.5">{t('admissions:form.senior_5')}</option>
                                <option value="S.6">Senior 6</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b', fontSize: '0.95rem' }}>{t('admissions:inquiry.message_label')}</label>
                        <textarea
                            value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.85rem 1rem',
                                borderRadius: '12px',
                                border: '1.5px solid #e2e8f0',
                                outline: 'none',
                                minHeight: '120px',
                                fontSize: '0.95rem',
                                transition: 'all 0.2s ease',
                                fontFamily: 'inherit'
                            }}
                            onFocus={e => e.target.style.borderColor = '#f97316'}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            placeholder={t('admissions:inquiry.message_placeholder')}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            background: '#f97316',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => !loading && (e.target.style.background = '#ea580c')}
                        onMouseLeave={e => e.target.style.background = '#f97316'}
                    >
                        {loading ? t('admissions:form.submitting') : <><Send size={18} /> {t('admissions:inquiry.send_inquiry')}</>}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default AdmissionsInquiry;
