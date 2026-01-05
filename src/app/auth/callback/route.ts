import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')
  
  let next = searchParams.get('next') ?? '/'
  if (!next.startsWith('/')) {
    next = '/'
  }

  if (code) {

    let cookiesToSetOnResponse: { name: string; value: string; options: any }[] = []

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSetOnResponse = cookiesToSet
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const forwardedHost = req.headers.get('x-forwarded-host') 
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      let redirectUrl = `${origin}${next}`
      
      if (!isLocalEnv && forwardedHost) {
        redirectUrl = `https://${forwardedHost}${next}`
      }

      const response = NextResponse.redirect(redirectUrl)

      cookiesToSetOnResponse.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options)
      })

      return response
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=auth-code-error`)
}