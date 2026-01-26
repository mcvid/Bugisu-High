import React, { useState } from 'react';
import { X, Play } from 'lucide-react';
import './VideoPlayer.css';

const VideoPlayer = ({ videoUrl, thumbnailUrl, title, autoplay = false }) => {
    const [isPlaying, setIsPlaying] = useState(autoplay);

    // Extract video ID from YouTube or Vimeo URL
    const getEmbedUrl = (url) => {
        if (!url) return null;

        // YouTube
        const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (youtubeMatch) {
            return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&rel=0`;
        }

        // Vimeo
        const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
        if (vimeoMatch) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
        }

        // Direct embed URL
        if (url.includes('embed')) {
            return url;
        }

        return null;
    };

    const embedUrl = getEmbedUrl(videoUrl);

    if (!embedUrl && !thumbnailUrl) {
        return null;
    }

    return (
        <div className="video-player-container">
            {!isPlaying ? (
                <div
                    className="video-thumbnail"
                    style={{ backgroundImage: `url(${thumbnailUrl || 'https://images.unsplash.com/photo-1544531696-2822a09966ce?auto=format&fit=crop&q=80&w=1000'})` }}
                    onClick={() => setIsPlaying(true)}
                >
                    <div className="play-overlay">
                        <button className="play-button-large">
                            <Play size={48} fill="white" />
                        </button>
                        {title && <p className="video-title">{title}</p>}
                    </div>
                </div>
            ) : (
                <div className="video-iframe-wrapper">
                    <button
                        className="close-video-btn"
                        onClick={() => setIsPlaying(false)}
                        aria-label="Close video"
                    >
                        <X size={24} />
                    </button>
                    <iframe
                        src={embedUrl}
                        title={title || "Video Player"}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="video-iframe"
                    />
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;
