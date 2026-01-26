import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Clubs.css';

const Clubs = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClubs();
    }, []);

    const fetchClubs = async () => {
        try {
            const { data } = await supabase
                .from('clubs')
                .select('*')
                .order('name');
            setClubs(data || []);
        } catch (error) {
            console.error('Error fetching clubs:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="clubs-page">
            {/* Hero Section */}
            <div className="clubs-hero">
                <div className="overlay"></div>
                <div className="hero-content container">
                    <h1>Student Clubs & Societies</h1>
                    <p>Discover your passion, build leadership skills, and make lifelong friends.</p>
                </div>
            </div>

            <div className="container section">
                <div className="section-header center">
                    <h2>Explore Our Community</h2>
                    <p>From debating to science, there's a place for everyone at Bugisu High.</p>
                </div>

                {loading ? (
                    <div className="loading-state">Loading clubs...</div>
                ) : (
                    <div className="clubs-grid">
                        {clubs.map(club => (
                            <div key={club.id} className="club-card">
                                <div className="club-image">
                                    {club.image_url ? (
                                        <img src={club.image_url} alt={club.name} />
                                    ) : (
                                        <div className="placeholder-club-img">
                                            <Users size={48} opacity={0.3} />
                                        </div>
                                    )}
                                </div>
                                <div className="club-content">
                                    <h3>{club.name}</h3>
                                    <p className="description">{club.description || 'No description available.'}</p>

                                    <div className="club-details">
                                        <div className="detail-item">
                                            <Calendar size={16} />
                                            <span>{club.meeting_day || 'Meeting times TBA'}</span>
                                        </div>
                                        {club.patron_name && (
                                            <div className="detail-item">
                                                <User size={16} />
                                                <span>Patron: {club.patron_name}</span>
                                            </div>
                                        )}
                                    </div>

                                    <button className="join-btn">
                                        Learn More <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {clubs.length === 0 && !loading && (
                    <div className="empty-state">
                        <Users size={64} />
                        <h3>No clubs currently listed</h3>
                        <p>Check back later for updates on student activities.</p>
                    </div>
                )}
            </div>

            <div className="call-to-action section-grey">
                <div className="container center">
                    <h2>Start Your Own Club?</h2>
                    <p>Have an idea for a new society? Reach out to the student council or administration to get started.</p>
                    <Link to="/contact" className="btn btn-primary">Contact Administration</Link>
                </div>
            </div>
        </div>
    );
};

export default Clubs;
