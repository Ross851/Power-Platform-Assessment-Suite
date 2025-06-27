import { createServerClient as _createSupabaseServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

/** Returns a singleton Supabase server client (reads / sets auth cookies). */
export function createServerClient() {
  const cookieStore = cookies()

  return _createSupabaseServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch {
          /* called in a server component → ignore */
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch {
          /* ignore */
        }
      },
    },
  })
}

/* backward-compat export (old code can keep calling createClient()) */
export const createClient = createServerClient
