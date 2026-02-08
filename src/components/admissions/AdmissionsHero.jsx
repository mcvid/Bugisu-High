import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import UniversalHero from '../ui/UniversalHero';

const AdmissionsHero = () => {
    const { t } = useTranslation(['admissions']);
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase.from('admissions_settings').select('*').maybeSingle();
            if (data) setSettings(data);
        };
        fetchSettings();
    }, []);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'open': return '#22c55e';
            case 'closed': return '#ef4444';
            case 'upcoming': return '#f97316';
            default: return '#64748b';
        }
    };

    return (
        <UniversalHero pagePath="/admissions" height="65vh">
            <div className="academics-hero-content">
                <div className="admissions-status-pill" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1.25rem',
                    borderRadius: '100px',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    marginBottom: '2rem',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: 'white'
                }}>
                    <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: getStatusColor(settings?.status)
                    }}></span>
                    {t('admissions:status_label')} {settings?.status || 'OPEN'} — {settings?.academic_year || '2026'} {t('admissions:status_intake')}
                </div>

                <h1>{t('admissions:hero_title')}</h1>
                <p className="lead">
                    {t('admissions:hero_desc')}
                </p>
            </div>
        </UniversalHero>
    );
};

export default AdmissionsHero;
