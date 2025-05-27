import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rqlnquhnzozmnvstpbkx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxbG5xdWhuem96bW52c3RwYmt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NjIzNjUsImV4cCI6MjA2MzMzODM2NX0.235tK40hLpHOs8HAJyywd5dPEKMJ5yLA-wCS5NMts80';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('SupaBase URl ou chave não estão configuradas corretamente!');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    realtime: {
        enabled: false,
    },
});
