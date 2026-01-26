import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { cacheManager } from '../../lib/cache';
import { Trash2, Upload, GripVertical } from 'lucide-react';

const HeroManager = () => {
    const [slides, setSlides] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [newSlide, setNewSlide] = useState({ title: '', subtitle: '' });

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        const { data, error } = await supabase.from('hero_slides').select('*').order('created_at', { ascending: true });
        if (data) setSlides(data);
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `hero-slides/${fileName}`;

            const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);

            const { error: dbError } = await supabase.from('hero_slides').insert([
                {
                    image_url: publicUrl,
                    title: newSlide.title || 'Welcome',
                    subtitle: newSlide.subtitle || 'Experience Excellence'
                }
            ]);
            if (dbError) throw dbError;

            fetchSlides();
            cacheManager.invalidate('home_data');
            setNewSlide({ title: '', subtitle: '' });
        } catch (error) {
            console.error('Error uploading slide:', error);
            alert('Upload failed!');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id, imageUrl) => {
        if (!window.confirm('Delete this slide?')) return;
        try {
            // Optimistic UI update
            const originalSlides = [...slides];
            setSlides(slides.filter(s => s.id !== id));

            const { error } = await supabase.from('hero_slides').delete().eq('id', id);
            if (error) {
                setSlides(originalSlides); // Revert on failure
                throw error;
            }
            cacheManager.invalidate('home_data');

            // Try to delete from storage (optional, good cleanup)
            // Extract path from URL... logic omitted for brevity as it's not strictly critical for functionality
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    return (
        <div className="admin-page">
            <h1>Hero Slideshow Manager</h1>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Manage the images on the Home Page slideshow. (Max recommended: 3-5)</p>

            {/* Upload Box */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Add New Slide</h3>
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                    <input
                        type="text"
                        placeholder="Small Green Title (e.g. NAMILYANGO COLLEGE)"
                        value={newSlide.title}
                        onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                        style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    />
                    <input
                        type="text"
                        placeholder="Big White Subtitle (e.g. NISI DOMINUS)"
                        value={newSlide.subtitle}
                        onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                        style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    />
                </div>
                <div style={{ marginTop: '1rem' }}>
                    <label className="btn btn-primary" style={{ cursor: uploading ? 'wait' : 'pointer', display: 'inline-block' }}>
                        <Upload size={18} style={{ marginRight: '8px' }} />
                        {uploading ? 'Uploading...' : 'Select Image & Add'}
                        <input type="file" onChange={handleUpload} style={{ display: 'none' }} accept="image/*" disabled={uploading} />
                    </label>
                </div>
            </div>

            {/* Slides List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {slides.map(slide => (
                    <div key={slide.id} style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'relative' }}>
                        <img src={slide.image_url} alt="Slide" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                        <div style={{ padding: '1rem' }}>
                            <p style={{ color: 'green', fontWeight: 'bold', fontSize: '0.8rem' }}>{slide.title}</p>
                            <p style={{ fontWeight: 'bold' }}>{slide.subtitle}</p>
                        </div>
                        <button
                            onClick={() => handleDelete(slide.id, slide.image_url)}
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
