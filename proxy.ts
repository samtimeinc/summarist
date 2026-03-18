
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