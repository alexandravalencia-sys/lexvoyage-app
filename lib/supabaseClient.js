import { createClient } from '@supabase/supabase-js'
let client = null
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return null
  if (!client) client = createClient(url, anon, { auth: { persistSession: true, autoRefreshToken: true } })
  return client
}