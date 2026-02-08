import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Layout from './components/Layout';

// Public Pages - Lazy Loaded
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Academics = lazy(() => import('./pages/Academics'));
const Admissions = lazy(() => import('./pages/Admissions'));
const News = lazy(() => import('./pages/News'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const Events = lazy(() => import('./pages/Events'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const StudentLife = lazy(() => import('./pages/StudentLife'));
const ApplicationForm = lazy(() => import('./pages/ApplicationForm'));
const PastPapers = lazy(() => import('./pages/PastPapers'));
const StudyTips = lazy(() => import('./pages/StudyTips'));
const AcademicCalendar = lazy(() => import('./pages/AcademicCalendar'));
const Sports = lazy(() => import('./pages/Sports'));
const Clubs = lazy(() => import('./pages/Clubs'));
const VirtualTour = lazy(() => import('./pages/VirtualTour'));
const Login = lazy(() => import('./pages/admin/Login'));
const FAQ = lazy(() => import('./pages/FAQ'));
const NotFound = lazy(() => import('./pages/NotFound'));
const StudentPortal = lazy(() => import('./pages/StudentPortal'));
const VerifyStudent = lazy(() => import('./pages/VerifyStudent'));
const Apply = lazy(() => import('./pages/Apply'));
const HeadteacherMessage = lazy(() => import('./pages/HeadteacherMessagePage'));
const Scholarships = lazy(() => import('./pages/Scholarships'));
const Departments = lazy(() => import('./pages/Departments'));


// Admin Pages - Lazy Loaded
const AdminLayout = lazy(() => import('./components/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const NewsList = lazy(() => import('./pages/admin/NewsList'));
const NewsEditor = lazy(() => import('./pages/admin/NewsEditor'));
const EventsList = lazy(() => import('./pages/admin/EventsList'));
const EventsEditor = lazy(() => import('./pages/admin/EventsEditor'));
const AnnouncementsManager = lazy(() => import('./pages/admin/AnnouncementsManager'));
const HeroManager = lazy(() => import('./pages/admin/HeroManager'));
const AdministrationManager = lazy(() => import('./pages/admin/AdministrationManager'));
const AcademicManager = lazy(() => import('./pages/admin/AcademicManager'));
const AdmissionsManager = lazy(() => import('./pages/admin/AdmissionsManager'));
const ContactManager = lazy(() => import('./pages/admin/ContactManager'));
const GalleriesManager = lazy(() => import('./pages/admin/GalleriesManager'));
const AchievementsManager = lazy(() => import('./pages/admin/AchievementsManager'));
const ChatManager = lazy(() => import('./pages/admin/ChatManager'));
const FeedbackManager = lazy(() => import('./pages/admin/FeedbackManager'));
const PastPapersManager = lazy(() => import('./pages/admin/PastPapersManager'));
const SportsManager = lazy(() => import('./pages/admin/SportsManager'));
const StudentsManager = lazy(() => import('./pages/admin/StudentsManager'));
const TourManager = lazy(() => import('./pages/admin/TourManager'));
const TeachersManager = lazy(() => import('./pages/admin/TeachersManager'));
const AlertsManager = lazy(() => import('./pages/admin/AlertsManager'));
const ActivityManager = lazy(() => import('./pages/admin/ActivityManager'));
const AdminMarksEntry = lazy(() => import('./pages/admin/AdminMarksEntry'));
const FinanceManager = lazy(() => import('./pages/admin/FinanceManager'));
const LeaveRequestsManager = lazy(() => import('./pages/admin/LeaveRequestsManager'));
const ParentEmailManager = lazy(() => import('./pages/admin/ParentEmailManager'));

// Parent Portal Pages
const ParentNotifications = lazy(() => import('./pages/parent/ParentNotifications'));
const SubmitLeaveRequest = lazy(() => import('./pages/parent/SubmitLeaveRequest'));
const ViewAnnouncements = lazy(() => import('./pages/parent/ViewAnnouncements'));
const Parents = lazy(() => import('./pages/Parents'));
const ParentPortal = lazy(() => import('./pages/parent/ParentPortal'));
const ParentFees = lazy(() => import('./pages/parent/ParentFees'));

import RequireAuth from './components/RequireAuth';
import ScrollToTop from './components/ui/ScrollToTop';
import MotionLoader from './components/ui/MotionLoader';

// Simple Loading Spinner for Suspense
const PageLoader = () => <MotionLoader />;

const App = () => {
    // Track visits
    React.useEffect(() => {
        const trackVisit = async () => {
            const hasVisited = sessionStorage.getItem('bhs_visited_today');
            if (!hasVisited) {
                try {
                    const { error } = await supabase.rpc('increment_visit_count');
                    if (!error) {
                        sessionStorage.setItem('bhs_visited_today', 'true');
                    } else {
                        // Fallback if RPC not setup yet, just try simple upsert if policy allows
                        // But RPC is safer. For now just log.
                        console.error('Error tracking visit:', error);
                    }
                } catch (err) {
                    console.error('Visit tracking failed:', err);
                }
            }
        };

        trackVisit();
    }, []);

    return (
        <Router>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="about" element={<About />} />
                        <Route path="academics" element={<Academics />} />
                        <Route path="admissions" element={<Admissions />} />
                        <Route path="scholarships" element={<Scholarships />} />
                        <Route path="departments" element={<Departments />} />
                        <Route path="news" element={<News />} />
                        <Route path="news/:slug" element={<NewsDetail />} />
                        <Route path="events" element={<Events />} />
                        <Route path="gallery" element={<Gallery />} />
                        <Route path="student-life" element={<StudentLife />} />
                        <Route path="apply" element={<ApplicationForm />} />
                        <Route path="resources" element={<PastPapers />} />
                        <Route path="study-tips" element={<StudyTips />} />
                        <Route path="calendar" element={<AcademicCalendar />} />
                        <Route path="sports" element={<Sports />} />
                        <Route path="clubs" element={<Clubs />} />
                        <Route path="contact" element={<Contact />} />
                        <Route path="login" element={<Login />} />
                        <Route path="virtual-tour" element={<VirtualTour />} />
                        <Route path="faq" element={<FAQ />} />
                        <Route path="student-portal" element={<StudentPortal />} />
                        <Route path="verify" element={<VerifyStudent />} />
                        <Route path="parent/notifications" element={<ParentNotifications />} />
                        <Route path="parent/announcements" element={<ViewAnnouncements />} />
                        <Route path="parent/leave-request" element={<SubmitLeaveRequest />} />
                        <Route path="parents" element={<Parents />} />
                        <Route path="parents/portal" element={<ParentPortal />} />
                        <Route path="parent/fees" element={<ParentFees />} />
                        <Route path="apply-online" element={<Apply />} />
                        <Route path="about/headteacher-message" element={<HeadteacherMessage />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<Login />} />

                    <Route path="/admin" element={
                        <RequireAuth>
                            <AdminLayout />
                        </RequireAuth>
                    }>
                        <Route index element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="news" element={<NewsList />} />
                        <Route path="news/new" element={<NewsEditor />} />
                        <Route path="news/edit/:id" element={<NewsEditor />} />
                        <Route path="gallery" element={<GalleriesManager />} />
                        <Route path="chat" element={<ChatManager />} />
                        <Route path="feedback" element={<FeedbackManager />} />
                        <Route path="resources" element={<PastPapersManager />} />
                        <Route path="sports" element={<SportsManager />} />
                        <Route path="tour" element={<TourManager />} />
                        <Route path="events" element={<EventsList />} />
                        <Route path="events/new" element={<EventsEditor />} />
                        <Route path="events/edit/:id" element={<EventsEditor />} />
                        <Route path="announcements" element={<AnnouncementsManager />} />
                        <Route path="hero" element={<HeroManager />} />
                        <Route path="administration" element={<AdministrationManager />} />
                        <Route path="academics" element={<AcademicManager />} />
                        <Route path="academics/marks" element={<AdminMarksEntry />} />
                        <Route path="finance" element={<FinanceManager />} />
                        <Route path="leave-requests" element={<LeaveRequestsManager />} />
                        <Route path="parent-emails" element={<ParentEmailManager />} />
                        <Route path="admissions" element={<AdmissionsManager />} />
                        <Route path="contact" element={<ContactManager />} />
                        <Route path="students" element={<StudentsManager />} />
                        <Route path="teachers" element={<TeachersManager />} />
                        <Route path="alerts" element={<AlertsManager />} />
                        <Route path="activity" element={<ActivityManager />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;
