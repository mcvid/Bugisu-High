import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Lightbox from '../components/Lightbox';
import { Calendar, Image as ImageIcon } from 'lucide-react';
import OptimizedImage from '../components/ui/OptimizedImage';
import UniversalHero from '../components/ui/UniversalHero';
import './Gallery.css';

const Gallery = () => {
    const [galleries, setGalleries] = useState([]);
    const [selectedGallery, setSelectedGallery] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchGalleries();
    }, [selectedCategory]);

    const fetchGalleries = async () => {
        try {
            setLoading(true);
            let query = supabase
                .from('galleries')
                .select('*')
                .order('event_date', { ascending: false });

            if (selectedCategory !== 'all') {
                query = query.eq('category', selectedCategory);
            }

            const { data, error } = await query;

            if (error) throw error;

            setGalleries(data || []);

            // Extract unique categories
            const uniqueCategories = [...new Set(data?.map(g => g.category).filter(Boolean))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error('Error fetching galleries:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchGalleryImages = async (galleryId) => {
        try {
            const { data, error } = await supabase
                .from('gallery_images')
                .select('*')
                .eq('gallery_id', galleryId)
                .order('sort_order', { ascending: true });

            if (error) throw error;

            setGalleryImages(data || []);
            setSelectedGallery(galleries.find(g => g.id === galleryId));
        } catch (error) {
            console.error('Error fetching gallery images:', error);
        }
    };

    const handleBackToGalleries = () => {
        setSelectedGallery(null);
        setGalleryImages([]);
        setLightboxIndex(null);
    };

    return (
        <div className="section container gallery-page">
            {/* Hero Section */}
            <UniversalHero pagePath="/gallery" height="40vh">
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ color: 'white' }}>School Gallery</h1>
                    <p className="page-subtitle" style={{ color: 'rgba(255,255,255,0.9)' }}>
                        {selectedGallery ? selectedGallery.title : 'A glimpse into life at Bugisu High School'}
                    </p>
                </div>
            </UniversalHero>

            {!selectedGallery ? (
                <>
                    {/* Category Filter */}
                    {categories.length > 0 && (
                        <div className="category-filter">
                            <button
                                className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                                onClick={() => setSelectedCategory('all')}
                            >
                                All
                            </button>
                            {categories.map(category => (
                                <button
                                    key={category}
                                    className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    )}

                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading galleries...</p>
                        </div>
                    ) : galleries.length === 0 ? (
                        <div className="empty-state">
                            <ImageIcon size={48} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
                            <p>No galleries available yet.</p>
                        </div>
                    ) : (
                        <div className="albums-grid">
                            {galleries.map((gallery) => (
                                <div
                                    key={gallery.id}
                                    className="album-card"
                                    onClick={() => fetchGalleryImages(gallery.id)}
                                >
                                    <div className="album-cover">
                                        <OptimizedImage
                                            src={gallery.cover_image_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80'}
                                            alt={gallery.title}
                                            aspectRatio="16/10"
                                        />
                                        {gallery.category && (
                                            <span className="album-category">{gallery.category}</span>
                                        )}
                                    </div>
                                    <div className="album-info">
                                        <h3>{gallery.title}</h3>
                                        {gallery.description && (
                                            <p className="album-description">{gallery.description}</p>
                                        )}
                                        {gallery.event_date && (
                                            <div className="album-date">
                                                <Calendar size={14} />
                                                {new Date(gallery.event_date).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <>
                    <button className="back-btn" onClick={handleBackToGalleries}>
                        ← Back to Albums
                    </button>

                    {selectedGallery.description && (
                        <p className="gallery-description">{selectedGallery.description}</p>
                    )}

                    {galleryImages.length === 0 ? (
                        <div className="empty-state">
                            <p>No images in this gallery yet.</p>
                        </div>
                    ) : (
                        <div className="gallery-grid">
                            {galleryImages.map((img, index) => (
                                <div
                                    key={img.id}
                                    className="gallery-item"
                                    onClick={() => setLightboxIndex(index)}
                                >
                                    <OptimizedImage
                                        src={img.image_url}
                                        alt={img.caption || `${selectedGallery.title} - Image ${index + 1}`}
                                        aspectRatio="1/1"
                                    />
                                    {img.caption && (
                                        <div className="gallery-overlay">
                                            <span className="gallery-title">{img.caption}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Lightbox */}
            {lightboxIndex !== null && (
                <Lightbox
                    images={galleryImages}
                    galleryTitle={selectedGallery?.title}
                    currentIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                    onNext={() => setLightboxIndex(lightboxIndex + 1)}
                    onPrev={() => setLightboxIndex(lightboxIndex - 1)}
                />
            )}
        </div>
    );
};

export default Gallery;
