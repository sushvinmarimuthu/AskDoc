import {NextResponse} from "next/server";
import {decode} from 'next-auth/jwt';

export async function middleware(request) {
    const path = request.nextUrl.pathname;
    const isPublicPath = path === '/auth/login' || path === '/auth/register' || path === '/auth/forgot-password' || path === '/auth/reset-password';

    const next_auth_session_token = request.cookies.get('next-auth.session-token')?.value || request.cookies.get('__Secure-next-auth.session-token')?.value || null;
    console.log("next_auth_session_token - ", next_auth_session_token);
    if ((isPublicPath || path === '/') && next_auth_session_token) {
        const decoded = await decode({
            token: next_auth_session_token,
            secret: process.env.SECRET,
        });
        console.log("D - ", decoded)
        return NextResponse.redirect(new URL(`/${decoded?._id}/home`, request.nextUrl))
    }

    if (path === '/' && !next_auth_session_token) {
        return NextResponse.redirect(new URL('/auth/login', request.nextUrl))
    }

    if (!isPublicPath && !next_auth_session_token) {
        return NextResponse.redirect(new URL('/auth/login', request.nextUrl))
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
        '/',
        '/admin',
        '/auth/:path*',
    ],
}