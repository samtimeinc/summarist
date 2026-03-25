
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ['/my-library', '/settings', '/player'];

export function proxy(request: NextRequest) {
    const token = request.cookies.get('firebase-auth-token');
    const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/my-library', '/settings', '/player']
};

/*
2. The Middleware & Cookie Strategy
I see you’re using proxy.ts (acting as Next.js Middleware) to check for a cookie. This is a very smart "Pro" move to prevent flickering on protected pages.

Security Check: You are currently refreshing the token every 55 minutes. This is good for keeping the session alive, but remember that client-side document.cookie can be accessed by scripts.

Improvement: For a production portfolio, you might want to mention that in a real enterprise app, you’d use an httpOnly cookie set by a Server Action or an API route to prevent XSS (Cross-Site Scripting) attacks.
*/