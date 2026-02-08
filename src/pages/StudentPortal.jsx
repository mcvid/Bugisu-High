import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Printer, AlertCircle, FileText, User as UserIcon } from 'lucide-react';
import DigitalIDCard from '../components/DigitalIDCard';
import ReportCard from '../components/ReportCard';
import SEO from '../components/SEO';
import PortalFAB from '../components/ui/PortalFAB';
import './StudentPortal.css';

const StudentPortal = () => {
    const [regNo, setRegNo] = useState('');
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('id'); // 'id' or 'results'
    const [results, setResults] = useState([]);
    const [reportMeta, setReportMeta] = useState({});
    const [reportComps, setReportComps] = useState([]);
    const [loadingResults, setLoadingResults] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!regNo.trim()) return;

        setLoading(true);
        setError(null);
        setStudent(null);
        setResults([]);

        try {
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .eq('student_reg_number', regNo.trim())
                .single();

            if (error) throw error;
            setStudent(data);
        } catch (err) {
            console.error('Search error:', err);
            setError('Student not found. Please check the Registration Number.');
        } finally {
            setLoading(false);
        }
    };

    const fetchResults = async () => {
        if (!student) return;
        setLoadingResults(true);
        setActiveTab('results');

        try {
            const { data, error } = await supabase
                .from('grades')
                .select('*, subjects(name, category)')
                .eq('student_id', student.id)
                .order('created_at', { ascending: false }); // Latest first

            if (error) throw error;
            setResults(data || []);

            // 2. Fetch Metadata
            const currentYear = new Date().getFullYear();
            const { data: metaData } = await supabase
                .from('report_metadata')
                .select('*')
                .eq('student_id', student.id)
                .eq('term', 'Term 1')
                .eq('year', currentYear)
                .single();
            setReportMeta(metaData || {});

            // 3. Fetch Competencies
            const { data: compData } = await supabase
                .from('competencies')
                .select('*')
                .eq('student_id', student.id)
                .eq('term', 'Term 1')
                .eq('year', currentYear);
            setReportComps(compData || []);
        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            setLoadingResults(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="student-portal-page">
            <SEO
                title="Student Portal | Digital ID & Results"
                description="Access your Bugisu High School Digital Student ID Card and Exam Results."
            />

            <div className="portal-hero">
                <h1>Student Portal</h1>
                <p>Enter your registration number to access your ID and Results.</p>
            </div>

            <div className="portal-container">
                {!student && (
                    <form onSubmit={handleSearch} className="search-box">
                        <input
                            type="text"
                            placeholder="Enter Reg Number (e.g. BHS/2026/0442)"
                            value={regNo}
                            onChange={(e) => setRegNo(e.target.value)}
                            className="portal-input"
                        />
                        <button type="submit" className="portal-btn" disabled={loading}>
                            {loading ? 'Searching...' : <Search size={20} />}
                        </button>
                    </form>
                )}

                {error && (
                    <div className="portal-error">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                {student && (
                    <div className="student-dash">
                        <div className="portal-tabs">
                            <button
                                className={`tab-btn ${activeTab === 'id' ? 'active' : ''}`}
                                onClick={() => setActiveTab('id')}
                            >
                                <UserIcon size={18} /> Digital ID
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
                                onClick={fetchResults}
                            >
                                <FileText size={18} /> My Results
                            </button>
                            <button className="tab-btn outline" onClick={() => setStudent(null)}>
                                Switch Student
                            </button>
                        </div>

                        {activeTab === 'id' && (
                            <div className="id-display-area">
                                <DigitalIDCard student={student} />
                                <div className="portal-actions">
                                    <button onClick={handlePrint} className="print-btn">
                                        <Printer size={20} /> Print ID Card
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'results' && (
                            <div className="results-area">
                                {loadingResults ? (
                                    <p>Loading results...</p>
                                ) : (
                                    <>
                                        {results.length > 0 ? (
                                            <>
                                                <ReportCard
                                                    student={student}
                                                    grades={results}
                                                    metadata={reportMeta}
                                                    competencies={reportComps}
                                                    term="Term 1"
                                                    year={new Date().getFullYear()}
                                                />
                                                <div className="portal-actions centered">
                                                    <button onClick={handlePrint} className="print-btn primary">
                                                        <Printer size={20} /> Print Report Card
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="no-results">
                                                <AlertCircle size={40} color="#cbd5e1" />
                                                <p>No results found for this term yet.</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <PortalFAB
                role="student"
                onAction={(id) => {
                    if (id === 'timetable') navigate('/calendar');
                    if (id === 'materials') navigate('/resources');
                    if (id === 'results' && student) fetchResults();
                }}
            />
        </div>
    );
};

export default StudentPortal;
