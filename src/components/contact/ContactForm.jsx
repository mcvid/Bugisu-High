import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Send, CheckCircle } from 'lucide-react';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.from('contact_messages').insert([formData]);
            if (error) throw error;
            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting message:', error);
            alert('Error sending message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="dept-item reveal-on-scroll" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <CheckCircle size={48} color="#10b981" style={{ marginBottom: '1.5rem' }} />
                <h3>Message Sent</h3>
                <p style={{ color: '#64748b' }}>We have received your message and will get back to you shortly.</p>
                <button className="btn btn-outline" style={{ marginTop: '1.5rem' }} onClick={() => setSubmitted(false)}>Send another message</button>
            </div>
        );
    }

    return (
        <div className="level-card reveal-on-scroll">
            <h3 style={{ marginBottom: '2rem' }}>Send us a Message</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                <div className="contact-form-row">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="form-input"
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>Subject</label>
                    <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label>Message</label>
                    <textarea
                        required
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        className="form-input form-textarea"
                    ></textarea>
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                    {loading ? 'Sending...' : <><Send size={18} /> Send Message</>}
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
