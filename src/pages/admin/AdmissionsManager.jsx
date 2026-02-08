import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Plus, Pencil, Trash2, Save, X, FileText, ListOrdered, Settings, MessageSquare, Download, CheckCircle, Clock, Users, Eye, Mail, Phone, Calendar, Award
} from 'lucide-react';
import { sendParentPortalWelcomeEmail, sendApplicationRejectionEmail } from '../../utils/emailService';

const AdmissionsManager = () => {
    const [activeTab, setActiveTab] = useState('applications');
    const [settings, setSettings] = useState({});
    const [steps, setSteps] = useState([]);
    const [requirements, setRequirements] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [downloads, setDownloads] = useState([]);
    const [applications, setApplications] = useState([]);
    const [scholarships, setScholarships] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [isAdding, setIsAdding] = useState(false);
    const [viewApp, setViewApp] = useState(null);
    const [scholarshipApps, setScholarshipApps] = useState([]);
    const [viewScholApp, setViewScholApp] = useState(null);
    const [selectedHouse, setSelectedHouse] = useState('Elgon House');

    const houses = ['Elgon House', 'Nile House', 'Victoria House', 'Rwenzori House'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [s, st, req, inq, dls, apps, sub, schol, scholApps] = await Promise.all([
                supabase.from('admissions_settings').select('*').single(),
                supabase.from('admissions_steps').select('*').order('sort_order', { ascending: true }),
                supabase.from('admissions_requirements').select('*').order('created_at', { ascending: true }),
                supabase.from('admissions_inquiries').select('*').order('created_at', { ascending: false }),
                supabase.from('admissions_downloads').select('*').order('sort_order', { ascending: true }),
                supabase.from('admission_applications').select('*').order('created_at', { ascending: false }),
                supabase.from('newsletter_subscriptions').select('*').order('created_at', { ascending: false }),
                supabase.from('scholarships').select('*').order('academic_year', { ascending: false }).order('sort_order', { ascending: true }),
                supabase.from('scholarship_applications').select('*, scholarships(title)').order('created_at', { ascending: false })
            ]);

            if (s.data) setSettings(s.data);
            setSteps(st.data || []);
            setRequirements(req.data || []);
            setInquiries(inq.data || []);
            setDownloads(dls.data || []);
            setApplications(apps.data || []);
            setSubscriptions(sub.data || []);
            setScholarships(schol.data || []);
            setScholarshipApps(scholApps.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id, data) => {
        setEditingId(id);
        setEditForm(data);
        setIsAdding(false);
    };

    const handleSave = async (table) => {
        try {
            if (editingId) {
                const { error } = await supabase.from(table).update(editForm).eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from(table).insert([editForm]);
                if (error) throw error;
            }
            setEditingId(null);
            setEditForm({});
            setIsAdding(false);
            fetchData();
        } catch (error) {
            alert('Error saving: ' + error.message);
        }
    };

    const handleSaveSettings = async () => {
        try {
            const { error } = await supabase.from('admissions_settings').update(settings).eq('id', settings.id);
            if (error) throw error;
            alert('Settings updated successfully');
            fetchData();
        } catch (error) {
            alert('Error updating settings: ' + error.message);
        }
    };

    const updateApplicationStatus = async (id, status) => {
        try {
            // Get application details before updating
            const { data: app } = await supabase
                .from('admission_applications')
                .select('*')
                .eq('id', id)
                .single();

            if (!app) {
                alert('Application not found');
                return;
            }

            // Update status in database
            const { error } = await supabase
                .from('admission_applications')
                .update({ status })
                .eq('id', id);

            if (error) throw error;

            // Send automated email based on status
            if (status === 'approved') {
                const emailResult = await sendParentPortalWelcomeEmail({
                    parent_name: app.parent_name,
                    parent_email: app.parent_email,
                    student_name: app.student_name,
                    class_applying_for: app.class_applying_for
                });

                if (emailResult.success) {
                    alert(`Application approved! Welcome email sent to ${app.parent_email}`);
                } else {
                    alert('Application approved, but email failed to send. Please send manually.');
                }
            } else if (status === 'rejected') {
                const emailResult = await sendApplicationRejectionEmail({
                    parent_name: app.parent_name,
                    parent_email: app.parent_email,
                    student_name: app.student_name
                });

                if (emailResult.success) {
                    alert(`Application rejected. Notification email sent to ${app.parent_email}`);
                }
            } else {
                alert('Application status updated');
            }

            fetchData();
        } catch (error) {
            alert('Error updating application: ' + error.message);
        }
    };

    const updateScholarshipAppStatus = async (id, status) => {
        try {
            const { error } = await supabase
                .from('scholarship_applications')
                .update({ status })
                .eq('id', id);

            if (error) throw error;
            alert(`Application ${status}`);
            setViewScholApp(null);
            fetchData();
        } catch (error) {
            alert('Error updating: ' + error.message);
        }
    };

    const updateInquiryStatus = async (id, status) => {
        const { error } = await supabase.from('admissions_inquiries').update({ status }).eq('id', id);
        if (error) alert(error.message);
        else fetchData();
    };

    const handleApprove = async (app) => {
        if (!confirm(`Approve application for ${app.student_name} and create student record?`)) return;

        try {
            // 1. Generate Reg No (Simple logic: Year/Random - Replace with better logic if needed)
            const year = new Date().getFullYear();
            const random = Math.floor(1000 + Math.random() * 9000); // 4 digit random
            const regNo = `BHS/${year}/${random}`;

            // 2. Create Student Record
            const { data: studentData, error: studentError } = await supabase.from('students').insert([{
                student_name: app.student_name,
                student_reg_number: regNo,
                parent_name: app.parent_name,
                parent_email: app.parent_email,
                parent_phone: app.parent_phone,
                house: selectedHouse,
                class_grade: app.Applying_for_class || app.entry_class || 'Senior 1', // Default if missing
                valid_until: `${year + 4}-12-31` // Valid for 4 years roughly
            }]).select().single();

            if (studentError) throw studentError;

            // 3. Update Application Status
            const { error: appError } = await supabase
                .from('admission_applications')
                .update({ status: 'approved' })
                .eq('id', app.id);

            if (appError) throw appError;

            // 4. Create Notification (with student_id link)
            await supabase.from('notifications').insert([{
                student_id: studentData.id, // Link notification to student
                recipient_phone: app.parent_phone,
                recipient_name: app.parent_name,
                type: 'sms',
                message: `Dear ${app.parent_name}, your child ${app.student_name} has been admitted to Bugisu High School. Reg No: ${regNo}. Welcome!`
            }]);

            alert(`Success! Student created with Reg No: ${regNo}`);
            setViewApp(null);
            fetchData();

        } catch (error) {
            console.error('Approval Error:', error);
            alert('Failed to approve: ' + error.message);
        }
    };

    const handleDelete = async (table, id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) alert(error.message);
        else fetchData();
    };

    const seedSteps = async () => {
        const defaultSteps = [
            { title: 'Obtain Application Form', description: 'Forms are available at the school bursar’s office or can be downloaded from our resources section.', sort_order: 1 },
            { title: 'Submit Documentation', description: 'Return the completed form along with previous academic reports, birth certificate copies, and passport photos.', sort_order: 2 },
            { title: 'Entrance Assessment', description: 'Prospective students may be required to sit a brief diagnostic assessment to determine appropriate class placement.', sort_order: 3 },
            { title: 'Admission Decision', description: 'Successful applicants are notified within 5 working days and issued an admission letter with reporting details.', sort_order: 4 },
            { title: 'Registration & Reporting', description: 'Complete the registration by paying the required fees and reporting to campus on the specified date.', sort_order: 5 }
        ];
        if (confirm('Replace current procedure steps with suggested default data?')) {
            await supabase.from('admissions_steps').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            await supabase.from('admissions_steps').insert(defaultSteps);
            fetchData();
        }
    };

    const seedRequirements = async () => {
        const defaultRequirements = [
            { title: 'PLE / UCE Results Slip', description: 'Evidence of standard academic qualification for O or A Level entry.' },
            { title: 'Previous Academic Reports', description: 'The last two termly reports from the student’s previous school.' },
            { title: 'Birth Certificate Copy', description: 'Required for age verification and official records.' },
            { title: 'Passport Photos (3)', description: 'Standard studio photos for identity card and student files.' },
            { title: 'Transfer / Leaving Letter', description: 'Required for students transferring between secondary schools.' }
        ];
        if (confirm('Replace current requirements with suggested default data?')) {
            await supabase.from('admissions_requirements').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            await supabase.from('admissions_requirements').insert(defaultRequirements);
            fetchData();
        }
    };

    const seedDownloads = async () => {
        const defaultDownloads = [
            { title: 'Application Form (PDF)', file_url: '#', sort_order: 1 },
            { title: 'School Prospectus 2026', file_url: '#', sort_order: 2 },
            { title: 'Fees Structure & Financial Policy', file_url: '#', sort_order: 3 },
            { title: 'Student Code of Conduct', file_url: '#', sort_order: 4 }
        ];
        if (confirm('Replace current resources with suggested default data?')) {
            await supabase.from('admissions_downloads').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            await supabase.from('admissions_downloads').insert(defaultDownloads);
            fetchData();
        }
    };

    const renderApplicationModal = () => {
        if (!viewApp) return null;
        return (
            <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setViewApp(null)}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>Application Details</h2>
                        <button className="close-modal" onClick={() => setViewApp(null)}><X size={20} /></button>
                    </div>

                    <div className="admin-grid admin-grid-2 modal-grid">
                        <div className="info-block">
                            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Student Info</h3>
                            <p><strong>Name:</strong> {viewApp.student_name}</p>
                            <p><strong>DOB:</strong> {viewApp.date_of_birth}</p>
                            <p><strong>Gender:</strong> {viewApp.gender}</p>
                            <p><strong>Nationality:</strong> {viewApp.nationality}</p>
                            <p><strong>Religion:</strong> {viewApp.religion}</p>
                        </div>
                        <div className="info-block">
                            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Academic</h3>
                            <p><strong>Program:</strong> {viewApp.program}</p>
                            <p><strong>Entry Class:</strong> {viewApp.entry_class}</p>
                            <p><strong>Previous School:</strong> {viewApp.previous_school}</p>
                            <p><strong>Aggregates:</strong> {viewApp.program === 'O-Level' ? viewApp.ple_aggregates : viewApp.uce_aggregates}</p>
                        </div>
                        <div className="info-block">
                            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Parent Info</h3>
                            <p><strong>Name:</strong> {viewApp.parent_name}</p>
                            <p><strong>Phone:</strong> {viewApp.parent_phone}</p>
                            <p><strong>Email:</strong> {viewApp.parent_email}</p>
                            <p><strong>Occupation:</strong> {viewApp.parent_occupation}</p>
                        </div>
                        <div className="info-block">
                            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Documents</h3>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                {viewApp.photo_url && (
                                    <a href={viewApp.photo_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                                        <Users size={16} /> View Photo
                                    </a>
                                )}
                                {viewApp.result_slip_url && (
                                    <a href={viewApp.result_slip_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                                        <FileText size={16} /> View Results
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Current Status:</span>
                            <span className={`status-badge ${viewApp.status}`}>{viewApp.status}</span>
                        </div>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem', background: '#fffbeb', padding: '1rem', borderRadius: '8px', border: '1px solid #fef3c7' }}>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: '#92400e' }}>Assign Student to House *</label>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                {houses.map(h => (
                                    <button
                                        key={h}
                                        className={`btn btn-sm ${selectedHouse === h ? 'btn-primary' : 'btn-outline'}`}
                                        onClick={() => setSelectedHouse(h)}
                                        style={selectedHouse === h ? { background: '#92400e', borderColor: '#92400e' } : {}}
                                    >
                                        {h}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <button className="btn btn-outline btn-sm" onClick={() => updateApplicationStatus(viewApp.id, 'under_review')}>Reviewing</button>
                            <button className="btn btn-primary btn-sm" onClick={() => handleApprove(viewApp)} style={{ background: '#22c55e', borderColor: '#22c55e' }}>Accept & Create Student</button>
                            <button className="btn btn-danger btn-sm" onClick={() => updateApplicationStatus(viewApp.id, 'rejected')}>Reject</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderSettingsTab = () => (
        <div className="admin-form-card" style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eee' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>General Admissions Settings</h3>
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.5rem' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Admissions Overview Title</label>
                    <input type="text" value={settings.title || ''} onChange={e => setSettings({ ...settings, title: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Admissions Overview Description</label>
                    <textarea value={settings.description || ''} onChange={e => setSettings({ ...settings, description: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px' }} />
                </div>
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Current Academic Year</label>
                    <input type="text" value={settings.academic_year || ''} onChange={e => setSettings({ ...settings, academic_year: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Inquiry Email</label>
                    <input type="email" value={settings.inquiry_email || ''} onChange={e => setSettings({ ...settings, inquiry_email: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
            </div>
            <button className="btn btn-primary" onClick={handleSaveSettings} style={{ marginTop: '2rem' }}>
                <Save size={18} /> Save Admissions Settings
            </button>
        </div>
    );

    const renderStepsTab = () => (
        <div className="admin-list-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3>Admission Procedure Steps</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" onClick={seedSteps} style={{ fontSize: '0.8rem' }}>Restore Suggested Data</button>
                    <button className="btn btn-primary" onClick={() => { setIsAdding(true); setEditingId(null); setEditForm({ sort_order: steps.length + 1 }); }}>
                        <Plus size={18} /> Add Step
                    </button>
                </div>
            </div>

            {(isAdding || editingId) && activeTab === 'steps' && (
                <div className="admin-form-card" style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                    <h4>{editingId ? 'Edit Step' : 'New Admission Step'}</h4>
                    <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                        <input type="text" placeholder="Step Title" value={editForm.title || ''} onChange={e => setEditForm({ ...editForm, title: e.target.value })} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                        <textarea placeholder="Step Description" value={editForm.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', minHeight: '80px' }} />
                        <input type="number" placeholder="Sort Order" value={editForm.sort_order || ''} onChange={e => setEditForm({ ...editForm, sort_order: parseInt(e.target.value) })} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-primary" onClick={() => handleSave('admissions_steps')}>Save Step</button>
                            <button className="btn btn-outline" onClick={() => { setIsAdding(false); setEditingId(null); setEditForm({}); }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="admin-list">
                {steps.map(step => (
                    <div key={step.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eee', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span style={{ fontWeight: 'bold', marginRight: '1rem', color: 'var(--color-primary)' }}>{step.sort_order}.</span>
                            <strong>{step.title}</strong>
                            <p style={{ margin: '0.5rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>{step.description}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-icon" onClick={() => handleEdit(step.id, step)}><Pencil size={16} /></button>
                            <button className="btn btn-icon delete" onClick={() => handleDelete('admissions_steps', step.id)}><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderRequirementsTab = () => (
        <div className="admin-list-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3>Admission Requirements</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" onClick={seedRequirements} style={{ fontSize: '0.8rem' }}>Restore Suggested Data</button>
                    <button className="btn btn-primary" onClick={() => { setIsAdding(true); setEditingId(null); setEditForm({}); }}>
                        <Plus size={18} /> Add Requirement
                    </button>
                </div>
            </div>

            {(isAdding || editingId) && activeTab === 'reqs' && (
                <div className="admin-form-card" style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                    <h4>{editingId ? 'Edit Requirement' : 'New Requirement'}</h4>
                    <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                        <input type="text" placeholder="Requirement Title" value={editForm.title || ''} onChange={e => setEditForm({ ...editForm, title: e.target.value })} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                        <textarea placeholder="Description (Optional)" value={editForm.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', minHeight: '60px' }} />
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-primary" onClick={() => handleSave('admissions_requirements')}>Save Requirement</button>
                            <button className="btn btn-outline" onClick={() => { setIsAdding(false); setEditingId(null); setEditForm({}); }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="admin-list">
                {requirements.map(req => (
                    <div key={req.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eee', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <strong>{req.title}</strong>
                            {req.description && <p style={{ margin: '0.5rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>{req.description}</p>}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-icon" onClick={() => handleEdit(req.id, req)}><Pencil size={16} /></button>
                            <button className="btn btn-icon delete" onClick={() => handleDelete('admissions_requirements', req.id)}><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderDownloadsTab = () => (
        <div className="admin-list-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3>Admission Resources & Downloads</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" onClick={seedDownloads} style={{ fontSize: '0.8rem' }}>Restore Suggested Data</button>
                    <button className="btn btn-primary" onClick={() => { setIsAdding(true); setEditingId(null); setEditForm({ sort_order: downloads.length + 1 }); }}>
                        <Plus size={18} /> Add Resource
                    </button>
                </div>
            </div>

            {(isAdding || editingId) && activeTab === 'downloads' && (
                <div className="admin-form-card" style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                    <h4>{editingId ? 'Edit Resource' : 'New Resource'}</h4>
                    <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                        <input type="text" placeholder="Resource Title (e.g. Fees Structure)" value={editForm.title || ''} onChange={e => setEditForm({ ...editForm, title: e.target.value })} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                        <input type="text" placeholder="File URL (PDF link)" value={editForm.file_url || ''} onChange={e => setEditForm({ ...editForm, file_url: e.target.value })} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                        <input type="number" placeholder="Sort Order" value={editForm.sort_order || ''} onChange={e => setEditForm({ ...editForm, sort_order: parseInt(e.target.value) })} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-primary" onClick={() => handleSave('admissions_downloads')}>Save Resource</button>
                            <button className="btn btn-outline" onClick={() => { setIsAdding(false); setEditingId(null); setEditForm({}); }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="admin-list">
                {downloads.length === 0 ? <p>No resources added.</p> : downloads.map(dl => (
                    <div key={dl.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eee', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Download size={20} color="#64748b" />
                            <div>
                                <strong>{dl.title}</strong>
                                <p style={{ margin: '0.25rem 0 0', color: '#3b82f6', fontSize: '0.85rem', wordBreak: 'break-all' }}>{dl.file_url}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-icon" onClick={() => handleEdit(dl.id, dl)}><Pencil size={16} /></button>
                            <button className="btn btn-icon delete" onClick={() => handleDelete('admissions_downloads', dl.id)}><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderInquiriesTab = () => (
        <div className="admin-list">
            <h3 style={{ marginBottom: '1.5rem' }}>Admissions Inquiries ({inquiries.filter(i => i.status === 'pending').length} New)</h3>
            {inquiries.length === 0 ? <p>No inquiries yet.</p> : inquiries.map(inq => (
                <div key={inq.id} style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '1.5rem',
                    border: '1px solid rgba(0,0,0,0.06)',
                    marginBottom: '1.5rem',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                                <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', color: '#1e293b' }}>{inq.name}</h4>
                                <span style={{
                                    background: inq.status === 'pending' ? '#fef3c7' : '#e0f2fe',
                                    color: inq.status === 'pending' ? '#92400e' : '#075985',
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: '8px',
                                    fontSize: '0.7rem',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>{inq.status}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '2rem', color: '#64748b', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Mail size={16} /> {inq.email}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Phone size={16} /> {inq.phone || 'N/A'}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar size={14} /> {new Date(inq.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        background: '#f8fafc',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        marginBottom: '1.5rem',
                        border: '1px solid #e2e8f0'
                    }}>
                        <p style={{ margin: 0, lineHeight: '1.6', color: '#475569' }}>{inq.message}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {inq.status === 'pending' && (
                            <button
                                style={{
                                    background: '#f97316',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.6rem 1.25rem',
                                    borderRadius: '10px',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.2s ease'
                                }}
                                onClick={() => updateInquiryStatus(inq.id, 'reviewed')}
                                onMouseEnter={e => e.target.style.background = '#ea580c'}
                                onMouseLeave={e => e.target.style.background = '#f97316'}
                            >
                                <CheckCircle size={16} /> Mark Reviewed
                            </button>
                        )}
                        <button
                            style={{
                                background: 'transparent',
                                border: '1px solid #fee2e2',
                                color: '#ef4444',
                                padding: '0.6rem 1.25rem',
                                borderRadius: '10px',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => handleDelete('admissions_inquiries', inq.id)}
                            onMouseEnter={e => {
                                e.target.style.background = '#ef4444';
                                e.target.style.color = 'white';
                            }}
                            onMouseLeave={e => {
                                e.target.style.background = 'transparent';
                                e.target.style.color = '#ef4444';
                            }}
                        >
                            <Trash2 size={16} /> Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderScholAppModal = () => {
        if (!viewScholApp) return null;

        return (
            <div className="admin-modal-overlay">
                <div className="admin-modal-card" style={{ maxWidth: '600px' }}>
                    <div className="modal-header">
                        <h2>Scholarship Application Details</h2>
                        <button className="btn btn-icon" onClick={() => setViewScholApp(null)}><X size={20} /></button>
                    </div>
                    <div className="modal-body" style={{ padding: '2rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Student Name</label>
                                <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{viewScholApp.student_name}</div>
                            </div>
                            <div>
                                <label style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Applied For</label>
                                <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{viewScholApp.scholarships?.title || viewScholApp.category}</div>
                            </div>
                            <div>
                                <label style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Phone</label>
                                <div>{viewScholApp.phone}</div>
                            </div>
                            <div>
                                <label style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Email</label>
                                <div>{viewScholApp.email || 'N/A'}</div>
                            </div>
                            <div>
                                <label style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Previous School</label>
                                <div>{viewScholApp.previous_school}</div>
                            </div>
                            <div>
                                <label style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Date Submitted</label>
                                <div>{new Date(viewScholApp.created_at).toLocaleDateString()}</div>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FileText size={18} /> Category Specific Data
                            </h4>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {viewScholApp.data && Object.entries(viewScholApp.data).map(([key, value]) => (
                                    <div key={key}>
                                        <label style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>{key.replace('_', ' ')}</label>
                                        <div style={{ fontWeight: '500' }}>{value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-primary" onClick={() => updateScholarshipAppStatus(viewScholApp.id, 'approved')}>
                                <CheckCircle size={18} /> Approve
                            </button>
                            <button className="btn btn-outline" style={{ color: '#ef4444', borderColor: '#ef4444' }} onClick={() => updateScholarshipAppStatus(viewScholApp.id, 'rejected')}>
                                <Trash2 size={18} /> Reject
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderScholarshipsTab = () => (
        <div className="admin-list-section">
            <div className="admin-header">
                <h3>Scholarships Management</h3>
                <button className="btn btn-primary" onClick={() => {
                    setIsAdding(true);
                    setEditingId(null);
                    setEditForm({
                        academic_year: '2026/2027',
                        coverage_type: 'partial',
                        is_active: true,
                        sort_order: scholarships.length + 1
                    });
                }}>
                    <Plus size={18} /> Add Scholarship
                </button>
            </div>

            {/* Application List Section */}
            <div style={{ marginBottom: '3rem' }}>
                <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={18} /> Recent Applications
                </h4>
                {scholarshipApps.length === 0 ? <p className="text-gray-500">No applications received yet.</p> : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Category/Scholarship</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scholarshipApps.map(app => (
                                    <tr key={app.id}>
                                        <td style={{ fontWeight: 'bold' }}>{app.student_name}</td>
                                        <td>{app.scholarships?.title || app.category}</td>
                                        <td><span className={`status-badge ${app.status}`}>{app.status}</span></td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button className="btn btn-outline btn-sm" onClick={() => setViewScholApp(app)}>
                                                <Eye size={16} /> Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div style={{ borderTop: '1px solid #eee', paddingTop: '2rem' }}>
                <h4 style={{ marginBottom: '1.5rem' }}>Active Programs</h4>
                {(isAdding || editingId) && activeTab === 'scholarships' && (
                    <div className="admin-form-card" style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                        <h4>{editingId ? 'Edit Scholarship' : 'New Scholarship'}</h4>
                        <div className="form-grid" style={{ marginTop: '1rem' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Title</label>
                                <input type="text" placeholder="e.g., Performance Excellence Scholarship" value={editForm.title || ''} onChange={e => setEditForm({ ...editForm, title: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Description</label>
                                <textarea placeholder="Scholarship details..." value={editForm.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', minHeight: '80px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Academic Year</label>
                                <input type="text" value={editForm.academic_year || ''} onChange={e => setEditForm({ ...editForm, academic_year: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Coverage Type</label>
                                <select value={editForm.coverage_type || 'partial'} onChange={e => setEditForm({ ...editForm, coverage_type: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                                    <option value="full">Full Scholarship</option>
                                    <option value="partial">Partial Scholarship</option>
                                    <option value="specific">Specific Coverage</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Amount (UGX)</label>
                                <input type="number" value={editForm.amount || ''} onChange={e => setEditForm({ ...editForm, amount: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Deadline</label>
                                <input type="date" value={editForm.deadline || ''} onChange={e => setEditForm({ ...editForm, deadline: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Application Link (Internal/External)</label>
                                <input type="text" placeholder="https://..." value={editForm.application_link || ''} onChange={e => setEditForm({ ...editForm, application_link: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input type="checkbox" checked={editForm.is_active || false} onChange={e => setEditForm({ ...editForm, is_active: e.target.checked })} />
                                <span>Active / Visible on Site</span>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', gridColumn: '1 / -1', marginTop: '1rem' }}>
                                <button className="btn btn-primary" onClick={() => handleSave('scholarships')}>Save Program</button>
                                <button className="btn btn-outline" onClick={() => { setIsAdding(false); setEditingId(null); setEditForm({}); }}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="admin-list">
                    {scholarships.length === 0 ? <p className="text-gray-500">No scholarships found.</p> : scholarships.map(s => (
                        <div key={s.id} className="admin-list-item">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: s.is_active ? '#f0fdf4' : '#f8fafc',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <Award size={24} color={s.is_active ? '#22c55e' : '#64748b'} />
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        <strong>{s.title}</strong>
                                        <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '100px', background: '#f1f5f9', color: '#64748b' }}>{s.academic_year}</span>
                                    </div>
                                    <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                                        {s.coverage_type.toUpperCase()} • {s.amount ? `${Number(s.amount).toLocaleString()} UGX` : 'Contact for details'}
                                    </p>
                                </div>
                            </div>
                            <div className="admin-list-item-actions">
                                <button className="btn btn-icon" onClick={() => handleEdit(s.id, s)}><Pencil size={16} /></button>
                                <button className="btn btn-icon delete" onClick={() => handleDelete('scholarships', s.id)}><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="admin-manager admissions-manager admin-fade-in">
            {renderApplicationModal()}
            {renderScholAppModal()}
            <div className="admin-header">
                <h1>Admissions Management</h1>
            </div>

            <div className="admin-tabs">
                <button className={`btn ${activeTab === 'applications' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('applications')}><Users size={18} /> Applications</button>
                <button className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('settings')}><Settings size={18} /> Settings</button>
                <button className={`btn ${activeTab === 'steps' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('steps')}><ListOrdered size={18} /> Procedure</button>
                <button className={`btn ${activeTab === 'reqs' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('reqs')}><FileText size={18} /> Requirements</button>
                <button className={`btn ${activeTab === 'downloads' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('downloads')}><Download size={18} /> Resources</button>
                <button className={`btn ${activeTab === 'inquiries' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('inquiries')}>
                    <MessageSquare size={18} /> Inquiries
                    {inquiries.filter(i => i.status === 'pending').length > 0 && <span style={{ marginLeft: '6px', background: '#ef4444', color: 'white', padding: '2px 6px', borderRadius: '100px', fontSize: '0.7rem' }}>{inquiries.filter(i => i.status === 'pending').length}</span>}
                </button>
                <button className={`btn ${activeTab === 'scholarships' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('scholarships')}><Award size={18} /> Scholarships</button>
                <button className={`btn ${activeTab === 'newsletter' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('newsletter')}><Mail size={18} /> Newsletter</button>
            </div>

            {loading ? <p>Loading...</p> : (
                <div className="admin-content">
                    {activeTab === 'applications' && (
                        <div className="admin-list admin-fade-in">
                            {applications.length === 0 ? <p className="text-gray-500">No applications received yet.</p> : (
                                <div className="admin-table-wrapper">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Ref No</th>
                                                <th>Student</th>
                                                <th>Class</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th style={{ textAlign: 'right' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {applications.map(app => (
                                                <tr key={app.id}>
                                                    <td style={{ fontWeight: '600', color: '#10b981', fontFamily: 'monospace' }}>{app.reference_no || 'N/A'}</td>
                                                    <td>
                                                        <div style={{ fontWeight: 'bold' }}>{app.student_name}</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{app.gender}</div>
                                                    </td>
                                                    <td>{app.entry_class}</td>
                                                    <td>{new Date(app.created_at).toLocaleDateString()}</td>
                                                    <td><span className={`status-badge ${app.status}`}>{app.status}</span></td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        <button className="btn btn-outline btn-sm" onClick={() => setViewApp(app)}>
                                                            <Eye size={16} /> View
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === 'settings' && renderSettingsTab()}
                    {activeTab === 'steps' && renderStepsTab()}
                    {activeTab === 'reqs' && renderRequirementsTab()}
                    {activeTab === 'downloads' && renderDownloadsTab()}
                    {activeTab === 'inquiries' && renderInquiriesTab()}
                    {activeTab === 'scholarships' && renderScholarshipsTab()}
                    {activeTab === 'newsletter' && (
                        <div className="admin-list admin-fade-in">
                            <div className="admin-header">
                                <h2>Newsletter Subscriptions ({subscriptions.length})</h2>
                                <button className="btn btn-outline btn-sm" onClick={() => {
                                    const csv = 'data:text/csv;charset=utf-8,' + ['Email,Date'].concat(subscriptions.map(s => `${s.email},${new Date(s.created_at).toLocaleDateString()}`)).join('\n');
                                    window.open(encodeURI(csv));
                                }}>Export CSV</button>
                            </div>
                            {subscriptions.length === 0 ? <p className="text-gray-500">No subscribers yet.</p> : (
                                <div className="admin-table-wrapper">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Email Address</th>
                                                <th>Subscription Date</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {subscriptions.map(sub => (
                                                <tr key={sub.id}>
                                                    <td style={{ fontWeight: '500' }}>{sub.email}</td>
                                                    <td>{new Date(sub.created_at).toLocaleDateString()}</td>
                                                    <td>
                                                        <button className="btn btn-icon delete" onClick={async () => {
                                                            if (confirm('Delete this subscription?')) {
                                                                await supabase.from('newsletter_subscriptions').delete().eq('id', sub.id);
                                                                fetchData();
                                                            }
                                                        }}><Trash2 size={16} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdmissionsManager;
