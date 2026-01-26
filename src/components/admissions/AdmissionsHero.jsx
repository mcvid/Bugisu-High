import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { Calendar, Bell } from 'lucide-react';

const AdmissionsHero = () => {
    const { t } = useTranslation(['admissions']);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data, error } = await supabase
                    .from('admissions_settings')
                    .select('*')
                    .single();

                if (data) setSettings(data);
            } catch (error) {
                console.error('Error fetching admissions settings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'open': return '#22c55e'; // Green
            case 'closed': return '#ef4444'; // Red
            case 'upcoming': return '#f97316'; // Orange
            default: return '#64748b';
        }
    };

    return (
        <header className="academics-hero admissions-hero">
            <div className="container">
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
                        {t('admissions:status_label')} {settings?.status || t('admissions:status_loading')} — {settings?.academic_year || '2026'} {t('admissions:status_intake')}
                    </div>

                    <h1>{t('admissions:hero_title')}</h1>
                    <p className="lead">
                        {t('admissions:hero_desc')}
                    </p>
                </div>
            </div>
        </header>
    );
};

export default AdmissionsHero;
