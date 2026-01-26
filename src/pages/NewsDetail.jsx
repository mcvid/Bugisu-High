import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import { shareContent } from '../lib/mobileUtils';
import SEO from '../components/SEO';
import Skeleton from '../components/ui/Skeleton';
import './NewsDetail.css';
import '../components/ui/Skeleton.css';

const NewsDetail = () => {
    const { slug } = useParams();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('news')
                    .select('*')
                    .eq('slug', slug)
                    .single();

                if (error) throw error;
                setNews(data);
            } catch (err) {
                console.error('Error fetching news detail:', err);
                setError('Article not found.');
            } finally {
                setLoading(false);
            }
        };

        fetchNewsDetail();
    }, [slug]);

    if (loading) return (
        <div className="section container">
            <div className="back-link mb-4">
                <ArrowLeft size={18} /> Back to All News
            </div>
            <article className="news-article">
                <Skeleton type="title" />
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ width: '100px', height: '1.25rem', backgroundColor: '#e2e8f0', borderRadius: '4px' }} className="shimmer"></div>
                    <div style={{ width: '120px', height: '1.25rem', backgroundColor: '#e2e8f0', borderRadius: '4px' }} className="shimmer"></div>
                </div>
                <Skeleton type="rect" className="mb-8" />
                <Skeleton type="text" count={5} />
            </article>
        </div>
    );

    if (error || !news) return (
        <div className="section container text-center">
            <h2>{error || 'Article not found'}</h2>
            <Link to="/news" className="btn btn-primary mt-4">
                <ArrowLeft size={18} /> Back to News
            </Link>
        </div>
    );

    return (
        <div className="news-detail-page section">
            <SEO
                title={news.title}
                description={news.excerpt || news.content?.substring(0, 160).replace(/<[^>]*>?/gm, '')}
                image={news.image_url}
                article={true}
                url={`/news/${news.slug}`}
            />

            <div className="container">
                <Link to="/news" className="back-link mb-4">
                    <ArrowLeft size={18} /> Back to All News
                </Link>

                <article className="news-article">
                    <header className="article-header">
                        <div className="article-meta">
                            <span className="meta-item">
                                <Calendar size={16} />
                                {new Date(news.published_at || news.created_at).toLocaleDateString()}
                            </span>
                            {news.author && (
                                <span className="meta-item">
                                    <User size={16} />
                                    {news.author}
                                </span>
                            )}
                            <button
                                className="share-article-btn"
                                onClick={() => shareContent({
                                    title: news.title,
                                    text: news.excerpt || news.title,
                                    url: window.location.href
                                })}
                            >
                                <Share2 size={16} /> Share
                            </button>
                        </div>
                        <h1 className="article-title">{news.title}</h1>
                        {news.excerpt && <p className="article-excerpt">{news.excerpt}</p>}
                    </header>

                    {news.image_url && (
                        <div className="article-image">
                            <img src={news.image_url} alt={news.title} />
                        </div>
                    )}

                    <div className="article-content" dangerouslySetInnerHTML={{ __html: news.content }} />
                </article>
            </div>
        </div>
    );
};

export default NewsDetail;
