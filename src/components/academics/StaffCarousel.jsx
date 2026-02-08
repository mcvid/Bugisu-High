import React from 'react';

const StaffCarousel = ({ items }) => {
    return (
        <div className="staff-carousel-container">
            <div className="staff-carousel-track">
                {items.map((item, index) => (
                    <div key={index} className="staff-carousel-item">
                        {item}
                    </div>
                ))}
            </div>
            <div className="staff-carousel-hint">
                <span className="dot animate-pulse"></span>
                <span>Swipe to browse staff</span>
            </div>

            <style>{`
                .staff-carousel-container {
                    width: 100%;
                    overflow: hidden;
                    position: relative;
                    padding-bottom: 1rem;
                }
                .staff-carousel-track {
                    display: flex;
                    overflow-x: auto;
                    snap-type: x mandatory;
                    gap: 1.5rem;
                    padding: 1rem 0 2rem;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                .staff-carousel-track::-webkit-scrollbar {
                    display: none;
                }
                .staff-carousel-item {
                    flex: 0 0 85%;
                    snap-align: center;
                    transform: scale(0.98);
                    transition: transform 0.3s ease;
                }
                .staff-carousel-item:active {
                    transform: scale(0.95);
                }
                .staff-carousel-hint {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    color: #94a3b8;
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
                .dot {
                    width: 6px;
                    height: 6px;
                    background: #dc2626;
                    border-radius: 50%;
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.5; }
                }
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
};

export default StaffCarousel;
