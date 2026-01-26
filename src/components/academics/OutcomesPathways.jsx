import React from 'react';
import { Compass, GraduationCap, Map } from 'lucide-react';

const OutcomesPathways = () => {
    return (
        <section className="academics-section reveal-on-scroll">
            <div className="academics-section-title">
                <h2>Progression & Pathways</h2>
                <p>A BHS education is a foundation for higher learning and professional development.</p>
            </div>

            <div className="policy-grid">
                <div className="policy-card">
                    <div className="policy-icon"><Compass size={24} /></div>
                    <div className="policy-content">
                        <h4>University Readiness</h4>
                        <p>Our A-Level combinations are designed to meet entry requirements for top national and regional universities across medicine, engineering, business, and humanities.</p>
                    </div>
                </div>

                <div className="policy-card">
                    <div className="policy-icon"><GraduationCap size={24} /></div>
                    <div className="policy-content">
                        <h4>Academic Continuity</h4>
                        <p>Students finishing O-Level at BHS are given priority for A-Level placement, ensuring a seamless 6-year academic journey with a faculty that already understands their strengths.</p>
                    </div>
                </div>

                <div className="policy-card">
                    <div className="policy-icon"><Map size={24} /></div>
                    <div className="policy-content">
                        <h4>Career Guidance</h4>
                        <p>We host annual career fairs and university application workshops to help senior students make informed decisions about their next academic steps.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OutcomesPathways;
