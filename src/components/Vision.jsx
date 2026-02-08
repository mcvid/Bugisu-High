import React from 'react';
import AspirationGallery from './AspirationGallery';
import './MissionVisionValues.css';

const Vision = () => {
    return (
        <section className="mvv-section bg-light-teal">
            <div className="container mvv-container">
                <div className="mvv-grid items-center">

                    {/* LEFT: CONTENT */}
                    <div className="content-column">
                        <h2 className="mvv-label">School Vision</h2>
                        <p className="mvv-text">
                            A fountain of enlightened and skilled young men and women rooted in excellence and integrity.
                        </p>
                    </div>

                    {/* RIGHT: IMAGE GALLERY */}
                    <div className="gallery-column">
                        <AspirationGallery images={["/images/about-hero.png", "/logo.png", "/hm.png"]} />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Vision;
