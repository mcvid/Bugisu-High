-- Universal Seed Hero Slides for all major pages
DELETE FROM public.hero_slides;

INSERT INTO public.hero_slides (image_url, video_url, title, subtitle, page_path, sort_order)
VALUES 
-- HOME PAGE
(
    'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=1600&q=80',
    'https://cdn.pixabay.com/vimeo/4435/mixkit-students-walking-in-a-hallway-4435-large.mp4',
    'BUGISU HIGH SCHOOL',
    'Experience Excellence in Education',
    '/',
    1
),
(
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
    NULL,
    'JOIN OUR COMMUNITY',
    'Nurturing the Leaders of Tomorrow',
    '/',
    2
),

-- ADMISSIONS
(
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
    NULL,
    'ADMISSIONS 2026',
    'Start Your Journey with Us Today',
    '/admissions',
    1
),

-- ACADEMICS
(
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80',
    NULL,
    'ACADEMIC EXCELLENCE',
    'A Tradition of High Standards & Innovation',
    '/academics',
    1
),

-- ABOUT
(
    'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=1600&q=80',
    NULL,
    'OUR STORY & VISION',
    'Building a Legacy of Knowledge Since 1990',
    '/about',
    1
),

-- CONTACT
(
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
    NULL,
    'GET IN TOUCH',
    'We are Here to Help with Your Inquiries',
    '/contact',
    1
),

-- VACANCIES
(
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80',
    NULL,
    'CAREERS AT BUGISU',
    'Join a Team of Dedicated Educators',
    '/vacancies',
    1
);
