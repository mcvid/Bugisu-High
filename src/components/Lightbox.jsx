import React, { useState } from 'react';
import { X } from 'lucide-react';
import './Lightbox.css';

const Lightbox = ({ images, currentIndex, onClose, onNext, onPrev, galleryTitle }) => {
    if (currentIndex === null) return null;

    const currentImage = images[currentIndex];

    const handleNext = () => {
        if (currentIndex < images.length - 1) {
            onNext();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            onPrev();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
    };

    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    // Minimum swipe distance in pixels
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleNext();
        } else if (isRightSwipe) {
            handlePrev();
        }
    };

    React.useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [currentIndex]);

    return (
        <div
            className="lightbox-overlay"
            onClick={onClose}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <button className="lightbox-close" onClick={onClose}>
                <X size={32} />
            </button>

            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                <img
                    src={currentImage.image_url}
                    alt={currentImage.caption || `${galleryTitle || 'Gallery'} - Image ${currentIndex + 1}`}
                />

                {currentImage.caption && (
                    <div className="lightbox-caption">
                        {currentImage.caption}
                    </div>
                )}

                <div className="lightbox-counter">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>

            {currentIndex > 0 && (
                <button className="lightbox-nav lightbox-prev" onClick={handlePrev}>
                    ‹
                </button>
            )}

            {currentIndex < images.length - 1 && (
                <button className="lightbox-nav lightbox-next" onClick={handleNext}>
                    ›
                </button>
            )}
        </div>
    );
};

export default Lightbox;
