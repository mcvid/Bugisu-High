import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const siteUrl = 'https://bugisuunitedfc.com'; // Change this to your actual production URL

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSitemap() {
    console.log('🚀 Generating sitemap...');

    const staticPages = [
        '',
        '/about',
        '/academics',
        '/admissions',
        '/news',
        '/events',
        '/gallery',
        '/contact',
        '/faq',
        '/study-tips',
        '/past-papers',
        '/virtual-tour',
        '/clubs',
        '/sports',
        '/student-life',
        '/academic-calendar'
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // 1. Add Static Pages
    staticPages.forEach(page => {
        let priority = '0.7';
        let freq = 'monthly';

        if (page === '') {
            priority = '1.0';
            freq = 'daily';
        } else if (page === '/admissions') {
            priority = '1.0';
            freq = 'monthly';
        } else if (page === '/news') {
            priority = '0.9';
            freq = 'daily';
        } else if (page === '/events' || page === '/calendar') {
            priority = '0.8';
            freq = 'daily';
        } else if (page === '/academics' || page === '/about') {
            priority = '0.8';
            freq = 'monthly';
        } else if (page === '/contact' || page === '/faq') {
            priority = '0.6';
            freq = 'monthly';
        }

        xml += `  <url>\n`;
        xml += `    <loc>${siteUrl}${page}</loc>\n`;
        xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
        xml += `    <changefreq>${freq}</changefreq>\n`;
        xml += `    <priority>${priority}</priority>\n`;
        xml += `  </url>\n`;
    });

    // 2. Fetch News Articles
    try {
        const { data: newsItems, error } = await supabase
            .from('news')
            .select('slug, created_at, published_at')
            .eq('is_published', true);

        if (error) throw error;

        if (newsItems) {
            newsItems.forEach(item => {
                const date = item.published_at || item.created_at || new Date().toISOString();
                xml += `  <url>\n`;
                xml += `    <loc>${siteUrl}/news/${item.slug}</loc>\n`;
                xml += `    <lastmod>${new Date(date).toISOString().split('T')[0]}</lastmod>\n`;
                xml += `    <changefreq>monthly</changefreq>\n`;
                xml += `    <priority>0.7</priority>\n`;
                xml += `  </url>\n`;
            });
        }
    } catch (err) {
        console.error('❌ Error fetching news:', err);
    }

    // 3. Fetch Galleries (Albums)
    try {
        const { data: galleries } = await supabase
            .from('galleries')
            .select('id, event_date');

        if (galleries) {
            // Note: We don't have individual gallery pages linked by slug yet, 
            // but we add them if the structure supports it. 
            // For now, the gallery page handles all albums.
        }
    } catch (err) {
        console.error('Error fetching galleries:', err);
    }

    xml += '</urlset>';

    const outputPath = path.join(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(outputPath, xml);

    console.log(`✅ Sitemap generated at ${outputPath}`);
}

generateSitemap();
