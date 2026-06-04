import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { supabaseAnonKey, supabaseUrl } from '@/lib/supabase-config';

export async function middleware(request) {
	let response = NextResponse.next({ request });

	const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			getAll() {
				return request.cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value }) => {
					request.cookies.set(name, value);
				});

				response = NextResponse.next({ request });
				cookiesToSet.forEach(({ name, value, options }) => {
					response.cookies.set(name, value, options);
				});
			},
		},
	});

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const isProtectedPath = request.nextUrl.pathname.startsWith('/profile');

	if (isProtectedPath) {
		const cookies = request.cookies.getAll();
		const hasSupabaseAuthCookie = cookies.some(
			(cookie) => cookie.name.includes('sb-') && cookie.name.includes('auth-token')
		);

		if (!hasSupabaseAuthCookie || !user) {
			return NextResponse.redirect(new URL('/login', request.url));
		}
	}

	return response;
}

export const config = {
	matcher: ['/profile/:path*'],
};
