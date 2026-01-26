import React from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';

const AdmissionsContact = () => {
    const { t } = useTranslation(['admissions']);
    return (
        <section className="academics-section reveal-on-scroll">
            <div className="academics-section-title">
                <h2>{t('admissions:support.title')}</h2>
                <p>{t('admissions:support.subtitle')}</p>
            </div>

            <div className="policy-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                <div className="dept-item" style={{ textAlign: 'center', alignItems: 'center' }}>
                    <div className="policy-icon" style={{ margin: '0 auto 1.5rem', background: '#eff6ff' }}><Phone size={24} color="var(--academics-primary)" /></div>
                    <h4 style={{ fontSize: '1.2rem' }}>{t('admissions:support.phone_inquiry')}</h4>
                    <p style={{ fontWeight: '700', color: '#1e293b', marginTop: '0.5rem' }}>+256 (0) 700 000 000</p>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>{t('admissions:support.mon_fri')}</p>
                </div>

                <div className="dept-item" style={{ textAlign: 'center', alignItems: 'center' }}>
                    <div className="policy-icon" style={{ margin: '0 auto 1.5rem', background: '#eff6ff' }}><Mail size={24} color="var(--academics-primary)" /></div>
                    <h4 style={{ fontSize: '1.2rem' }}>{t('admissions:support.email_admissions')}</h4>
                    <p style={{ fontWeight: '700', color: '#1e293b', marginTop: '0.5rem' }}>admissions@bugisuhigh.ac.ug</p>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>{t('admissions:support.tech_inquiry')}</p>
                </div>

                <div className="dept-item" style={{ textAlign: 'center', alignItems: 'center' }}>
                    <div className="policy-icon" style={{ margin: '0 auto 1.5rem', background: '#eff6ff' }}><MapPin size={24} color="var(--academics-primary)" /></div>
                    <h4 style={{ fontSize: '1.2rem' }}>{t('admissions:support.office_location')}</h4>
                    <p style={{ fontWeight: '700', color: '#1e293b', marginTop: '0.5rem' }}>{t('admissions:support.office_desc')}</p>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>{t('admissions:support.office_sub')}</p>
                </div>
            </div>
        </section>
    );
};

export default AdmissionsContact;
