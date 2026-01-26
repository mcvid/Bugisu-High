import React from 'react';
import './Skeleton.css';

const Skeleton = ({ type, count = 1, className = '' }) => {
    const skeletons = Array.from({ length: count });

    return (
        <>
            {skeletons.map((_, i) => (
                <div key={i} className={`skeleton skeleton-${type} ${className} shimmer`}></div>
            ))}
        </>
    );
};
export const CardSkeleton = ({ count = 1 }) => {
    const skeletons = Array.from({ length: count });
    return (
        <>
            {skeletons.map((_, i) => (
                <div key={i} className="skeleton-card-container">
                    <div className="skeleton skeleton-rect shimmer" style={{ height: '200px' }}></div>
                    <div className="skeleton skeleton-text shimmer" style={{ width: '80%', marginTop: '1rem' }}></div>
                    <div className="skeleton skeleton-text shimmer" style={{ width: '40%' }}></div>
                </div>
            ))}
        </>
    );
};

export default Skeleton;
