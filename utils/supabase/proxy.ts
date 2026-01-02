import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Get user session
    const { data: { user } } = await supabase.auth.getUser()

    // Protected Admin Routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!user) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
    }

    // Auth Routes (Login) - Redirect to Admin if already logged in
    if (request.nextUrl.pathname === '/login') {
        if (user) {
            const url = request.nextUrl.clone()
            url.pathname = '/admin'
            return NextResponse.redirect(url)
        }
    }

    return supabaseResponse
}

// this is the old code that i wanna retry later
// IMPORTANT: Avoid triggering an infinite loop by checking for authentication
// only on admin routes (not on login page)

// const {
//     data: { user },
// } = await supabase.auth.getUser()

// // Protect admin routes (except login)
// if (
//     request.nextUrl.pathname.startsWith('/admin') &&
//     !request.nextUrl.pathname.startsWith('/admin/login') &&
//     !user
// ) {
//     const url = request.nextUrl.clone()
//     url.pathname = '/admin/login'
//     return NextResponse.redirect(url)
// }

// // If logged in user tries to access login page, redirect to dashboard
// if (request.nextUrl.pathname === '/admin/login' && user) {
//     const url = request.nextUrl.clone()
//     url.pathname = '/admin'
//     return NextResponse.redirect(url)
// }

// return supabaseResponse

