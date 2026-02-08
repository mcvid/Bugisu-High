import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, CheckCircle2, Trophy, GraduationCap, Phone, User, Calendar, BookOpen, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ScholarshipForm = ({ scholarship, onClose }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        student_name: '',
        date_of_birth: '',
        gender: 'Male',
        email: '',
        phone: '',
        previous_school: '',
        category: scholarship?.title?.toLowerCase().includes('sport') ? 'Sports' : 'Academics',
        // Dynamic data fields
        sports_type: '',
        achievements: '',
        coach_contact: '',
        ple_aggregates: '',
        uce_aggregates: '',
        hobbies: '',
        reasons: ''
    });

    const categories = [
        { id: 'Academics', icon: GraduationCap, label: 'Academic Merit' },
        { id: 'Sports', icon: Trophy, label: 'Sports & Talent' },
        { id: 'Other', icon: Star, label: 'Other' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare dynamic data based on category
            const categoryData = {};
            if (formData.category === 'Sports') {
                categoryData.sports_type = formData.sports_type;
                categoryData.achievements = formData.achievements;
                categoryData.coach_contact = formData.coach_contact;
            } else if (formData.category === 'Academics') {
                categoryData.ple_aggregates = formData.ple_aggregates;
                categoryData.uce_aggregates = formData.uce_aggregates;
            } else {
                categoryData.hobbies = formData.hobbies;
                categoryData.reasons = formData.reasons;
            }

            const submission = {
                scholarship_id: scholarship?.id || null,
                category: formData.category,
                student_name: formData.student_name,
                date_of_birth: formData.date_of_birth,
                gender: formData.gender,
                email: formData.email,
                phone: formData.phone,
                previous_school: formData.previous_school,
                data: categoryData,
                status: 'pending'
            };

            const { error } = await supabase.from('scholarship_applications').insert([submission]);
            if (error) throw error;

            setSuccess(true);
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('Failed to submit application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="scholarship-form-success"
            >
                <div className="success-icon-wrapper">
                    <CheckCircle2 size={64} className="text-green" />
                </div>
                <h2>Application Submitted!</h2>
                <p>Your application for the <strong>{scholarship?.title || formData.category}</strong> has been received successfully. Our team will review it and contact you soon.</p>
                <button className="btn-red-pill" onClick={onClose}>Close Window</button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="scholarship-form-container"
        >
            <div className="form-header-v2">
                <div className="header-text">
                    <span className="form-badge">Scholarship Application</span>
                    <h2>{scholarship?.title || 'Apply Now'}</h2>
                    <p>Academic Year: {scholarship?.academic_year || '2026/2027'}</p>
                </div>
                <button className="close-btn" onClick={onClose}>
                    <X size={24} />
                </button>
            </div>

            <div className="form-progress">
                <div className={`progress-dot ${step >= 1 ? 'active' : ''}`} />
                <div className={`progress-line ${step >= 2 ? 'active' : ''}`} />
                <div className={`progress-dot ${step >= 2 ? 'active' : ''}`} />
            </div>

            <form onSubmit={handleSubmit} className="scholarship-main-form">
                {step === 1 ? (
                    <div className="form-step">
                        <h3><User size={20} /> Personal Information</h3>
                        <div className="form-grid-v2">
                            <div className="form-group-v2">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    name="student_name"
                                    required
                                    value={formData.student_name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div className="form-row-v2">
                                <div className="form-group-v2">
                                    <label>Date of Birth *</label>
                                    <input
                                        type="date"
                                        name="date_of_birth"
                                        required
                                        value={formData.date_of_birth}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group-v2">
                                    <label>Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange}>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row-v2">
                                <div className="form-group-v2">
                                    <label>Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+256..."
                                    />
                                </div>
                                <div className="form-group-v2">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="johndoe@example.com"
                                    />
                                </div>
                            </div>
                            <div className="form-group-v2">
                                <label>Previous/Current School *</label>
                                <input
                                    type="text"
                                    name="previous_school"
                                    required
                                    value={formData.previous_school}
                                    onChange={handleChange}
                                    placeholder="Name of your previous school"
                                />
                            </div>
                        </div>
                        <div className="form-actions-v2">
                            <button type="button" className="btn-black-pill" onClick={() => setStep(2)}>
                                Next Step
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="form-step">
                        <h3><GraduationCap size={20} /> Scholarship Details</h3>

                        {!scholarship && (
                            <div className="category-selector">
                                <label>Select Category</label>
                                <div className="category-options">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            className={`cat-opt ${formData.category === cat.id ? 'active' : ''}`}
                                            onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                                        >
                                            <cat.icon size={20} />
                                            <span>{cat.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="form-grid-v2">
                            {formData.category === 'Sports' ? (
                                <>
                                    <div className="form-group-v2">
                                        <label>Specific Sport (e.g., Football, Netball) *</label>
                                        <input
                                            type="text"
                                            name="sports_type"
                                            required
                                            value={formData.sports_type}
                                            onChange={handleChange}
                                            placeholder="What sport do you excel in?"
                                        />
                                    </div>
                                    <div className="form-group-v2">
                                        <label>Notable Achievements *</label>
                                        <textarea
                                            name="achievements"
                                            required
                                            value={formData.achievements}
                                            onChange={handleChange}
                                            placeholder="List your medals, awards or teams you've played for"
                                        />
                                    </div>
                                    <div className="form-group-v2">
                                        <label>Coach or School Reference Contact *</label>
                                        <input
                                            type="text"
                                            name="coach_contact"
                                            required
                                            value={formData.coach_contact}
                                            onChange={handleChange}
                                            placeholder="Phone or Name of your coach"
                                        />
                                    </div>
                                </>
                            ) : formData.category === 'Academics' ? (
                                <>
                                    <div className="form-row-v2">
                                        <div className="form-group-v2">
                                            <label>PLE Aggregates (if for S.1)</label>
                                            <input
                                                type="number"
                                                name="ple_aggregates"
                                                value={formData.ple_aggregates}
                                                onChange={handleChange}
                                                placeholder="e.g., 4"
                                            />
                                        </div>
                                        <div className="form-group-v2">
                                            <label>UCE Aggregates (if for S.5)</label>
                                            <input
                                                type="number"
                                                name="uce_aggregates"
                                                value={formData.uce_aggregates}
                                                onChange={handleChange}
                                                placeholder="e.g., 10"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group-v2">
                                        <label>Other Academic Achievements</label>
                                        <textarea
                                            name="achievements"
                                            value={formData.achievements}
                                            onChange={handleChange}
                                            placeholder="List any other relevant medals or awards"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="form-group-v2">
                                        <label>Hobbies & Talents</label>
                                        <input
                                            type="text"
                                            name="hobbies"
                                            value={formData.hobbies}
                                            onChange={handleChange}
                                            placeholder="Music, Art, Debate, etc."
                                        />
                                    </div>
                                    <div className="form-group-v2">
                                        <label>Why do you deserve this scholarship? *</label>
                                        <textarea
                                            name="reasons"
                                            required
                                            value={formData.reasons}
                                            onChange={handleChange}
                                            placeholder="Tell us about your background and goals"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="form-actions-v2">
                            <button type="button" className="btn-outline-pill" onClick={() => setStep(1)}>
                                Back
                            </button>
                            <button type="submit" className="btn-red-pill" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </motion.div>
    );
};

export default ScholarshipForm;
