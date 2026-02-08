import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugContent() {
    console.log('Checking hero_slides table content...');
    const { data: rows, error } = await supabase.from('hero_slides').select('id, page_path, image_url, title');

    if (error) {
        console.error('Error fetching hero_slides:', error.message);
    } else {
        console.log('Total rows:', rows?.length);
        const pathCounts = {};
        rows?.forEach(r => {
            const p = r.page_path || 'NULL';
            pathCounts[p] = (pathCounts[p] || 0) + 1;
        });
        console.log('Grouped by page_path:', pathCounts);
        console.log('Detailed data:', rows);
    }
}

debugContent();
