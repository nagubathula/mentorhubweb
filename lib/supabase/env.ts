/**
 * Utility to safely retrieve and validate Supabase environment variables.
 * Supports standard NEXT_PUBLIC_SUPABASE_ANON_KEY as well as legacy/project specific
 * NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
 */
export function getSupabaseCredentials() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ''

  const missing: string[] = []
  if (!url) {
    missing.push('NEXT_PUBLIC_SUPABASE_URL')
  }
  if (!key) {
    missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY)')
  }

  const isValid = missing.length === 0

  if (!isValid) {
    const isClient = typeof window !== 'undefined'
    const context = isClient ? 'Client' : 'Server/Middleware'
    console.error(
      `[Supabase ${context} Error] Missing required environment variable(s): ${missing.join(
        ', '
      )}. Please configure them in your .env.local file or deployment environment settings (e.g., Vercel).`
    )
  }

  return {
    url: isValid ? url : 'https://placeholder.supabase.co',
    key: isValid ? key : 'placeholder-anon-key',
    isValid,
    missing,
  }
}
