import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import './NetworkStatus.css';

const NetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showStatus, setShowStatus] = useState(false);
    const [statusType, setStatusType] = useState(null); // 'online' or 'offline'

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setStatusType('online');
            setShowStatus(true);
            // Hide "back online" message after 3 seconds
            setTimeout(() => {
                setShowStatus(false);
                setStatusType(null);
            }, 3000);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setStatusType('offline');
            setShowStatus(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!showStatus && isOnline) return null;

    return (
        <div className={`network-status-banner ${statusType || (isOnline ? '' : 'offline')}`}>
            <div className="status-content">
                {isOnline ? (
                    <>
                        <Wifi size={16} />
                        <span>You are back online</span>
                    </>
                ) : (
                    <>
                        <WifiOff size={16} />
                        <span>You are currently offline. Some features may be limited.</span>
                    </>
                )}
            </div>
        </div>
    );
};

export default NetworkStatus;
