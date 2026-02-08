/**
 * Search Index for Bugisu High School
 * This file centralizes page metadata, keywords, and descriptions for the search engine.
 * It's designed to work with i18n by using translation keys where possible.
 */

export const getStaticSearchIndex = (t) => [
    {
        title: t('nav.home'),
        path: "/",
        type: "Page",
        description: t('home:hero_subtitle') || "Main landing page for Bugisu High School.",
        keywords: ["home", "welcome", "index", "landing", "overview", "mbale", "journey", "identity", "official", "bugisu high school"]
    },
    {
        title: "The Journey Ahead",
        path: "/#journey",
        type: "Section",
        description: "Our school growth pillars and rapid development overview.",
        keywords: ["journey", "pillars", "growth", "quick access", "development"]
    },
    {
        title: "Mission, Vision & Values",
        path: "/#mission",
        type: "Identity",
        description: "The core values, mission, and vision driving Bugisu High School.",
        keywords: ["mission", "vision", "values", "motto", "core values", "curriculum", "excellence"]
    },
    {
        title: "Headteacher's Message",
        path: "/about/headteacher-message",
        type: "Message",
        description: "A welcoming note from our Headteacher about our academic excellence.",
        keywords: ["headteacher", "message", "welcome", "principal", "leadership"]
    },
    {
        title: t('nav.about'),
        path: "/about",
        type: "Page",
        description: t('about:hero_desc') || "Learn about our heritage, mission, vision, and leadership.",
        keywords: ["history", "mission", "vision", "values", "leadership", "administration", "teachers", "staff", "headteacher", "founder"]
    },
    {
        title: t('nav.admissions'),
        path: "/admissions",
        type: "Page",
        description: t('admissions:hero_desc') || "Information about enrollment, requirements, and application process.",
        keywords: ["apply", "enroll", "fees", "money", "cost", "tuition", "S1", "S5", "intake", "application", "form", "tracker", "admission process", "requirements"]
    },
    {
        title: t('nav.academics'),
        path: "/academics",
        type: "Page",
        description: t('academics:hero_title') || "Explore our curriculum, subjects, and academic standards.",
        keywords: ["curriculum", "subjects", "O-Level", "A-Level", "learning", "exams", "assessment", "education", "science", "arts"]
    },
    {
        title: t('nav.student_life'),
        path: "/student-life",
        type: "Page",
        description: "Life on campus beyond the classroom.",
        keywords: ["clubs", "sports", "activities", "wellbeing", "discipline", "dormitory", "boarding", "community", "culture"]
    },
    {
        title: t('nav.tour'),
        path: "/virtual-tour",
        type: "Feature",
        description: t('common:nav.tour_desc') || "Explore our campus interactively from anywhere.",
        keywords: ["360", "virtual", "campus", "map", "tour", "interactive", "hotspots", "facilities", "buildings"]
    },
    {
        title: t('nav.contact'),
        path: "/contact",
        type: "Page",
        description: "Reach out to us for any inquiries or visits.",
        keywords: ["location", "map", "phone", "email", "address", "visit", "inquiry", "help", "support"]
    },
    {
        title: t('nav.gallery'),
        path: "/gallery",
        type: "Media",
        description: "View photos and videos of our campus life and events.",
        keywords: ["photos", "videos", "images", "events", "pictures", "campus", "visuals"]
    },
    {
        title: t('nav.calendar'),
        path: "/calendar",
        type: "Page",
        description: "Stay updated with important dates and school events.",
        keywords: ["dates", "holidays", "term", "breaking", "events", "schedule", "timetable"]
    },
    {
        title: "FAQ",
        path: "/faq",
        type: "Page",
        description: t('faq:hero_subtitle') || "Frequently asked questions about Bugisu High School.",
        keywords: ["questions", "answers", "help", "support", "inquiry", "info"]
    },
    {
        title: t('nav.resources') || "Resources",
        path: "/resources",
        type: "Resource",
        description: "Downloadable documents, forms, and learning materials.",
        keywords: ["downloads", "forms", "materials", "notes", "past papers", "documents"]
    },
    {
        title: "Past Papers",
        path: "/past-papers",
        type: "Resource",
        description: "Collection of past exam papers for O-Level and A-Level.",
        keywords: ["exams", "revision", "papers", "assessments", "study", "uneb"]
    },
    {
        title: "Study Tips",
        path: "/study-tips",
        type: "Resource",
        description: "Tips and strategies for effective learning and exam preparation.",
        keywords: ["study", "learning", "revision", "strategies", "success", "grades"]
    },
    {
        title: "Online Application",
        path: "/apply",
        type: "Action",
        description: "Fill out the online application form for admission.",
        keywords: ["apply", "enroll", "form", "admission", "registration"]
    },
    {
        title: t('nav.sports'),
        path: "/sports",
        type: "Page",
        description: "Our athletic programs and sports achievements.",
        keywords: ["football", "netball", "athletics", "competition", "games", "trophy", "sports"]
    },
    {
        title: t('nav.clubs'),
        path: "/clubs",
        type: "Page",
        description: "Student organizations and extracurricular interest groups.",
        keywords: ["music", "dance", "drama", "debate", "science", "writer", "club", "society"]
    },
    {
        title: t('nav.login'),
        path: "/login",
        type: "Portal",
        description: "Access the student and staff portal.",
        keywords: ["signin", "portal", "account", "dashboard", "grades", "management"]
    },
    {
        title: t('common:nav.uniform_title') || "Uniform Policy",
        path: "/student-life",
        type: "Info",
        description: "Guidelines for school uniform and dress code.",
        keywords: ["wear", "dress code", "smart", "clothing", "uniform"]
    }
];
