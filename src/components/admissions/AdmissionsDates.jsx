import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { Clock, CalendarDays } from 'lucide-react';

const AdmissionsDates = () => {
    const { t } = useTranslation(['admissions', 'common']);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await supabase.from('admissions_settings').select('*').single();
                if (data) setSettings(data);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return t('admissions:dates.tba');
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) return null;

    return (
        <section className="academics-section reveal-on-scroll">
            <div className="academics-section-title">
                <h2>{t('admissions:dates.title')}</h2>
                <p>{t('admissions:dates.subtitle', { year: settings?.academic_year || 'upcoming' })}</p>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '24px', overflow: 'hidden', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ color: '#ef4444' }}><Clock size={24} /></div>
                                <div>
                                    <strong style={{ display: 'block', color: '#1e293b' }}>{t('admissions:dates.deadline_label')}</strong>
                                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{t('admissions:dates.deadline_desc')}</span>
                                </div>
                            </td>
                            <td style={{ padding: '2rem', textAlign: 'right', fontWeight: '700', color: '#1e293b', fontSize: '1.1rem' }}>
                                {formatDate(settings?.application_deadline)}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ color: 'var(--academics-primary)' }}><CalendarDays size={24} /></div>
                                <div>
                                    <strong style={{ display: 'block', color: '#1e293b' }}>{t('admissions:dates.reporting_label')}</strong>
                                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{t('admissions:dates.reporting_desc')}</span>
                                </div>
                            </td>
                            <td style={{ padding: '2rem', textAlign: 'right', fontWeight: '700', color: '#1e293b', fontSize: '1.1rem' }}>
                                {formatDate(settings?.reporting_date)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                {t('admissions:dates.note')}
            </p>
        </section>
    );
};

export default AdmissionsDates;
