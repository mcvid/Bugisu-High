import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, Award, Users, Search } from 'lucide-react';
import AchievementWall from '../components/AchievementWall';
import SEO from '../components/SEO';
import './StudentLife.css';

const StudentLife = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    const categories = ['All', 'Academics', 'Sports', 'Arts', 'Leadership', 'Community'];

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('achievements')
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;
            setAchievements(data || []);
        } catch (error) {
            console.error('Error fetching achievements:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAchievements = filter === 'All'
        ? achievements
        : achievements.filter(item => item.category === filter);

    return (
        <div className="section container student-life-page">
            <SEO
                title="Student Life"
                description="Life at Bugisu High School: achievements, sports, clubs, and extracurricular activities that shape our students' future."
                url="/student-life"
            />
            <div className="page-header center">
                <span className="section-subtitle">CAMPUS LIFE</span>
                <h1>Student Life & Achievements</h1>
                <p className="page-subtitle">Celebrating excellence in academics, sports, and community service.</p>
                <div className="title-underline dodgerblue"></div>
            </div>

            {/* Featured Trophy Cabinet */}
            <AchievementWall />

            {/* Achievements Section */}
            <div className="achievements-section">
                {/* Filter Tabs */}
                <div className="filter-tabs">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`filter-tab ${filter === cat ? 'active' : ''}`}
                            onClick={() => setFilter(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading achievements...</p>
                    </div>
                ) : filteredAchievements.length === 0 ? (
                    <div className="empty-state">
                        <Award size={48} className="text-gray-300 mb-4" />
                        <p>No achievements found in this category yet.</p>
                    </div>
                ) : (
                    <div className="achievements-grid">
                        {filteredAchievements.map((item) => (
                            <div key={item.id} className="achievement-card">
                                <div
                                    className="achievement-image"
                                    style={{ backgroundImage: `url(${item.image_url || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80'})` }}
                                >
                                    <div className="category-tag">{item.category}</div>
                                </div>
                                <div className="achievement-content">
                                    <h3>{item.title}</h3>
                                    <div className="student-meta">
                                        <Users size={14} />
                                        <span>{item.student_name}</span>
                                    </div>
                                    <p className="description">{item.description}</p>
                                    <div className="date-footer">
                                        <Calendar size={14} />
                                        {new Date(item.date).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Clubs & Activities Preview (Placeholder for future) */}
            <section className="clubs-preview mt-16">
                <div className="text-center mb-8">
                    <h2>Clubs & Societies</h2>
                    <p className="text-gray-600">Bugisu High School offers a vibrant array of extra-curricular activities.</p>
                </div>
                <div className="clubs-grid">
                    <div className="club-card">
                        <h3>Science Club</h3>
                        <p>Exploring innovation and technology.</p>
                    </div>
                    <div className="club-card">
                        <h3>Debate Society</h3>
                        <p>Fostering critical thinking and public speaking.</p>
                    </div>
                    <div className="club-card">
                        <h3>Writers Club</h3>
                        <p>Creative writing and journalism.</p>
                    </div>
                    <div className="club-card">
                        <h3>Scripture Union</h3>
                        <p>Spiritual growth and community service.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default StudentLife;
