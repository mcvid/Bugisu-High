import React, { useRef, useState, useEffect } from 'react';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/markers-plugin/index.css';

const VirtualTourViewer = ({
    imageUrl,
    initialYaw = 0,
    initialPitch = 0,
    hotspots = [],
    onHotspotClick,
    onReady
}) => {
    const psvRef = useRef(null);
    const [viewerInstance, setViewerInstance] = useState(null);

    const handleReady = (instance) => {
        psvRef.current = instance;
        setViewerInstance(instance);

        const markersPlugin = instance.getPlugin(MarkersPlugin);
        if (markersPlugin) {
            markersPlugin.addEventListener('select-marker', ({ marker }) => {
                if (onHotspotClick && marker.data) {
                    onHotspotClick(marker.data);
                }
            });
        }

        if (onReady) onReady(instance);
    };

    // Update markers when hotspots change
    useEffect(() => {
        if (viewerInstance && hotspots) {
            const markersPlugin = viewerInstance.getPlugin(MarkersPlugin);
            if (markersPlugin) {
                markersPlugin.clearMarkers();
                hotspots.forEach(h => {
                    markersPlugin.addMarker({
                        id: h.id,
                        position: { yaw: h.yaw, pitch: h.pitch },
                        image: 'https://photo-sphere-viewer.js.org/assets/pin-red.png',
                        size: { width: 32, height: 32 },
                        tooltip: h.label,
                        anchor: 'bottom center',
                        data: h // Pass full hotspot object
                    });
                });
            }
        }
    }, [viewerInstance, hotspots]);

    if (!imageUrl) return <div className="tour-loading">Loading tour...</div>;

    return (
        <div className="tour-viewer-container" style={{ width: '100%', height: '100%' }}>
            <ReactPhotoSphereViewer
                src={imageUrl}
                height={'100%'}
                width={"100%"}
                defaultYaw={initialYaw}
                defaultPitch={initialPitch}
                container={""}
                onReady={handleReady}
                plugins={[
                    [MarkersPlugin, {}]
                ]}
                navbar={[
                    'zoom',
                    'move',
                    'caption',
                    'fullscreen'
                ]}
            />
        </div>
    );
};

export default VirtualTourViewer;
