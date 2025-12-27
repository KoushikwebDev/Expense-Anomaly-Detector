import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function createServerSupabaseClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_APP_SUPABASE_URL!,
        process.env.NEXT_APP_SUPABASE_API_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing sessions.
                    }
                },
            },
        }
    );
}

// Admin client with service role (bypasses RLS)
export function createAdminClient() {
    return createClient(
        process.env.NEXT_APP_SUPABASE_URL!,
        process.env.NEXT_APP_SUPABASE_SERVICE_ROLE_KEY!
    );
}

