import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Use placeholder values if environment variables are not set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client component client (with auth)
export const createClientSupabaseClient = () => {
  // Only create client if we have valid environment variables
  if (supabaseUrl === 'https://placeholder.supabase.co') {
    console.warn('Supabase URL not configured. Please set NEXT_PUBLIC_SUPABASE_URL in .env.local')
    return null
  }
  return createClientComponentClient()
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type Database = {
  // Types will be generated later with: npx supabase gen types typescript --local > types/supabase.ts
}