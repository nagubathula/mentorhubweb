import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'
import { getSupabaseCredentials } from './supabase/env'

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
  const { url, key } = getSupabaseCredentials()
  if (typeof window !== 'undefined') {
    if (!browserClient) {
      browserClient = createBrowserClient<Database>(url, key)
    }
    return browserClient
  }
  return createBrowserClient<Database>(url, key)
}

