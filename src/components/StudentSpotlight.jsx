import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Award, Calendar, ChevronRight } from 'lucide-react';
import './StudentSpotlight.css';

const StudentSpotlight = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            // Get top 3 most recent achievements
            const { data, error } = await supabase
                .from('achievements')
                .select('*')
                .order('date', { ascending: false })
                .limit(3);

            if (error) throw error;
            setAchievements(data || []);
        } catch (error) {
            console.error('Error fetching achievements:', error);
            // Don't show error to user, just hide section if empty
        } finally {
            setLoading(false);
        }
    };

    if (loading || achievements.length === 0) return null;

    return (
        <section className="section bg-light spotlight-section">
            <div className="container">
                <div className="section-header text-center">
                    <span className="section-badge">Student Success</span>
                    <h2>Achievements Spotlight</h2>
                    <p>Celebrating the remarkable accomplishments of our students.</p>
                </div>

                <div className="spotlight-grid">
                    {achievements.map((item) => (
                        <div key={item.id} className="spotlight-card">
                            <div
                                className="spotlight-image"
                                style={{ backgroundImage: `url(${item.image_url || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80'})` }}
                            >
                                <div className="spotlight-category">{item.category}</div>
                            </div>
                            <div className="spotlight-content">
                                <h3>{item.title}</h3>
                                <div className="spotlight-meta">
                                    <span className="student-name">{item.student_name}</span>
                                    <span className="meta-separator">•</span>
                                    <span className="achievement-date">
                                        <Calendar size={14} />
                                        {new Date(item.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-3">
                    <a href="/student-life" className="btn-link">
                        View All Achievements <ChevronRight size={16} />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default StudentSpotlight;
