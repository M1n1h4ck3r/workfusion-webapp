import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')
  const type = searchParams.get('type')

  if (!token) {
    return NextResponse.redirect(
      new URL('/auth/login?error=missing_token', request.url)
    )
  }

  try {
    if (type === 'signup') {
      // Verify email for new signup
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup'
      })

      if (error) {
        return NextResponse.redirect(
          new URL('/auth/login?error=invalid_token', request.url)
        )
      }

      // Redirect to dashboard after successful verification
      return NextResponse.redirect(
        new URL('/dashboard?verified=true', request.url)
      )
    } else if (type === 'recovery') {
      // Handle password recovery
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'recovery'
      })

      if (error) {
        return NextResponse.redirect(
          new URL('/auth/login?error=invalid_recovery_token', request.url)
        )
      }

      // Redirect to password reset page
      return NextResponse.redirect(
        new URL('/auth/reset-password', request.url)
      )
    } else {
      return NextResponse.redirect(
        new URL('/auth/login?error=invalid_type', request.url)
      )
    }
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.redirect(
      new URL('/auth/login?error=verification_failed', request.url)
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Resend verification email
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email
    })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to resend verification email' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Verification email sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}