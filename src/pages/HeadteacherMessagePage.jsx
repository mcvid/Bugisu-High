import React from 'react';
import { Quote } from 'lucide-react';
import './HeadteacherMessagePage.css';

const HeadteacherMessagePage = () => {
    return (
        <div className="headteacher-page">
            {/* Header Area */}
            <header className="page-header-banner">
                <div className="container">
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
                                    src="/hm.png"
                                    alt="Mr. Mabonga Samuel - Headteacher"
                                    className="main-hm-image"
                                />
                                <div className="image-caption">
                                    <h3>Mr. Mabonga Samuel</h3>
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
                        <div className="message-body">
                            <p className="highlight-text">
                                "Praise the Lord! Welcome to Bugisu High School."
                            </p>

                            <p>
                                We are dedicated to providing quality education rooted in academic excellence, discipline, and strong Christian values. Our goal is to nurture well-rounded students who are confident, responsible, and capable of making meaningful contributions to society.
                            </p>

                            <p>
                                At Bugisu High School, we emphasize both academic achievement and personal growth. We provide a supportive and inclusive environment where every student is encouraged to explore their potential, develop critical thinking skills, and pursue their passions. Our experienced staff are committed to guiding students not only in their studies but also in character development, ensuring they embody integrity, respect, and compassion in all aspects of life.
                            </p>

                            <p>
                                We also offer a rich variety of programs, extracurricular activities, and leadership opportunities designed to prepare our students for the challenges of the modern world while keeping them grounded in Christian principles. By fostering a culture of excellence, curiosity, and ethical responsibility, we aim to equip our students with the knowledge, skills, and confidence they need to succeed academically, socially, and spiritually.
                            </p>

                            <p>
                                We warmly invite you to explore our school, join our learning community, and become part of a tradition of excellence, faith, and holistic development.
                            </p>

                            <p className="signature-quote">
                                May your time with us be fruitful and inspiring.
                            </p>

                            <div className="signature-area">
                                <div className="signature-line"></div>
                                <p className="signature-name">Mr. Mabonga Samuel</p>
                                <p className="signature-title">Headteacher, Bugisu High School</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HeadteacherMessagePage;
