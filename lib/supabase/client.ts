// lib/supabase/client.ts
import { createClient as createSupabaseBrowserClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase env vars. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
  )
}

// ─────────────────────────────────────────────────────────────────────────
// Singleton – ensure we create the browser client once and reuse it
// ─────────────────────────────────────────────────────────────────────────
let _supabase: ReturnType<typeof createSupabaseBrowserClient> | undefined

export function createClient() {
  if (_supabase) return _supabase

  _supabase = createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })

  return _supabase
}

// Back-compat: some files import { supabase } directly
export const supabase = createClient()
