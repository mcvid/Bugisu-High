import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './UniversalHero.css';
import { useHeroSlides } from '../../hooks/useQueries';
import { useSchool } from '../../contexts/SchoolContext';

const UniversalHero = ({ pagePath, children, height = '60vh', showImage = true }) => {
    const { school } = useSchool();
    const { data: slides = [], isLoading: slidesLoading } = useHeroSlides(pagePath);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Hardcoded professional fallbacks to prevent black/blank screens
    const fallbacks = [
        {
            id: 'fb-1',
            title: 'BUGISU HIGH SCHOOL',
            subtitle: 'Excellence, Integrity, and Service'
        }
    ];

    // Use fetched slides if available, otherwise use fallbacks
    const displaySlides = (slides && slides.length > 0) ? slides : fallbacks;

    // Use state to track if we should show the loader or the fallback
    // We want to show fallbacks immediately to prevent blank screens
    const showLoading = slidesLoading && (!slides || slides.length === 0);

    useEffect(() => {
        if (displaySlides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [displaySlides.length]);

    // We no longer return early with a skeleton if we have fallbacks to show
    // This ensures a "ready" look immediately.
    // if (isLoading) return <div className="hero-skeleton" style={{ height, background: '#f3f4f6' }}></div>;

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);

    // If ONLY one slide, we use it directly. If multiple, we have a slideshow.
    const containerStyle = {
        height: height,
        minHeight: height
    };

    return (
        <section className={`hero-carousel ${!showImage ? 'no-bg-image' : ''}`} style={containerStyle}>
            {displaySlides.map((slide, index) => {
                const isActive = index === currentSlide;
                const slideStyle = {
                    display: isActive ? 'flex' : 'none',
                    height: height
                };

                if (showImage) {
                    slideStyle.backgroundImage = `url("${slide.image_url}")`;
                }

                return (
                    <div
                        key={slide.id}
                        className={`hero-slide ${isActive ? 'active' : ''}`}
                        style={slideStyle}
                    >
                        {showImage && slide.video_url && isActive && (
                            <video
                                className="hero-video"
                                autoPlay
                                muted
                                loop
                                playsInline
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    zIndex: 1
                                }}
                            >
                                <source src={slide.video_url} type="video/mp4" />
                            </video>
                        )}
                        <div className="hero-content" style={{ zIndex: 10 }}>
                            {children ? (
                                typeof children === 'function' ? children({ slide, isActive }) : children
                            ) : (
                                <>
                                    <h2 className="hero-small-title">{slide.title}</h2>
                                    <h1 className="hero-big-title">{slide.subtitle}</h1>
                                </>
                            )}
                        </div>
                    </div>
                );
            })}

            {displaySlides.length > 1 && (
                <>
                    <button className="carousel-arrow left" onClick={prevSlide} aria-label="Previous slide">
                        <ChevronLeft size={32} />
                    </button>
                    <button className="carousel-arrow right" onClick={nextSlide} aria-label="Next slide">
                        <ChevronRight size={32} />
                    </button>
                    <div className="carousel-dots">
                        {displaySlides.map((_, i) => (
                            <span
                                key={i}
                                className={`dot ${i === currentSlide ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(i)}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

export default UniversalHero;
