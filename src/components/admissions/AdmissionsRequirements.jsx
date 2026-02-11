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
        { document_name: 'Previous Academic Reports', purpose: 'Last two termly reports from the student’s previous school.', is_mandatory: true },
        { document_name: 'Birth Certificate Copy', purpose: 'Required for age verification and official records.', is_mandatory: true },
        { document_name: 'Passport Photos (4)', purpose: 'Standard studio photos for identity card and student files.', is_mandatory: true },
        { document_name: 'School Rules Agreement', purpose: 'Carefully study and sign the school rules provided in admission.', is_mandatory: true },
        { document_name: 'Medical Examination Report', purpose: 'Completed and signed by a qualified doctor.', is_mandatory: true },
        { document_name: 'School Fees Payment Proof', purpose: 'Required at the time of reporting for enrollment.', is_mandatory: true },
        { document_name: 'Ream of paper (S1-S4: Photocopying, S5-S6: Ruled)', purpose: 'Annual academic requirement for all students.', is_mandatory: true }
    ];


    const displayRequirements = requirements.length > 0 ? requirements : defaultRequirements;

    return (
        <section className="academics-section reveal-on-scroll">
            <div className="academics-section-title">
                <h2>{t('admissions:requirements_title')}</h2>
                <p>{t('admissions:requirements_subtitle')}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {displayRequirements.map((req, index) => (
                    <div key={index} className="reveal-on-scroll" style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '1.5rem',
                        border: req.is_mandatory ? '2px solid #f97316' : '1px solid rgba(0,0,0,0.06)',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {req.is_mandatory && (
                            <div style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: '#f97316',
                                color: 'white',
                                padding: '0.4rem 0.8rem',
                                borderRadius: '8px',
                                fontSize: '0.7rem',
                                fontWeight: '700',
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase'
                            }}>
                                {t('admissions:mandatory') || 'Required'}
                            </div>
                        )}
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '14px',
                            background: req.is_mandatory ? '#fff7ed' : '#f8fafc',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1.5rem'
                        }}>
                            <FileText size={28} color={req.is_mandatory ? '#f97316' : '#64748b'} />
                        </div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.75rem' }}>
                            {req.title || req.document_name}
                        </h4>
                        <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: '1.6', margin: 0 }}>
                            {req.description || req.purpose}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AdmissionsRequirements;
