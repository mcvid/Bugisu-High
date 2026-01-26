import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { Download, FileText, ExternalLink } from 'lucide-react';

const AdmissionsDownloads = () => {
    const { t } = useTranslation(['admissions']);
    const [downloads, setDownloads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDownloads = async () => {
            try {
                const { data, error } = await supabase
                    .from('admissions_downloads')
                    .select('*')
                    .order('sort_order', { ascending: true });

                if (data) setDownloads(data);
            } catch (error) {
                console.error('Error fetching downloads:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDownloads();
    }, []);

    const defaultDownloads = [
        { label: 'Application Form (PDF)', file_url: '#', file_type: 'PDF' },
        { label: 'School Prospectus 2026', file_url: '#', file_type: 'PDF' },
        { label: 'Fees Structure & Financial Policy', file_url: '#', file_type: 'PDF' },
        { label: 'Student Code of Conduct', file_url: '#', file_type: 'PDF' }
    ];

    const displayDownloads = downloads.length > 0 ? downloads : defaultDownloads;

    return (
        <section className="academics-section reveal-on-scroll">
            <div className="academics-section-title">
                <h2>{t('admissions:resources.title')}</h2>
                <p>{t('admissions:resources.subtitle')}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                {displayDownloads.map((item, index) => (
                    <a
                        key={index}
                        href={item.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="value-item reveal-on-scroll"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1.5rem 2rem',
                            textDecoration: 'none',
                            background: 'white',
                            borderRadius: '16px',
                            border: '1px solid #f1f5f9',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: '#eff6ff', padding: '0.75rem', borderRadius: '12px', color: 'var(--academics-primary)' }}>
                                <FileText size={20} />
                            </div>
                            <span style={{ fontWeight: '600', color: '#1e293b' }}>{item.label}</span>
                        </div>
                        <Download size={20} color="#94a3b8" />
                    </a>
                ))}
            </div>
        </section>
    );
};

export default AdmissionsDownloads;
