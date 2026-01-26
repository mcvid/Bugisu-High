import React from 'react';
import { Beaker, Laptop, Library, Users } from 'lucide-react';

const EnvironmentSignals = () => {
    return (
        <section className="academics-section reveal-on-scroll">
            <div className="academics-section-title">
                <h2>Learning Environment</h2>
                <p>We believe academic success is a product of the right conditions and infrastructure.</p>
            </div>

            <div className="departments-list">
                <div className="dept-item reveal-on-scroll">
                    <div className="icon-wrapper" style={{ width: 'fit-content', marginBottom: '1rem' }}><Beaker size={24} /></div>
                    <h4>Laboratory Access</h4>
                    <p>Science instruction is supported by dedicated Chemistry, Physics, and Biology laboratories, ensuring practical experimentation is core to the curriculum.</p>
                </div>

                <div className="dept-item reveal-on-scroll">
                    <div className="icon-wrapper" style={{ width: 'fit-content', marginBottom: '1rem' }}><Laptop size={24} /></div>
                    <h4>ICT Integration</h4>
                    <p>Our computer laboratory provides students with scheduled access to digital resources and internet-based research, fostering essential digital literacy.</p>
                </div>

                <div className="dept-item reveal-on-scroll">
                    <div className="icon-wrapper" style={{ width: 'fit-content', marginBottom: '1rem' }}><Library size={24} /></div>
                    <h4>Resource Center</h4>
                    <p>The school library maintains a collection of standard textbooks, reference materials, and quiet study spaces for independent academic work.</p>
                </div>

                <div className="dept-item reveal-on-scroll">
                    <div className="icon-wrapper" style={{ width: 'fit-content', marginBottom: '1rem' }}><Users size={24} /></div>
                    <h4>Class Dynamics</h4>
                    <p>We manage class sizes to maintain an environment where teachers can monitor individual progress and address specific learning gaps.</p>
                </div>
            </div>
        </section>
    );
};

export default EnvironmentSignals;
