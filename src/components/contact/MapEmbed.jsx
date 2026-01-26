import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const DEFAULT_MAP =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.097062909087!2d34.17268087521489!3d1.0894636989000828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1778b63874ea2aa9%3A0x8da182477d64c8fa!2sBugisu%20High%20School!5e0!3m2!1sen!2sug!4v1768127117740!5m2!1sen!2sug";

const MapEmbed = () => {
    const [mapUrl, setMapUrl] = useState(DEFAULT_MAP);

    useEffect(() => {
        // TEMPORARY: Testing with default URL only (database disabled)
        console.log('🗺️ MapEmbed: TESTING MODE - Using default URL only');
        console.log('🗺️ Default URL:', DEFAULT_MAP);

        /* Database fetch temporarily disabled for testing
        const fetchMap = async () => {
            console.log('🗺️ MapEmbed: Fetching map URL from database...');
            console.log('🗺️ MapEmbed: Default URL:', DEFAULT_MAP);

            const { data, error } = await supabase
                .from('contact_settings')
                .select('map_embed_url')
                .limit(1)
                .maybeSingle();

            if (error) {
                console.error('❌ Map fetch error:', error);
                console.log('✅ Using default map URL');
                return;
            }

            if (data?.map_embed_url?.trim()) {
                console.log('📍 Database map URL found:', data.map_embed_url);
                setMapUrl(data.map_embed_url);
            } else {
                console.log('✅ No database URL found, using default');
            }
        };

        fetchMap();
        */
    }, []);

    return (
        <section
            className="map-embed-section"
            style={{
                padding: 0,
                overflow: 'hidden',
                borderRadius: '24px',
                border: '1px solid #f1f5f9',
                opacity: 1,
                transform: 'translateY(0)'
            }}
        >
            <iframe
                src={mapUrl}
                width="100%"
                height="450"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title="School Location Map"
            />
        </section>
    );
};

export default MapEmbed;
