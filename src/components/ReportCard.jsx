import React from 'react';
import {
    BookOpen,
    TrendingUp,
    TrendingDown,
    Minus,
    CheckCircle2,
    AlertCircle,
    Calendar,
    User,
    Award,
    FileText,
    Activity
} from 'lucide-react';
import './ReportCard.css';

const ReportCard = ({ student, grades = [], metadata = {}, competencies = [], term, year }) => {
    // Basic stats
    const totalMarks = grades.reduce((sum, g) => sum + (g.marks || 0), 0);
    const average = grades.length ? (totalMarks / grades.length).toFixed(1) : 0;

    // Achievement Level Badge
    const getAchievementLevel = (avg) => {
        if (avg >= 80) return { label: 'Excellent', color: '#16a34a' };
        if (avg >= 70) return { label: 'Very Good', color: '#22c55e' };
        if (avg >= 50) return { label: 'Satisfactory', color: '#f59e0b' };
        return { label: 'Developing', color: '#ef4444' };
    };

    const achievement = getAchievementLevel(parseFloat(average));

    // Progress Indicator Icon
    const getProgressIcon = (grade) => {
        if (['A', 'B'].includes(grade)) return <TrendingUp size={16} color="#16a34a" />;
        if (['F'].includes(grade)) return <TrendingDown size={16} color="#ef4444" />;
        return <Minus size={16} color="#94a3b8" />;
    };

    return (
        <div className="modern-report-container">
            {/* 2. Header / Student Summary */}
            <header className="report-v2-header card">
                <div className="header-accent" style={{ backgroundColor: achievement.color }}></div>
                <div className="header-main">
                    <div className="student-basic-info">
                        <h1 className="student-name">{student.student_name}</h1>
                        <div className="meta-grid">
                            <span><strong>Reg No:</strong> {student.student_reg_number}</span>
                            <span><strong>Class:</strong> {student.class_grade}</span>
                            <span><strong>Term:</strong> {term} {year}</span>
                            <span><strong>Curriculum:</strong> CBC</span>
                        </div>
                    </div>
                    <div className="achievement-badge-container desktop-only">
                        <span className="badge-label">Overall Achievement</span>
                        <div className="achievement-badge" style={{ backgroundColor: achievement.color + '15', color: achievement.color }}>
                            <Award size={20} />
                            {achievement.label}
                        </div>
                    </div>
                </div>
            </header>

            {/* 3. Academic Performance Section */}
            <section className="report-section">
                <div className="section-header">
                    <BookOpen size={20} className="text-orange" />
                    <div>
                        <h2>Academic Performance</h2>
                        <p>Term-based subject results</p>
                    </div>
                </div>

                <div className="subject-cards-grid swipable-container">
                    {grades.map((grade) => (
                        <div key={grade.id} className="subject-card">
                            <div className="subject-header">
                                <h3>{grade.subjects?.name || 'Unknown Subject'}</h3>
                                <span className="teacher-name">{grade.teacher_name || 'Class Teacher'}</span>
                            </div>

                            <div className="score-row">
                                <div className="score-block">
                                    <span className="score-value">{grade.marks}%</span>
                                    <span className="score-grade">Grade {grade.grade}</span>
                                </div>
                                <div className="progress-indicator">
                                    {getProgressIcon(grade.grade)}
                                </div>
                            </div>

                            <div className="teacher-comment">
                                <p>{grade.teacher_comment || 'Good progress this term.'}</p>
                            </div>
                        </div>
                    ))}
                    {grades.length === 0 && (
                        <div className="empty-state">No subject results found.</div>
                    )}
                </div>
            </section>

            {/* 4. Skills & Competencies Section */}
            <section className="report-section">
                <div className="section-header">
                    <Activity size={20} className="text-orange" />
                    <div>
                        <h2>Skills & Competencies</h2>
                        <p>Behavioral & core competency assessment</p>
                    </div>
                </div>

                <div className="competencies-grid">
                    {(competencies.length > 0 ? competencies : [
                        { skill_name: 'Communication', achievement_level: 'Meets Expectations' },
                        { skill_name: 'Critical Thinking', achievement_level: 'Approaching Expectations' },
                        { skill_name: 'Collaboration', achievement_level: 'Meets Expectations' },
                        { skill_name: 'Creativity', achievement_level: 'Needs Support' }
                    ]).map((comp, idx) => (
                        <div key={idx} className="skill-card">
                            <span className="skill-name">{comp.skill_name}</span>
                            <div className="competency-bar-container">
                                <div className="competency-steps">
                                    {['Needs Support', 'Approaching Expectations', 'Meets Expectations', 'Exceeds Expectations'].map(level => (
                                        <div
                                            key={level}
                                            className={`comp-step ${comp.achievement_level === level ? 'active' : ''}`}
                                            title={level}
                                        ></div>
                                    ))}
                                </div>
                                <span className="current-level-text">{comp.achievement_level}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. Attendance & Conduct Section */}
            <section className="report-two-col">
                <div className="summary-card card">
                    <div className="card-icon-header">
                        <Calendar size={20} className="text-orange" />
                        <h3>Attendance</h3>
                    </div>
                    <div className="attendance-stats">
                        <div className="stat-item">
                            <span className="stat-value">{metadata.attendance_present || 0}</span>
                            <span className="stat-label">Days Present</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{metadata.attendance_total - (metadata.attendance_present || 0)}</span>
                            <span className="stat-label">Days Absent</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">
                                {Math.round(((metadata.attendance_present || 0) / (metadata.attendance_total || 90)) * 100)}%
                            </span>
                            <span className="stat-label">Percentage</span>
                        </div>
                    </div>
                </div>

                <div className="summary-card card">
                    <div className="card-icon-header">
                        <User size={20} className="text-orange" />
                        <h3>Conduct & Responsibility</h3>
                    </div>
                    <div className="conduct-grid">
                        <div className="conduct-item">
                            <span className="label">Behavior</span>
                            <span className="value">{metadata.conduct_rating || 'Satisfactory'}</span>
                        </div>
                        <div className="conduct-item">
                            <span className="label">Punctuality</span>
                            <span className="value">{metadata.punctuality_rating || 'Good'}</span>
                        </div>
                        <div className="conduct-item">
                            <span className="label">Responsibility</span>
                            <span className="value">{metadata.responsibility_rating || 'Improving'}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Teacher & School Remarks */}
            <section className="report-section">
                <div className="remarks-stack">
                    <div className="remark-card card">
                        <h4>Class Teacher's Remark</h4>
                        <p>{metadata.teacher_remark || 'A determined student with a positive attitude. Keep it up!'}</p>
                    </div>
                    <div className="remark-card card">
                        <h4>Head Teacher's Remark</h4>
                        <p>{metadata.headteacher_remark || 'Encouraging results. Focus more on technical subjects next term.'}</p>
                    </div>
                </div>
            </section>

            {/* 8. Parent Acknowledgement */}
            <footer className="report-v2-footer">
                <div className="acknowledgement card">
                    <CheckCircle2 size={18} color="#94a3b8" />
                    <span>Parent Acknowledgement: {metadata.viewed_at ? `Viewed on ${new Date(metadata.viewed_at).toLocaleDateString()}` : 'Pending Review'}</span>
                </div>
            </footer>
        </div>
    );
};

export default ReportCard;
