import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rqlnquhnzozmnvstpbkx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxbG5xdWhuem96bW52c3RwYmt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NjIzNjUsImV4cCI6MjA2MzMzODM2NX0.235tK40hLpHOs8HAJyywd5dPEKMJ5yLA-wCS5NMts80';

export const supabase = createClient(supabaseUrl, supabaseKey);