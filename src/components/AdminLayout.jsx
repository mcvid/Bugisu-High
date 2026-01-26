import React, { Suspense } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
    LayoutDashboard, Users, Video, Image, FileText,
    MessageSquare, ThumbsUp, Database, Award, BookOpen, Shield, Map,
    LogOut, Menu, X, Bell, Megaphone, Home as HomeIcon, School, Activity, DollarSign, Mail, Send
} from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const [counts, setCounts] = React.useState({
        admissions: 0,
        contact: 0
    });

    React.useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [msgCount, appCount, inqCount] = await Promise.all([
                    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'Unread'),
                    supabase.from('admission_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
                    supabase.from('admissions_inquiries').select('*', { count: 'exact', head: true }).eq('status', 'pending')
                ]);

                setCounts({
                    contact: msgCount.count || 0,
                    admissions: (appCount.count || 0) + (inqCount.count || 0)
                });
            } catch (error) {
                console.error('Error fetching admin counts:', error);
            }
        };

        fetchCounts();
        const interval = setInterval(fetchCounts, 30000); // 30s refresh
        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    const navItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: <FileText size={20} />, label: 'News', path: '/admin/news' },
        { icon: <Megaphone size={20} />, label: 'Announcements', path: '/admin/announcements' },
        { icon: <Send size={20} />, label: 'Leave Requests', path: '/admin/leave-requests' },
        { icon: <Mail size={20} />, label: 'Parent Emails', path: '/admin/parent-emails' },
        { icon: <Users size={20} />, label: 'Events', path: '/admin/events' },
        { icon: <HomeIcon size={20} />, label: 'Hero Section', path: '/admin/hero' },
        { icon: <School size={20} />, label: 'Administration', path: '/admin/administration' },
        { icon: <BookOpen size={20} />, label: 'Academics', path: '/admin/academics' },
        { icon: <Video size={20} />, label: 'Video Manager', path: '/admin/video' },
        { icon: <Image size={20} />, label: 'Galleries', path: '/admin/gallery' },
        { icon: <ThumbsUp size={20} />, label: 'Feedback', path: '/admin/feedback' },
        { icon: <MessageSquare size={20} />, label: 'Live Chat', path: '/admin/chat' },
        { icon: <DollarSign size={20} />, label: 'Finance & Fees', path: '/admin/finance' },
        { icon: <Users size={20} />, label: 'Students', path: '/admin/students' },
        { icon: <Users size={20} />, label: 'Admissions', path: '/admin/admissions', badge: counts.admissions },
        { icon: <Award size={20} />, label: 'Achievements', path: '/admin/achievements' },
        { icon: <BookOpen size={20} />, label: 'Resources', path: '/admin/resources' },
        { icon: <Shield size={20} />, label: 'Sports', path: '/admin/sports' },
        { icon: <Menu size={20} />, label: 'Contact', path: '/admin/contact', badge: counts.contact },
        { icon: <Map size={20} />, label: 'Virtual Tour', path: '/admin/tour' },
        { icon: <Users size={20} />, label: 'Teachers', path: '/admin/teachers' },
        { icon: <Activity size={20} />, label: 'Activity', path: '/admin/activity' },
        { icon: <Bell size={20} />, label: 'Site Alerts', path: '/admin/alerts' },
    ];

    return (
        <div className="admin-layout">
            {/* Mobile Header (Fixed) */}
            <header className="admin-mobile-header">
                <div className="mobile-branding">
                    <img src="/logo.png" alt="BHS Logo" className="mobile-logo" />
                    <div className="mobile-titles">
                        <h1>Bugisu High School</h1>
                        <span>Admin Portal</span>
                    </div>
                </div>
                <button className="mobile-menu-trigger" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <div className="sidebar-branding">
                        <img src="/logo.png" alt="Logo" className="sidebar-logo" />
                        <h2>Admin Portal</h2>
                    </div>
                </div>

                <nav className="admin-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`admin-nav-link ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                        >
                            {item.icon} {item.label}
                            {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-topbar">
                    <button className="menu-trigger" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <Menu size={24} />
                    </button>
                    <div className="user-info">
                        <Link to="/admin/activity" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'inherit', textDecoration: 'none' }}>
                            <Activity size={18} />
                            <span>Activity</span>
                        </Link>
                        <span>Administrator</span>
                        <div className="avatar">A</div>
                    </div>
                </header>
                <div className="admin-content">
                    <Suspense fallback={<div className="content-loader"></div>}>
                        <Outlet />
                    </Suspense>
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className={`admin-mobile-nav ${isSidebarOpen ? 'hidden' : ''}`}>
                <Link to="/admin/dashboard" className={`mobile-nav-link ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}>
                    <LayoutDashboard size={22} />
                    <span>Home</span>
                </Link>
                <Link to="/admin/news" className={`mobile-nav-link ${location.pathname.startsWith('/admin/news') ? 'active' : ''}`}>
                    <FileText size={22} />
                    <span>News</span>
                </Link>
                <Link to="/admin/activity" className={`mobile-nav-link ${location.pathname.startsWith('/admin/activity') ? 'active' : ''}`}>
                    <Activity size={22} />
                    <span>Activity</span>
                </Link>
                <Link to="/admin/admissions" className={`mobile-nav-link ${location.pathname.startsWith('/admin/admissions') ? 'active' : ''}`}>
                    <div className="mobile-nav-icon-wrapper">
                        <Users size={22} />
                        {counts.admissions > 0 && <span className="mobile-badgeBadge">{counts.admissions}</span>}
                    </div>
                    <span>Admissions</span>
                </Link>
                <Link to="/admin/contact" className={`mobile-nav-link ${location.pathname.startsWith('/admin/contact') ? 'active' : ''}`}>
                    <div className="mobile-nav-icon-wrapper">
                        <MessageSquare size={22} />
                        {counts.contact > 0 && <span className="mobile-badgeBadge">{counts.contact}</span>}
                    </div>
                    <span>Contact</span>
                </Link>
            </nav>
        </div>
    );
};

export default AdminLayout;
