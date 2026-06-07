import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect route
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .maybeSingle()

          if (!profile) {
            const name = user.user_metadata?.full_name || user.user_metadata?.name || 'Google User'
            const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || null
            
            await supabase.from('profiles').insert({
              id: user.id,
              name,
              email: user.email,
              role: null,
              preferences: {
                coins: 0,
                streak: 1,
                xp: 10,
                avatar_url: avatarUrl
              }
            })
          }
        }
      } catch (profileError) {
        console.error("Failed to auto-create profile in OAuth callback:", profileError)
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/?error=auth_callback_failed`)
}

