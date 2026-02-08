import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GraduationCap, Trophy, BookOpen, CheckCircle2,
    ArrowRight, UserCheck, Star, Filter, Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import ScholarshipForm from '../components/admissions/ScholarshipForm';
import './Scholarships.css';

const Scholarships = () => {
    const [selectedYear, setSelectedYear] = useState('');
    const [yearOptions, setYearOptions] = useState([]);
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedScholarship, setSelectedScholarship] = useState(null);

    const beneficiaries = [
        {
            id: 1,
            name: "Musa Okello",
            title: "O-Level Bursary Recipient",
            description: "Musa achieved distinction in his PLE exams and has maintained top-tier academic performance throughout S.1 and S.2 through our Merit Scholarship.",
            image: "https://images.unsplash.com/photo-1523240715639-994ad08f9157?q=80&w=2070&auto=format&fit=crop",
            year: "Class of 2026",
        },
        {
            id: 2,
            name: "Sarah Namukasa",
            title: "Sports & Talent Scholar",
            description: "A star athlete on our football team, Sarah's dedication to both her sport and her studies earned her a full scholarship for her S-Level journey.",
            image: "https://images.unsplash.com/photo-1544717297-fa95b3ee51f3?q=80&w=2070&auto=format&fit=crop",
            year: "Class of 2025",
        },
    ];

    // Generate academic year options
    const generateYearOptions = () => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        let startYear = currentMonth < 6 ? currentYear - 1 : currentYear;
        const years = [];
        for (let i = 0; i < 3; i++) {
            const year = startYear + i;
            years.push(`${year}/${year + 1}`);
        }
        return years;
    };

    const fetchScholarships = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('scholarships')
                .select('*')
                .eq('is_active', true)
                .order('sort_order', { ascending: true });

            if (error) throw error;
            setScholarships(data || []);
        } catch (error) {
            console.error('Error fetching scholarships:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const years = generateYearOptions();
        setYearOptions(years);
        setSelectedYear(years[0]);
        fetchScholarships();
    }, []);

    const openApplyForm = (scholarship = null) => {
        setSelectedScholarship(scholarship);
        setShowForm(true);
    };

    return (
        <main className="scholarships-page-v2">
            <SEO
                title="Scholarships & Financial Aid"
                description="Apply for full bursaries, sports scholarships, and merit-based grants at Bugisu High School."
                url="/scholarships"
            />

            {/* Application Modal */}
            <AnimatePresence>
                {showForm && (
                    <div className="scholarship-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
                        <ScholarshipForm
                            scholarship={selectedScholarship}
                            onClose={() => setShowForm(false)}
                        />
                    </div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <section className="scholarship-hero">
                <div className="container hero-grid">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hero-content"
                    >
                        <div className="status-badge-compact">
                            <div className="pulse-dot" />
                            <span>Admissions 2026 Open</span>
                        </div>

                        <h1 className="hero-title-v2">
                            The smartest way to <span className="text-red">dodge </span><br />
                            <span className="fees-highlight">school fees </span> hustle
                        </h1>

                        <p className="hero-description">
                            We believe financial constraints shouldn't limit bright minds. Access full bursaries, sports scholarships, and merit-based grants designed for the next generation of leaders.
                        </p>

                        <div className="hero-actions">
                            <button className="btn-red-pill" onClick={() => openApplyForm()}>
                                Apply Now
                            </button>
                            <div className="learn-more-link" onClick={() => document.getElementById('categories').scrollIntoView({ behavior: 'smooth' })}>
                                <span>Learn More</span>
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="hero-image-v2"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"
                            alt="Bright student searching for scholarships"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Category Boxes */}
            <section className="category-section" id="categories">
                <div className="container">
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                            <Loader2 className="animate-spin text-red" size={40} />
                        </div>
                    ) : (
                        <div className="category-grid">
                            {scholarships.length > 0 ? (
                                scholarships.map((s) => (
                                    <motion.div
                                        whileHover={{ y: -10 }}
                                        key={s.id}
                                        className="category-card"
                                        onClick={() => openApplyForm(s)}
                                    >
                                        <div className={`icon-wrapper bg-${s.title.toLowerCase().includes('sport') ? 'blue' : s.title.toLowerCase().includes('a-level') ? 'green' : 'red'}-light`}>
                                            {s.title.toLowerCase().includes('sport') ? (
                                                <Trophy className="text-blue" size={28} />
                                            ) : s.title.toLowerCase().includes('a-level') ? (
                                                <GraduationCap className="text-green" size={28} />
                                            ) : (
                                                <BookOpen className="text-red" size={28} />
                                            )}
                                        </div>
                                        <h3 className="category-title">{s.title}</h3>
                                        <p className="category-desc">{s.description}</p>
                                        <div className="card-footer" style={{ cursor: 'pointer' }}>
                                            <span className="apply-text">Apply Now</span>
                                            <div className="arrow-circle">
                                                <ArrowRight size={14} />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                [
                                    { title: "O-Level Bursaries", icon: BookOpen, desc: "For bright P.7 leavers entering S.1 with exceptional results.", color: "red" },
                                    { title: "A-Level Merit", icon: GraduationCap, desc: "Scholarships for top performers in UCE entering S.5.", color: "green" },
                                    { title: "Sports & Talent", icon: Trophy, desc: "Rewarding exceptional skills in football, basketball, and more.", color: "blue" }
                                ].map((cat) => (
                                    <motion.div
                                        whileHover={{ y: -10 }}
                                        key={cat.title}
                                        className="category-card"
                                        onClick={() => openApplyForm({ title: cat.title })}
                                    >
                                        <div className={`icon-wrapper bg-${cat.color}-light`}>
                                            <cat.icon className={`text-${cat.color}`} size={28} />
                                        </div>
                                        <h3 className="category-title">{cat.title}</h3>
                                        <p className="category-desc">{cat.desc}</p>
                                        <div className="card-footer" style={{ cursor: 'pointer' }}>
                                            <span className={`apply-text text-${cat.color}`}>Apply</span>
                                            <div className="arrow-circle">
                                                <ArrowRight size={14} />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Year Filter Section */}
            <section className="year-filter-section">
                <div className="container">
                    <div className="filter-bar">
                        <div className="filter-label">
                            <Filter size={18} />
                            <span>Select Academic Year</span>
                        </div>
                        <div className="year-tabs">
                            {yearOptions.map(year => (
                                <button
                                    key={year}
                                    className={`year-tab ${selectedYear === year ? 'active' : ''}`}
                                    onClick={() => setSelectedYear(year)}
                                >
                                    {year}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Beneficiaries/Success Stories */}
            <section className="beneficiaries-section">
                <div className="container">
                    <div className="section-header">
                        <div className="title-area">
                            <h2 className="section-title">
                                Meet Our <span className="text-red">Scholars</span>
                            </h2>
                            <p className="section-subtitle">Beneficiaries</p>
                        </div>
                        <div className="stats-box">
                            <UserCheck className="text-green" size={24} />
                            <div className="stats-content">
                                <span className="stats-number">120+</span>
                                <span className="stats-label">Active Scholars</span>
                            </div>
                        </div>
                    </div>

                    <div className="beneficiaries-list">
                        {beneficiaries.map((b, i) => (
                            <div key={b.id} className={`beneficiary-item ${i % 2 === 1 ? 'reverse' : ''}`}>
                                <div className="beneficiary-image">
                                    <img src={b.image} alt={b.name} />
                                </div>
                                <div className="beneficiary-info">
                                    <div className="spotlight-badge">
                                        <Star className="text-yellow" size={16} />
                                        <span>Student Spotlight</span>
                                    </div>
                                    <h3 className="beneficiary-name">
                                        {b.name} <span className="beneficiary-year">{b.year}</span>
                                    </h3>
                                    <p className="beneficiary-role">{b.title}</p>
                                    <p className="beneficiary-quote">
                                        "{b.description}"
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works">
                <div className="gradient-bg" />
                <div className="container relative-z">
                    <div className="step-header">
                        <h2 className="white-title">How it works</h2>
                        <div className="red-divider" />
                    </div>

                    <div className="steps-grid">
                        {[
                            { step: "01", title: "Apply", desc: "Submit your application form with PLE or UCE results." },
                            { step: "02", title: "Review", desc: "Our committee evaluates academic and extra-curricular excellence." },
                            { step: "03", title: "Interview", desc: "Shortlisted candidates are invited for a professional panel interview." },
                            { step: "04", title: "Award", desc: "Successful candidates receive full or partial fee coverage." }
                        ].map((s) => (
                            <div key={s.title} className="step-item">
                                <span className="step-number">{s.step}</span>
                                <h4 className="step-title">{s.title}</h4>
                                <p className="step-desc">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="final-cta">
                <div className="cta-container">
                    <div className="cta-icon-bg">
                        <CheckCircle2 className="text-green" size={32} />
                    </div>
                    <h2 className="cta-title">
                        Ready to Join Bugisu High School?
                    </h2>
                    <p className="cta-text">
                        Take the first step towards a bright academic future. Apply for our 2026 scholarship program today.
                    </p>
                    <button className="btn-black-pill" onClick={() => openApplyForm()}>
                        Apply Now
                    </button>
                </div>
            </section>
        </main>
    );
};

export default Scholarships;
