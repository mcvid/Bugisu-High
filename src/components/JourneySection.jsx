import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock } from 'lucide-react';
import './JourneySection.css';

const JourneySection = () => {
    return (
        <section className="journey-section">
            <div className="container journey-container">
                {/* Color pillars */}
                <div className="color-pillars">
                    {["pillar-blue", "pillar-green", "pillar-amber", "pillar-red"].map(
                        (colorClass, i) => (
                            <div
                                key={i}
                                className={`pillar ${colorClass}`}
                            />
                        ),
                    )}
                </div>

                {/* Main content */}
                <div className="journey-content">
                    <div className="journey-label-group">
                        <span className="journey-label">Our Story</span>
                        <div className="journey-line" />
                    </div>

                    <h2 className="journey-title">
                        The Journey Ahead
                    </h2>

                    <p className="journey-text">
                        Bugisu High School is committed to nurturing disciplined,
                        knowledgeable, and morally upright students. We provide quality secondary
                        education grounded in excellence and integrity while promoting leadership
                        and responsible citizenship. Our mission is not only to shape successful
                        learners but also to develop future leaders who positively impact their
                        communities, the nation, and the world.
                    </p>

                    <div className="journey-footer">
                        <Link
                            to="/about"
                            className="read-more-link"
                        >
                            Read more &rarr;
                        </Link>
                        <div className="footer-line" />
                    </div>
                </div>

                {/* Quick actions (right side) */}
                <aside className="journey-aside">
                    <div className="quick-access-box">
                        <span className="aside-label">Quick Access</span>

                        <Link
                            to="/contact"
                            className="aside-link"
                        >
                            <Phone size={20} />
                            <span>Contact Us</span>
                        </Link>

                        <Link
                            to="https://maps.app.goo.gl/uXYebSwMza8Gres77"
                            target="_blank"
                            className="aside-link"
                        >
                            <MapPin size={20} />
                            <span>Our Location</span>
                        </Link>

                        <Link
                            to="/about#history"
                            className="aside-link"
                        >
                            <Clock size={20} />
                            <span>School History</span>
                        </Link>
                    </div>
                </aside>
            </div>
        </section>
    );
};

export default JourneySection;
