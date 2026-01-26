import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { Bell, X, Info, AlertTriangle, AlertCircle, ChevronRight } from 'lucide-react';
import './NotificationCenter.css';

const NotificationCenter = ({ isOpen, onClose }) => {
    const { t } = useTranslation(['common']);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchAlerts();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const fetchAlerts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('site_alerts')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);

            if (data) setAlerts(data);
        } catch (error) {
            console.error('Error fetching alerts:', error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'warning': return <AlertTriangle size={20} className="text-warning" />;
            case 'error': return <AlertCircle size={20} className="text-error" />;
            default: return <Info size={20} className="text-info" />;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="notification-center-overlay" onClick={onClose}>
            <div className="notification-center-drawer" onClick={e => e.stopPropagation()}>
                <div className="drawer-header">
                    <div className="header-title">
                        <Bell size={20} />
                        <h3>{t('common:mobile.recent_updates')}</h3>
                    </div>
                    <button className="close-drawer" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="drawer-content">
                    {loading ? (
                        <div className="drawer-loading">
                            <div className="spinner"></div>
                            <p>{t('common:common.loading')}</p>
                        </div>
                    ) : alerts.length === 0 ? (
                        <div className="drawer-empty">
                            <Bell size={48} className="empty-icon" />
                            <p>{t('common:mobile.no_updates')}</p>
                        </div>
                    ) : (
                        <div className="alerts-list">
                            {alerts.map((alert) => (
                                <div key={alert.id} className={`alert-item ${alert.is_active ? 'active' : 'historical'}`}>
                                    <div className="alert-icon">
                                        {getIcon(alert.type)}
                                    </div>
                                    <div className="alert-body">
                                        <div className="alert-meta">
                                            <span className="alert-type">{alert.type || 'info'}</span>
                                            <span className="alert-date">
                                                {new Date(alert.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="alert-text">{alert.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="drawer-footer">
                    <button className="btn btn-primary full-width" onClick={onClose}>
                        {t('common:mobile.done')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationCenter;
