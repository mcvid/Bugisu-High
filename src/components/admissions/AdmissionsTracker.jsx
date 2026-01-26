import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { Search, Loader2, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import './AdmissionsTracker.css';

const AdmissionsTracker = () => {
    const { t } = useTranslation(['admissions']);
    const [referenceNo, setReferenceNo] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!referenceNo.trim()) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const { data, error } = await supabase
                .from('admission_applications')
                .select('*')
                .eq('reference_no', referenceNo.trim().toUpperCase())
                .maybeSingle();

            if (error) throw error;

            if (data) {
                setResult(data);
            } else {
                setError(t('admissions:tracker.error_not_found'));
            }
        } catch (err) {
            console.error('Error tracking application:', err);
            setError(t('admissions:tracker.error_generic'));
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'accepted': return <CheckCircle2 size={48} color="#22c55e" />;
            case 'rejected': return <XCircle size={48} color="#ef4444" />;
            case 'under_review': return <Clock size={48} color="#f59e0b" />;
            default: return <AlertCircle size={48} color="#6b7280" />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'accepted': return t('admissions:tracker.status_accepted');
            case 'rejected': return t('admissions:tracker.status_rejected');
            case 'under_review': return t('admissions:tracker.status_review');
            case 'pending': return t('admissions:tracker.status_pending');
            default: return t('admissions:tracker.status_unknown');
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'accepted': return t('admissions:tracker.status_accepted_label');
            case 'rejected': return t('admissions:tracker.status_rejected_label');
            case 'under_review': return t('admissions:tracker.status_review_label');
            case 'pending': return t('admissions:tracker.status_pending_label');
            default: return status.replace('_', ' ');
        }
    };

    return (
        <section className="admissions-tracker container reveal-on-scroll" style={{ margin: '4rem auto' }}>
            <div className="tracker-card card">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t('admissions:tracker.title')}</h2>
                    <p style={{ color: '#6b7280' }}>{t('admissions:tracker.desc')}</p>
                </div>

                <form onSubmit={handleTrack} className="tracker-form">
                    <div style={{ position: 'relative', flex: 1 }}>
                        <input
                            type="text"
                            placeholder={t('admissions:tracker.placeholder')}
                            value={referenceNo}
                            onChange={(e) => setReferenceNo(e.target.value)}
                            maxLength={8}
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3rem',
                                borderRadius: '0.75rem',
                                border: '2px solid #e5e7eb',
                                fontSize: '1rem',
                                textTransform: 'uppercase'
                            }}
                        />
                        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={20} />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ padding: '0 2rem' }}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : t('admissions:tracker.btn_track')}
                    </button>
                </form>

                {error && (
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '0.5rem', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                {result && (
                    <div className="tracker-result">
                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                            {getStatusIcon(result.status)}
                        </div>
                        <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#1e293b' }}>
                            {result.student_name}
                        </h4>
                        <div style={{
                            display: 'inline-block',
                            padding: '0.25rem 1rem',
                            borderRadius: '9999px',
                            background: result.status === 'accepted' ? '#dcfce7' : result.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                            color: result.status === 'accepted' ? '#166534' : result.status === 'rejected' ? '#991b1b' : '#92400e',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            marginBottom: '1rem'
                        }}>
                            {getStatusLabel(result.status)}
                        </div>
                        <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.6' }}>
                            {getStatusText(result.status)}
                        </p>

                        {result.status === 'accepted' && (
                            <div style={{ marginTop: '1.5rem', padding: '1rem', borderTop: '1px solid #e2e8f0' }}>
                                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>{t('admissions:tracker.accepted_note')}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default AdmissionsTracker;
