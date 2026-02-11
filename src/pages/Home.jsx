import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    useNews,
    useAdministration,
    useAnnouncements,
    useEvents,
    useHomepageAssets
} from '../hooks/useQueries';
import { ArrowRight, Bell, Calendar, BookOpen, Clock, Users, ChevronLeft, ChevronRight, Trophy, Play, Map } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MapEmbed from '../components/contact/MapEmbed';
import NewsCard from '../components/NewsCard';
import StudentSpotlight from '../components/StudentSpotlight';
import QuickAccessHub from '../components/QuickAccessHub';
import OptimizedImage from '../components/ui/OptimizedImage';
import SEO from '../components/SEO';
import HeadMsg from '../components/HeadMsg';
import JourneySection from '../components/JourneySection';
import Mission from '../components/Mission';
import Vision from '../components/Vision';
import CoreValues from '../components/CoreValues';
import Skeleton from '../components/ui/Skeleton';
import UniversalHero from '../components/ui/UniversalHero';
import './Home.css';
import { useSchool } from '../contexts/SchoolContext';

const Home = () => {
    const { t } = useTranslation(['home', 'common']);
    const { school } = useSchool();

    // React Query Hooks
    const { data: latestNews = [], isLoading: newsLoading } = useNews(school?.id, { limit: 6 });
    const { data: administration = [], isLoading: adminLoading } = useAdministration(school?.id);
    const { data: announcements = [] } = useAnnouncements(school?.id, 3);
    const { data: events = [] } = useEvents(school?.id, 1);
    const { data: assets } = useHomepageAssets(school?.id);

    const upcomingEvent = events?.[0];
    const tourPreviewImage = assets?.tour ? (assets.tour.thumbnail_url || assets.tour.image_url) : null;

    const newsSliderRef = useRef(null);
    const adminSliderRef = useRef(null);

    useEffect(() => {
        if (latestNews.length <= 1) return;
        const interval = setInterval(() => {
            if (newsSliderRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = newsSliderRef.current;
                if (scrollLeft + clientWidth >= scrollWidth - 5) {
                    newsSliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    newsSliderRef.current.scrollBy({ left: 524, behavior: 'smooth' });
                }
            }
        }, 4000);
        return () => clearInterval(interval);
    }, [latestNews]);

    useEffect(() => {
        if (administration.length <= 1) return;
        const interval = setInterval(() => {
            if (adminSliderRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = adminSliderRef.current;
                if (scrollLeft + clientWidth >= scrollWidth - 5) {
                    adminSliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    adminSliderRef.current.scrollBy({ left: 320, behavior: 'smooth' });
                }
            }
        }, 4000);
        return () => clearInterval(interval);
    }, [administration]);

    return (
        <div className="home-page">
            <SEO
                title={t('nav.home')}
                description="Bugisu High School - Excellence, Integrity, and Service. Mbale's leading secondary school nurturing future leaders through holistic education."
                url="/"
            />
            {/* Hero Section */}
            <UniversalHero pagePath="/" height="90vh" />

            {/* Quick Access Tools - Mobile only */}
            <QuickAccessHub />

            {/* Live Updates Strip */}
            <div className="section-live-updates bg-white shadow-sm border-bottom">
                {announcements.length > 0 && (
                    <div className="container py-3 border-bottom">
                        <div className="d-flex align-items-center text-danger fw-bold mb-2">
                            <Bell size={18} className="me-2" />
                            <span>LIVE UPDATES</span>
                        </div>
                        <div className="announcement-ticker">
                            {announcements.map((ann) => (
                                <span key={ann.id} className="me-4">
                                    • {ann.title}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Our Story / Journey Section */}
            <JourneySection />

            {/* Headteacher Message Section */}
            <HeadMsg />

            {/* Goals & Values Sections */}
            <Mission />
            <Vision />
            <CoreValues />

            {/* Virtual Tour Preview */}
            <section className="section bg-black text-white tour-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 mb-4 mb-md-0">
                            <h2 className="section-title text-white">{t('nav.tour_title')}</h2>
                            <p className="lead mb-4">{t('nav.tour_desc')}</p>
                            <Link to="/virtual-tour" className="btn btn-primary btn-lg">
                                {t('nav.tour_btn')} <ChevronRight size={20} style={{ marginLeft: '8px' }} />
                            </Link>
                        </div>
                        <div className="col-md-6">
                            <div className="tour-preview-card">
                                <OptimizedImage
                                    src={tourPreviewImage || "/images/students/infra.jpeg"}
                                    alt="Virtual Tour Preview"
                                    aspectRatio="16/9"
                                />
                                <div className="tour-overlay-hint">
                                    <Map size={24} />
                                    <span>Click to explore campus interactively</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest News */}
            <section className="section container news-section">
                <div className="section-header center-vertical">
                    <div>
                        <p className="section-subtitle">{t('news.subtitle')}</p>
                        <h2>{t('news.title')}</h2>
                        <div className="title-underline dodgerblue"></div>
                    </div>
                </div>

                <div className="news-slider-container">
                    <div className="news-slider" ref={newsSliderRef}>
                        {newsLoading ? (
                            Array(3).fill(0).map((_, i) => <Skeleton key={i} type="image" className="news-slide-item" style={{ minWidth: '320px', height: '400px' }} />)
                        ) : latestNews.length === 0 ? (
                            <p className="empty-text">{t('news.empty')}</p>
                        ) : (
                            latestNews.map(item => (
                                <div key={item.id} className="news-slide-item">
                                    <NewsCard news={item} />
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Link to="/news" className="btn btn-outline">{t('news.view_all')} &rarr;</Link>
                </div>
            </section>

            <StudentSpotlight />

            {/* Administration */}
            <section className="section container admin-slider-section">
                <div className="section-header center-vertical">
                    <div>
                        <p className="section-subtitle">{t('leadership.subtitle')}</p>
                        <h2>{t('leadership.title')}</h2>
                        <div className="title-underline dodgerblue"></div>
                    </div>
                </div>
                <div className="admin-slider-container">
                    <div className="admin-slider" ref={adminSliderRef}>
                        {adminLoading ? (
                            Array(3).fill(0).map((_, i) => <Skeleton key={i} type="text" className="admin-slide-item" style={{ minWidth: '300px', height: '350px' }} />)
                        ) : (
                            administration.map(person => (
                                <div key={person.id} className="admin-slide-item">
                                    <div className="admin-card-v2">
                                        <div className="admin-image-wrapper">
                                            <OptimizedImage
                                                src={person.image_url || '/images/students/hm.jpeg'}
                                                alt={person.name}
                                                aspectRatio="1/1"
                                            />
                                            <div className="admin-overlay">
                                                <span className="admin-role-tag">{person.role}</span>
                                            </div>
                                        </div>
                                        <div className="admin-info-v2">
                                            <h3>{person.name}</h3>
                                            <p>{person.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* About Snapshot */}
            <section className="section section-grey">
                <div className="container about-snapshot">
                    <div className="about-text">
                        <h2>{t('about.title')}</h2>
                        <p>{t('about.text')}</p>
                        <Link to="/about" className="btn btn-link">{t('about.link')} &rarr;</Link>
                    </div>
                    <div className="about-stats">
                        <div className="stat-box">
                            <span className="stat-number">1200+</span>
                            <span className="stat-label">{t('about.students')}</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-number">40+</span>
                            <span className="stat-label">{t('about.years')}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="section container">
                <div className="section-header center-vertical">
                    <div>
                        <p className="section-subtitle">{t('visit.subtitle')}</p>
                        <h2>{t('visit.title')}</h2>
                        <div className="title-underline dodgerblue"></div>
                    </div>
                </div>
                <MapEmbed />
            </section>
        </div>
    );
};

export default Home;
