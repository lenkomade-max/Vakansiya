import { createClient } from '../supabase/client'

export type Profile = {
  id: string
  full_name: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

/**
 * Get user profile from database
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

/**
 * Update user profile (name and/or phone)
 */
export async function updateProfile(
  userId: string,
  updates: { full_name?: string; phone?: string }
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)

  if (error) {
    console.error('Error updating profile:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Create profile for new user (called automatically by trigger, but can be used manually)
 */
export async function createProfile(
  userId: string,
  fullName?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  const { error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      full_name: fullName || null,
    })

  if (error) {
    console.error('Error creating profile:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
