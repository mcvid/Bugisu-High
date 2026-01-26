import React from 'react';
import { ShieldCheck, Award } from 'lucide-react';

const AcademicScope = () => {
    return (
        <section className="academics-section reveal-on-scroll">
            <div className="academics-section-title">
                <h2>Program Scope & Standards</h2>
                <p>Clearly defined educational boundaries ensure specialized attention at every level.</p>
            </div>

            <div className="policy-grid">
                <div className="policy-card">
                    <div className="policy-icon"><ShieldCheck size={24} /></div>
                    <div className="policy-content">
                        <h4>Educational Levels</h4>
                        <p>We provide full-time secondary education across two levels: Lower Secondary (O-Level) and Upper Secondary (A-Level). We do not offer primary or vocational-only certificate tracks at this campus.</p>
                    </div>
                </div>

                <div className="policy-card">
                    <div className="policy-icon"><Award size={24} /></div>
                    <div className="policy-content">
                        <h4>National Certification</h4>
                        <p>All academic programs are aligned with the Uganda National Examinations Board (UNEB). Students are prepared for the Uganda Certificate of Education (UCE) and Uganda Advanced Certificate of Education (UACE).</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AcademicScope;
