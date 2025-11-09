import { createClient } from './supabase/client'

export async function signInWithGoogle(returnTo?: string) {
  try {
    const supabase = createClient()

    // Build redirect URL with optional returnTo parameter
    const baseUrl = `${window.location.origin}/auth/callback`
    const redirectUrl = returnTo
      ? `${baseUrl}?returnTo=${encodeURIComponent(returnTo)}`
      : baseUrl

    console.log('Starting Google OAuth...')
    console.log('Redirect URL:', redirectUrl)
    console.log('Return to:', returnTo)
    console.log('Current origin:', window.location.origin)

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    })

    console.log('OAuth response:', { data, error })

    if (error) {
      console.error('OAuth error details:', error)
      throw error
    }
  } catch (error: any) {
    console.error('Login xətası:', error)
    console.error('Error message:', error?.message)
    console.error('Error details:', JSON.stringify(error, null, 2))
    alert(`Giriş xətası: ${error?.message || 'Unknown error'}`)
  }
}

export async function signOut() {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    window.location.href = '/'
  } catch (error) {
    console.error('Çıxış xətası:', error)
    alert('Çıxış zamanı xəta baş verdi')
  }
}

export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
