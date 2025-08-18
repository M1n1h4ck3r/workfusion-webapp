import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// OAuth callback handler for Supabase Auth
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    try {
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('OAuth exchange error:', error)
        return NextResponse.redirect(
          `${origin}/auth/login?error=${encodeURIComponent(error.message)}`
        )
      }

      // Check if user exists in our database and create profile if needed
      if (data.user) {
        console.log('OAuth success for user:', data.user.email)
        
        // TODO: Create user profile in your database if it doesn't exist
        // const { data: profile } = await supabase
        //   .from('profiles')
        //   .select('*')
        //   .eq('id', data.user.id)
        //   .single()
        
        // if (!profile) {
        //   await supabase.from('profiles').insert({
        //     id: data.user.id,
        //     email: data.user.email,
        //     name: data.user.user_metadata?.name || 'User',
        //     avatar_url: data.user.user_metadata?.avatar_url,
        //     tokens: 500, // Give new users 500 free tokens
        //     role: 'user'
        //   })
        // }
      }

      // Successful authentication, redirect to dashboard
      return NextResponse.redirect(`${origin}${next}`)
      
    } catch (error) {
      console.error('Unexpected OAuth error:', error)
      return NextResponse.redirect(
        `${origin}/auth/login?error=${encodeURIComponent('Authentication failed')}`
      )
    }
  }

  // No code received, redirect to login with error
  return NextResponse.redirect(
    `${origin}/auth/login?error=${encodeURIComponent('No authorization code received')}`
  )
}