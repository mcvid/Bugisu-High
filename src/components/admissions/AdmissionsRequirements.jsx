import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const AdmissionsRequirements = () => {
    const { t } = useTranslation(['admissions']);
    const [requirements, setRequirements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequirements = async () => {
            try {
                const { data, error } = await supabase
                    .from('admissions_requirements')
                    .select('*')
                    .order('created_at', { ascending: true });

                if (data) setRequirements(data);
            } catch (error) {
                console.error('Error fetching admissions requirements:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRequirements();
    }, []);

    const defaultRequirements = [
        { document_name: 'PLE / UCE Results Slip', purpose: 'Evidence of standard academic qualification for O or A Level entry.', is_mandatory: true },
        { document_name: 'Previous Academic Reports', purpose: 'The last two termly reports from the student’s previous school.', is_mandatory: true },
        { document_name: 'Birth Certificate Copy', purpose: 'Required for age verification and official records.', is_mandatory: true },
        { document_name: 'Passport Photos (3)', purpose: 'Standard studio photos for identity card and student files.', is_mandatory: true },
        { document_name: 'Transfer / Leaving Letter', purpose: 'Required for students transferring between secondary schools.', is_mandatory: false }
    ];

    const displayRequirements = requirements.length > 0 ? requirements : defaultRequirements;

    return (
        <section className="academics-section reveal-on-scroll">
            <div className="academics-section-title">
                <h2>{t('admissions:requirements_title')}</h2>
                <p>{t('admissions:requirements_subtitle')}</p>
            </div>

            <div className="policy-grid" style={{ gap: '2rem' }}>
                <div className="eligibility-content" style={{ gridColumn: '1 / -1', marginBottom: '1rem' }}>
                    <div className="level-card" style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.5)', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <CheckCircle2 size={24} color="var(--academics-primary)" />
                            {t('admissions:eligibility_title')}
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            <li style={{ display: 'flex', gap: '0.75rem', fontSize: '1rem', color: '#475569' }}>
                                <span style={{ color: 'var(--academics-primary)', fontWeight: 'bold' }}>•</span>
                                {t('admissions:eligibility_li1')}
                            </li>
                            <li style={{ display: 'flex', gap: '0.75rem', fontSize: '1rem', color: '#475569' }}>
                                <span style={{ color: 'var(--academics-primary)', fontWeight: 'bold' }}>•</span>
                                {t('admissions:eligibility_li2')}
                            </li>
                            <li style={{ display: 'flex', gap: '0.75rem', fontSize: '1rem', color: '#475569' }}>
                                <span style={{ color: 'var(--academics-primary)', fontWeight: 'bold' }}>•</span>
                                {t('admissions:eligibility_li3')}
                            </li>
                        </ul>
                    </div>
                </div>

                {displayRequirements.map((req, index) => (
                    <div key={index} className="policy-card reveal-on-scroll" style={{ padding: '2rem' }}>
                        <div className="policy-icon" style={{ background: req.is_mandatory ? '#eff6ff' : '#f8fafc' }}>
                            <FileText size={24} color={req.is_mandatory ? 'var(--academics-primary)' : '#64748b'} />
                        </div>
                        <div className="policy-content">
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {req.document_name}
                                {req.is_mandatory && <span style={{ fontSize: '0.65rem', padding: '2px 6px', background: '#fee2e2', color: '#ef4444', borderRadius: '4px', textTransform: 'uppercase' }}>{t('admissions:mandatory')}</span>}
                            </h4>
                            <p style={{ fontSize: '0.95rem', color: '#64748b' }}>{req.purpose}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AdmissionsRequirements;
