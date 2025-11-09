'use server'

import { createClient } from '../supabase/server'

export type Category = {
  id: string
  name: string
  name_az: string
  type: 'vacancy' | 'short_job'
  parent_id: string | null
  icon: string | null
  sort_order: number
  is_active: boolean
  created_at: string
}

/**
 * Get all active categories by type
 */
export async function getCategories(type: 'vacancy' | 'short_job'): Promise<Category[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('type', type)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data || []
}

/**
 * Get all active cities
 */
export async function getCities(): Promise<string[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('cities')
    .select('name_az')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching cities:', error)
    return []
  }

  return data?.map(c => c.name_az) || []
}
