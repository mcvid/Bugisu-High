import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronRight, BookOpen, Calendar, Users, FileText, Map, Trophy, Music, Image, HelpCircle, GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Fuse from 'fuse.js';
import { getStaticSearchIndex } from '../lib/searchIndex';
import { supabase } from '../lib/supabase';
import useDebounce from '../hooks/useDebounce';
import './SearchOverlay.css';

const SearchOverlay = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [dynamicData, setDynamicData] = useState([]);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const { t } = useTranslation(['common', 'about', 'admissions', 'academics', 'tour']);

    // Memoize the static index so it updates when language changes
    const staticIndex = useMemo(() => getStaticSearchIndex(t), [t]);

    // Fetch dynamic content once on mount
    useEffect(() => {
        const fetchSearchData = async () => {
            const [news, events, admin, teachers] = await Promise.all([
                supabase.from('news').select('title, slug').eq('is_published', true).limit(50),
                supabase.from('events').select('title, id').gte('event_date', new Date().toISOString()).limit(20),
                supabase.from('administration').select('name, role').limit(20),
                supabase.from('teachers').select('name, subject').limit(30)
            ]);

            const newItems = [];

            if (news.data) {
                news.data.forEach(item => newItems.push({
                    title: item.title,
                    path: `/news/${item.slug}`,
                    type: "Article",
                    icon: <FileText size={20} />
                }));
            }

            if (events.data) {
                events.data.forEach(item => newItems.push({
                    title: item.title,
                    path: `/events`,
                    type: "Event",
                    icon: <Calendar size={20} />
                }));
            }

            if (admin.data) {
                admin.data.forEach(item => newItems.push({
                    title: `${item.name} (${item.role})`,
                    path: `/about`,
                    type: "Staff",
                    icon: <Users size={20} />
                }));
            }

            if (teachers.data) {
                teachers.data.forEach(item => newItems.push({
                    title: `${item.name} - ${item.subject}`,
                    path: `/academics`,
                    type: "Teacher",
                    icon: <GraduationCap size={20} />
                }));
            }

            setDynamicData(newItems);
        };

        fetchSearchData();
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setQuery('');
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const fuse = useMemo(() => {
        const fullIndex = [...staticIndex, ...dynamicData];
        return new Fuse(fullIndex, {
            keys: [
                { name: 'title', weight: 0.7 },
                { name: 'keywords', weight: 0.5 },
                { name: 'description', weight: 0.3 },
                { name: 'type', weight: 0.2 }
            ],
            threshold: 0.3,
            location: 0,
            distance: 100,
            includeMatches: true,
            minMatchCharLength: 2
        });
    }, [staticIndex, dynamicData]);

    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setResults([]);
            return;
        }

        const fuseResults = fuse.search(debouncedQuery);
        setResults(fuseResults.map(r => ({
            ...r.item,
            icon: r.item.icon || (r.item.type === 'Article' ? <FileText size={20} /> :
                r.item.type === 'Event' ? <Calendar size={20} /> :
                    r.item.type === 'Staff' ? <Users size={20} /> :
                        r.item.type === 'Teacher' ? <GraduationCap size={20} /> : <ChevronRight size={20} />)
        })).slice(0, 10));

    }, [debouncedQuery, fuse]);

    const handleResultClick = (path) => {
        navigate(path);
        onClose();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
    };

    // Helper to translate type safely
    const getTypeLabel = (type) => {
        const key = `search.types.${type.toLowerCase()}`;
        const label = t(key);
        return label === key ? type : label; // Fallback to key if missing
    };

    if (!isOpen) return null;

    return (
        <div className="search-overlay" onClick={onClose}>
            <div className="search-container" onClick={e => e.stopPropagation()}>
                <div className="search-header">
                    <Search className="search-icon-large" size={24} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={t('search.placeholder')}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="search-input"
                    />
                    <button className="close-search-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="search-results">
                    {query.trim() === '' ? (
                        <div className="search-empty-state">
                            <p>{t('search.empty_title')}</p>
                            <div className="search-suggestions">
                                <span>{t('search.try')} </span>
                                <button onClick={() => setQuery(t('search.fees'))}>{t('search.fees')}</button>
                                <button onClick={() => setQuery(t('search.exams'))}>{t('search.exams')}</button>
                                <button onClick={() => setQuery(t('search.football'))}>{t('search.football')}</button>
                                <button onClick={() => setQuery(t('search.headteacher'))}>{t('search.headteacher')}</button>
                            </div>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="results-list">
                            {results.map((item, index) => (
                                <div
                                    key={index}
                                    className="search-result-item"
                                    onClick={() => handleResultClick(item.path)}
                                >
                                    <div className="result-icon">
                                        {item.icon}
                                    </div>
                                    <div className="result-info">
                                        <h4>{item.title}</h4>
                                        <span className="result-type">{getTypeLabel(item.type)}</span>
                                    </div>
                                    <ChevronRight size={16} className="result-arrow" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="search-no-results">
                            <p>{t('search.no_results')} "{query}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchOverlay;
