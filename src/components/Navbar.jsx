import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import NotificationCenter from './ui/NotificationCenter';
import LanguageSwitcher from './LanguageSwitcher';
import SearchOverlay from './SearchOverlay';
import FloatingMenuButton from './ui/FloatingMenuButton';
import { supabase } from '../lib/supabase';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
    const location = useLocation();
    const { t } = useTranslation(['common', 'home']);
    const navigate = useNavigate();

    const triggerAdminAccess = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login', { state: { secretAccess: true } });
    };

    const [logoClicks, setLogoClicks] = useState(0);
    const longPressTimerRef = React.useRef(null);

    // Close mobile menu on route change
    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
        setActiveDropdown(null);
    }, [location.pathname]);

    // Scroll Listener for Floating Menu
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        const handleResize = () => {
            setIsMobile(window.innerWidth < 900);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Secret Trigger: Shift + A
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Check if user is typing in an input or textarea
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

            if (e.shiftKey && (e.key === 'A' || e.key === 'a')) {
                triggerAdminAccess();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate]);

    // Secret Trigger: Typing 'admin'
    useEffect(() => {
        let keyBuffer = '';
        const handleTyping = (e) => {
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

            keyBuffer += e.key.toLowerCase();
            if (keyBuffer.length > 5) {
                keyBuffer = keyBuffer.slice(-5);
            }

            if (keyBuffer === 'admin') {
                triggerAdminAccess();
                keyBuffer = ''; // Reset after success
            }
        };

        window.addEventListener('keydown', handleTyping);
        return () => window.removeEventListener('keydown', handleTyping);
    }, [navigate]);

    // Secret Trigger: 7 Clicks on Logo
    useEffect(() => {
        let resetTimer;
        if (logoClicks > 0) {
            resetTimer = setTimeout(() => {
                setLogoClicks(0);
            }, 2000); // 2 seconds window to click
        }

        if (logoClicks >= 7) {
            triggerAdminAccess();
            setLogoClicks(0);
        }

        return () => clearTimeout(resetTimer);
    }, [logoClicks, navigate]);

    // Secret Trigger: Logo Click Handler
    const handleLogoClick = () => {
        setLogoClicks(prev => prev + 1);
    };

    // Secret Trigger: Long Press Handlers
    const handleMouseDown = () => {
        longPressTimerRef.current = setTimeout(() => {
            triggerAdminAccess();
        }, 3000); // 3 seconds long press
    };

    const handleMouseUp = () => {
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    };

    const links = [
        { name: t('nav.home'), path: '/' },
        {
            name: t('nav.about'),
            path: null,
            children: [
                { name: t('nav.overview'), path: '/about' },
                { name: t('nav.news'), path: '/news' },
                { name: t('nav.tour'), path: '/virtual-tour' },
                { name: t('nav.gallery'), path: '/gallery' },
                { name: t('nav.contact'), path: '/contact' }
            ]
        },
        {
            name: t('nav.academics'),
            path: null,
            children: [
                { name: t('nav.overview'), path: '/academics' },
                { name: 'Faculty & Staff', path: '/departments' },
                { name: t('nav.resources'), path: '/resources' },
                { name: t('nav.calendar'), path: '/calendar' }
            ]
        },
        {
            name: t('nav.student_life'),
            path: null,
            children: [
                { name: t('nav.overview'), path: '/student-life' },
                { name: t('nav.events'), path: '/events' },
                { name: t('nav.sports'), path: '/sports' },
                { name: t('nav.clubs'), path: '/clubs' },
                { name: 'Parents', path: '/parents' },
                { name: 'Digital ID Portal', path: '/student-portal' }
            ]
        },
        {
            name: t('nav.admissions'),
            path: null,
            children: [
                { name: 'Overview', path: '/admissions' },
                { name: 'Scholarships', path: '/scholarships' },
                { name: 'Apply Online', path: '/apply' }
            ]
        },
    ];

    const toggleDropdown = (index) => {
        if (activeDropdown === index) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(index);
        }
    };

    return (
        <>
            <nav className={`navbar ${isScrolled ? 'scrolled-hidden' : ''}`}>
                <div className="navbar-container">
                    <div
                        className="logo"
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleMouseDown}
                        onTouchEnd={handleMouseUp}
                    >
                        <Link to="/" onClick={handleLogoClick}>
                            <img src="/logo.png?v=2" alt="BHS Logo" className="logo-img" />
                            <span className="logo-text">{t('app.title')}</span>
                        </Link>
                    </div>

                    <div className="nav-actions">
                        <button className="search-trigger-btn desktop-only" onClick={() => setIsSearchOpen(true)} aria-label="Search">
                            <Search size={22} />
                        </button>
                        <div className="desktop-only">
                            <NotificationCenter />
                        </div>
                        <LanguageSwitcher />

                        {/* Desktop Menu */}
                        <div className="desktop-actions">
                            <div className="nav-links desktop-links">
                                {links.map((link, index) => (
                                    <div key={index} className={`nav-item-desktop ${link.children ? 'has-dropdown' : ''}`}>
                                        {link.path ? (
                                            <Link
                                                to={link.path}
                                                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                                            >
                                                {link.name}
                                            </Link>
                                        ) : (
                                            <span className="nav-link dropdown-trigger">
                                                {link.name} <ChevronDown size={14} />
                                            </span>
                                        )}

                                        {link.children && (
                                            <div className="dropdown-menu">
                                                {link.children.map((child, cIndex) => (
                                                    <Link
                                                        key={cIndex}
                                                        to={child.path}
                                                        className={`dropdown-link ${location.pathname === child.path ? 'active' : ''}`}
                                                    >
                                                        {child.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <Link to="/apply" className="btn btn-primary ml-2">{t('home:cta_apply')}</Link>
                        </div>

                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay ${isOpen ? 'active' : ''}`}>
                <div className="mobile-menu-header">
                    <div className="logo-mobile">
                        <img src="/logo.png?v=2" alt="BHS Logo" className="logo-img-sm" />
                    </div>
                    <button className="close-menu-btn" onClick={() => setIsOpen(false)}>
                        <X size={28} />
                    </button>
                </div>

                <ul className="nav-menu-mobile">
                    {/* Mobile Search Item */}
                    <li className="nav-item">
                        <div className="mobile-search-row" onClick={() => { setIsSearchOpen(true); setIsOpen(false); }}>
                            <div className="mobile-search-bar-mock">
                                <Search size={18} />
                                <span>{t('search.placeholder')}</span>
                            </div>
                        </div>
                    </li>
                    {links.map((link, index) => (
                        <li key={index} className="nav-item">
                            {link.children ? (
                                <>
                                    <div
                                        className="nav-link mobile-dropdown-trigger"
                                        onClick={() => toggleDropdown(index)}
                                    >
                                        {link.name}
                                        <ChevronDown
                                            size={16}
                                            className={`dropdown-arrow ${activeDropdown === index ? 'rotate' : ''}`}
                                        />
                                    </div>
                                    <div className={`mobile-dropdown-content ${activeDropdown === index ? 'open' : ''}`}>
                                        {link.children.map((child, cIndex) => (
                                            <Link
                                                key={cIndex}
                                                to={child.path}
                                                className={`dropdown-link mobile-sublink ${location.pathname === child.path ? 'active' : ''}`}
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {child.name}
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <Link
                                    to={link.path}
                                    className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            )}
                        </li>
                    ))}
                    <li className="nav-item margin-top">
                        <div className="mobile-notif-row">
                            <NotificationCenter />
                            <span className="mobile-notif-label">Notifications</span>
                        </div>
                    </li>
                    <li className="nav-item margin-top">
                        <Link to="/apply" className="btn btn-primary full-width" onClick={() => setIsOpen(false)}>
                            {t('home:cta_apply')}
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Floating Menu Button */}
            <FloatingMenuButton
                visible={isScrolled && !isOpen}
                onClick={() => setIsOpen(true)}
            />

            {/* Search Overlay */}
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
};

export default Navbar;
