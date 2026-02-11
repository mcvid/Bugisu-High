import { Trash2, Upload, GripVertical, Video, RefreshCw } from 'lucide-react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useHeroSlides } from '../../hooks/useQueries';

const HeroManager = () => {
    const PAGES = [
        { label: 'Home Page', path: '/' },
        { label: 'Admissions', path: '/admissions' },
        { label: 'Academics', path: '/academics' },
        { label: 'About School', path: '/about' },
        { label: 'Contact Us', path: '/contact' },
        { label: 'Vacancies', path: '/vacancies' },
    ];

    const SMART_SUGGESTIONS = {
        '/': [
            { title: 'BUGISU HIGH SCHOOL', subtitle: 'Experience Excellence in Education' },
            { title: 'JOIN OUR COMMUNITY', subtitle: 'Nurturing the Leaders of Tomorrow' },
            { title: 'FUTURE LEADERS', subtitle: 'Shaping Minds, Changing Lives' },
            { title: 'STAY CONNECTED', subtitle: 'Building a Legacy of Knowledge' },
            { title: 'EXCELLENCE ALWAYS', subtitle: 'Your Gateway to a Brighter Future' },
            { title: 'INSPIRING MINDS', subtitle: 'Fostering Innovation and Creativity' },
            { title: 'VIBRANT COMMUNITY', subtitle: 'Where Every Student Succeeds' },
            { title: 'DISCOVER POTENTIAL', subtitle: 'Empowering Excellence Since 1990' },
            { title: 'WE ARE BUGISU', subtitle: 'A Place of Tradition and Progress' },
            { title: 'START YOUR JOURNEY', subtitle: 'The First Step to Greatness' }
        ],
        '/admissions': [
            { title: 'ADMISSIONS 2026', subtitle: 'Start Your Journey with Us Today' },
            { title: 'JOIN THE PRIDE', subtitle: 'Become Part of our Excellence' },
            { title: 'ENROLL NOW', subtitle: 'Secure Your Future with Quality Education' },
            { title: 'APPLY TODAY', subtitle: 'Your Path to Success Starts Here' },
            { title: 'WELCOME STUDENTS', subtitle: 'Join Mbale\'s Leading High School' },
            { title: 'FUTURE SCHOLARS', subtitle: 'Admissions Now Open for Next Term' },
            { title: 'CHOOSE EXCELLENCE', subtitle: 'Why Bugisu is the Right Choice' },
            { title: 'JOIN OUR LEGACY', subtitle: 'Nurturing Talent and Character' },
            { title: 'ADMISSIONS OPEN', subtitle: 'Step Into a World of Opportunities' },
            { title: 'READY TO LEARN?', subtitle: 'Join Our Dynamic Learning Environment' }
        ],
        '/academics': [
            { title: 'ACADEMIC EXCELLENCE', subtitle: 'A Tradition of High Standards & Innovation' },
            { title: 'HOLISTIC LEARNING', subtitle: 'Beyond the Classroom Boundaries' },
            { title: 'SMART CURRICULUM', subtitle: 'Empowering Students for Global Success' },
            { title: 'LEARN TO LEAD', subtitle: 'Developing Critical Thinking Skills' },
            { title: 'STEM FOCUS', subtitle: 'Inspiring Future Scientists and Engineers' },
            { title: 'ARTS & HUMANITIES', subtitle: 'Fostering Creativity and Expression' },
            { title: 'BEYOND THE BOOKS', subtitle: 'Practical Skills for Real-World Success' },
            { title: 'EXPERT TEACHERS', subtitle: 'Expert Guidance for Every Student' },
            { title: 'ACADEMIC GROWTH', subtitle: 'Scholarly Pursuits and Achievement' },
            { title: 'INNOVATION HUB', subtitle: 'Cutting-Edge Education for Modern Minds' }
        ],
        '/about': [
            { title: 'OUR STORY & VISION', subtitle: 'Building a Legacy of Knowledge Since 1990' },
            { title: 'PRINCIPAL\'S MESSAGE', subtitle: 'Leading with Integrity and Passion' },
            { title: 'OUR CORE VALUES', subtitle: 'Excellence, Integrity, and Service' },
            { title: 'HERITAGE & TRADITION', subtitle: 'A Glimpse into Our Rich History' },
            { title: 'OUR MISSION', subtitle: 'Nurturing Holistic and Responsible Citizens' },
            { title: 'SCHOOL GOVERNANCE', subtitle: 'Strategic Leadership and Vision' },
            { title: 'OUR ETHOS', subtitle: 'Inspiring a Lifetime of Learning' },
            { title: 'OUR IMPACT', subtitle: 'Alumni Success Stories that Inspire' },
            { title: 'PROUD HISTORY', subtitle: 'Decades of Educational Excellence' },
            { title: 'THE BUGISU WAY', subtitle: 'Character Building and Discipline' }
        ],
        '/contact': [
            { title: 'GET IN TOUCH', subtitle: 'We are Here to Help with Your Inquiries' },
            { title: 'VISIT OUR CAMPUS', subtitle: 'Experience our Vibrant Community Firsthand' },
            { title: 'REACH OUT', subtitle: 'Your Future Starts with a Conversation' },
            { title: 'CONTACT US', subtitle: 'Dedicated Support for Parents and Students' },
            { title: 'FIND US', subtitle: 'Visit our Campus in the Heart of Mbale' },
            { title: 'ADMISSIONS OFFICE', subtitle: 'Get Detailed Enrollment Information' },
            { title: 'GENERAL ENQUIRIES', subtitle: 'We\'re Just a Message Away' },
            { title: 'SCHOOL HOTLINE', subtitle: 'Immediate Assistance for Parents' },
            { title: 'VISITORS WELCOME', subtitle: 'Discover Bugisu High School Today' },
            { title: 'CONNECT WITH US', subtitle: 'Stay Updated on Enrollment and Events' }
        ],
        '/vacancies': [
            { title: 'CAREERS AT BUGISU', subtitle: 'Join a Team of Dedicated Educators' },
            { title: 'SHAPE THE FUTURE', subtitle: 'Professional Growth and Impact' },
            { title: 'TEACH WITH US', subtitle: 'Inspiring the Next Generation' },
            { title: 'STAFF VACANCIES', subtitle: 'Opportunities for Excellence' },
            { title: 'JOIN OUR TEAM', subtitle: 'Building a Brighter Future Together' },
            { title: 'EDUCATIONAL LEADERS', subtitle: 'Seeking Passionate Teachers' },
            { title: 'CAREER GROWTH', subtitle: 'Professional Development at Bugisu' },
            { title: 'WORK WITH PURPOSE', subtitle: 'Making a Difference in Students\' Lives' },
            { title: 'JOIN OUR FACULTY', subtitle: 'A Community of Lifelong Learners' },
            { title: 'VACANCIES 2026', subtitle: 'New Opportunities for the Academic Year' }
        ],
        '/gallery': [
            { title: 'SCHOOL MEMORIES', subtitle: 'Capturing Moments of Joy and Learning' },
            { title: 'CAMPUS LIFE', subtitle: 'A Glimpse into our Dynamic Environment' },
            { title: 'EVENTS IN PICTURES', subtitle: 'Celebrating our Achievements and Growth' },
            { title: 'SPORTS HIGHLIGHTS', subtitle: 'Excellence on and off the Field' },
            { title: 'CREATIVE ARTS', subtitle: 'Showcasing Student Talent and Expression' },
            { title: 'CAMPUS BEAUTY', subtitle: 'Our State-of-the-Art Facilities' },
            { title: 'STUDENT ACTIVITIES', subtitle: 'Engagement Beyond the Classroom' },
            { title: 'CELEBRATIONS', subtitle: 'Marking Milestones and Successes' },
            { title: 'GALLERY OVERVIEW', subtitle: 'Experience the Spirit of Bugisu' },
            { title: 'RECENT MOMENTS', subtitle: 'Life at Bugisu High School in Pictures' }
        ],
        '/news': [
            { title: 'LATEST UPDATES', subtitle: 'Stay Informed about School Life' },
            { title: 'ANNOUNCEMENTS', subtitle: 'Important Information for our Community' },
            { title: 'BLOG & STORIES', subtitle: 'Voices from Bugisu High School' },
            { title: 'TERM HIGHLIGHTS', subtitle: 'Reviewing our Recent Successes' },
            { title: 'STUDENT NEWS', subtitle: 'Celebrating Individual Achievements' },
            { title: 'STAFF UPDATES', subtitle: 'Professional News from our Faculty' },
            { title: 'UPCOMING EVENTS', subtitle: 'Don\'t Miss Out on What\'s Coming' },
            { title: 'COMMUNITY NEWS', subtitle: 'Strengthening our Local Ties' },
            { title: 'PRESS RELEASES', subtitle: 'Official Statements and News' },
            { title: 'READ MORE', subtitle: 'Dive Deeper into our Latest Stories' }
        ]
    };


    const [slides, setSlides] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [selectedPage, setSelectedPage] = useState('/');
    const [newSlide, setNewSlide] = useState({ title: '', subtitle: '', sort_order: 0 });
    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [selectedAssetUrl, setSelectedAssetUrl] = useState('');
    const [selectedVideoUrl, setSelectedVideoUrl] = useState('');

    const queryClient = useQueryClient();
    const { data: slides = [], isLoading: slidesLoading, refetch: fetchSlides } = useHeroSlides(selectedPage);

    // Mutation for adding a slide
    const uploadMutation = useMutation({
        mutationFn: async ({ imageUrl, videoUrl, newSlide, selectedPage }) => {
            const { error } = await supabase.from('hero_slides').insert([
                {
                    image_url: imageUrl,
                    video_url: videoUrl,
                    title: newSlide.title || 'Welcome',
                    subtitle: newSlide.subtitle || 'Experience Excellence',
                    page_path: selectedPage,
                    sort_order: parseInt(newSlide.sort_order) || 0
                }
            ]);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['hero-slides', selectedPage]);
            setNewSlide({ title: '', subtitle: '', sort_order: 0 });
            setImageFile(null);
            setVideoFile(null);
            setSelectedAssetUrl('');
            setSelectedVideoUrl('');
            alert('Slide added successfully to ' + selectedPage);
        },
        onError: (error) => {
            console.error('Error uploading slide:', error);
            alert('Upload failed: ' + error.message);
        }
    });

    // Mutation for deleting a slide
    const deleteMutation = useMutation({
        mutationFn: async (slide) => {
            const getPath = (url) => url.split('/storage/v1/object/public/images/')[1];
            const filesToDelete = [];
            if (slide.image_url) {
                const path = getPath(slide.image_url);
                if (path) filesToDelete.push(path);
            }
            if (slide.video_url) {
                const path = getPath(slide.video_url);
                if (path) filesToDelete.push(path);
            }

            if (filesToDelete.length > 0) {
                await supabase.storage.from('images').remove(filesToDelete);
            }

            const { error } = await supabase.from('hero_slides').delete().eq('id', slide.id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['hero-slides', selectedPage]);
            alert('Slide deleted!');
        },
        onError: (error) => {
            console.error('Delete failed:', error);
            alert('Delete failed. Check console.');
        }
    });

    const applySuggestion = (suggestion) => {
        setNewSlide({ ...newSlide, title: suggestion.title, subtitle: suggestion.subtitle });
    };

    const handleUpload = async () => {
        if (!imageFile && !selectedAssetUrl) {
            alert('Please select a professional asset or upload your own image!');
            return;
        }

        setUploading(true);
        try {
            let imageUrl = selectedAssetUrl;
            let videoUrl = selectedVideoUrl;

            // 1. Upload Image
            if (imageFile) {
                const imgExt = imageFile.name.split('.').pop();
                const imgName = `${Math.random()}.${imgExt}`;
                const imgPath = `hero-slides/${imgName}`;
                const { error: imgError } = await supabase.storage.from('images').upload(imgPath, imageFile);
                if (imgError) throw imgError;
                imageUrl = supabase.storage.from('images').getPublicUrl(imgPath).data.publicUrl;
            }

            // 2. Upload Video
            if (videoFile) {
                const vidExt = videoFile.name.split('.').pop();
                const vidName = `${Math.random()}.${vidExt}`;
                const vidPath = `hero-videos/${vidName}`;
                const { error: vidError } = await supabase.storage.from('images').upload(vidPath, videoFile);
                if (vidError) throw vidError;
                videoUrl = supabase.storage.from('images').getPublicUrl(vidPath).data.publicUrl;
            }

            // 3. Trigger Mutation
            uploadMutation.mutate({ imageUrl, videoUrl, newSlide, selectedPage });
        } catch (error) {
            console.error('Error preparing upload:', error);
            alert('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = (slide) => {
        if (!window.confirm('Delete this slide?')) return;
        deleteMutation.mutate(slide);
    };

    return (
        <div className="admin-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1>Universal Hero Manager</h1>
                    <p style={{ color: '#6b7280' }}>Manage background images and videos for all pages.</p>
                </div>

                <div style={{ background: '#f3f4f6', padding: '0.5rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={{ fontWeight: '600' }}>Select Page to Edit:</label>
                    <select
                        value={selectedPage}
                        onChange={(e) => setSelectedPage(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db', minWidth: '200px' }}
                    >
                        {PAGES.map(p => <option key={p.path} value={p.path}>{p.label}</option>)}
                    </select>
                </div>
            </div>

            {/* Upload Box */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Add New Slide to <span style={{ color: '#2563eb' }}>{selectedPage}</span></h3>
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '2fr 2fr 1fr' }}>
                    <input
                        type="text"
                        placeholder="Small Green Title"
                        value={newSlide.title}
                        onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                        style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    />
                    <input
                        type="text"
                        placeholder="Big White Subtitle"
                        value={newSlide.subtitle}
                        onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                        style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    />
                    <input
                        type="number"
                        placeholder="Sort Order"
                        value={newSlide.sort_order}
                        onChange={(e) => setNewSlide({ ...newSlide, sort_order: e.target.value })}
                        style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    />
                </div>

                {/* Smart Suggestions */}
                <div style={{ marginTop: '1rem' }}>
                    <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: '600' }}>✨ Smart Suggestions for {selectedPage}:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {SMART_SUGGESTIONS[selectedPage]?.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => applySuggestion(s)}
                                style={{
                                    padding: '0.4rem 0.8rem',
                                    paddingRight: '1rem',
                                    borderRadius: '50px',
                                    border: '1px solid #e5e7eb',
                                    background: '#f9fafb',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb'; }}
                                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = 'inherit'; }}
                            >
                                <span style={{ fontWeight: 'bold' }}>{s.title}:</span> {s.subtitle}
                            </button>
                        ))}
                    </div>
                </div>


                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                    <div style={{
                        border: imageFile ? '2px solid #059669' : '2px dashed #e5e7eb',
                        padding: '1rem',
                        borderRadius: '8px',
                        textAlign: 'center',
                        background: imageFile ? '#ecfdf5' : 'transparent'
                    }}>
                        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold', color: imageFile ? '#059669' : 'inherit' }}>
                            {imageFile ? '✓ My Custom Image' : '1. Or Upload New Image'}
                        </p>
                        <input
                            type="file"
                            onChange={(e) => {
                                setImageFile(e.target.files[0]);
                                setSelectedAssetUrl(''); // Clear preset if local file is chosen
                            }}
                            accept="image/*"
                            id="img-upload"
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="img-upload" style={{ cursor: 'pointer', color: '#6b7280', fontSize: '0.85rem' }}>
                            {imageFile ? `Selected: ${imageFile.name}` : 'Select Local File...'}
                        </label>
                    </div>

                    <div style={{
                        border: videoFile ? '2px solid #2563eb' : '2px dashed #e5e7eb',
                        padding: '1rem',
                        borderRadius: '8px',
                        textAlign: 'center',
                        background: videoFile ? '#eff6ff' : 'transparent'
                    }}>
                        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold', color: videoFile ? '#2563eb' : 'inherit' }}>
                            {videoFile ? '✓ My Custom Video' : '2. Or Upload New Video'}
                        </p>
                        <input
                            type="file"
                            onChange={(e) => {
                                setVideoFile(e.target.files[0]);
                                setSelectedVideoUrl(''); // Clear preset if local file is chosen
                            }}
                            accept="video/*"
                            id="vid-upload"
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="vid-upload" style={{ cursor: 'pointer', color: '#6b7280', fontSize: '0.85rem' }}>
                            {videoFile ? `Selected: ${videoFile.name}` : 'Select Video Background...'}
                        </label>
                    </div>
                </div>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={handleUpload}
                        disabled={uploading || (!imageFile && !selectedAssetUrl)}
                        style={{ padding: '0.75rem 2rem' }}
                    >
                        {uploading ? 'Processing...' : 'Publish to ' + selectedPage}
                    </button>
                    {(imageFile || selectedAssetUrl || videoFile || selectedVideoUrl) && (
                        <button
                            onClick={() => {
                                setImageFile(null);
                                setSelectedAssetUrl('');
                                setVideoFile(null);
                                setSelectedVideoUrl('');
                            }}
                            style={{ marginLeft: '1rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                            Reset Selection
                        </button>
                    )}
                </div>
            </div>

            {/* Slides List */}
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Active Slides for {selectedPage} ({slides.length})</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {slides.length === 0 && <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#6b7280', background: '#f9fafb', borderRadius: '8px' }}>No hero content for this page yet.</p>}
                {slides.map(slide => (
                    <div key={slide.id} style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'relative' }}>
                        <img src={slide.image_url} alt="Slide" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />

                        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '5px' }}>
                            <div style={{ background: 'rgba(0,0,0,0.7)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem' }}>
                                Ord: {slide.sort_order}
                            </div>
                            {slide.video_url && (
                                <div style={{ background: '#2563eb', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Video size={12} /> VIDEO
                                </div>
                            )}
                        </div>

                        <div style={{ padding: '1rem' }}>
                            <p style={{ color: 'green', fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{slide.title}</p>
                            <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>{slide.subtitle}</p>
                        </div>
                        <button
                            onClick={() => handleDelete(slide)}
                            style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                        >
                            <Trash2 size={16} color="red" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HeroManager;
