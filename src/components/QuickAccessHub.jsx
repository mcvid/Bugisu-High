import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, FileText, ClipboardList, CreditCard, Bell, ExternalLink, Megaphone } from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import DigitalIDCard from './ui/DigitalIDCard';
import './QuickAccessHub.css';

const QuickAccessHub = () => {
    const { t } = useTranslation(['common']);
    const [isNotifOpen, setIsNotifOpen] = React.useState(false);
    const [isIdOpen, setIsIdOpen] = React.useState(false);

    const tools = [
        {
            title: t('common:shortcuts.intake'),
            icon: <Calendar size={24} />,
            path: '/admissions',
            color: '#3b82f6'
        },
        {
            title: t('common:shortcuts.requirements'),
            icon: <ClipboardList size={24} />,
            path: '/admissions',
            color: '#10b981'
        },
        {
            title: t('common:shortcuts.calendar'),
            icon: <FileText size={24} />,
            path: '/calendar',
            color: '#f59e0b'
        },
        {
            title: t('common:shortcuts.fees'),
            icon: <CreditCard size={24} />,
            path: '/parent/fees',
            color: '#ef4444'
        },
        {
            title: t('common:shortcuts.alerts'),
            icon: <Megaphone size={24} />,
            action: () => setIsNotifOpen(true),
            color: '#8b5cf6'
        },
        {
            title: t('common:mobile.digital_id'),
            icon: <CreditCard size={24} />,
            action: () => setIsIdOpen(true),
            color: '#d946ef'
        }
    ];

    return (
        <section className="quick-access-section desktop-hidden">
            <div className="section-header">
                <h3>{t('common:mobile.utilities')}</h3>
                <p>{t('common:mobile.parent_student')}</p>
            </div>
            <div className="quick-access-grid">
                {tools.map((tool, index) => (
                    tool.path ? (
                        <Link key={index} to={tool.path} className="quick-tool-card">
                            <div className="tool-icon" style={{ backgroundColor: `${tool.color}15`, color: tool.color }}>
                                {tool.icon}
                            </div>
                            <span className="tool-title">{tool.title}</span>
                        </Link>
                    ) : (
                        <button key={index} onClick={tool.action} className="quick-tool-card btn-reset">
                            <div className="tool-icon" style={{ backgroundColor: `${tool.color}15`, color: tool.color }}>
                                {tool.icon}
                            </div>
                            <span className="tool-title">{tool.title}</span>
                        </button>
                    )
                ))}
            </div>

            <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
            <DigitalIDCard isOpen={isIdOpen} onClose={() => setIsIdOpen(false)} />
        </section>
    );
};

export default QuickAccessHub;
