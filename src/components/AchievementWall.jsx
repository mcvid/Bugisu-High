import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Award, Trophy, Star, Medal } from 'lucide-react';
import './AchievementWall.css';

const AchievementWall = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const { data } = await supabase
                .from('achievements')
                .select('*')
                .eq('is_featured', true)
                .order('created_at', { ascending: false });
            setAchievements(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="trophy-cabinet">
            <div className="cabinet-header center">
                <Trophy size={48} className="gold-icon" />
                <h2>Wall of Fame</h2>
                <p>Honoring our most outstanding performers and victories.</p>
            </div>

            <div className="cabinet-shelves">
                {loading ? (
                    <div className="loading-shelf">Loading treasures...</div>
                ) : achievements.length === 0 ? (
                    <div className="empty-shelf">
                        <p>No trophies yet. Excellence is loading...</p>
                    </div>
                ) : (
                    <div className="shelf-grid">
                        {achievements.map((item, index) => (
                            <div
                                key={item.id}
                                className="trophy-item"
                                onClick={() => setSelectedItem(item)}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="trophy-icon-wrapper">
                                    {item.category === 'Sports' ? <Trophy size={32} /> :
                                        item.category === 'Arts' ? <Star size={32} /> :
                                            <Medal size={32} />}
                                    <div className="shine"></div>
                                </div>
                                <div className="plaque">
                                    <h4>{item.achievement_title}</h4>
                                    <span className="year">{new Date(item.achievement_date).getFullYear()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal for Details */}
            {selectedItem && (
                <div className="trophy-modal-overlay" onClick={() => setSelectedItem(null)}>
                    <div className="trophy-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-top-bar">
                            <span className="category-badge">{selectedItem.category}</span>
                            <button onClick={() => setSelectedItem(null)} className="close-x">×</button>
                        </div>
                        <div className="trophy-modal-content">
                            {selectedItem.image_url && (
                                <div className="trophy-image">
                                    <img src={selectedItem.image_url} alt={selectedItem.achievement_title} />
                                </div>
                            )}
                            <h3>{selectedItem.achievement_title}</h3>
                            <p className="recipient">Awarded to: <strong>{selectedItem.student_name}</strong></p>
                            <p className="description">{selectedItem.description}</p>
                            <span className="date">Date: {new Date(selectedItem.achievement_date).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AchievementWall;
