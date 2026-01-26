import React from 'react';
import { useNews } from '../hooks/useQueries';
import NewsCard from '../components/NewsCard';
import SEO from '../components/SEO';
import { CardSkeleton } from '../components/ui/Skeleton';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import { RefreshCw } from 'lucide-react';
import './News.css';
import '../components/ui/Skeleton.css';

const News = () => {
    const { data: newsItems, isLoading, error, refetch } = useNews();
    const {
        pullDistance,
        isRefreshing,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd
    } = usePullToRefresh(refetch);

    return (
        <div
            className="section container news-page"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <SEO
                title="News & Announcements"
                description="Stay updated with the latest news, announcements, and stories from Bugisu High School."
                url="/news"
            />

            {/* Pull to Refresh Indicator */}
            <div
                className={`ptr-indicator ${isRefreshing ? 'refreshing' : ''}`}
                style={{
                    height: `${pullDistance}px`,
                    opacity: pullDistance / 40
                }}
            >
                <RefreshCw size={24} className={isRefreshing ? 'spin' : ''} />
            </div>

            <div className="page-header">
                <h1>News & Announcements</h1>
                <p className="page-subtitle">Stay updated with the latest happenings at Bugisu High School.</p>
            </div>

            {isLoading && !isRefreshing ? (
                <div className="news-grid">
                    <CardSkeleton count={6} />
                </div>
            ) : error ? (
                <div className="error-state">
                    <p>Failed to load news. Please try again later.</p>
                </div>
            ) : newsItems?.length === 0 ? (
                <div className="empty-state">
                    <p>No news updates at the moment. Please check back later.</p>
                </div>
            ) : (
                <div className="news-grid">
                    {newsItems.map((item, index) => (
                        <NewsCard key={item.id} news={item} index={index} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default News;
