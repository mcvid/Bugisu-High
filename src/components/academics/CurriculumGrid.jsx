import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { GraduationCap, BookOpen } from 'lucide-react';

const CurriculumGrid = () => {
    const { t } = useTranslation(['academics']);
    const [levels, setLevels] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurriculum = async () => {
            try {
                setLoading(true);
                const [levelsRes, subjectsRes] = await Promise.all([
                    supabase.from('academic_levels').select('*').order('sort_order', { ascending: true }),
                    supabase.from('subjects').select('*').order('name', { ascending: true })
                ]);

                if (levelsRes.error) throw levelsRes.error;
                if (subjectsRes.error) throw subjectsRes.error;

                setLevels(levelsRes.data || []);
                setSubjects(subjectsRes.data || []);
            } catch (error) {
                console.error('Error fetching curriculum:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCurriculum();
    }, []);

    if (loading) return (
        <div className="container" style={{ padding: '2rem 0', textAlign: 'center' }}>
            <p>{t('loading')}</p>
        </div>
    );

    return (
        <section className="academics-section reveal-on-scroll">
            <div className="academics-section-title">
                <h2>{t('curriculum_title')}</h2>
                <p>{t('curriculum_subtitle')}</p>
            </div>

            <div className="levels-grid">
                {(levels.length > 0 ? levels : [
                    { id: 'o-level', name: t('o_level_title'), description: t('o_level_desc') },
                    { id: 'a-level', name: t('a_level_title'), description: t('a_level_desc') }
                ]).map(level => (
                    <div key={level.id} className="level-card reveal-on-scroll">
                        <h3>
                            <div className="icon-wrapper"><GraduationCap size={28} /></div>
                            {level.name}
                        </h3>
                        <p style={{ marginBottom: '2rem', color: '#64748b', fontSize: '1.1rem' }}>{level.description}</p>
                        <div className="subject-list">
                            {subjects.length > 0 && subjects.some(s => s.level_id === level.id) ? (
                                subjects
                                    .filter(s => s.level_id === level.id)
                                    .map(subject => (
                                        <div key={subject.id} className="subject-item">
                                            {subject.name}
                                        </div>
                                    ))
                            ) : (
                                <>
                                    <div className="subject-item">Mathematics</div>
                                    <div className="subject-item">English</div>
                                    <div className="subject-item">Physics</div>
                                    <div className="subject-item">Chemistry</div>
                                    <div className="subject-item">Biology</div>
                                    <div className="subject-item">History</div>
                                    <div className="subject-item">Geography</div>
                                    <div className="subject-item">CRE / IRE</div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CurriculumGrid;
