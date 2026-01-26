import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { FileText, Download, Search, Filter, BookOpen, Calendar, ChevronDown } from 'lucide-react';
import './PastPapers.css';

const PastPapers = () => {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [selectedLevel, setSelectedLevel] = useState('All');
    const [selectedSubject, setSelectedSubject] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPapers();
    }, []);

    const fetchPapers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('past_papers')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setPapers(data);
        setLoading(false);
    };

    const handleDownload = async (paper) => {
        // Increment download count
        try {
            await supabase.rpc('increment_downloads', { paper_id: paper.id });
        } catch (e) {
            // If the RPC doesn't exist yet, we can update normally
            await supabase
                .from('past_papers')
                .update({ downloads: paper.downloads + 1 })
                .eq('id', paper.id);
        }

        // Open file
        window.open(paper.file_url, '_blank');
    };

    // Derived lists for filter dropdowns
    const uniqueSubjects = ['All', ...new Set(papers.map(p => p.subject))].sort();

    // Filter logic
    const filteredPapers = papers.filter(paper => {
        const matchesLevel = selectedLevel === 'All' || paper.level === selectedLevel;
        const matchesSubject = selectedSubject === 'All' || paper.subject === selectedSubject;
        const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            paper.subject.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesLevel && matchesSubject && matchesSearch;
    });

    return (
        <div className="past-papers-page section">
            <div className="container">
                <div className="page-header center">
                    <h1>Academic Resources & Past Papers</h1>
                    <p>Download exams, notes, and revision materials to excel in your studies.</p>
                    <div style={{ marginTop: '1rem' }}>
                        <Link to="/study-tips" className="btn btn-outline">View Study Tips</Link>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="resources-toolbar card">
                    <div className="search-box">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search papers by title or subject..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="filters-group">
                        <div className="filter-select">
                            <Filter size={16} />
                            <select value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)}>
                                <option value="All">All Classes</option>
                                <option value="S1">Senior 1</option>
                                <option value="S2">Senior 2</option>
                                <option value="S3">Senior 3</option>
                                <option value="S4">Senior 4</option>
                                <option value="S5">Senior 5</option>
                                <option value="S6">Senior 6</option>
                            </select>
                            <ChevronDown size={14} className="select-arrow" />
                        </div>

                        <div className="filter-select">
                            <BookOpen size={16} />
                            <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
                                {uniqueSubjects.map(subject => (
                                    <option key={subject} value={subject}>{subject === 'All' ? 'All Subjects' : subject}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="select-arrow" />
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="resources-grid">
                    {loading ? (
                        <div className="loading-state">Loading resources...</div>
                    ) : filteredPapers.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon"><FileText size={48} /></div>
                            <h3>No papers found</h3>
                            <p>Try adjusting your search or filters.</p>
                        </div>
                    ) : (
                        filteredPapers.map(paper => (
                            <div key={paper.id} className="resource-card card-hover">
                                <div className="resource-icon">
                                    <div className={`file-initial ${paper.file_url.endsWith('.pdf') ? 'pdf' : 'doc'}`}>
                                        {paper.file_url.endsWith('.pdf') ? 'PDF' : 'DOC'}
                                    </div>
                                </div>
                                <div className="resource-content">
                                    <div className="resource-meta">
                                        <span className="badge badge-sm">{paper.level}</span>
                                        <span className="subject-tag">{paper.subject}</span>
                                    </div>
                                    <h3 className="resource-title">{paper.title}</h3>
                                    <div className="resource-details">
                                        <span className="detail-item"><Calendar size={14} /> {paper.year} Term {paper.term}</span>
                                        <span className="detail-item">{paper.paper_type}</span>
                                    </div>
                                    <button className="download-btn" onClick={() => handleDownload(paper)}>
                                        <Download size={16} /> Download
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default PastPapers;
