import React from 'react';
import { FileSearch, LineChart, FileText } from 'lucide-react';

const AssessmentTransparency = () => {
    return (
        <section className="academics-section reveal-on-scroll">
            <div className="academics-section-title">
                <h2>Assessment & Measurement</h2>
                <p>We maintain a transparent evaluation system that focuses on consistent progress and early intervention.</p>
            </div>

            <div className="policy-grid">
                <div className="policy-card">
                    <div className="policy-icon"><FileSearch size={24} /></div>
                    <div className="policy-content">
                        <h4>Assessment Frequency</h4>
                        <p>Student progress is measured through Mid-Term examinations and End-of-Term finals, supplemented by weekly subject-specific topical tests.</p>
                    </div>
                </div>

                <div className="policy-card">
                    <div className="policy-icon"><LineChart size={24} /></div>
                    <div className="policy-content">
                        <h4>Performance Tracking</h4>
                        <p>We provide parents with detailed termly reports that include not just grades, but teacher observations on specific areas for improvement.</p>
                    </div>
                </div>

                <div className="policy-card">
                    <div className="policy-icon"><FileText size={24} /></div>
                    <div className="policy-content">
                        <h4>Integrity & Standards</h4>
                        <p>Our assessment workflows are strictly monitored to prevent academic dishonesty and ensure results truly reflect student capability.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AssessmentTransparency;
