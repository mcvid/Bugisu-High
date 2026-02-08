import React from 'react';
import { Link } from 'react-router-dom';
import { Quote, ArrowLeft } from 'lucide-react';
import './HeadteacherMessagePage.css';

const HeadteacherMessagePage = () => {
    return (
        <div className="headteacher-page">
            {/* Header Area */}
            <header className="page-header-banner">
                <div className="container">
                    <Link to="/about" className="back-link-white" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'white', marginBottom: '1rem', opacity: 0.9, textDecoration: 'none' }}>
                        <ArrowLeft size={18} /> Back to About
                    </Link>
                    <h1 className="page-title">Headteacher's Message</h1>
                    <p className="page-subtitle">A word of welcome and vision from our leadership.</p>
                </div>
            </header>

            <main className="container page-content">
                <div className="layout-grid">
                    {/* Left Column: Image */}
                    <div className="image-column">
                        <div className="sticky-wrapper">
                            <div className="image-card">
                                <img
                                    src="/images/students/hm.jpeg?v=2"
                                    alt="Mabonga Sam Mukholi - Headteacher"
                                    className="main-hm-image"
                                />
                                <div className="image-caption">
                                    <h3>Mabonga Sam Mukholi</h3>
                                    <p>Headteacher</p>
                                </div>
                            </div>
                            <div className="quote-decoration">
                                <Quote size={80} className="quote-icon-bg" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Text Content */}
                    <div className="text-column">
                        <p className="highlight-text">
                            "I am deeply honoured and humbled to serve as the Headteacher of Bugisu High School."
                        </p>

                        <p>
                            Bugisu High School is an institution with a strong heritage and a clear mission of inspiring, preparing, and nurturing young people into academically competent, morally upright, and socially responsible citizens. We stand as a centre of excellence where learners are guided to discover their purpose and develop the confidence to face an increasingly competitive and dynamic world.
                        </p>

                        <p>
                            At Bugisu High School, we believe that true education goes beyond examination success. While we place great emphasis on academic excellence, we equally value character formation, discipline, creativity, leadership, and spiritual growth. Our curriculum is therefore complemented by a wide range of co-curricular and extracurricular activities including sports, clubs, debates, leadership programmes, and community engagement. These experiences help our learners develop critical thinking skills, teamwork, resilience, and self-discipline—qualities that prepare them for higher education, the workplace, and life beyond school.
                        </p>

                        <p>
                            Our dedicated and professional teaching staff work tirelessly to provide learner-centred instruction in a safe, supportive, and motivating environment. We continuously embrace modern teaching methods and educational innovations to ensure that our learners are equipped with relevant knowledge and practical skills needed to compete favourably both locally and internationally.
                        </p>

                        <p>
                            We strongly believe that education is a shared responsibility. As such, we value the partnership between the school, parents, guardians, and the wider community. When we work together with a common purpose, we create a strong foundation for our learners to thrive academically, morally, and socially. I encourage parents and guardians to remain actively involved in their children’s education, as your support plays a vital role in their success.
                        </p>

                        <p>
                            Dear students, never underestimate the power of education. Education is the key to unlocking your potential and shaping your future. Through education, we mould attitudes, character, behaviour, and understanding—qualities that define responsible citizens and future leaders. Remain disciplined, focused, and God-fearing, and always strive for excellence in all that you do.
                        </p>

                        <p>
                            Guided by our motto “For God and My Country,” Bugisu High School remains committed to nurturing learners who are not only knowledgeable but also ethical, patriotic, and ready to serve society with integrity.
                        </p>

                        <p className="signature-quote">
                            I warmly welcome you to Bugisu High School and invite you to be part of our journey as we continue to build a strong, vibrant, and forward-looking institution dedicated to transforming lives through education.
                        </p>

                        <div className="signature-area">
                            <div className="signature-line"></div>
                            <p className="signature-name">Mabonga Sam Mukholi</p>
                            <p className="signature-title">Headteacher, Bugisu High School</p>
                            <p className="signature-motto italic text-orange-600 mt-1">For God and My Country</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HeadteacherMessagePage;
