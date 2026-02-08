import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const SchoolContext = createContext();

// Bugisu High School Fixed ID from our migration
export const BUGISU_HIGH_SCHOOL_ID = 'b4e9e0e0-e0e0-4e0e-8e0e-e0e0e0e0e0e0';

export const SchoolProvider = ({ children }) => {
    const [school, setSchool] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchool = async () => {
            try {
                // Determine school by subdomain or slug
                // For local development, we default to bugisu-high
                // In production, this would look at window.location.hostname
                const hostname = window.location.hostname;
                let slug = 'bugisu-high';

                if (hostname !== 'localhost' && !hostname.includes('127.0.0.1')) {
                    // Extract subdomain: schoolname.domain.com
                    const parts = hostname.split('.');
                    if (parts.length > 2) {
                        slug = parts[0];
                    }
                }

                const { data, error } = await supabase
                    .from('schools')
                    .select('*')
                    .eq('slug', slug)
                    .single();

                let activeSchool = data;
                if (error) {
                    console.error('Error fetching school:', error);
                    const { data: fallbackData } = await supabase
                        .from('schools')
                        .select('*')
                        .eq('id', BUGISU_HIGH_SCHOOL_ID)
                        .single();
                    activeSchool = fallbackData;
                }

                setSchool(activeSchool);

                // Inject CSS Variables for Branding
                if (activeSchool) {
                    const root = document.documentElement;
                    if (activeSchool.primary_color) {
                        root.style.setProperty('--color-primary', activeSchool.primary_color);
                    }
                    if (activeSchool.secondary_color) {
                        root.style.setProperty('--color-secondary', activeSchool.secondary_color);
                    }
                }
            } catch (err) {
                console.error('School detection failed:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSchool();
    }, []);

    const value = {
        school,
        loading,
        isBugisu: school?.id === BUGISU_HIGH_SCHOOL_ID
    };

    return (
        <SchoolContext.Provider value={value}>
            {!loading && children}
        </SchoolContext.Provider>
    );
};

export const useSchool = () => {
    const context = useContext(SchoolContext);
    if (!context) {
        throw new Error('useSchool must be used within a SchoolProvider');
    }
    return context;
};
