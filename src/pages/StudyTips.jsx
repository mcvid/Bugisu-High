import React, { useState, useEffect } from 'react';
import { BookOpen, Brain, CheckCircle, Clock, FileText, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './StudyTips.css';

const StudyTips = () => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        const { data } = await supabase
            .from('past_papers')
            .select('*')
            .eq('paper_type', 'Notes')
            .order('created_at', { ascending: false })
            .limit(5);
        if (data) setNotes(data);
    };

    const tips = [
        {
            title: "Active Recall",
            description: "Don't just re-read your notes. Test yourself! Close the book and try to recite what you learned.",
            icon: <Brain size={24} color="#3b82f6" />
        },
        {
            title: "Spaced Repetition",
            description: "Review material at increasing intervals (1 day, 3 days, 1 week) to move it to long-term memory.",
            icon: <Clock size={24} color="#8b5cf6" />
        },
        {
            title: "The Pomodoro Technique",
            description: "Study for 25 minutes, then take a 5-minute break. After 4 sessions, take a longer break.",
            icon: <CheckCircle size={24} color="#10b981" />
        }
    ];

    return (
        <div className="study-tips-page section">
            <div className="container">
                <div className="page-header center">
                    <h1>Study Tips & Resources</h1>
                    <p>Maximize your learning potential with these proven strategies.</p>
                </div>

                <div className="tips-grid">
                    {tips.map((tip, index) => (
                        <div key={index} className="tip-card card">
                            <div className="tip-icon">{tip.icon}</div>
                            <h3>{tip.title}</h3>
                            <p>{tip.description}</p>
                        </div>
                    ))}
                </div>

                <div className="notes-section section-grey">
                    <div className="container">
                        <h2><BookOpen size={24} /> Recent Class Notes</h2>
                        <div className="notes-list card">
                            {notes.length === 0 ? (
                                <p className="empty-text">No notes uploaded yet. Check back later!</p>
                            ) : (
                                notes.map(note => (
                                    <div key={note.id} className="note-item">
                                        <div className="note-info">
                                            <h4>{note.title}</h4>
                                            <span>{note.subject} • {note.level}</span>
                                        </div>
                                        <a href={note.file_url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline">
                                            <Download size={14} /> Download
                                        </a>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudyTips;
