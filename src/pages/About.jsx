import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { cacheManager } from '../lib/cache';
import SEO from '../components/SEO';
import UniversalHero from '../components/ui/UniversalHero';
import OptimizedImage from '../components/ui/OptimizedImage';
import ThreeDCarousel from '../components/academics/ThreeDCarousel';
import './About.css';

const About = () => {
    const { t } = useTranslation(['about', 'common']);
    const [administration, setAdministration] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [focusedId, setFocusedId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check Cache
                const cached = cacheManager.get('about_page_data');
                if (cached) {
                    setAdministration(cached.administration);
                    setTeachers(cached.teachers);
                    setLoading(false);
                    return;
                }

                setLoading(true);

                // Fetch in parallel
                const [adminRes, teacherRes] = await Promise.all([
                    supabase.from('administration').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true }),
                    supabase.from('teachers').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true })
                ]);

                if (adminRes.data) setAdministration(adminRes.data);
                if (teacherRes.data) setTeachers(teacherRes.data);

                // Cache it
                cacheManager.set('about_page_data', {
                    administration: adminRes.data || [],
                    teachers: teacherRes.data || []
                });

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (administration.length === 0 && teachers.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setFocusedId(entry.target.getAttribute('data-id'));
                }
            });
        }, {
            threshold: 0.7,
            rootMargin: "-10% 0px -10% 0px"
        });

        const cards = document.querySelectorAll('.leader-card, .about-card, .value-item, .teacher-card');
        cards.forEach(card => observer.observe(card));

        return () => observer.disconnect();
    }, [administration, teachers]);

    return (
        <div className="about-page">
            <SEO
                title={t('nav.about')}
                description="Discover the heritage, mission, and leadership of Bugisu High School. Founded on principles of Excellence, Integrity, and Service to nurture the leaders of tomorrow in Mbale, Uganda."
                url="/about"
            />
            {/* Opening Section */}
            <UniversalHero pagePath="/about" height="50vh">
                <div className="center-hero">
                    <h1>
                        <span className="desktop-title">{t('hero_title')}</span>
                        <span className="mobile-title">{t('hero_title_mobile')}</span>
                    </h1>
                    <p className="lead">
                        {t('hero_desc')}
                    </p>
                </div>
            </UniversalHero>

            <div className="container">
                {/* School Overview */}
                <section className="about-section">
                    <div className="history-split">
                        <div className="history-text">
                            <div className="about-section-header">
                                <h2>{t('foundation_title')}</h2>
                                <p>{t('foundation_desc')}</p>
                            </div>
                            <div className="history-content">
                                <p>
                                    {t('history_text')}
                                </p>
                            </div>
                        </div>
                        <div className="history-image-container">
                            <OptimizedImage
                                src="/images/students/infra.jpeg"
                                alt="Our Campus"
                                aspectRatio="4/3"
                            />
                        </div>
                    </div>
                </section>

                {/* Mission, Vision & Values */}
                <section className="about-section">
                    <div className="about-grid">
                        <div
                            className={`about-card ${focusedId === 'mission' ? 'focused' : ''}`}
                            data-id="mission"
                        >
                            <div className="card-image-mini">
                                <OptimizedImage
                                    src="/images/students/stu.jpeg"
                                    alt="Mission"
                                    aspectRatio="16/9"
                                />
                            </div>
                            <h3>{t('mission_title')}</h3>
                            <p>{t('mission_desc')}</p>
                        </div>
                        <div
                            className={`about-card ${focusedId === 'vision' ? 'focused' : ''}`}
                            data-id="vision"
                        >
                            <div className="card-image-mini">
                                <OptimizedImage
                                    src="/images/students/girl.jpeg"
                                    alt="Vision"
                                    aspectRatio="16/9"
                                />
                            </div>
                            <h3>{t('vision_title')}</h3>
                            <p>{t('vision_desc')}</p>
                        </div>
                    </div>

                    <div className="values-section">
                        <h3>{t('values_title')}</h3>
                        <div className="values-list">
                            <div
                                className={`value-item ${focusedId === 'v-excellence' ? 'focused' : ''}`}
                                data-id="v-excellence"
                            >
                                <h4>{t('values.excellence_title')}</h4>
                                <p>{t('values.excellence_desc')}</p>
                            </div>
                            <div
                                className={`value-item ${focusedId === 'v-integrity' ? 'focused' : ''}`}
                                data-id="v-integrity"
                            >
                                <h4>{t('values.integrity_title')}</h4>
                                <p>{t('values.integrity_desc')}</p>
                            </div>
                            <div
                                className={`value-item ${focusedId === 'v-discipline' ? 'focused' : ''}`}
                                data-id="v-discipline"
                            >
                                <h4>{t('values.discipline_title')}</h4>
                                <p>{t('values.discipline_desc')}</p>
                            </div>
                            <div
                                className={`value-item ${focusedId === 'v-community' ? 'focused' : ''}`}
                                data-id="v-community"
                            >
                                <h4>{t('values.community_title')}</h4>
                                <p>{t('values.community_desc')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Leadership */}
                <section className="about-section">
                    <div className="about-section-header">
                        <h2>{t('leadership_title')}</h2>
                        <p>{t('leadership_desc')}</p>
                    </div>
                    {loading ? (
                        <div className="leadership-grid">{Array(3).fill(0).map((_, i) => <div key={i} className="skeleton-card" style={{ height: '300px', background: '#f3f4f6', borderRadius: '12px' }}></div>)}</div>
                    ) : (
                        <>
                            {/* Desktop Grid */}
                            <div className="leadership-grid desktop-only-grid">
                                {administration.map(person => (
                                    <div
                                        key={person.id}
                                        className={`leader-card ${focusedId === person.id.toString() ? 'focused' : ''}`}
                                        data-id={person.id}
                                    >
                                        <span className="leader-role">{person.role}</span>
                                        <h3>{person.name}</h3>
                                        {person.image_url ? (
                                            <img
                                                src={person.image_url}
                                                alt={person.name}
                                                loading="lazy"
                                                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
                                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1544531696-2822a09966ce?auto=format&fit=crop&q=80&w=400'; }}
                                            />
                                        ) : (
                                            <div style={{ width: '100%', height: '200px', background: '#f3f4f6', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                                                {t('common.no_image') || 'No Image'}
                                            </div>
                                        )}
                                        <p className="leader-bio">Dedicated to academic excellence and nurturing the future leaders of Uganda through holistic education and strong moral values.</p>
                                    </div>
                                ))}
                            </div>

                            {/* Mobile 3D Carousel */}
                            <div className="mobile-only-carousel">
                                <ThreeDCarousel
                                    items={administration.map(person => (
                                        <div
                                            key={person.id}
                                            className={`leader-card ${focusedId === person.id.toString() ? 'focused' : ''}`}
                                            data-id={person.id}
                                            style={{ margin: 0, height: '100%' }} // Override grid margins
                                        >
                                            <span className="leader-role">{person.role}</span>
                                            <h3>{person.name}</h3>
                                            {person.image_url ? (
                                                <img
                                                    src={person.image_url}
                                                    alt={person.name}
                                                    loading="lazy"
                                                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
                                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1544531696-2822a09966ce?auto=format&fit=crop&q=80&w=400'; }}
                                                />
                                            ) : (
                                                <div style={{ width: '100%', height: '200px', background: '#f3f4f6', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                                                    {t('common.no_image') || 'No Image'}
                                                </div>
                                            )}
                                            <p className="leader-bio">Dedicated to academic excellence.</p>
                                        </div>
                                    ))}
                                />
                            </div>
                        </>
                    )}
                </section>

                {/* Our Team Section */}
                <section className="about-section mt-16">
                    <div className="about-section-header">
                        <h2>{t('team_title')}</h2>
                        <p>{t('team_desc')}</p>
                    </div>
                    {loading ? (
                        <div className="teachers-grid">{Array(4).fill(0).map((_, i) => <div key={i} className="skeleton-card" style={{ height: '350px', background: '#f3f4f6', borderRadius: '12px' }}></div>)}</div>
                    ) : teachers.length === 0 ? (
                        <p className="empty-text">{t('teachers_coming_soon')}</p>
                    ) : (
                        <>
                            {/* Desktop Grid */}
                            <div className="teachers-grid desktop-only-grid">
                                {teachers.map(teacher => (
                                    <div
                                        key={teacher.id}
                                        className="teacher-card"
                                        data-id={teacher.id}
                                    >
                                        <div className="teacher-image-container">
                                            <img
                                                src={teacher.image_url}
                                                alt={teacher.name}
                                                loading="lazy"
                                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1544531696-2822a09966ce?auto=format&fit=crop&q=80&w=400'; }}
                                            />
                                        </div>
                                        <div className="teacher-info">
                                            <h3>{teacher.name}</h3>
                                            <p className="teacher-subject">{teacher.subject}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Mobile 3D Carousel */}
                            <div className="mobile-only-carousel">
                                <ThreeDCarousel
                                    items={teachers.map(teacher => (
                                        <div
                                            key={teacher.id}
                                            className="teacher-card"
                                            data-id={teacher.id}
                                            style={{ margin: 0, height: '100%' }}
                                        >
                                            <div className="teacher-image-container">
                                                <img
                                                    src={teacher.image_url}
                                                    alt={teacher.name}
                                                    loading="lazy"
                                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1544531696-2822a09966ce?auto=format&fit=crop&q=80&w=400'; }}
                                                />
                                            </div>
                                            <div className="teacher-info">
                                                <h3>{teacher.name}</h3>
                                                <p className="teacher-subject">{teacher.subject}</p>
                                            </div>
                                        </div>
                                    ))}
                                />
                            </div>
                        </>
                    )}
                </section>
            </div>
        </div>
    );
};

export default About;
