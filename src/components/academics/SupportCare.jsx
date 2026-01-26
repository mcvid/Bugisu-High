import React from 'react';
import { HeartPulse, MessageSquare, Clock } from 'lucide-react';

const SupportCare = () => {
    return (
        <section className="academics-section reveal-on-scroll">
            <div className="academics-section-title">
                <h2>Student Support & Academic Care</h2>
                <p>Academic pressure is managed through proactive support systems and guidance.</p>
            </div>

            <div className="policy-grid">
                <div className="policy-card">
                    <div className="policy-icon"><Clock size={24} /></div>
                    <div className="policy-content">
                        <h4>Remedial Support</h4>
                        <p>We host scheduled remedial classes for students who require additional time and attention in specific subject areas, ensuring no one falls behind.</p>
                    </div>
                </div>

                <div className="policy-card">
                    <div className="policy-icon"><HeartPulse size={24} /></div>
                    <div className="policy-content">
                        <h4>Guidance & Counseling</h4>
                        <p>A dedicated counseling department provides academic and emotional support, helping students navigate the challenges of secondary growth.</p>
                    </div>
                </div>

                <div className="policy-card">
                    <div className="policy-icon"><MessageSquare size={24} /></div>
                    <div className="policy-content">
                        <h4>Teacher Accessibility</h4>
                        <p>Teachers maintain open office hours, encouraging students to seek clarity on complex topics outside of formal classroom hours.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SupportCare;
