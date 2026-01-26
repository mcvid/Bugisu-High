import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import VirtualTourViewer from '../components/VirtualTourViewer';
import { MapPin, List, Info, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import './VirtualTour.css';

const VirtualTour = () => {
    const { t } = useTranslation(['tour', 'common']);
    const [stops, setStops] = useState([]);
    const [currentStop, setCurrentStop] = useState(null);
    const [hotspots, setHotspots] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStops();
    }, []);

    useEffect(() => {
        if (currentStop) {
            fetchHotspots(currentStop.id);
        }
    }, [currentStop]);

    const fetchStops = async () => {
        setLoading(true);
        const { data } = await supabase.from('tour_stops').select('*').order('created_at');
        if (data && data.length > 0) {
            setStops(data);
            if (!currentStop) setCurrentStop(data[0]);
        }
        setLoading(false);
    };

    const fetchHotspots = async (stopId) => {
        const { data } = await supabase.from('tour_hotspots').select('*').eq('stop_id', stopId);
        if (data) setHotspots(data);
    };

    const handleStopChange = (stop) => {
        setCurrentStop(stop);
        if (window.innerWidth < 768) setSidebarOpen(false);
    };

    const handleHotspotClick = (hotspotData) => {
        if (hotspotData.target_stop_id) {
            const target = stops.find(s => s.id === hotspotData.target_stop_id);
            if (target) handleStopChange(target);
        }
    };

    return (
        <div className="virtual-tour-page">
            <SEO
                title={currentStop ? `Virtual Tour: ${currentStop.title}` : "Virtual Campus Tour"}
                description={currentStop?.description || "Take a 360-degree virtual tour of Bugisu High School campus and facilities."}
                image={currentStop?.image_url}
                url="/virtual-tour"
            />
            {/* Sidebar */}
            <div className={`tour-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="tour-header">
                    <h2>{t('sidebar_title')}</h2>
                    <button className="close-tour-sidebar" onClick={() => setSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>
                <div className="tour-stops-list">
                    {loading ? <p className="p-4">{t('common.loading')}</p> : stops.map(stop => (
                        <div
                            key={stop.id}
                            className={`tour-stop-item ${currentStop?.id === stop.id ? 'active' : ''}`}
                            onClick={() => handleStopChange(stop)}
                        >
                            <img src={stop.thumbnail_url || stop.image_url} alt={stop.title} />
                            <div className="stop-info">
                                <h4>{stop.title}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Viewer Area */}
            <div className="tour-main">
                <button
                    className="toggle-tour-sidebar"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <List size={24} />
                </button>

                {currentStop ? (
                    <div className="viewer-wrapper">
                        <VirtualTourViewer
                            key={currentStop.id} // Re-render on stop change
                            imageUrl={currentStop.image_url}
                            initialYaw={currentStop.initial_yaw}
                            initialPitch={currentStop.initial_pitch}
                            hotspots={hotspots}
                            onHotspotClick={handleHotspotClick}
                        />
                        <div className="current-stop-overlay">
                            <h3>{currentStop.title}</h3>
                            {currentStop.description && <p>{currentStop.description}</p>}
                        </div>
                    </div>
                ) : (
                    <div className="tour-empty-state">
                        <p>{loading ? t('loading') : t('empty')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VirtualTour;
