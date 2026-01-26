import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, GraduationCap, ClipboardCheck, Newspaper, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { triggerHaptic } from '../lib/mobileUtils';
import './BottomNav.css';

const BottomNav = () => {
    const location = useLocation();
    const { t } = useTranslation(['common']);

    const navItems = [
        { icon: Home, label: t('nav.home'), path: '/' },
        { icon: GraduationCap, label: t('nav.academics'), path: '/academics' },
        { icon: ClipboardCheck, label: t('nav.admissions'), path: '/admissions' },
        { icon: Newspaper, label: t('nav.news'), path: '/news' },
        { icon: MessageSquare, label: t('nav.contact'), path: '/contact' }
    ];

    // Don't show on admin routes
    if (location.pathname.startsWith('/admin')) return null;

    return (
        <nav className="bottom-nav">
            <div className="bottom-nav-container">
                {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={index}
                            to={item.path}
                            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => triggerHaptic(10)}
                        >
                            <Icon size={24} className="bottom-nav-icon" />
                            <span className="bottom-nav-label">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
