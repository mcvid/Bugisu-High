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

async function debugSchema() {
    console.log('Checking hero_slides table...');
    const { data, error } = await supabase.from('hero_slides').select('*').limit(1);

    if (error) {
        console.error('Error fetching hero_slides:', error.message);
        if (error.message.includes('column "page_path" does not exist')) {
            console.log('MIGRATION NEEDED: page_path column is missing.');
        }
        if (error.message.includes('column "sort_order" does not exist')) {
            console.log('MIGRATION NEEDED: sort_order column is missing.');
        }
    } else {
        console.log('Table structure:', data.length > 0 ? Object.keys(data[0]) : 'Empty table');
    }
}

debugSchema();
