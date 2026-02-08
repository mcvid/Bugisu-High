import { FileSearch, LineChart, FileText } from 'lucide-react';
import OptimizedImage from '../ui/OptimizedImage';

const AssessmentTransparency = () => {
    return (
        <section className="academics-section reveal-on-scroll">
            <div className="academics-section-title">
                <h2>Assessment & Measurement</h2>
                <p>We maintain a transparent evaluation system that focuses on consistent progress and early intervention.</p>
            </div>

            <div className="policy-grid">
                {/* Row 1 */}
                <div className="academic-alternating-row">
                    <div className="academic-image-container">
                        <OptimizedImage
                            src="https://images.unsplash.com/photo-1454165833767-027ffea9e77b?q=80&w=1000&auto=format&fit=crop"
                            alt="Assessment Frequency"
                            aspectRatio="16/10"
                        />
                    </div>
                    <div className="academic-text-container">
                        <div className="policy-card">
                            <div className="policy-icon"><FileSearch size={28} /></div>
                            <div className="policy-content">
                                <h4>Assessment Frequency</h4>
                                <p>We maintain a high-frequency assessment cycle to ensure steady progress. This includes comprehensive Mid-Term examinations, rigorous End-of-Term finals, and weekly topical tests that help identify knowledge gaps as soon as they appearing, allowing for immediate remedial intervention.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 2 */}
                <div className="academic-alternating-row">
                    <div className="academic-image-container">
                        <OptimizedImage
                            src="https://images.unsplash.com/photo-1551288049-bbda3865c670?q=80&w=1000&auto=format&fit=crop"
                            alt="Performance Tracking"
                            aspectRatio="16/10"
                        />
                    </div>
                    <div className="academic-text-container">
                        <div className="policy-card">
                            <div className="policy-icon"><LineChart size={28} /></div>
                            <div className="policy-content">
                                <h4>Performance Tracking</h4>
                                <p>Our transparent reporting system provides parents and guardians with detailed termly performance analytics. Beyond just alphanumeric grades, our reports include qualitative teacher assessments focusing on character development, participation, and specific subject-level strengths and weaknesses.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 3 */}
                <div className="academic-alternating-row">
                    <div className="academic-image-container">
                        <OptimizedImage
                            src="https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?q=80&w=1000&auto=format&fit=crop"
                            alt="Integrity & Standards"
                            aspectRatio="16/10"
                        />
                    </div>
                    <div className="academic-text-container">
                        <div className="policy-card">
                            <div className="policy-icon"><FileText size={28} /></div>
                            <div className="policy-content">
                                <h4>Integrity & Standards</h4>
                                <p>Academic integrity is a core value at Bugisu High School. Our examinations and assessment workflows are strictly proctored and monitored to ensure that every grade earned is a true reflection of a student's hard work, merit, and actual academic capability.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AssessmentTransparency;
