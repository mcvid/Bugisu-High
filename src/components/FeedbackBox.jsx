import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X, Send, ThumbsUp, HelpCircle, AlertTriangle } from 'lucide-react';
import './FeedbackBox.css';

const FeedbackBox = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState('general'); // general, q_and_a, complaint
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let finalMessage = formData.message;
            if (type === 'q_and_a' && formData.date && formData.time) {
                finalMessage = `[REQUESTED SESSION]\nDate: ${formData.date}\nTime: ${formData.time}\n\n[TOPIC]\n${formData.message}`;
            }

            const { error } = await supabase
                .from('feedback')
                .insert([{
                    name: formData.name,
                    email: formData.email,
                    message: finalMessage,
                    type,
                    status: 'new'
                }]);

            if (error) throw error;
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setIsOpen(false);
                setFormData({ name: '', email: '', message: '', date: '', time: '' });
                setType('general');
            }, 3000);

        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Failed to submit. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Visibility logic
    const priorityPaths = ['/admissions', '/apply', '/contact'];
    const isPriorityPath = priorityPaths.some(path => location.pathname === path);
    const isHome = location.pathname === '/';

    // Hide on mobile if not priority or home
    const isVisibleOnMobile = isPriorityPath || isHome;

    if (!isOpen) {
        return (
            <button
                className={`feedback-trigger ${!isVisibleOnMobile ? 'mobile-hidden' : ''}`}
                onClick={() => setIsOpen(true)}
            >
                Feedback
            </button>
        );
    }

    return (
        <div className="feedback-modal-overlay">
            <div className="feedback-modal">
                <button className="close-btn" onClick={() => setIsOpen(false)}>
                    <X size={20} />
                </button>

                {success ? (
                    <div className="feedback-success">
                        <div className="success-icon">
                            <ThumbsUp size={40} />
                        </div>
                        <h3>Thank You!</h3>
                        <p>We appreciate your feedback. We'll review it shortly.</p>
                    </div>
                ) : (
                    <>
                        <div className="feedback-header">
                            <h3>We value your input</h3>
                            <p>Help us improve or ask a question.</p>
                        </div>

                        <div className="feedback-types">
                            <button
                                type="button"
                                className={`type-btn ${type === 'general' ? 'active' : ''}`}
                                onClick={() => setType('general')}
                            >
                                <ThumbsUp size={16} /> Suggestion
                            </button>
                            <button
                                type="button"
                                className={`type-btn ${type === 'q_and_a' ? 'active' : ''}`}
                                onClick={() => setType('q_and_a')}
                            >
                                <HelpCircle size={16} /> Q & A
                            </button>
                            <button
                                type="button"
                                className={`type-btn ${type === 'complaint' ? 'active' : ''}`}
                                onClick={() => setType('complaint')}
                            >
                                <AlertTriangle size={16} /> Issue
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Your Name (Optional)"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="email"
                                    placeholder="Email (Required for reply)"
                                    required={type === 'q_and_a'}
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            {type === 'q_and_a' && (
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Preferred Date</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.date || ''}
                                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Preferred Time</label>
                                        <input
                                            type="time"
                                            required
                                            value={formData.time || ''}
                                            onChange={e => setFormData({ ...formData, time: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <textarea
                                    placeholder={type === 'q_and_a' ? "What specific topics would you like to discuss?" : "Tell us what you think..."}
                                    required
                                    rows={4}
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Sending...' : (type === 'q_and_a' ? 'Request Session' : 'Send Feedback')} <Send size={16} />
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default FeedbackBox;
