import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

/**
 * Hook to fetch news articles with caching
 */
export const useNews = (schoolId, options = {}) => {
    return useQuery({
        queryKey: ['news', schoolId, options],
        queryFn: async () => {
            if (!schoolId) return [];
            let query = supabase
                .from('news')
                .select('*')
                .eq('school_id', schoolId)
                .eq('is_published', true)
                .order('published_at', { ascending: false });

            if (options.limit) {
                query = query.limit(options.limit);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data;
        },
        enabled: !!schoolId
    });
};

/**
 * Hook to fetch a single news article by slug
 */
export const useNewsArticle = (schoolId, slug) => {
    return useQuery({
        queryKey: ['news', schoolId, slug],
        queryFn: async () => {
            if (!schoolId || !slug) return null;
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .eq('school_id', schoolId)
                .eq('slug', slug)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!schoolId && !!slug
    });
};

/**
 * Hook to fetch events with caching
 */
export const useEvents = (schoolId, limit = 20) => {
    return useQuery({
        queryKey: ['events', schoolId, limit],
        queryFn: async () => {
            if (!schoolId) return [];
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('school_id', schoolId)
                .order('event_date', { ascending: true })
                .limit(limit);

            if (error) throw error;
            return data;
        },
        enabled: !!schoolId
    });
};

/**
 * Hook to fetch teachers/staff
 */
export const useTeachers = () => {
    return useQuery({
        queryKey: ['teachers'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('teachers')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            return data;
        }
    });
};

/**
 * Hook to fetch active announcements/alerts
 */
export const useAnnouncements = (schoolId, limit = 5) => {
    return useQuery({
        queryKey: ['announcements', schoolId, limit],
        queryFn: async () => {
            if (!schoolId) return [];
            const { data, error } = await supabase
                .from('announcements')
                .select('*')
                .eq('school_id', schoolId)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data;
        },
        enabled: !!schoolId
    });
};

/**
 * Hook to fetch hero slides for a specific page
 */
export const useHeroSlides = (pagePath = '/') => {
    return useQuery({
        queryKey: ['hero-slides', pagePath],
        queryFn: async () => {
            try {
                const { data, error } = await supabase
                    .from('hero_slides')
                    .select('*')
                    .eq('page_path', pagePath)
                    .order('sort_order', { ascending: true });

                if (error) {
                    // Check if error is due to missing column (migration not run)
                    if (error.code === '42703' || error.message?.includes('page_path')) {
                        console.warn('Hero slides: Falling back due to missing page_path column.');
                        const { data: fallbackData, error: fallbackError } = await supabase
                            .from('hero_slides')
                            .select('*')
                            .order('created_at', { ascending: true });
                        if (fallbackError) throw fallbackError;
                        return fallbackData || [];
                    }
                    throw error;
                }
                return data || [];
            } catch (err) {
                console.error('Error fetching hero slides:', err);
                return []; // Return empty array to trigger frontend fallback
            }
        }
    });
};

/**
 * Hook to fetch administration team
 */
export const useAdministration = (schoolId) => {
    return useQuery({
        queryKey: ['administration', schoolId],
        queryFn: async () => {
            if (!schoolId) return [];
            const { data, error } = await supabase
                .from('administration')
                .select('*')
                .eq('school_id', schoolId)
                .order('sort_order', { ascending: true });
            if (error) throw error;
            return data;
        },
        enabled: !!schoolId
    });
};

/**
 * Hook to fetch specialized homepage assets (video, tour preview)
 */
export const useHomepageAssets = (schoolId) => {
    return useQuery({
        queryKey: ['homepage-assets', schoolId],
        queryFn: async () => {
            if (!schoolId) return { video: null, tour: null };
            const [video, tour] = await Promise.all([
                supabase.from('site_settings').select('promo_video_url, promo_video_thumbnail').eq('school_id', schoolId).eq('key', 'homepage_video').maybeSingle(),
                supabase.from('tour_stops').select('image_url, thumbnail_url').eq('school_id', schoolId).limit(1).maybeSingle()
            ]);

            return {
                video: video.data,
                tour: tour.data
            };
        },
        enabled: !!schoolId
    });
};
