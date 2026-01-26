import { useState, useEffect, useCallback } from 'react';

export const usePullToRefresh = (onRefresh, threshold = 80) => {
    const [startY, setStartY] = useState(0);
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleTouchStart = useCallback((e) => {
        if (window.scrollY === 0) {
            setStartY(e.touches[0].pageY);
        }
    }, []);

    const handleTouchMove = useCallback((e) => {
        if (startY > 0 && window.scrollY === 0) {
            const currentY = e.touches[0].pageY;
            const diff = currentY - startY;
            if (diff > 0) {
                setPullDistance(Math.min(diff * 0.5, threshold + 20));
                if (diff > threshold) {
                    // Prevent page scroll when pulling
                    if (e.cancelable) e.preventDefault();
                }
            }
        }
    }, [startY, threshold]);

    const handleTouchEnd = useCallback(async () => {
        if (pullDistance > threshold) {
            setIsRefreshing(true);
            setPullDistance(threshold);
            try {
                await onRefresh();
            } finally {
                setTimeout(() => {
                    setIsRefreshing(false);
                    setPullDistance(0);
                }, 500);
            }
        } else {
            setPullDistance(0);
        }
        setStartY(0);
    }, [pullDistance, threshold, onRefresh]);

    return {
        pullDistance,
        isRefreshing,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd
    };
};
