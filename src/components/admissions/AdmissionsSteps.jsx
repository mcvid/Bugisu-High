import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';

const AdmissionsSteps = () => {
    const { t } = useTranslation(['admissions']);
    const [steps, setSteps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSteps = async () => {
            try {
                const { data, error } = await supabase
                    .from('admissions_steps')
                    .select('*')
                    .order('sort_order', { ascending: true });

                if (data) setSteps(data);
            } catch (error) {
                console.error('Error fetching admissions steps:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSteps();
    }, []);

    const defaultSteps = [
        { title: 'Obtain Application Form', description: 'Forms are available at the school bursar’s office or can be downloaded from our resources section.' },
        { title: 'Submit Documentation', description: 'Return the completed form along with previous academic reports, birth certificate copies, and passport photos.' },
        { title: 'Entrance Assessment', description: 'Prospective students may be required to sit a brief diagnostic assessment to determine appropriate class placement.' },
        { title: 'Admission Decision', description: 'Successful applicants are notified within 5 working days and issued an admission letter with reporting details.' },
        { title: 'Registration & Reporting', description: 'Complete the registration by paying the required fees and reporting to campus on the specified date.' }
    ];

    const displaySteps = steps.length > 0 ? steps : defaultSteps;

    return (
        <section className="academics-section reveal-on-scroll">
            <div className="academics-section-title">
                <h2>{t('admissions:procedure_title')}</h2>
                <p>{t('admissions:procedure_subtitle')}</p>
            </div>

            <div className="admissions-steps-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '2.5rem',
                marginTop: '3rem'
            }}>
                {displaySteps.map((step, index) => (
                    <div key={index} className="dept-item reveal-on-scroll" style={{
                        position: 'relative',
                        padding: '3rem 2rem 2rem',
                        borderTop: index % 2 === 0 ? '4px solid var(--academics-primary)' : '4px solid #f97316'
                    }}>
                        <div className="step-number" style={{
                            position: 'absolute',
                            top: '-20px',
                            left: '20px',
                            width: '44px',
                            height: '44px',
                            background: index % 2 === 0 ? 'var(--academics-primary)' : '#f97316',
                            color: 'white',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: '1.25rem',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                        }}>
                            {index + 1}
                        </div>
                        <h4 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>{step.title}</h4>
                        <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#64748b' }}>{step.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AdmissionsSteps;
