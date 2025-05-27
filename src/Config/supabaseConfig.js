import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ehnkoavwjcdciejqvcoe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVobmtvYXZ3amNkY2llanF2Y29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDI1OTksImV4cCI6MjA2MzkxODU5OX0.TMltv-3Dk7mWqYR7UECgEkREOdfvogqA96UwpAA39Ms';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('SupaBase URl ou chave não estão configuradas corretamente!');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    realtime: {
        enabled: false,
    },
});
