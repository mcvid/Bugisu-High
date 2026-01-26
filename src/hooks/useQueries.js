import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

/**
 * Hook to fetch news articles with caching
 */
export const useNews = (options = {}) => {
    return useQuery({
        queryKey: ['news', options],
        queryFn: async () => {
            let query = supabase
                .from('news')
                .select('*')
                .eq('is_published', true)
                .order('published_at', { ascending: false });

            if (options.limit) {
                query = query.limit(options.limit);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data;
        }
    });
};

/**
 * Hook to fetch a single news article by slug
 */
export const useNewsArticle = (slug) => {
    return useQuery({
        queryKey: ['news', slug],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!slug
    });
};

/**
 * Hook to fetch events with caching
 */
export const useEvents = (limit = 20) => {
    return useQuery({
        queryKey: ['events', limit],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('event_date', { ascending: true })
                .limit(limit);

            if (error) throw error;
            return data;
        }
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
export const useAnnouncements = (limit = 5) => {
    return useQuery({
        queryKey: ['announcements', limit],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('announcements')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data;
        }
    });
};

/**
 * Hook to fetch hero slides
 */
export const useHeroSlides = () => {
    return useQuery({
        queryKey: ['hero-slides'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('hero_slides')
                .select('*')
                .order('created_at', { ascending: true });
            if (error) throw error;
            return data;
        }
    });
};

/**
 * Hook to fetch administration team
 */
export const useAdministration = () => {
    return useQuery({
        queryKey: ['administration'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('administration')
                .select('*')
                .order('sort_order', { ascending: true });
            if (error) throw error;
            return data;
        }
    });
};

/**
 * Hook to fetch specialized homepage assets (video, tour preview)
 */
export const useHomepageAssets = () => {
    return useQuery({
        queryKey: ['homepage-assets'],
        queryFn: async () => {
            const [video, tour] = await Promise.all([
                supabase.from('site_settings').select('promo_video_url, promo_video_thumbnail').eq('key', 'homepage_video').maybeSingle(),
                supabase.from('tour_stops').select('image_url, thumbnail_url').limit(1).maybeSingle()
            ]);

            return {
                video: video.data,
                tour: tour.data
            };
        }
    });
};
