import React, { Suspense } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

import LiveChat from './LiveChat';
import FeedbackBox from './FeedbackBox';
import NotificationChain from './NotificationChain';
import BottomNav from './BottomNav';
import FAB from './ui/FAB';
import NetworkStatus from './ui/NetworkStatus';
import MotionLoader from './ui/MotionLoader';

const Layout = () => {
    return (
        <div className="app-wrapper">
            <Navbar />
            <NotificationChain />
            <NetworkStatus />
            <main className="main-content">
                <Suspense fallback={<MotionLoader />}>
                    <Outlet />
                </Suspense>
            </main>
            <Footer />
            <BottomNav />
            <FAB />
            <LiveChat />
            <FeedbackBox />
        </div>
    );
};

export default Layout;
