import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';
import './AcademicCalendar.css';

const AcademicCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('events')
            .select('*')
            .order('event_date', { ascending: true });

        if (data) setEvents(data);
        setLoading(false);
    };

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        setSelectedDate(null);
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        setSelectedDate(null);
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Empty cells for padding
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Day cells
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
            const dayEvents = events.filter(e => new Date(e.event_date).toDateString() === dateStr);
            const isToday = new Date().toDateString() === dateStr;
            const isSelected = selectedDate === dateStr;

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedDate(dateStr)}
                >
                    <span className="day-number">{day}</span>
                    <div className="day-dots">
                        {dayEvents.map(event => (
                            <span
                                key={event.id}
                                className={`event-dot ${event.category.toLowerCase().replace(/\s+/g, '-')}`}
                                title={event.title}
                            />
                        ))}
                    </div>
                </div>
            );
        }

        return days;
    };

    const getMonthName = (date) => {
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };

    const selectedDayEvents = selectedDate
        ? events.filter(e => new Date(e.event_date).toDateString() === selectedDate)
        : events.filter(e => new Date(e.event_date) >= new Date() && new Date(e.event_date).getMonth() === currentDate.getMonth()).slice(0, 5);

    return (
        <div className="calendar-page section">
            <div className="container">
                <div className="page-header center">
                    <h1>Academic Calendar</h1>
                    <p>Keep track of important school dates, exams, and holidays.</p>
                </div>

                <div className="calendar-container card">
                    <div className="calendar-header">
                        <button onClick={prevMonth} className="nav-btn"><ChevronLeft size={24} /></button>
                        <h2>{getMonthName(currentDate)}</h2>
                        <button onClick={nextMonth} className="nav-btn"><ChevronRight size={24} /></button>
                    </div>

                    <div className="calendar-grid-header">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                    </div>

                    <div className="calendar-grid">
                        {renderCalendar()}
                    </div>
                </div>

                {/* Exam Timetables Section */}
                <TimetablesSection />

                <div className="events-agenda section-grey" style={{ marginTop: '3rem' }}>
                    <h3>{selectedDate ? `Events for ${new Date(selectedDate).toLocaleDateString()}` : 'Upcoming Events This Month'}</h3>
                    <div className="agenda-list">
                        {loading ? <p>Loading events...</p> : selectedDayEvents.length === 0 ? (
                            <p className="no-events text-muted">No events scheduled for this period.</p>
                        ) : (
                            selectedDayEvents.map(event => (
                                <div key={event.id} className="agenda-item card">
                                    <div className={`event-date-box ${event.category.toLowerCase().replace(/\s+/g, '-')}`}>
                                        <span className="month">{new Date(event.event_date).toLocaleString('default', { month: 'short' })}</span>
                                        <span className="day">{new Date(event.event_date).getDate()}</span>
                                    </div>
                                    <div className="event-details">
                                        <h4>{event.title}</h4>
                                        <div className="meta">
                                            <span className="category-tag">{event.category}</span>
                                            {event.location && <span><MapPin size={14} /> {event.location}</span>}
                                            <span><Clock size={14} /> {new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        {event.description && <p>{event.description}</p>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Submenu to fetch and display timetables
const TimetablesSection = () => {
    const [timetables, setTimetables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fileText, setFileText] = useState(null); // Used for icon, since FileText is defined outside

    useEffect(() => {
        // Dynamically import icon or define inside? It's imported at top.
        // We'll just fetch data.
        const fetchTimetables = async () => {
            const { data } = await supabase
                .from('past_papers')
                .select('*')
                .eq('paper_type', 'Timetable')
                .order('created_at', { ascending: false })
                .limit(3);
            if (data) setTimetables(data);
            setLoading(false);
        };
        fetchTimetables();
    }, []);

    if (loading || timetables.length === 0) return null;

    return (
        <div className="timetables-section card" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b45309' }}>
                    <CalendarIcon size={20} /> Latest Exam Timetables
                </h3>
            </div>
            <div className="timetables-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {timetables.map(t => (
                    <a key={t.id} href={t.file_url} target="_blank" rel="noopener noreferrer" className="timetable-card" style={{ display: 'flex', flexDirection: 'column', padding: '1rem', background: '#fffbeb', borderRadius: '8px', textDecoration: 'none', color: 'inherit', border: '1px solid #fcd34d' }}>
                        <span style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{t.title}</span>
                        <span style={{ fontSize: '0.85rem', color: '#92400e' }}>{t.level} • {t.year}</span>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default AcademicCalendar;
