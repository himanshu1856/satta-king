// utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// ✅ This is the client-side instance
export const supabase = createClient(supabaseUrl, supabaseKey);

// ✅ For server-side: import createServerSupabaseClient separately
export { createServerSupabaseClient };
