import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { cacheManager } from '../../lib/cache';
import { Trash2, Upload, Plus, Pencil, X, Save } from 'lucide-react';

const AdministrationManager = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(null); // ID of the person being edited
    const [formData, setFormData] = useState({ name: '', role: '', image_url: '' });

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('administration')
            .select('*')
            .order('sort_order', { ascending: true })
            .order('created_at', { ascending: true });

        if (data) setStaff(data);
        setLoading(false);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `administration/${fileName}`;

            const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
            setFormData({ ...formData, image_url: publicUrl });

        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Upload failed!');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.role) return;

        try {
            if (isEditing) {
                const { error } = await supabase
                    .from('administration')
                    .update({
                        name: formData.name,
                        role: formData.role,
                        image_url: formData.image_url
                    })
                    .eq('id', isEditing);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('administration')
                    .insert([formData]);
                if (error) throw error;
            }

            setFormData({ name: '', role: '', image_url: '' });
            setIsEditing(null);
            fetchStaff();
            cacheManager.invalidate('home_data');
        } catch (error) {
            console.error('Error saving staff member:', error);
            alert('Save failed!');
        }
    };

    const handleEdit = (person) => {
        setIsEditing(person.id);
        setFormData({
            name: person.name,
            role: person.role,
            image_url: person.image_url
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this staff member?')) return;

        try {
            const { error } = await supabase.from('administration').delete().eq('id', id);
            if (error) throw error;
            setStaff(staff.filter(s => s.id !== id));
            cacheManager.invalidate('home_data');
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Delete failed!');
        }
    };

    const cancelEdit = () => {
        setIsEditing(null);
        setFormData({ name: '', role: '', image_url: '' });
    };

    return (
        <div className="admin-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>Administration Management</h1>
                    <p style={{ color: '#6b7280' }}>Add, edit, or remove school leadership members.</p>
                </div>
            </div>

            {/* Form Box */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {isEditing ? <Pencil size={20} /> : <Plus size={20} />}
                    {isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}
                </h3>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Full Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Mr. John Okello"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px' }}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Role / Position</label>
                            <input
                                type="text"
                                placeholder="e.g. Head Teacher"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px' }}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Photo</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: '#f3f4f6',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                border: '2px solid #e5e7eb'
                            }}>
                                {formData.image_url ? (
                                    <img src={formData.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <Upload size={24} color="#9ca3af" />
                                )}
                            </div>
                            <div>
                                <label className="btn btn-outline" style={{ cursor: uploading ? 'wait' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Upload size={16} />
                                    {uploading ? 'Uploading...' : 'Upload Image'}
                                    <input type="file" onChange={handleImageUpload} style={{ display: 'none' }} accept="image/*" disabled={uploading} />
                                </label>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>Recommended: Square image, 400x400px</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }} disabled={uploading}>
                            <Save size={18} />
                            {isEditing ? 'Update Member' : 'Add Member'}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={cancelEdit} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                <X size={18} /> Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* List Section */}
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Current Administration</h2>

            {loading ? (
                <p>Loading staff list...</p>
            ) : staff.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: '#f9fafb', borderRadius: '12px', border: '2px dashed #e5e7eb' }}>
                    <p style={{ color: '#6b7280' }}>No administration members added yet.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {staff.map(person => (
                        <div key={person.id} style={{
                            background: 'white',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            border: '1px solid #f3f4f6',
                            transition: 'transform 0.2s',
                            position: 'relative'
                        }}>
                            <div style={{ display: 'flex', padding: '1rem', alignItems: 'center', gap: '1rem' }}>
                                <img
                                    src={person.image_url || 'https://via.placeholder.com/150'}
                                    alt={person.name}
                                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{person.name}</h4>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>{person.role}</p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => handleEdit(person)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', padding: '4px' }}
                                        title="Edit"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(person.id)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdministrationManager;
