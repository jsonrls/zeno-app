import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'

/**
 * Returns the public profile for an authenticated user, creating it when an
 * older Auth account has no matching public.profiles row.
 */
export async function ensureProfile(user: User) {
  const { data: existingProfile, error: lookupError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (lookupError) throw lookupError
  if (existingProfile) return existingProfile

  const metadata = user.user_metadata || {}
  const { error: createError } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      email: user.email || '',
      name: metadata.name || metadata.full_name || 'Synesis Student',
      course: metadata.course || '',
      year_level: metadata.yearLevel || metadata.year_level || '',
    })

  // Another request can create the same profile between lookup and insert.
  if (createError && createError.code !== '23505') throw createError

  const { data: repairedProfile, error: verifyError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (verifyError) throw verifyError
  if (!repairedProfile) {
    throw new Error('Your authenticated account has no matching profile record.')
  }

  return repairedProfile
}
