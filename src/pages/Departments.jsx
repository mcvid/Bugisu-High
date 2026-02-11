import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Mail, Phone, GraduationCap, ChevronRight, Users } from "lucide-react";
import { supabase } from "../lib/supabase";
import Footer from "../components/Footer";
import ThreeDCarousel from "../components/academics/ThreeDCarousel";
import "./Departments.css";

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [expandedDept, setExpandedDept] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [deptsRes, subjectsRes, teachersRes, teacherSubjsRes] = await Promise.all([
                supabase.from("departments").select("*").order("sort_order", { ascending: true }),
                supabase.from("subjects").select("*").order("name"),
                supabase.from("teachers").select("*"), // Removed order temporarily to prevent crash if column missing
                supabase.from("teacher_subjects").select("teacher_id, subject_id, role")
            ]);

            if (deptsRes.error) throw new Error("Depts: " + deptsRes.error.message);
            if (subjectsRes.error) throw new Error("Subjects: " + subjectsRes.error.message);
            if (teachersRes.error) throw new Error("Teachers: " + teachersRes.error.message);
            if (teacherSubjsRes.error) throw new Error("TeacherSubjects: " + teacherSubjsRes.error.message);

            const transformedTeachers = (teachersRes.data || []).map(t => {
                const links = (teacherSubjsRes.data || []).filter(ts => ts.teacher_id === t.id);
                const roles = {};
                links.forEach(l => roles[l.subject_id] = l.role || 'teacher');

                return {
                    ...t,
                    subject_ids: links.map(ts => ts.subject_id),
                    subject_roles: roles
                };
            }).filter(t => t);

            setDepartments(deptsRes.data || []);
            setSubjects(subjectsRes.data || []);
            setTeachers(transformedTeachers);
        } catch (error) {
            console.error("Error fetching departments data:", error);
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    const selectedSubject = useMemo(() =>
        subjects.find(s => s.id === selectedSubjectId),
        [subjects, selectedSubjectId]);

    const filteredTeachers = useMemo(() => {
        let list = teachers;
        if (selectedSubjectId) {
            list = list.filter(t => t.subject_ids?.includes(selectedSubjectId));
        }
        if (searchQuery) {
            list = list.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        return list;
    }, [teachers, selectedSubjectId, searchQuery]);

    const activeHoD = useMemo(() =>
        filteredTeachers.find(t => t.role === 'hod'),
        [filteredTeachers]);

    const otherTeachers = useMemo(() =>
        filteredTeachers.filter(t => t.id !== activeHoD?.id),
        [filteredTeachers, activeHoD]);

    const uniqueSubjectsByDepartment = useMemo(() => {
        const groups = {};
        teachers.forEach(teacher => {
            if (teacher.department_id) {
                if (!groups[teacher.department_id]) {
                    groups[teacher.department_id] = new Set();
                }
                const teacherSubjs = subjects.filter(s => teacher.subject_ids?.includes(s.id));
                teacherSubjs.forEach(s => groups[teacher.department_id].add(JSON.stringify(s)));
            }
        });

        Object.keys(groups).forEach(deptId => {
            groups[deptId] = Array.from(groups[deptId]).map(s => JSON.parse(s));
        });
        return groups;
    }, [teachers, subjects]);

    if (loading) {
        return (
            <div className="departments-page flex items-center justify-center pt-24">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (errorMsg) {
        return (
            <div className="departments-page flex flex-col items-center justify-center pt-24 px-4 text-center">
                <div className="text-red-600 text-xl font-bold mb-4">Something went wrong!</div>
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg max-w-lg text-slate-800">
                    {errorMsg}
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-full text-sm font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <main className="departments-page pt-24">
            <div className="departments-container">

                {/* Desktop Sidebar */}
                <aside className="dept-sidebar">
                    <div className="sidebar-header">
                        <button
                            onClick={() => { setSelectedSubjectId(null); setExpandedDept(null); }}
                            className={`all-staff-btn ${!selectedSubjectId ? "active" : ""}`}
                        >
                            <Users size={18} />
                            <span>All Staff</span>
                        </button>
                    </div>

                    <div className="sidebar-content">
                        {departments.map(dept => {
                            const isExpanded = expandedDept === dept.id;
                            const selectedSubjObj = subjects.find(s => s.id === selectedSubjectId);
                            const isActive = selectedSubjObj && uniqueSubjectsByDepartment[dept.id]?.some(s => s.name === selectedSubjObj.name);

                            return (
                                <div key={dept.id} className="dept-nav-group">
                                    <button
                                        onClick={() => setExpandedDept(isExpanded ? null : dept.id)}
                                        className={`dept-nav-header ${isActive || isExpanded ? "active" : ""} ${isExpanded ? "expanded" : ""}`}
                                    >
                                        <h4>{dept.name}</h4>
                                        <ChevronRight
                                            size={20}
                                            className={`chevron-icon ${isExpanded ? "rotate" : ""}`}
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="subject-nav-list">
                                                    {uniqueSubjectsByDepartment[dept.id]?.map(subject => (
                                                        <button
                                                            key={subject.id}
                                                            onClick={() => setSelectedSubjectId(subject.id)}
                                                            className={`subject-nav-btn ${subjects.find(s => s.id === selectedSubjectId)?.name === subject.name ? "active" : ""}`}
                                                        >
                                                            {subjects.find(s => s.id === selectedSubjectId)?.name === subject.name && (
                                                                <motion.div
                                                                    layoutId="active-indicator"
                                                                    className="active-indicator"
                                                                />
                                                            )}
                                                            {subject.name}
                                                        </button>
                                                    ))}
                                                    {(!uniqueSubjectsByDepartment[dept.id] || uniqueSubjectsByDepartment[dept.id].length === 0) && (
                                                        <div className="empty-state" style={{ padding: '1rem', fontSize: '0.75rem' }}>No subjects listed</div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </aside>

                {/* Mobile Navigation */}
                <div className="mobile-nav">
                    <div className="mobile-dept-scroll no-scrollbar">
                        <button
                            onClick={() => { setSelectedSubjectId(null); setExpandedDept(null); }}
                            className={`mobile-dept-btn ${!selectedSubjectId ? "active" : ""}`}
                        >
                            All Staff
                        </button>
                        {departments.map(dept => {
                            const isExpanded = expandedDept === dept.id;
                            const selectedSubjObj = subjects.find(s => s.id === selectedSubjectId);
                            const isActive = (selectedSubjObj && uniqueSubjectsByDepartment[dept.id]?.some(s => s.name === selectedSubjObj.name)) || isExpanded;

                            return (
                                <button
                                    key={dept.id}
                                    onClick={() => setExpandedDept(expandedDept === dept.id ? null : dept.id)}
                                    className={`mobile-dept-btn ${isActive ? "active" : ""}`}
                                >
                                    {dept.name}
                                </button>
                            );
                        })}
                    </div>

                    <AnimatePresence>
                        {expandedDept && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mobile-subject-scroll no-scrollbar"
                            >
                                {uniqueSubjectsByDepartment[expandedDept]?.map(subject => (
                                    <button
                                        key={subject.id}
                                        onClick={() => setSelectedSubjectId(subject.id)}
                                        className={`mobile-subject-btn ${subjects.find(s => s.id === selectedSubjectId)?.name === subject.name ? "active" : ""}`}
                                    >
                                        {subject.name}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mobile-search-wrapper">
                        <div className="search-input-wrapper">
                            <Search className="search-icon" size={16} />
                            <input
                                type="text"
                                placeholder="Search teacher..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="dept-search-input"
                            />
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="departments-main">
                    <div className="content-inner">
                        {/* Desktop Search Bar */}
                        <div className="desktop-search search-section">
                            <div className="search-input-wrapper">
                                <Search className="search-icon" size={20} />
                                <input
                                    type="text"
                                    placeholder="Browse teachers by name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="dept-search-input"
                                />
                            </div>
                        </div>

                        <div className="main-content-results">
                            <AnimatePresence mode="wait">
                                {!selectedSubjectId ? (
                                    <motion.div
                                        key="all-leadership"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="results-section"
                                    >
                                        <div className="section-header">
                                            <h1 className="section-title">Academic Leadership</h1>
                                            <div className="title-underline" />
                                            <p className="section-subtitle">Heads of Departments</p>
                                        </div>

                                        <div className="all-departments-list" style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                                            {departments.map(dept => {
                                                const deptHods = teachers.filter(t => t.department_id === dept.id && t.role === 'hod');
                                                if (deptHods.length === 0) return null;

                                                return (
                                                    <div key={dept.id} className="dept-group-section">
                                                        <div className="dept-header-row" style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                                                            <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', color: 'var(--color-primary)' }}>
                                                                {dept.name}
                                                            </h2>
                                                        </div>

                                                        {/* Desktop Grid for HODs */}
                                                        <div className="desktop-only-grid" style={{
                                                            display: 'grid',
                                                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                                            gap: '2rem',
                                                            justifyItems: 'start'
                                                        }}>
                                                            {deptHods.map((teacher) => (
                                                                <div key={teacher.id} style={{ width: '100%', maxWidth: '400px' }}>
                                                                    <TeacherCard
                                                                        teacher={teacher}
                                                                        showRole={true}
                                                                        availableSubjects={subjects}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Mobile Carousel for HODs */}
                                                        <div className="mobile-only-carousel">
                                                            <ThreeDCarousel
                                                                items={deptHods.map((teacher) => (
                                                                    <TeacherCard
                                                                        key={teacher.id}
                                                                        teacher={teacher}
                                                                        showRole={true}
                                                                        availableSubjects={subjects}
                                                                    />
                                                                ))}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {teachers.filter(t => t.role === 'hod').length === 0 && (
                                                <div className="empty-state">
                                                    <p>No Academic Leaders assigned yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key={selectedSubjectId}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="results-section"
                                    >
                                        <div className="subject-header">
                                            <h1 className="subject-title">{selectedSubject?.name}</h1>
                                            <span className="hierarchy-badge">Academic Faculty</span>
                                        </div>

                                        {activeHoD && (
                                            <div className="hod-container">
                                                <span className="hod-label">Head of Subject</span>
                                                <TeacherCard teacher={activeHoD} isLarge showRole subjectName={selectedSubject?.name} />
                                                <div className="connector-line" />
                                            </div>
                                        )}

                                        <div className="staff-section">
                                            <span className="staff-label">Department Staff</span>
                                            {otherTeachers.length === 0 ? (
                                                <p className="empty-state">No other staff members listed for this subject yet.</p>
                                            ) : (
                                                <div className="teacher-grid">
                                                    {/* Mobile Carousel */}
                                                    <div className="mobile-only-carousel" style={{ gridColumn: '1 / -1' }}>
                                                        <ThreeDCarousel
                                                            items={otherTeachers.map((teacher) => (
                                                                <TeacherCard
                                                                    key={teacher.id}
                                                                    teacher={teacher}
                                                                    showRole={teacher.role === 'hod'}
                                                                    availableSubjects={subjects}
                                                                />
                                                            ))}
                                                        />
                                                    </div>

                                                    {/* Desktop Grid */}
                                                    {otherTeachers.map((teacher) => (
                                                        <div key={teacher.id} className="desktop-only-grid">
                                                            <TeacherCard teacher={teacher} availableSubjects={subjects} />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
};

const TeacherCard = ({ teacher, isLarge = false, showRole = false, subjectName, availableSubjects }) => {
    const teacherSubjNames = useMemo(() => {
        if (!availableSubjects) return [];
        const ids = teacher.subject_ids || (teacher.primary_subject_id ? [teacher.primary_subject_id] : []);
        const names = ids.map(id => availableSubjects.find(s => s.id === id)?.name).filter(Boolean);
        return [...new Set(names)];
    }, [teacher, availableSubjects]);

    const displaySubjects = subjectName || teacherSubjNames.join(" & ") || "Faculty";

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`staff-card ${isLarge ? "large-card" : ""}`}
        >
            <div className="staff-card-image">
                {teacher.image_url ? (
                    <img
                        src={teacher.image_url}
                        alt={teacher.name}
                    />
                ) : (
                    <div className="staff-placeholder">
                        <Users size={isLarge ? 64 : 48} />
                    </div>
                )}
            </div>

            <div className={`staff-card-body ${showRole ? 'hod-bg' : ''}`}>
                <div className="staff-info-header">
                    <span className="staff-subject-tag">
                        {showRole ? (displaySubjects ? `HOD ${displaySubjects}` : "Head of Department") : displaySubjects}
                    </span>
                    <h3 className="staff-name">
                        {teacher.title} {teacher.name}
                    </h3>
                </div>

                <div className="staff-details">
                    {teacher.qualification && (
                        <div className="staff-qualification">
                            <GraduationCap size={16} />
                            <span>{teacher.qualification}</span>
                        </div>
                    )}

                    <div className="staff-actions">
                        {teacher.email && (
                            <a href={`mailto:${teacher.email}`} className="staff-action-link">
                                <Mail size={14} />
                                <span className="staff-action-text">Email</span>
                            </a>
                        )}
                        {teacher.phone && (
                            <a href={`tel:${teacher.phone}`} className="staff-action-link">
                                <Phone size={14} />
                                <span className="staff-action-text">Call</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Departments;
