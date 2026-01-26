import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const ContactInfo = () => {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase.from('contact_settings').select('*').single();
            if (data) setSettings(data);
        };
        fetchSettings();
    }, []);

    const defaultInfo = {
        address: 'Bugisu High School, Mbale, Uganda',
        phone_main: '+256 000 000 000',
        phone_admissions: '+256 000 000 001',
        email_general: 'info@bugisuhighschool.com',
        email_admissions: 'admissions@bugisuhighschool.com',
        office_hours: 'Mon - Fri: 8:00 AM - 5:00 PM'
    };

    const info = settings || defaultInfo;

    return (
        <div className="contact-info-grid reveal-on-scroll">
            <div className="info-item">
                <div className="info-icon-wrapper location-icon">
                    <MapPin size={24} />
                </div>
                <h4>Location</h4>
                <p>{info.address}</p>
            </div>

            <div className="info-item">
                <div className="info-icon-wrapper phone-icon">
                    <Phone size={24} />
                </div>
                <h4>Phone</h4>
                <p>Main: {info.phone_main}</p>
                {info.phone_admissions && <p>Admissions: {info.phone_admissions}</p>}
            </div>

            <div className="info-item">
                <div className="info-icon-wrapper email-icon">
                    <Mail size={24} />
                </div>
                <h4>Email</h4>
                <div className="email-links">
                    <p>{info.email_general}</p>
                    {info.email_admissions && <p className="admissions-email">Admissions: {info.email_admissions}</p>}
                </div>
            </div>

            <div className="info-item">
                <div className="info-icon-wrapper hours-icon">
                    <Clock size={24} />
                </div>
                <h4>Office Hours</h4>
                <p>{info.office_hours}</p>
            </div>
        </div>
    );
};

export default ContactInfo;
