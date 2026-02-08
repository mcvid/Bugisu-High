import React, { useEffect } from 'react';
import SEO from '../components/SEO';
import ContactInfo from '../components/contact/ContactInfo';
import ContactForm from '../components/contact/ContactForm';
import MapEmbed from '../components/contact/MapEmbed';
import UniversalHero from '../components/ui/UniversalHero';
import './Academics.css'; // Reusing the same premium styles

const Contact = () => {
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

        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                const newElements = document.querySelectorAll('.reveal-on-scroll:not(.observed)');
                newElements.forEach(el => {
                    el.classList.add('observed');
                    observer.observe(el);
                });
            });
        });

        mutationObserver.observe(document.body, { childList: true, subtree: true });

        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        revealElements.forEach(el => {
            el.classList.add('observed');
            observer.observe(el);
        });

        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
        };
    }, []);

    return (
        <div className="academics-page contact-page">
            <SEO
                title="Contact Us"
                description="Get in touch with Bugisu High School. Reach us via phone, email, or visit our campus in Mbale, Uganda. We are here to help with your inquiries."
                url="/contact"
                schema={{
                    "@context": "https://schema.org",
                    "@type": "ContactPage",
                    "mainEntity": {
                        "@type": "School",
                        "name": "Bugisu High School",
                        "telephone": "+256 000 000 000",
                        "email": "info@bugisuhighschool.com",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "Mbale",
                            "addressRegion": "Eastern Region",
                            "addressCountry": "Uganda"
                        }
                    }
                }}
            />
            <div className="academics-bg-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-3"></div>
            </div>

            <UniversalHero pagePath="/contact" height="40vh">
                <div style={{ textAlign: 'center' }}>
                    <h1 className="reveal-on-scroll" style={{ color: 'white' }}>Contact Us</h1>
                    <p className="reveal-on-scroll" style={{ maxWidth: '600px', margin: '1rem auto', color: 'rgba(255,255,255,0.9)' }}>
                        We are here to help. Reach out to Bugisu High School through any of the channels below.
                    </p>
                </div>
            </UniversalHero>

            <div className="container" style={{ display: 'grid', gap: '4rem', paddingBottom: '6rem' }}>
                <ContactInfo />

                <div className="contact-grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'start' }}>
                    <ContactForm />

                    <div style={{ display: 'grid', gap: '2rem' }}>
                        <div className="level-card reveal-on-scroll">
                            <h3 style={{ marginBottom: '1rem' }}>Visit Our Campus</h3>
                            <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                                Our campus is open for visits during office hours. We welcome prospective parents and students to tour our facilities and meet our staff.
                            </p>
                        </div>
                        <MapEmbed />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
