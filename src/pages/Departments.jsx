import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Mail, Phone, GraduationCap, ChevronRight, Users } from "lucide-react";
import { supabase } from "../lib/supabase";
import Footer from "../components/Footer";
import StaffCarousel from "../components/academics/StaffCarousel";
import "./Departments.css";

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [expandedDept, setExpandedDept] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [deptsRes, subjectsRes, teachersRes, teacherSubjsRes] = await Promise.all([
                supabase.from("departments").select("*").order("sort_order"),
                supabase.from("subjects").select("*").order("name"),
                supabase.from("teachers").select("*").order("hierarchy_order"),
                supabase.from("teacher_subjects").select("teacher_id, subject_id, role")
            ]);

            if (deptsRes.error) throw deptsRes.error;
            if (subjectsRes.error) throw subjectsRes.error;
            if (teachersRes.error) throw teachersRes.error;
            if (teacherSubjsRes.error) throw teacherSubjsRes.error;

            const transformedTeachers = (teachersRes.data || []).map(t => {
                const links = (teacherSubjsRes.data || []).filter(ts => ts.teacher_id === t.id);
                const roles = {};
                links.forEach(l => roles[l.subject_id] = l.role || 'teacher');

                return {
                    ...t,
                    subject_ids: links.map(ts => ts.subject_id),
                    subject_roles: roles
                };
            }).filter(t => t.id !== 'e376b0f7-ab4f-453f-9a1c-fa409e206c10');

            setDepartments(deptsRes.data || []);
            setSubjects(subjectsRes.data || []);
            setTeachers(transformedTeachers);
        } catch (error) {
            console.error("Error fetching departments data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filtered lists
    const filteredTeachers = useMemo(() => {
        let result = teachers;
        if (selectedSubjectId) {
            const selectedSubject = subjects.find(s => s.id === selectedSubjectId);
            if (selectedSubject) {
                result = result.filter(t => {
                    const teacherSubjectIds = t.subject_ids || (t.primary_subject_id ? [t.primary_subject_id] : []);
                    return teacherSubjectIds.some(sid => {
                        const s = subjects.find(sub => sub.id === sid);
                        return s?.name === selectedSubject.name;
                    });
                });
            }
        }
        if (searchQuery) {
            result = result.filter(t =>
                t.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return result;
    }, [teachers, selectedSubjectId, searchQuery, subjects]);

    // Grouping for HoD view (when no subject is selected)
    const hods = useMemo(() => {
        return teachers.filter(t => t.role?.toLowerCase() === 'hod');
    }, [teachers]);

    const uniqueSubjectsByDepartment = useMemo(() => {
        const grouped = {};
        subjects.forEach(s => {
            if (!grouped[s.department_id]) grouped[s.department_id] = [];
            if (!grouped[s.department_id].some(ext => ext.name === s.name)) {
                grouped[s.department_id].push(s);
            }
        });
        return grouped;
    }, [subjects]);

    const selectedSubject = useMemo(() =>
        subjects.find(s => s.id === selectedSubjectId),
        [subjects, selectedSubjectId]);

    const activeHoD = useMemo(() => {
        if (!selectedSubject) return null;
        return filteredTeachers.find(t => {
            if (!t.subject_roles) return false;
            const matchingSubjectIds = subjects
                .filter(s => s.name === selectedSubject.name)
                .map(s => s.id);
            return matchingSubjectIds.some(sid => t.subject_roles?.[sid] === 'hod');
        });
    }, [selectedSubject, filteredTeachers, subjects]);

    const otherTeachers = useMemo(() => {
        if (!selectedSubject) return [];
        const hodId = activeHoD?.id;
        return filteredTeachers.filter(t => t.id !== hodId);
    }, [selectedSubject, filteredTeachers, activeHoD]);

    if (loading) {
        return (
            <div className="departments-page flex items-center justify-center pt-24">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin" />
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
                                        key="all-hods"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="results-section"
                                    >
                                        <div className="section-header">
                                            <h1 className="section-title">Academic Heads</h1>
                                            <div className="title-underline" />
                                        </div>

                                        <div className="teacher-grid">
                                            {/* Mobile Carousel */}
                                            <div className="lg:hidden" style={{ gridColumn: '1 / -1' }}>
                                                <StaffCarousel
                                                    items={hods.map((teacher) => {
                                                        const primarySubj = subjects.find(s => s.id === teacher.primary_subject_id)?.name;
                                                        return <TeacherCard key={teacher.id} teacher={teacher} showRole subjectName={primarySubj} availableSubjects={subjects} />;
                                                    })}
                                                />
                                            </div>

                                            {/* Desktop Grid */}
                                            {hods.map((teacher) => {
                                                const primarySubj = subjects.find(s => s.id === teacher.primary_subject_id)?.name;
                                                return (
                                                    <div key={teacher.id} className="hidden lg:block">
                                                        <TeacherCard teacher={teacher} showRole subjectName={primarySubj} availableSubjects={subjects} />
                                                    </div>
                                                );
                                            })}
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
                                                    <div className="lg:hidden" style={{ gridColumn: '1 / -1' }}>
                                                        <StaffCarousel
                                                            items={otherTeachers.map((teacher) => (
                                                                <TeacherCard key={teacher.id} teacher={teacher} availableSubjects={subjects} />
                                                            ))}
                                                        />
                                                    </div>

                                                    {/* Desktop Grid */}
                                                    {otherTeachers.map((teacher) => (
                                                        <div key={teacher.id} className="hidden lg:block">
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
