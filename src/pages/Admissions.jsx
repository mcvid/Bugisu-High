import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import './Academics.css'; // Reuse academics styling for consistency

// Modular Components
import AdmissionsHero from '../components/admissions/AdmissionsHero';
import AdmissionsSteps from '../components/admissions/AdmissionsSteps';
import AdmissionsRequirements from '../components/admissions/AdmissionsRequirements';
import AdmissionsDownloads from '../components/admissions/AdmissionsDownloads';
import AdmissionsDates from '../components/admissions/AdmissionsDates';
import AdmissionsInquiry from '../components/admissions/AdmissionsInquiry';
import AdmissionsContact from '../components/admissions/AdmissionsContact';
import AdmissionsTracker from '../components/admissions/AdmissionsTracker';

const Admissions = () => {
    // Intersection Observer for Scroll Reveal
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const observeElements = () => {
            const elements = document.querySelectorAll('.reveal-on-scroll:not(.active)');
            elements.forEach(el => observer.observe(el));
        };

        observeElements();

        const mutationObserver = new MutationObserver((mutations) => {
            let shouldCheck = false;
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) shouldCheck = true;
            });
            if (shouldCheck) observeElements();
        });

        mutationObserver.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
        };
    }, []);

    return (
        <div className="academics-page admissions-page">
            <SEO
                title="Admissions"
                description="Join the Bugisu High School family. Applications for the 2026/2027 academic year are now open. View requirements, enrollment dates, and apply online."
                url="/admissions"
            />
            <div className="academics-bg-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
            </div>

            <AdmissionsHero />

            <div className="container" style={{ marginTop: '-4rem', position: 'relative', zIndex: 10, textAlign: 'center', marginBottom: '3rem' }}>
                <Link to="/apply" className="btn btn-primary btn-lg" style={{ boxShadow: '0 10px 20px rgba(30, 144, 255, 0.3)', padding: '1.25rem 3rem', fontSize: '1.2rem' }}>
                    Apply Online Now &rarr;
                </Link>
            </div>

            <div className="container">
                <AdmissionsTracker />
                <AdmissionsSteps />
                <AdmissionsRequirements />
                <AdmissionsDates />

                {/* Scholarships CTA */}
                <div className="reveal-on-scroll" style={{
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    padding: '3rem 2rem',
                    borderRadius: '16px',
                    color: 'white',
                    textAlign: 'center',
                    margin: '3rem 0'
                }}>
                    <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Need Financial Assistance?</h3>
                    <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.95 }}>
                        Explore our scholarship opportunities and financial aid programs to make quality education accessible.
                    </p>
                    <Link to="/scholarships" className="btn" style={{
                        background: 'white',
                        color: '#f97316',
                        border: '2px solid white',
                        padding: '1rem 2.5rem',
                        fontSize: '1.1rem'
                    }}>
                        View Scholarships
                    </Link>
                </div>

                <AdmissionsContact />
            </div>
        </div>
    );
};

export default Admissions;
