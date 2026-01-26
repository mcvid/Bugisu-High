import React, { useState } from 'react';
import './OptimizedImage.css';

const OptimizedImage = ({ src, alt, className = '', aspectRatio = '16/9' }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    return (
        <div
            className={`optimized-image-container ${className} ${isLoaded ? 'loaded' : 'loading'}`}
            style={{ aspectRatio }}
        >
            {!isLoaded && !hasError && (
                <div className="image-placeholder shimmer"></div>
            )}
            {hasError ? (
                <div className="image-error">
                    <span>Failed to load image</span>
                </div>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    onLoad={() => setIsLoaded(true)}
                    onError={() => setHasError(true)}
                    className={isLoaded ? 'visible' : 'hidden'}
                />
            )}
        </div>
    );
};

export default OptimizedImage;
