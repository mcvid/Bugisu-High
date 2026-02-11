import React from 'react';
import { useNews } from '../hooks/useQueries';
import NewsCard from '../components/NewsCard';
import SEO from '../components/SEO';
import { CardSkeleton } from '../components/ui/Skeleton';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import UniversalHero from '../components/ui/UniversalHero';
import { RefreshCw } from 'lucide-react';
import './News.css';
import '../components/ui/Skeleton.css';
import { useSchool } from '../contexts/SchoolContext';

const News = () => {
    const { school } = useSchool();
    const { data: newsItems, isLoading, error, refetch } = useNews(school?.id);
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

            <UniversalHero pagePath="/news" height="35vh" showImage={false}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ color: 'white' }}>News & Announcements</h1>
                    <p className="page-subtitle" style={{ color: 'rgba(255,255,255,0.9)' }}>Stay updated with the latest happenings at Bugisu High School.</p>
                </div>
            </UniversalHero>

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
