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

const Layout = () => {
    return (
        <div className="app-wrapper">
            <Navbar />
            <NotificationChain />
            <NetworkStatus />
            <main className="main-content">
                <Suspense fallback={<div className="content-loader"></div>}>
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
