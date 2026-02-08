import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, Upload, Plus, Pencil, X, Save, Users as UsersIcon, Mail, Phone, Filter } from 'lucide-react';

const TeachersManager = () => {
    const [teachers, setTeachers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(null);

    // Smart Connect State
    const [selectedSubjects, setSelectedSubjects] = useState(new Set());
    const [filterDepartmentId, setFilterDepartmentId] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        title: 'Mr.',
        role: 'teacher',
        department_id: '',
        primary_subject_id: '',
        qualification: '',
        email: '',
        phone: '',
        image_url: '',
        hierarchy_order: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [t, d, s] = await Promise.all([
                supabase.from('teachers').select('*, teacher_subjects(subject_id)').order('hierarchy_order', { ascending: true }),
                supabase.from('departments').select('*').order('name', { ascending: true }),
                supabase.from('subjects').select('*').order('name', { ascending: true })
            ]);

            if (t.data) setTeachers(t.data);
            if (d.data) setDepartments(d.data);
            if (s.data) setSubjects(s.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `teachers/${fileName}`;

            const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
            setFormData({ ...formData, image_url: publicUrl });

        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Upload failed!');
        } finally {
            setUploading(false);
        }
    };

    const handleSubjectToggle = (subjectId) => {
        const newSelected = new Set(selectedSubjects);
        if (newSelected.has(subjectId)) {
            newSelected.delete(subjectId);
            // If we remove the primary subject, unset it
            if (formData.primary_subject_id === subjectId) {
                setFormData({ ...formData, primary_subject_id: '' });
            }
        } else {
            newSelected.add(subjectId);
            // If it's the first subject selected, standard UX is to make it primary automatically
            if (newSelected.size === 1) {
                setFormData({ ...formData, primary_subject_id: subjectId });
            }
        }
        setSelectedSubjects(newSelected);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) return;

        try {
            // 1. Save Teacher Profile
            const primarySubjName = subjects.find(s => s.id === formData.primary_subject_id)?.name || '';
            const dataToSave = { ...formData, subject: primarySubjName };
            let teacherId = isEditing;

            if (isEditing) {
                const { error } = await supabase
                    .from('teachers')
                    .update(dataToSave)
                    .eq('id', isEditing);
                if (error) throw error;
            } else {
                const { data, error } = await supabase
                    .from('teachers')
                    .insert([dataToSave])
                    .select()
                    .single();
                if (error) throw error;
                teacherId = data.id;
            }

            // 2. Sync Logic (Teacher Subjects Join Table)
            // First, clear existing connections for this teacher
            const { error: deleteError } = await supabase
                .from('teacher_subjects')
                .delete()
                .eq('teacher_id', teacherId);
            if (deleteError) throw deleteError;

            // Then, insert new connections
            if (selectedSubjects.size > 0) {
                const subjectsToInsert = Array.from(selectedSubjects).map(subjectId => ({
                    teacher_id: teacherId,
                    subject_id: subjectId,
                    // HOD Logic: If teacher is HOD and this is their primary subject, mark as HOD link
                    role: (formData.role === 'hod' && subjectId === formData.primary_subject_id) ? 'hod' : 'teacher'
                }));

                const { error: insertError } = await supabase
                    .from('teacher_subjects')
                    .insert(subjectsToInsert);
                if (insertError) throw insertError;
            }

            // Reset Form
            resetForm();
            fetchData();
            alert(isEditing ? 'Teacher updated successfully!' : 'Teacher added successfully!');
        } catch (error) {
            console.error('Error saving teacher:', error);
            alert('Save failed! ' + error.message);
        }
    };

    const handleEdit = (teacher) => {
        setIsEditing(teacher.id);
        setFormData({
            name: teacher.name,
            title: teacher.title || 'Mr.',
            role: teacher.role || 'teacher',
            department_id: teacher.department_id || '', // Main department for the teacher
            primary_subject_id: teacher.primary_subject_id || '',
            qualification: teacher.qualification || '',
            email: teacher.email || '',
            phone: teacher.phone || '',
            image_url: teacher.image_url || '',
            hierarchy_order: teacher.hierarchy_order || 0
        });

        // Load subjects into the "Shopping Cart"
        const teacherSubjs = teacher.teacher_subjects?.map(ts => ts.subject_id) || [];
        setSelectedSubjects(new Set(teacherSubjs));

        // Auto-set filter to teacher's department if set, for convenience
        if (teacher.department_id) {
            setFilterDepartmentId(teacher.department_id);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this teacher?')) return;

        try {
            const { error } = await supabase.from('teachers').delete().eq('id', id);
            if (error) throw error;
            setTeachers(teachers.filter(t => t.id !== id));
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Delete failed!');
        }
    };

    const resetForm = () => {
        setIsEditing(null);
        setFormData({
            name: '',
            title: 'Mr.',
            role: 'teacher',
            department_id: '',
            primary_subject_id: '',
            qualification: '',
            email: '',
            phone: '',
            image_url: '',
            hierarchy_order: 0
        });
        setSelectedSubjects(new Set());
        setFilterDepartmentId('');
    };

    // Filter subjects for the checkbox list based on the chosen "Filter Department"
    const filteredSubjects = filterDepartmentId
        ? subjects.filter(s => s.department_id === filterDepartmentId)
        : subjects;

    return (
        <div className="admin-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>Teachers Management</h1>
                    <p style={{ color: '#6b7280' }}>Add, edit, or remove school teachers and assign their subjects.</p>
                </div>
            </div>

            {/* Form Box */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {isEditing ? <Pencil size={20} /> : <Plus size={20} />}
                    {isEditing ? 'Edit Teacher' : 'Add New Teacher'}
                </h3>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Title</label>
                            <select
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px' }}
                            >
                                <option value="Mr.">Mr.</option>
                                <option value="Mrs.">Mrs.</option>
                                <option value="Ms.">Ms.</option>
                                <option value="Dr.">Dr.</option>
                                <option value="Rev.">Rev.</option>
                                <option value="Br.">Br.</option>
                                <option value="Sr.">Sr.</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Full Name</label>
                            <input
                                type="text"
                                placeholder="e.g. John Okello"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px' }}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Role</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px' }}
                            >
                                <option value="teacher">Teacher</option>
                                <option value="hod">Head of Department (HOD)</option>
                                <option value="admin">Administration</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1.5rem' }}>
                        <h4 style={{ marginBottom: '1rem', fontSize: '1rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <UsersIcon size={18} /> Assignment & Subjects
                        </h4>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            {/* Main Department */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Main Department</label>
                                <select
                                    value={formData.department_id}
                                    onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px' }}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>

                            {/* Primary Subject (Filtered by Selected) */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Primary Subject (The VIP)</label>
                                <select
                                    value={formData.primary_subject_id}
                                    onChange={(e) => setFormData({ ...formData, primary_subject_id: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#fffbeb' }}
                                    disabled={selectedSubjects.size === 0}
                                >
                                    <option value="">{selectedSubjects.size === 0 ? 'Select subjects first ->' : 'Select Primary...'}</option>
                                    {Array.from(selectedSubjects).map(subjId => {
                                        const s = subjects.find(sub => sub.id === subjId);
                                        return s ? <option key={s.id} value={s.id}>{s.name}</option> : null;
                                    })}
                                </select>
                            </div>
                        </div>

                        {/* Subject Selection Area */}
                        <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Select Subjects (Shopping Cart)</label>

                                {/* Department Filter */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Filter size={14} color="#6b7280" />
                                    <select
                                        value={filterDepartmentId}
                                        onChange={(e) => setFilterDepartmentId(e.target.value)}
                                        style={{ padding: '0.4rem', fontSize: '0.85rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                                    >
                                        <option value="">All Departments</option>
                                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto' }}>
                                {filteredSubjects.length === 0 ? (
                                    <p style={{ color: '#9ca3af', fontSize: '0.9rem', fontStyle: 'italic' }}>No subjects found in this department.</p>
                                ) : (
                                    filteredSubjects.map(subject => (
                                        <label key={subject.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer', padding: '0.25rem' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedSubjects.has(subject.id)}
                                                onChange={() => handleSubjectToggle(subject.id)}
                                                style={{ accentColor: 'var(--color-primary)' }}
                                            />
                                            {subject.name}
                                        </label>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Qualification</label>
                            <input
                                type="text"
                                placeholder="e.g. B.Sc Education"
                                value={formData.qualification}
                                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Email Address</label>
                            <input
                                type="email"
                                placeholder="name@bugisuhigh.ac.ug"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Phone Number</label>
                            <input
                                type="text"
                                placeholder="+256..."
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Hierarchy Order (Priority)</label>
                            <input
                                type="number"
                                value={formData.hierarchy_order}
                                onChange={(e) => setFormData({ ...formData, hierarchy_order: parseInt(e.target.value) || 0 })}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: '#f3f4f6',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                border: '2px solid #e5e7eb',
                                flexShrink: 0
                            }}>
                                {formData.image_url ? (
                                    <img src={formData.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <UsersIcon size={24} color="#9ca3af" />
                                )}
                            </div>
                            <div style={{ flex: 1 }}>
                                <label className="btn btn-outline" style={{ cursor: uploading ? 'wait' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}>
                                    <Upload size={16} />
                                    {uploading ? '...' : 'Upload Photo'}
                                    <input type="file" onChange={handleImageUpload} style={{ display: 'none' }} accept="image/*" disabled={uploading} />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }} disabled={uploading}>
                            <Save size={18} />
                            {isEditing ? 'Update Teacher' : 'Add Teacher'}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={resetForm} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                <X size={18} /> Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* List Section */}
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Our Team</h2>

            {loading ? (
                <p>Loading teachers list...</p>
            ) : teachers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: '#f9fafb', borderRadius: '12px', border: '2px dashed #e5e7eb' }}>
                    <p style={{ color: '#6b7280' }}>No teachers added yet.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {teachers.map(teacher => (
                        <div key={teacher.id} style={{
                            background: 'white',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            border: '1px solid #f3f4f6',
                            transition: 'transform 0.2s',
                            position: 'relative'
                        }}>
                            <div style={{ display: 'flex', padding: '1rem', alignItems: 'center', gap: '1rem' }}>
                                <img
                                    src={teacher.image_url || 'https://via.placeholder.com/150'}
                                    alt={teacher.name}
                                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <h4 style={{ margin: 0, fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {teacher.title} {teacher.name}
                                        </h4>
                                        {teacher.role === 'hod' && (
                                            <span style={{ fontSize: '0.6rem', background: '#fee2e2', color: '#dc2626', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', textTransform: 'uppercase' }}>HOD</span>
                                        )}
                                    </div>
                                    <p style={{ margin: '2px 0', fontSize: '0.75rem', color: '#6b7280' }}>
                                        {departments.find(d => d.id === teacher.department_id)?.name || 'No Dept'}
                                        {teacher.primary_subject_id && ` • ${subjects.find(s => s.id === teacher.primary_subject_id)?.name}`}
                                    </p>
                                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.4rem' }}>
                                        {teacher.email && <Mail size={12} color="#9ca3af" />}
                                        {teacher.phone && <Phone size={12} color="#9ca3af" />}
                                        <span style={{ fontSize: '0.65rem', color: '#9ca3af' }}>Order: {teacher.hierarchy_order}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => handleEdit(teacher)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', padding: '4px' }}
                                        title="Edit"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(teacher.id)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeachersManager;
