-- Seed Hero Slides with high-quality educational content (V2 - Verified URLs)
DELETE FROM public.hero_slides;

INSERT INTO public.hero_slides (image_url, video_url, title, subtitle, sort_order)
VALUES 
(
    'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=1600&q=80',
    'https://cdn.pixabay.com/vimeo/4435/mixkit-students-walking-in-a-hallway-4435-large.mp4',
    'BUGISU HIGH SCHOOL',
    'Experience Excellence in Education',
    1
),
(
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1600&q=80',
    NULL,
    'ACADEMIC BRILLIANCE',
    'Nurturing the Leaders of Tomorrow',
    2
),
(
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80',
    NULL,
    'MODERN FACILITIES',
    'State-of-the-art Campus & Learning Labs',
    3
),
(
    'https://images.unsplash.com/photo-1523240715639-99a8088fb98b?auto=format&fit=crop&w=1600&q=80',
    NULL,
    'JOIN OUR COMMUNITY',
    'Admissions for 2026 Intake are Open',
    4
);
