import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    useHeroSlides,
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
import VideoPlayer from '../components/VideoPlayer';
import StudentSpotlight from '../components/StudentSpotlight';
import QuickAccessHub from '../components/QuickAccessHub';
import OptimizedImage from '../components/ui/OptimizedImage';
import SEO from '../components/SEO';
import Skeleton from '../components/ui/Skeleton';
import './Home.css';

const Home = () => {
    const { t } = useTranslation(['home', 'common']);
    const [currentSlide, setCurrentSlide] = useState(0);

    // React Query Hooks
    const { data: heroSlides = [] } = useHeroSlides();
    const { data: latestNews = [], isLoading: newsLoading } = useNews({ limit: 6 });
    const { data: administration = [], isLoading: adminLoading } = useAdministration();
    const { data: announcements = [] } = useAnnouncements(3);
    const { data: events = [] } = useEvents(1);
    const { data: assets } = useHomepageAssets();

    const upcomingEvent = events?.[0];
    const promoVideo = assets?.video;
    const tourPreviewImage = assets?.tour ? (assets.tour.thumbnail_url || assets.tour.image_url) : null;

    const newsSliderRef = useRef(null);
    const adminSliderRef = useRef(null);

    // Carousel & Slider Logic
    useEffect(() => {
        if (heroSlides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [heroSlides]);

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

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

    return (
        <div className="home-page">
            <SEO
                title={t('nav.home')}
                description="Bugisu High School - Excellence, Integrity, and Service. Mbale's leading secondary school nurturing future leaders through holistic education."
                url="/"
            />
            {/* Hero Section */}
            <section className="hero-carousel">
                {heroSlides.length > 0 ? (
                    <>
                        {heroSlides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${slide.image_url})` }}
                            >
                                <div className="hero-content">
                                    <h2 className="hero-small-title">{slide.title}</h2>
                                    <h1 className="hero-big-title">{slide.subtitle}</h1>
                                </div>
                            </div>
                        ))}
                        <button className="carousel-arrow left" onClick={prevSlide}><ChevronLeft size={32} /></button>
                        <button className="carousel-arrow right" onClick={nextSlide}><ChevronRight size={32} /></button>
                    </>
                ) : (
                    <div className="hero-slide active" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')` }}>
                        <div className="hero-content">
                            <h2 className="hero-small-title">{t('app.title')}</h2>
                            <h1 className="hero-big-title">{t('hero_subtitle').toUpperCase()}</h1>
                        </div>
                    </div>
                )}
            </section>

            {/* Quick Access Tools - Mobile only */}
            <QuickAccessHub />

            {/* Live Updates & Quick Info */}
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

                <div className="quick-info-strip container">
                    <div className="info-item">
                        <Clock size={24} className="info-icon" />
                        <div>
                            <strong>{t('quick_info.term_progress')}</strong>
                            <span>{t('quick_info.term_ends')}</span>
                        </div>
                    </div>
                    <div className="info-item">
                        <BookOpen size={24} className="info-icon" />
                        <div>
                            <strong>{t('quick_info.admissions_open')}</strong>
                            <span>{t('quick_info.admissions_desc')}</span>
                        </div>
                    </div>
                    <div className="info-item highlight">
                        <Calendar size={24} className="info-icon" />
                        <div>
                            <strong>{upcomingEvent ? upcomingEvent.title : t('quick_info.next_event')}</strong>
                            <span>{upcomingEvent ? new Date(upcomingEvent.event_date).toLocaleDateString() : 'Join our community'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Intro Section */}
            <section className="section container intro-section">
                <div className="intro-grid">
                    <div className="intro-card">
                        <div className="intro-header">
                            <Users size={20} color="white" />
                            <span>{t('intro.header')}</span>
                        </div>
                        <div className="intro-content">
                            <p>{t('intro.text1')}</p>
                            <p>{t('intro.text2')}</p>
                            <p>{t('intro.text3')}</p>
                        </div>
                    </div>
                    <div className="intro-video">
                        <VideoPlayer
                            videoUrl={promoVideo?.promo_video_url || "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
                            thumbnailUrl={promoVideo?.promo_video_thumbnail || "https://images.unsplash.com/photo-1544531696-2822a09966ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"}
                            title="Welcome to Bugisu High School"
                        />
                    </div>
                </div>
            </section>

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
                                    src={tourPreviewImage || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1000"}
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
                                                src={person.image_url || 'https://images.unsplash.com/photo-1544531696-2822a09966ce?auto=format&fit=crop&q=80&w=400'}
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
