import React, { useEffect } from 'react';
import SEO from '../components/SEO';
import './Academics.css';

// Modular Components
import AcademicHero from '../components/academics/AcademicHero';
import AcademicScope from '../components/academics/AcademicScope';
import CurriculumGrid from '../components/academics/CurriculumGrid';
import DepartmentList from '../components/academics/DepartmentList';
import EnvironmentSignals from '../components/academics/EnvironmentSignals';
import SupportCare from '../components/academics/SupportCare';
import AssessmentTransparency from '../components/academics/AssessmentTransparency';
import OutcomesPathways from '../components/academics/OutcomesPathways';

const Academics = () => {
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
                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const observeElements = () => {
            const elements = document.querySelectorAll('.reveal-on-scroll:not(.active)');
            elements.forEach(el => observer.observe(el));
        };

        // Initial observation
        observeElements();

        // Watch for new elements being added to the DOM (MutationObserver)
        const mutationObserver = new MutationObserver((mutations) => {
            let shouldCheck = false;
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) shouldCheck = true;
            });
            if (shouldCheck) observeElements();
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
        };
    }, []);

    return (
        <div className="academics-page">
            <SEO
                title="Academics"
                description="Discover the rigorous O-Level and A-Level academic programs at Bugisu High School. Our curriculum emphasizes holistic development, critical thinking, and prepares students for higher education and future success in Mbale, Uganda."
                url="/academics"
            />
            {/* Background Decoration */}
            <div className="academics-bg-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
            </div>

            <AcademicHero />

            <div className="container">
                <AcademicScope />
                <CurriculumGrid />
                <DepartmentList />
                <EnvironmentSignals />
                <SupportCare />
                <AssessmentTransparency />
                <OutcomesPathways />
            </div>
        </div>
    );
};

export default Academics;
