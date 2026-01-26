import React from 'react';
import { useEvents } from '../hooks/useQueries';
import EventCard from '../components/EventCard';
import SEO from '../components/SEO';
import { CardSkeleton } from '../components/ui/Skeleton';
import './Events.css';

const Events = () => {
    const { data: events, isLoading } = useEvents();

    const upcomingEvents = events?.filter(e => new Date(e.event_date) >= new Date()) || [];
    const pastEvents = events?.filter(e => new Date(e.event_date) < new Date()).reverse() || [];

    return (
        <div className="section container events-page">
            <SEO
                title="Upcoming Events"
                description="View the upcoming events, academic dates, and school activities at Bugisu High School."
                url="/events"
            />
            <div className="page-header">
                <h1>School Events</h1>
                <p className="page-subtitle">Mark your calendars for our upcoming activities.</p>
            </div>

            {isLoading ? (
                <div className="events-section">
                    <h2 className="section-title">Upcoming Events</h2>
                    <div className="events-list">
                        {[1, 2, 3].map((n) => <CardSkeleton key={n} />)}
                    </div>
                </div>
            ) : (
                <>
                    <section className="events-section">
                        <h2 className="section-title">Upcoming Events</h2>
                        {upcomingEvents.length === 0 ? (
                            <p className="empty-text">No upcoming events scheduled.</p>
                        ) : (
                            <div className="events-list">
                                {upcomingEvents.map((event, index) => (
                                    <EventCard key={event.id} event={event} index={index} />
                                ))}
                            </div>
                        )}
                    </section>

                    {pastEvents.length > 0 && (
                        <section className="events-section section-grey" style={{ padding: '2rem', borderRadius: '8px', marginTop: '4rem' }}>
                            <h2 className="section-title">Past Events</h2>
                            <div className="events-list">
                                {pastEvents.map((event, index) => (
                                    <EventCard key={event.id} event={event} index={index} />
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}
        </div>
    );
};

export default Events;
