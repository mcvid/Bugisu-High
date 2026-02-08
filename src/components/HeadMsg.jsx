import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from 'lucide-react';
import './HeadMsg.css';

const HeadMsg = () => {
    return (
        <section className="head-msg-section">
            <div className="container head-msg-container">
                {/* Text content */}
                <div className="head-msg-content">
                    <div className="leadership-badge">
                        <div className="badge-line" />
                        <span className="badge-text">Leadership</span>
                    </div>

                    <h2 className="head-msg-title">
                        Message from the <span className="italic">Headteacher</span>
                    </h2>

                    <p className="head-msg-excerpt">
                        Praise the Lord! Welcome to Bugisu High School. We are dedicated to providing quality
                        education rooted in academic excellence, discipline, and strong Christian values. Our goal
                        is to nurture well-rounded students who are confident, responsible, and prepared to
                        succeed in both education and life. We value partnership with parents and the community
                        as we guide our learners toward a bright and purposeful future.
                    </p>

                    <div className="head-msg-footer">
                        <Book size={20} className="footer-icon" />
                        <Link
                            to="/about/headteacher-message"
                            className="read-more-link"
                        >
                            Read full message
                        </Link>
                    </div>
                </div>

                {/* Image / visual */}
                <div className="head-msg-visual">
                    <div className="image-wrapper group">
                        <div className="image-backdrop" />
                        <img
                            src="/hm.png"
                            alt="Headteacher - Mabonga Samuel"
                            className="headteacher-img"
                        />
                        {/* Hover overlay */}
                        <div className="image-overlay">
                            <span className="overlay-name">Mr. Mabonga Samuel</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeadMsg;
