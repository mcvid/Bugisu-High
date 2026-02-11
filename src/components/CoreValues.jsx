import React from 'react';
import { Lightbulb } from 'lucide-react';
import AspirationGallery from './AspirationGallery';
import './MissionVisionValues.css';

const CoreValues = () => {
    return (
        <section className="mvv-section bg-white">
            <div className="container mvv-container">
                <div className="mvv-grid items-center">

                    {/* LEFT: IMAGE GALLERY */}
                    <div className="gallery-column order-2 lg:order-1">
                        <AspirationGallery images={["/images/students/prom.jpeg", "/images/students/mdd.jpeg", "/images/students/foot2.jpeg"]} />
                    </div>


                    {/* RIGHT: CONTENT (Bullets) */}
                    <div className="content-column order-1 lg:order-2">
                        <h2 className="mvv-label">Core Values</h2>

                        <div className="values-list-modern">
                            <div className="value-card-modern">
                                <div className="value-icon"><Lightbulb size={32} /></div>
                                <h4>Fear God</h4>
                                <p>Spiritual grounding is at the heart of our community, fostering a culture of humility and respect.</p>
                            </div>
                            <div className="value-card-modern">
                                <div className="value-icon"><Lightbulb size={32} /></div>
                                <h4>Excellence</h4>
                                <p>We strive for the highest standards in academics, sports, and character development in every student.</p>
                            </div>
                            <div className="value-card-modern">
                                <div className="value-icon"><Lightbulb size={32} /></div>
                                <h4>Integrity</h4>
                                <p>Building a legacy of honesty, transparency, and ethical leadership that students carry throughout their lives.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default CoreValues;
