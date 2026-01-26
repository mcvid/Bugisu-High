import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { cacheManager } from '../../lib/cache';
import {
    Map, Navigation, Plus, Edit, Trash2,
    Save, X, Upload, Image as ImageIcon, MapPin, Target, Check
} from 'lucide-react';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/markers-plugin/index.css';

const TourManager = () => {
    const [activeTab, setActiveTab] = useState('stops');

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Virtual Tour Manager</h1>
                <p>Manage campus tour locations, panoramic images, and interactive hotspots.</p>
            </div>

            <div className="admin-tabs">
                <button
                    className={`tab-btn ${activeTab === 'stops' ? 'active' : ''}`}
                    onClick={() => setActiveTab('stops')}
                >
                    <Map size={18} /> Tour Stops
                </button>
                <button
                    className={`tab-btn ${activeTab === 'hotspots' ? 'active' : ''}`}
                    onClick={() => setActiveTab('hotspots')}
                >
                    <MapPin size={18} /> Hotspots Editor
                </button>
            </div>

            <div className="admin-content-wrapper">
                {activeTab === 'stops' && <TourStopsTab />}
                {activeTab === 'hotspots' && <HotspotsTab />}
            </div>
        </div>
    );
};

// ==========================================
// 1. TOUR STOPS TAB
// ==========================================
const TourStopsTab = () => {
    const [stops, setStops] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingStop, setEditingStop] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image_url: '',
        thumbnail_url: '',
        initial_yaw: 0,
        initial_pitch: 0
    });

    useEffect(() => {
        fetchStops();
    }, []);

    const fetchStops = async () => {
        setLoading(true);
        const { data } = await supabase.from('tour_stops').select('*').order('created_at');
        if (data) setStops(data);
        setLoading(false);
    };

    const handleImageUpload = async (e) => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `stops/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('campus_tours')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('campus_tours').getPublicUrl(filePath);

            // Set both as same for now, ideally generate smaller thumb
            setFormData(prev => ({
                ...prev,
                image_url: data.publicUrl,
                thumbnail_url: data.publicUrl
            }));

        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingStop) {
                await supabase.from('tour_stops').update(formData).eq('id', editingStop.id);
            } else {
                await supabase.from('tour_stops').insert([formData]);
            }
            setIsFormOpen(false);
            setEditingStop(null);
            setFormData({ title: '', description: '', image_url: '', thumbnail_url: '', initial_yaw: 0, initial_pitch: 0 });
            fetchStops();
            cacheManager.invalidate('home_data');
        } catch (error) {
            console.error('Error saving stop:', error);
            alert('Failed to save stop');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this tour stop?')) return;
        await supabase.from('tour_stops').delete().eq('id', id);
        fetchStops();
        cacheManager.invalidate('home_data');
    };

    return (
        <div className="tab-content">
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <h3>Tour Locations</h3>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingStop(null);
                        setFormData({ title: '', description: '', image_url: '', thumbnail_url: '', initial_yaw: 0, initial_pitch: 0 });
                        setIsFormOpen(true);
                    }}
                >
                    <Plus size={16} /> Add Stop
                </button>
            </div>

            {isFormOpen && (
                <div className="admin-card form-card">
                    <h4>{editingStop ? 'Edit Stop' : 'Add New Stop'}</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Location Title</label>
                            <input
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Main Gate"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>360°/Panorama Image</label>
                            <div className="file-upload-wrapper">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                                {uploading && <span>Uploading...</span>}
                            </div>
                            {formData.image_url && (
                                <div style={{ marginTop: '0.5rem' }}>
                                    <img src={formData.image_url} alt="Preview" style={{ height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn btn-outline" onClick={() => setIsFormOpen(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={uploading}>Save Stop</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid-list">
                {stops.map(stop => (
                    <div key={stop.id} className="admin-card list-item">
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <img
                                src={stop.thumbnail_url || stop.image_url}
                                alt={stop.title}
                                style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px', backgroundColor: '#eee' }}
                            />
                            <div>
                                <h4>{stop.title}</h4>
                                <p style={{ fontSize: '0.9rem', color: '#666' }}>{stop.description?.substring(0, 60)}...</p>
                            </div>
                        </div>
                        <div className="actions">
                            <button
                                className="btn btn-sm btn-outline"
                                onClick={() => {
                                    setEditingStop(stop);
                                    setFormData(stop);
                                    setIsFormOpen(true);
                                }}
                            >
                                <Edit size={14} />
                            </button>
                            <button className="btn-icon delete" onClick={() => handleDelete(stop.id)}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ==========================================
// 2. HOTSPOTS TAB (Placeholder)
// ==========================================
// ==========================================
// 2. HOTSPOTS TAB
// ==========================================
const HotspotsTab = () => {
    const [stops, setStops] = useState([]);
    const [selectedStopId, setSelectedStopId] = useState('');
    const [hotspots, setHotspots] = useState([]);
    const [viewerInstance, setViewerInstance] = useState(null);
    const [isAddingMode, setIsAddingMode] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [tempCoords, setTempCoords] = useState(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        label: '',
        target_stop_id: '',
        type: 'scene'
    });

    useEffect(() => {
        fetchStops();
    }, []);

    useEffect(() => {
        if (selectedStopId) {
            fetchHotspots(selectedStopId);
        } else {
            setHotspots([]);
        }
    }, [selectedStopId]);

    // Update markers when hotspots change or viewer is ready
    useEffect(() => {
        if (viewerInstance && hotspots.length >= 0) {
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
                        anchor: 'bottom center'
                    });
                });
            }
        }
    }, [viewerInstance, hotspots]);

    const fetchStops = async () => {
        const { data } = await supabase.from('tour_stops').select('*').order('title');
        if (data) setStops(data);
    };

    const fetchHotspots = async (stopId) => {
        const { data } = await supabase.from('tour_hotspots').select('*').eq('stop_id', stopId);
        if (data) setHotspots(data);
    };

    const handleViewerReady = (instance) => {
        setViewerInstance(instance);
    };

    const handleViewerClick = (data) => {
        if (isAddingMode) {
            setTempCoords({ yaw: data.yaw, pitch: data.pitch });
            setShowForm(true);
            setIsAddingMode(false); // Turn off adding mode after click
        }
    };

    const handleSaveHotspot = async (e) => {
        e.preventDefault();
        if (!tempCoords || !selectedStopId) return;

        try {
            setSaving(true);
            const newHotspot = {
                stop_id: selectedStopId,
                ...formData,
                pitch: tempCoords.pitch,
                yaw: tempCoords.yaw
            };

            const { error } = await supabase.from('tour_hotspots').insert([newHotspot]);
            if (error) throw error;

            fetchHotspots(selectedStopId);
            setShowForm(false);
            setFormData({ label: '', target_stop_id: '', type: 'scene' });
            setTempCoords(null);
            alert('Hotspot added!');
        } catch (error) {
            console.error('Error saving hotspot:', error);
            alert('Failed to save hotspot');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteHotspot = async (id) => {
        if (!window.confirm('Delete this hotspot?')) return;
        await supabase.from('tour_hotspots').delete().eq('id', id);
        fetchHotspots(selectedStopId);
    };

    const selectedStop = stops.find(s => s.id === selectedStopId);

    return (
        <div className="tab-content" style={{ display: 'flex', gap: '1rem', height: 'calc(100vh - 200px)' }}>
            {/* Sidebar Controls */}
            <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
                <div className="admin-card">
                    <h4>1. Select Scene</h4>
                    <select
                        style={{ width: '100%', padding: '0.5rem' }}
                        value={selectedStopId}
                        onChange={(e) => setSelectedStopId(e.target.value)}
                    >
                        <option value="">-- Choose a location --</option>
                        {stops.map(stop => (
                            <option key={stop.id} value={stop.id}>{stop.title}</option>
                        ))}
                    </select>
                </div>

                {selectedStop && (
                    <div className="admin-card">
                        <h4>2. Manage Hotspots</h4>
                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                            {isAddingMode
                                ? "Click anywhere on the image to place the hotspot."
                                : "Click 'Add Hotspot' then click on the panorama."}
                        </p>

                        {!isAddingMode && !showForm && (
                            <button
                                className="btn btn-primary w-full"
                                onClick={() => setIsAddingMode(true)}
                                style={{ marginBottom: '1rem' }}
                            >
                                <Plus size={16} /> Add Hotspot
                            </button>
                        )}

                        {isAddingMode && (
                            <div className="alert alert-info" style={{ padding: '0.5rem', fontSize: '0.9rem' }}>
                                <Target size={14} /> Tap on image to place...
                                <button
                                    onClick={() => setIsAddingMode(false)}
                                    style={{ marginLeft: '0.5rem', textDecoration: 'underline', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        <div className="hotspots-list" style={{ marginTop: '1rem' }}>
                            <h5 style={{ marginBottom: '0.5rem' }}>Existing Hotspots ({hotspots.length})</h5>
                            {hotspots.length === 0 && <p className="text-grey text-sm">No hotspots yet.</p>}
                            {hotspots.map(h => {
                                const target = stops.find(s => s.id === h.target_stop_id);
                                return (
                                    <div key={h.id} style={{
                                        background: '#f9fafb', padding: '0.5rem', borderRadius: '4px',
                                        marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                    }}>
                                        <div>
                                            <strong>{h.label}</strong>
                                            <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                                Target: {target?.title || 'Unknown'}
                                            </div>
                                        </div>
                                        <button className="btn-icon delete" onClick={() => handleDeleteHotspot(h.id)}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Viewer Area */}
            <div style={{ flex: 1, position: 'relative', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#000' }}>
                {selectedStop ? (
                    <>
                        <ReactPhotoSphereViewer
                            src={selectedStop.image_url}
                            height={'100%'}
                            width={"100%"}
                            container={""}
                            onReady={handleViewerReady}
                            onClick={handleViewerClick}
                            plugins={[
                                [MarkersPlugin, {}]
                            ]}
                        />

                        {/* Add Hotspot Modal/Form Overlay */}
                        {showForm && (
                            <div style={{
                                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                width: '300px', zIndex: 100
                            }}>
                                <h4>New Hotspot Details</h4>
                                <form onSubmit={handleSaveHotspot}>
                                    <div className="form-group">
                                        <label>Label</label>
                                        <input
                                            value={formData.label}
                                            onChange={e => setFormData({ ...formData, label: e.target.value })}
                                            placeholder="e.g. Go to Hall"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Target Scene</label>
                                        <select
                                            value={formData.target_stop_id}
                                            onChange={e => setFormData({ ...formData, target_stop_id: e.target.value })}
                                            required
                                        >
                                            <option value="">-- Select Destination --</option>
                                            {stops.filter(s => s.id !== selectedStopId).map(s => (
                                                <option key={s.id} value={s.id}>{s.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-actions">
                                        <button
                                            type="button"
                                            className="btn btn-outline"
                                            onClick={() => { setShowForm(false); setTempCoords(null); }}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary" disabled={saving}>
                                            <Check size={16} /> Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
                        <p>Select a scene from the sidebar to start editing.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TourManager;
