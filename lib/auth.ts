import { createClient } from './supabase/client'

export async function signInWithGoogle() {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
  } catch (error) {
    console.error('Login xətası:', error)
    alert('Giriş zamanı xəta baş verdi')
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
