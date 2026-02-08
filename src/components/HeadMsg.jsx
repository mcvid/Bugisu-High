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
                        I am deeply honoured to serve as the Headteacher of Bugisu High School, an institution with a strong heritage and clear mission. We are dedicated to nurturing academically competent, morally upright, and socially responsible citizens. At Bugisu High School, we believe true education goes beyond examination success—valuing character formation, discipline, and spiritual growth alongside academic excellence.
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
                            src="/images/students/hm.jpeg?v=2"
                            alt="Headteacher - Mabonga Sam Mukholi"
                            className="headteacher-img"
                        />
                        {/* Hover overlay */}
                        <div className="image-overlay">
                            <span className="overlay-name">Mabonga Sam Mukholi</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeadMsg;
