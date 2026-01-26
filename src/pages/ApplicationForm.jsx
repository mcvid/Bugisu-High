import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { CheckCircle, ChevronRight, ChevronLeft, Upload, FileText, User, BookOpen } from 'lucide-react';
import './ApplicationForm.css';

const ApplicationForm = () => {
    const { t } = useTranslation(['admissions', 'common']);
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        student_name: '',
        date_of_birth: '',
        gender: '',
        religion: '',
        nationality: '',
        program: 'O-Level',
        entry_class: 'S1',
        previous_school: '',
        ple_aggregates: '',
        uce_aggregates: '',
        parent_name: '',
        parent_phone: '',
        parent_email: '',
        parent_occupation: '',
        photo_url: '',
        result_slip_url: ''
    });

    const [files, setFiles] = useState({
        photo: null,
        result_slip: null
    });

    const [referenceNo, setReferenceNo] = useState(''); // New state for reference number

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            setFiles({ ...files, [type]: file });
        }
    };

    const uploadFile = async (file, path) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${path}/${Date.now()}.${fileExt}`;
        const { error } = await supabase.storage
            .from('applications')
            .upload(fileName, file);

        if (error) throw error;

        const { data } = supabase.storage
            .from('applications')
            .getPublicUrl(fileName);

        return data.publicUrl;
    };

    const generateRef = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Upload files first
            let photoUrl = '';
            let resultSlipUrl = '';

            if (files.photo) {
                photoUrl = await uploadFile(files.photo, 'photos');
            }
            if (files.result_slip) {
                resultSlipUrl = await uploadFile(files.result_slip, 'results');
            }

            const ref = generateRef(); // Generate reference number
            setReferenceNo(ref);

            // Sanitize form data (convert empty strings to null for integers)
            const submissionData = {
                ...formData,
                ple_aggregates: formData.ple_aggregates === '' ? null : parseInt(formData.ple_aggregates),
                uce_aggregates: formData.uce_aggregates === '' ? null : parseInt(formData.uce_aggregates),
                photo_url: photoUrl,
                result_slip_url: resultSlipUrl,
                status: 'pending',
                reference_no: ref // Include reference number
            };

            const { error } = await supabase
                .from('admission_applications')
                .insert([submissionData]);

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
            <div className="application-success">
                <div className="success-content">
                    <CheckCircle size={64} color="#4ade80" />
                    <h2>{t('admissions:form.success_title')}</h2>
                    <p>{t('admissions:form.success_desc')}</p>

                    <div className="reference-box" style={{
                        margin: '2rem 0',
                        padding: '1.5rem',
                        background: '#f0fdf4',
                        border: '2px dashed #22c55e',
                        borderRadius: '12px',
                        textAlign: 'center'
                    }}>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#166534', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>{t('admissions:form.ref_label')}</p>
                        <h1 style={{ margin: '0.5rem 0', color: '#16a34a', fontSize: '3rem', letterSpacing: '4px' }}>{referenceNo}</h1>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#166534' }}>{t('admissions:form.ref_note')}</p>
                    </div>

                    <p>{t('admissions:form.contact_note')}</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                        <button onClick={() => navigate('/')} className="btn btn-primary">{t('admissions:form.return_home')}</button>
                        <button onClick={() => navigate('/admissions')} className="btn btn-outline">{t('admissions:form.track_status')}</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="application-page section">
            <div className="container">
                <div className="form-header">
                    <h1>{t('admissions:form.title')}</h1>
                    <p>{t('admissions:form.subtitle')}</p>
                </div>

                <div className="progress-bar-container">
                    <div className="progress-status">
                        {t('admissions:form.step')} {step} {t('admissions:form.of')} 4: {
                            step === 1 ? t('admissions:form.student_info') :
                                step === 2 ? t('admissions:form.academic_info') :
                                    step === 3 ? t('admissions:form.parent_info') : t('admissions:form.documents')
                        }
                    </div>
                    <div className="progress-bar">
                        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}><span>1</span><label>{t('admissions:form.student_info').split(' ')[0]}</label></div>
                        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}><span>2</span><label>{t('admissions:form.academic_info').split(' ')[0]}</label></div>
                        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}><span>3</span><label>{t('admissions:form.parent_info').split(' ')[0]}</label></div>
                        <div className={`progress-step ${step >= 4 ? 'active' : ''}`}><span>4</span><label>Docs</label></div>
                    </div>
                </div>

                <form className="application-form card" onSubmit={handleSubmit}>

                    {/* STEP 1: STUDENT INFO */}
                    {step === 1 && (
                        <div className="form-step">
                            <h3><User size={20} /> {t('admissions:form.student_info')}</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>{t('admissions:form.full_name')} *</label>
                                    <input type="text" name="student_name" required value={formData.student_name} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>{t('admissions:form.date_of_birth')} *</label>
                                    <input type="date" name="date_of_birth" required value={formData.date_of_birth} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>{t('admissions:form.gender')} *</label>
                                    <select name="gender" required value={formData.gender} onChange={handleChange}>
                                        <option value="">{t('admissions:form.select_gender')}</option>
                                        <option value="Male">{t('admissions:form.male')}</option>
                                        <option value="Female">{t('admissions:form.female')}</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>{t('admissions:form.nationality')} *</label>
                                    <input type="text" name="nationality" required value={formData.nationality} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>{t('admissions:form.religion')}</label>
                                    <input type="text" name="religion" value={formData.religion} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="step-actions sticky-mobile">
                                <div />
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => setStep(2)}
                                    disabled={!formData.student_name || !formData.date_of_birth || !formData.gender || !formData.nationality}
                                >
                                    {t('admissions:form.next_step')} <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: ACADEMIC INFO */}
                    {step === 2 && (
                        <div className="form-step">
                            <h3><BookOpen size={20} /> {t('admissions:form.academic_info')}</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>{t('admissions:form.program_applying_for')} *</label>
                                    <select name="program" required value={formData.program} onChange={handleChange}>
                                        <option value="O-Level">{t('admissions:form.o_level')}</option>
                                        <option value="A-Level">{t('admissions:form.a_level')}</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>{t('admissions:form.entry_class')} *</label>
                                    <select name="entry_class" required value={formData.entry_class} onChange={handleChange}>
                                        <option value="S1">{t('admissions:form.senior_1')}</option>
                                        <option value="S2">{t('admissions:form.senior_2')}</option>
                                        <option value="S3">{t('admissions:form.senior_3')}</option>
                                        <option value="S5">{t('admissions:form.senior_5')}</option>
                                    </select>
                                </div>
                                <div className="form-group full">
                                    <label>{t('admissions:form.previous_school')} *</label>
                                    <input type="text" name="previous_school" required value={formData.previous_school} onChange={handleChange} />
                                </div>
                                {formData.program === 'O-Level' ? (
                                    <div className="form-group">
                                        <label>{t('admissions:form.ple_aggregates')} *</label>
                                        <input type="number" name="ple_aggregates" required value={formData.ple_aggregates} onChange={handleChange} placeholder="e.g. 12" />
                                    </div>
                                ) : (
                                    <div className="form-group">
                                        <label>{t('admissions:form.uce_aggregates')} *</label>
                                        <input type="number" name="uce_aggregates" required value={formData.uce_aggregates} onChange={handleChange} placeholder="e.g. 30" />
                                    </div>
                                )}
                            </div>
                            <div className="step-actions sticky-mobile">
                                <button type="button" className="btn btn-outline" onClick={() => setStep(1)}><ChevronLeft size={18} /> {t('admissions:form.prev_step')}</button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => setStep(3)}
                                    disabled={!formData.previous_school || (formData.program === 'O-Level' ? !formData.ple_aggregates : !formData.uce_aggregates)}
                                >
                                    {t('admissions:form.next_step')} <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: PARENT INFO */}
                    {step === 3 && (
                        <div className="form-step">
                            <h3><User size={20} /> {t('admissions:form.parent_info')}</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>{t('admissions:form.parent_name')} *</label>
                                    <input type="text" name="parent_name" required value={formData.parent_name} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>{t('admissions:form.phone_number')} *</label>
                                    <input type="tel" name="parent_phone" required value={formData.parent_phone} onChange={handleChange} placeholder="+256..." />
                                </div>
                                <div className="form-group">
                                    <label>{t('admissions:form.email_address')}</label>
                                    <input type="email" name="parent_email" value={formData.parent_email} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>{t('admissions:form.occupation')}</label>
                                    <input type="text" name="parent_occupation" value={formData.parent_occupation} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="step-actions sticky-mobile">
                                <button type="button" className="btn btn-outline" onClick={() => setStep(2)}><ChevronLeft size={18} /> {t('admissions:form.prev_step')}</button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => setStep(4)}
                                    disabled={!formData.parent_name || !formData.parent_phone}
                                >
                                    {t('admissions:form.next_step')} <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: DOCUMENTS */}
                    {step === 4 && (
                        <div className="form-step">
                            <h3><FileText size={20} /> {t('admissions:form.documents')}</h3>
                            <p className="form-note">{t('admissions:form.upload_note')}</p>

                            <div className="upload-grid">
                                <div className="upload-box">
                                    <label>{t('admissions:form.upload_passport')}</label>
                                    <div className={`file-drop ${files.photo ? 'has-file' : ''}`}>
                                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'photo')} />
                                        <div className="drop-content">
                                            <Upload size={32} />
                                            <span>{files.photo ? files.photo.name : t('admissions:form.click_to_upload_photo')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="upload-box">
                                    <label>{t('admissions:form.upload_results')}</label>
                                    <div className={`file-drop ${files.result_slip ? 'has-file' : ''}`}>
                                        <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'result_slip')} />
                                        <div className="drop-content">
                                            <Upload size={32} />
                                            <span>{files.result_slip ? files.result_slip.name : t('admissions:form.click_to_upload_slip')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="step-actions sticky-mobile">
                                <button type="button" className="btn btn-outline" onClick={() => setStep(3)}><ChevronLeft size={18} /> {t('admissions:form.prev_step')}</button>
                                <button type="submit" className="btn btn-primary btn-lg" disabled={loading || !files.photo || !files.result_slip}>
                                    {loading ? t('admissions:form.submitting') : t('admissions:form.submit')}
                                </button>
                            </div>
                        </div>
                    )}

                </form>
            </div>
        </div>
    );
};

export default ApplicationForm;
