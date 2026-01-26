/**
 * Triggers haptic feedback (vibration) if supported by the device.
 * @param {number|number[]} pattern - Duration in ms or pattern array.
 */
export const triggerHaptic = (pattern = 10) => {
    if ('vibrate' in navigator) {
        try {
            navigator.vibrate(pattern);
        } catch (e) {
            // Silently fail if blocked or unsupported
        }
    }
};

/**
 * Opens the native share sheet if supported.
 * @param {Object} options - { title, text, url }
 */
export const shareContent = async (options) => {
    if (navigator.share) {
        try {
            await navigator.share(options);
            return true;
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error sharing content:', error);
            }
            return false;
        }
    } else {
        // Fallback for desktop or unsupported browsers
        const shareUrl = options.url || window.location.href;
        navigator.clipboard.writeText(shareUrl)
            .then(() => alert('Link copied to clipboard!'))
            .catch(err => console.error('Could not copy text: ', err));
        return false;
    }
};
