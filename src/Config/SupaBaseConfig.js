import { createClient } from '@supabase/supabase-js';

// Escolha apenas UM par de URL e ANON_KEY para usar.
// Remova um dos pares duplicados abaixo e mantenha só o que você deseja usar:

const SUPABASE_URL = 'https://rqlnquhnzozmnvstpbkx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxbG5xdWhuem96bW52c3RwYmt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NjIzNjUsImV4cCI6MjA2MzMzODM2NX0.235tK40hLpHOs8HAJyywd5dPEKMJ5yLA-wCS5NMts80';

// Se quiser usar o outro projeto, troque as duas linhas acima pelas duas abaixo:
// const SUPABASE_URL = 'https://ehnkoavwjcdciejqvcoe.supabase.co';
// const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVobmtvYXZ3amNkY2llanF2Y29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDI1OTksImV4cCI6MjA2MzkxODU5OX0.TMltv-3Dk7mWqYR7UECgEkREOdfvogqA96UwpAA39Ms';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('SupaBase URL ou chave não estão configuradas corretamente!');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);