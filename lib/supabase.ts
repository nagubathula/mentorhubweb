import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'
import { getSupabaseCredentials } from './supabase/env'

let browserClient: any = null

export function createClient() {
  const { url, key } = getSupabaseCredentials()
  if (typeof window !== 'undefined') {
    if (!browserClient) {
      browserClient = createBrowserClient<Database>(url, key, {
        cookieOptions: {
          maxAge: 365 * 24 * 60 * 60, // 1 year cookie maxAge (persists browser restarts)
          domain: '',
          path: '/',
          sameSite: 'lax',
        },
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        }
      })
    }
    return browserClient
  }
  return createBrowserClient<Database>(url, key, {
    cookieOptions: {
      maxAge: 365 * 24 * 60 * 60,
      domain: '',
      path: '/',
      sameSite: 'lax',
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    }
  })
}
