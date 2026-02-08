import React from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';
import './AdmissionsContact.css';

const AdmissionsContact = () => {
    const { t } = useTranslation(['admissions']);
    return (
        <section className="academics-section reveal-on-scroll">
            <div className="academics-section-title">
                <h2>{t('admissions:support.title')}</h2>
                <p>{t('admissions:support.subtitle')}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div style={{
                    background: 'white',
                    padding: '2.5rem',
                    borderRadius: '1.5rem',
                    border: '1px solid rgba(0,0,0,0.06)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                }} className="support-card">
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        background: '#eff6ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem'
                    }}>
                        <Phone size={28} color="#1e90ff" />
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.75rem' }}>
                        {t('admissions:support.phone_inquiry')}
                    </h4>
                    <p style={{ fontWeight: '600', color: '#1e90ff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                        +256 (0) 700 000 000
                    </p>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
                        {t('admissions:support.mon_fri')}
                    </p>
                </div>

                <div style={{
                    background: 'white',
                    padding: '2.5rem',
                    borderRadius: '1.5rem',
                    border: '1px solid rgba(0,0,0,0.06)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                }} className="support-card">
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        background: '#eff6ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem'
                    }}>
                        <Mail size={28} color="#1e90ff" />
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.75rem' }}>
                        {t('admissions:support.email_admissions')}
                    </h4>
                    <p style={{ fontWeight: '600', color: '#1e90ff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                        admissions@bugisuhigh.ac.ug
                    </p>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
                        {t('admissions:support.tech_inquiry')}
                    </p>
                </div>

                <div style={{
                    background: 'white',
                    padding: '2.5rem',
                    borderRadius: '1.5rem',
                    border: '1px solid rgba(0,0,0,0.06)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                }} className="support-card">
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        background: '#eff6ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem'
                    }}>
                        <MapPin size={28} color="#1e90ff" />
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.75rem' }}>
                        {t('admissions:support.office_location')}
                    </h4>
                    <p style={{ fontWeight: '600', color: '#1e90ff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                        {t('admissions:support.office_desc')}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
                        {t('admissions:support.office_sub')}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default AdmissionsContact;
