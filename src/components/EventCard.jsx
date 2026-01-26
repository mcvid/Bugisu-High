import React from 'react';
import { Calendar, MapPin, Tag } from 'lucide-react';
import './EventCard.css';

const EventCard = ({ event, index }) => {
    const eventDate = new Date(event.event_date);
    const day = eventDate.getDate();
    const month = eventDate.toLocaleString('default', { month: 'short' });
    const year = eventDate.getFullYear();
    const time = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="event-card" style={{ '--index': index }}>
            <div className="event-date-box">
                <span className="event-day">{day}</span>
                <span className="event-month">{month}</span>
            </div>
            <div className="event-details">
                <div className="event-meta">
                    <span className="event-category">
                        <Tag size={14} /> {event.category}
                    </span>
                    <span className="event-time">
                        {time}
                    </span>
                </div>
                <h3 className="event-title">{event.title}</h3>
                {event.location && (
                    <p className="event-location">
                        <MapPin size={16} /> {event.location}
                    </p>
                )}
                <p className="event-description">{event.description}</p>
            </div>
        </div>
    );
};

export default EventCard;
