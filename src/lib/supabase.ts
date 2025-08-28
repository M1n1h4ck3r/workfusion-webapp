import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database'

// Use placeholder values if environment variables are not set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Client-side Supabase client with types
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Client component client (with auth and types)
export const createClientSupabaseClient = () => {
  // Only create client if we have valid environment variables
  if (supabaseUrl === 'https://placeholder.supabase.co') {
    console.warn('Supabase URL not configured. Please set NEXT_PUBLIC_SUPABASE_URL in .env.local')
    return null
  }
  return createClientComponentClient<Database>()
}

// Server-side client for API routes
export const createServerSupabaseClient = (
  supabaseAccessToken?: string,
  supabaseRefreshToken?: string
) => {
  return createClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        ...(supabaseAccessToken && {
          storage: {
            getItem: () => JSON.stringify({
              access_token: supabaseAccessToken,
              refresh_token: supabaseRefreshToken,
            }),
            setItem: () => {},
            removeItem: () => {},
          },
        }),
      },
    }
  )
}

export type { Database }