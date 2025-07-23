import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lzlpfpydxnzitpbzobfr.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6bHBmcHlkeG56aXRwYnpvYmZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYzMTU0NzAsImV4cCI6MjAwMTg5MTQ3MH0.dxaiqLbzJA6iY-jXrDKYu_BQfGpUVjnUEQq8Bo5-xS8'

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)