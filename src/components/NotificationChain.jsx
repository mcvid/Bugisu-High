import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { X, Bell } from 'lucide-react';
import './NotificationChain.css';

const NotificationChain = () => {
    const { t } = useTranslation(['common', 'home']);
    const [alert, setAlert] = useState(null);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        const fetchAlert = async () => {
            const { data, error } = await supabase
                .from('site_alerts')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (data) {
                setAlert(data);
                setIsVisible(true);
            }
        };

        fetchAlert();
    }, []);

    useEffect(() => {
        if (!alert || !alert.target_date) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const target = new Date(alert.target_date).getTime();
            const difference = target - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [alert]);

    const handleDismiss = () => {
        setIsVisible(false);
    };

    if (!alert || !isVisible) return null;

    return (
        <div className="notification-chain-wrapper">
            <div className="chain-animation-container">
                <div className="chain-links">
                    <div className="chain-link"></div>
                    <div className="chain-link"></div>
                </div>

                <div className="notification-box">
                    <button className="close-chain" onClick={handleDismiss} aria-label="Close notification">
                        <X size={18} />
                    </button>

                    <div className="alert-label">
                        {(alert.type || 'info').toUpperCase()}
                    </div>

                    <p className="alert-message">{alert.message}</p>

                    {alert.target_date && (
                        <div className="countdown-container">
                            <div className="countdown-label">
                                {alert.target_label || t('home:quick_info.next_event')}
                            </div>
                            <div className="countdown-timer">
                                <div className="timer-part">
                                    <span className="value">{timeLeft.days}</span>
                                    <span className="label">{t('common:common.timer.days')}</span>
                                </div>
                                <div className="timer-part">
                                    <span className="value">{String(timeLeft.hours).padStart(2, '0')}</span>
                                    <span className="label">{t('common:common.timer.hours')}</span>
                                </div>
                                <div className="timer-part">
                                    <span className="value">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                    <span className="label">{t('common:common.timer.minutes')}</span>
                                </div>
                                <div className="timer-part">
                                    <span className="value">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                    <span className="label">{t('common:common.timer.seconds')}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationChain;
