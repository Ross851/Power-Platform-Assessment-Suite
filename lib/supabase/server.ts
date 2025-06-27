// lib/supabase/server.ts
import { createServerClient as _createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Internal helper – returns a configured Supabase *server* client that
 * (a) reads the auth cookies coming from `next/headers` and
 * (b) can also **set** cookies when we call `supabase.auth.setSession()` etc.
 *
 * NOTE ─ Uses the **service-role key** so we can run RLS-protected queries
 * from Server Components / Server Actions.  Never send this key to the browser.
 */
function _initServerClient() {
  const cookieStore = cookies()

  return _createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch {
          /* called from a Server Component – safe to ignore */
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

/**
 * Preferred export.  Call this in a **Server Component / Server Action**:
 *
 * \`\`\`ts
 * const supabase = createClient();
 * \`\`\`
 */
export function createClient() {
  // Initialise only once per request on the server.
  return _initServerClient()
}

/**
 * Back-compat: some code still imports `createServerClient`.
 * Provide it as an alias so nothing breaks.
 */
export const createServerClient = createClient
