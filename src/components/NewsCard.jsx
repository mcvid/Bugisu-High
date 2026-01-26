import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, Users } from 'lucide-react';
import OptimizedImage from './ui/OptimizedImage';
import './NewsCard.css';

const NewsCard = ({ news, index }) => {
    const formattedDate = new Date(news.published_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="news-card" style={{ '--index': index }}>
            {news.image_url && (
                <div className="news-card-image">
                    <OptimizedImage
                        src={news.image_url}
                        alt={news.title}
                        aspectRatio="16/9"
                    />
                </div>
            )}
            <div className="news-card-content">
                <div className="news-meta">
                    <Users size={14} className="meta-icon" />
                    <span>School Admin</span>
                </div>
                <div className="news-meta">
                    <Calendar size={14} className="meta-icon" />
                    <span>{formattedDate}</span>
                </div>
                <h3 className="news-title">{news.title}</h3>

                <Link to={`/news/${news.slug}`} className="news-link">
                    Read More <ChevronRight size={16} />
                </Link>
            </div>
        </div>
    );
};

export default NewsCard;
