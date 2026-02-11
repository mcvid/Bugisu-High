import React from 'react';
import AspirationGallery from './AspirationGallery';
import './MissionVisionValues.css';

const Mission = () => {
    return (
        <section className="mvv-section bg-white">
            <div className="container mvv-container">
                <div className="mvv-grid items-center">

                    {/* LEFT: IMAGE GALLERY */}
                    <div className="gallery-column order-2">
                        <AspirationGallery
                            images={[
                                "/images/students/stu.jpeg",
                                "/images/students/girl.jpeg",
                                "/images/students/achioeve.jpeg"
                            ]}
                        />
                    </div>


                    {/* RIGHT: CONTENT */}
                    <div className="content-column order-1 lg:order-2">
                        <h2 className="mvv-label">School Mission</h2>
                        <p className="mvv-text">
                            To Produce Versatile Individuals through Quality Education and Integrity to address Global Challenges
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Mission;
