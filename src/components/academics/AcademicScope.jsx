import { ShieldCheck, Award } from 'lucide-react';
import OptimizedImage from '../ui/OptimizedImage';

const AcademicScope = () => {
    return (
        <section className="academics-section reveal-on-scroll">
            <div className="academics-section-title">
                <h2>Program Scope & Standards</h2>
                <p>Clearly defined educational boundaries ensure specialized attention at every level.</p>
            </div>

            <div className="policy-grid">
                {/* Row 1 */}
                <div className="academic-alternating-row">
                    <div className="academic-image-container">
                        <OptimizedImage
                            src="/images/students/WhatsApp Image 2026-02-08 at 14.13.28.jpeg"
                            alt="Secondary Education"
                            aspectRatio="16/10"
                        />
                    </div>
                    <div className="academic-text-container">
                        <div className="policy-card">
                            <div className="policy-icon"><ShieldCheck size={28} /></div>
                            <div className="policy-content">
                                <h4>Educational Levels</h4>
                                <p>We provide a comprehensive secondary education framework across two primary levels: Lower Secondary (O-Level) and Upper Secondary (A-Level). Each phase is designed to build critical foundational knowledge while progressively introducing advanced concepts, ensuring our students are prepared for the rigors of university education and beyond.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 2 */}
                <div className="academic-alternating-row">
                    <div className="academic-image-container">
                        <OptimizedImage
                            src="/images/students/WhatsApp Image 2026-02-08 at 14.13.32.jpeg"
                            alt="National Certification"
                            aspectRatio="16/10"
                        />
                    </div>
                    <div className="academic-text-container">
                        <div className="policy-card">
                            <div className="policy-icon"><Award size={28} /></div>
                            <div className="policy-content">
                                <h4>National Certification</h4>
                                <p>Our academic programs are fully accredited and strictly aligned with the Uganda National Examinations Board (UNEB). We maintain a gold standard in preparing students for the Uganda Certificate of Education (UCE) and the Uganda Advanced Certificate of Education (UACE), with a consistent track record of excellence in national rankings.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AcademicScope;
