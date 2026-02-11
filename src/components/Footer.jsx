import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, Users, Newspaper, Calendar, Phone, FileText, Image, HelpCircle } from 'lucide-react';
import './Footer.css';
import { useSchool } from '../contexts/SchoolContext';

const Footer = () => {
    const { t } = useTranslation(['common']);
    const { school } = useSchool();
    const currentYear = new Date().getFullYear();
    const [latestNews, setLatestNews] = useState([]);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [subResult, setSubResult] = useState({ type: '', message: '' });

    useEffect(() => {
        const fetchFooterNews = async () => {
            if (!school?.id) return;
            const { data } = await supabase
                .from('news')
                .select('id, title, slug, published_at, image_url')
                .eq('school_id', school.id)
                .eq('is_published', true)
                .order('created_at', { ascending: false })
                .limit(2);
            if (data) setLatestNews(data);
        };
        fetchFooterNews();
    }, [school?.id]);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!newsletterEmail) return;

        setSubmitting(true);
        setSubResult({ type: '', message: '' });

        try {
            const { error } = await supabase
                .from('newsletter_subscriptions')
                .insert([{ email: newsletterEmail }]);

            if (error) {
                if (error.code === '23505') {
                    setSubResult({ type: 'success', message: t('footer.newsletter_already') });
                } else throw error;
            } else {
                setSubResult({ type: 'success', message: t('footer.newsletter_success') });
                setNewsletterEmail('');
            }
        } catch (err) {
            console.error('Subscription error:', err);
            setSubResult({ type: 'error', message: t('footer.newsletter_error') });
        } finally {
            setSubmitting(false);
            // Clear message after 5 seconds
            setTimeout(() => setSubResult({ type: '', message: '' }), 5000);
        }
    };

    return (
        <footer className="footer section-grey">
            <div className="container footer-container">

                {/* School Info */}
                <div className="footer-column">
                    <h3 className="footer-heading">{school?.name || 'Bugisu High School'}</h3>
                    <p className="footer-text">
                        {t('footer.about')}
                    </p>
                    <div className="footer-contact">
                        <p><strong>{t('footer.address')}:</strong> {school?.address || 'P.O.BOX 923, MBALE (U)'}</p>
                        <p><strong>{t('footer.phone')}:</strong> <a href="tel:0781425483">0781 425483</a> / <a href="tel:0701814161">0701 814161</a></p>
                        <p><strong>{t('footer.email')}:</strong> <a href="mailto:bugisuhighschool@gmail.com">bugisuhighschool@gmail.com</a></p>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="footer-column">
                    <h3 className="footer-heading">{t('footer.quick_links')}</h3>
                    <ul className="footer-links">
                        <li><Link to="/academics"><BookOpen size={16} /> {t('nav.academics')}</Link></li>
                        <li><Link to="/departments"><Users size={16} /> Faculty & Staff</Link></li>
                        <li><Link to="/admissions"><Users size={16} /> {t('nav.admissions')}</Link></li>
                        <li><Link to="/news"><Newspaper size={16} /> {t('footer.latest_news')}</Link></li>
                        <li><Link to="/events"><Calendar size={16} /> {t('nav.events')}</Link></li>
                        <li><Link to="/contact"><Phone size={16} /> {t('nav.contact')}</Link></li>
                    </ul>
                </div>

                {/* Resources */}
                <div className="footer-column">
                    <h3 className="footer-heading">{t('footer.resources')}</h3>
                    <ul className="footer-links">
                        <li><Link to="/resources"><FileText size={16} /> {t('nav.resources')}</Link></li>
                        <li><Link to="/calendar"><Calendar size={16} /> {t('nav.calendar')}</Link></li>
                        <li><Link to="/gallery"><Image size={16} /> {t('nav.gallery')}</Link></li>
                        <li><Link to="/faq"><HelpCircle size={16} /> FAQ</Link></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div className="footer-column newsletter-col">
                    <h3 className="footer-heading">{t('footer.newsletter_title')}</h3>
                    <p className="footer-text" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                        {t('footer.newsletter_desc')}
                    </p>
                    <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
                        <input
                            type="email"
                            placeholder={t('footer.newsletter_placeholder')}
                            required
                            value={newsletterEmail}
                            onChange={(e) => setNewsletterEmail(e.target.value)}
                        />
                        <button type="submit" disabled={submitting}>
                            {submitting ? '...' : t('footer.newsletter_btn')}
                        </button>
                    </form>
                    {subResult.message && (
                        <p className={`footer-sub-msg ${subResult.type}`} style={{
                            fontSize: '0.8rem',
                            marginTop: '0.5rem',
                            color: subResult.type === 'success' ? '#4ade80' : '#f87171'
                        }}>
                            {subResult.message}
                        </p>
                    )}
                </div>

                {/* Latest News */}
                <div className="footer-column latest-news-col">
                    <h3 className="footer-heading">{t('footer.latest_news')}</h3>
                    <ul className="footer-links">
                        {latestNews.length > 0 ? (
                            latestNews.map(news => (
                                <li key={news.id} className="footer-news-item">
                                    {news.image_url && (
                                        <img src={news.image_url} alt={news.title} className="footer-news-img" />
                                    )}
                                    <div>
                                        <Link to={`/news/${news.slug}`} className="footer-news-title">
                                            {news.title}
                                        </Link>
                                        <span className="footer-news-date">
                                            {new Date(news.published_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li>{t('footer.no_news')}</li>
                        )}
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; {currentYear} {school?.name || 'Bugisu High School'}. {t('footer.rights')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
