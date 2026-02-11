import { HeartPulse, MessageSquare, Clock } from 'lucide-react';
import OptimizedImage from '../ui/OptimizedImage';

const SupportCare = () => {
    return (
        <section className="academics-section reveal-on-scroll">
            <div className="academics-section-title">
                <h2>Student Support & Academic Care</h2>
                <p>Academic pressure is managed through proactive support systems and guidance.</p>
            </div>

            <div className="policy-grid">
                {/* Row 1 */}
                <div className="academic-alternating-row">
                    <div className="academic-image-container">
                        <OptimizedImage
                            src="/images/students/stu.jpeg"
                            alt="Remedial Support"
                            aspectRatio="16/10"
                        />
                    </div>
                    <div className="academic-text-container">
                        <div className="policy-card">
                            <div className="policy-icon"><Clock size={28} /></div>
                            <div className="policy-content">
                                <h4>Remedial Support</h4>
                                <p>Understanding that every student learns at a different pace, we offer dedicated remedial blocks scheduled after official class hours. These sessions provide a safe and supportive environment for students to revisit complex topics and strengthen their understanding alongside subject specialists.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 2 */}
                <div className="academic-alternating-row">
                    <div className="academic-image-container">
                        <OptimizedImage
                            src="/images/students/girl.jpeg"
                            alt="Guidance & Counseling"
                            aspectRatio="16/10"
                        />
                    </div>
                    <div className="academic-text-container">
                        <div className="policy-card">
                            <div className="policy-icon"><HeartPulse size={28} /></div>
                            <div className="policy-content">
                                <h4>Guidance & Counseling</h4>
                                <p>Our holistic approach includes a robust Guidance and Counseling department. We understand the unique pressures of the teenage years and provide professional mentorship and emotional support to help students navigate personal and academic challenges with confidence.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 3 */}
                <div className="academic-alternating-row">
                    <div className="academic-image-container">
                        <OptimizedImage
                            src="/images/students/hm.jpeg"
                            alt="Teacher Accessibility"
                            aspectRatio="16/10"
                        />
                    </div>
                    <div className="academic-text-container">
                        <div className="policy-card">
                            <div className="policy-icon"><MessageSquare size={28} /></div>
                            <div className="policy-content">
                                <h4>Teacher Accessibility</h4>
                                <p>Academic care extends beyond the classroom. Our teachers maintain an 'open-door' policy, encouraging students to book one-on-one consultations for academic mentorship, project guidance, or simple clarification on lesson content.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SupportCare;
