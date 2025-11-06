import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createBrowserClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to homepage after successful login
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}

// Removed edge runtime to fix build
