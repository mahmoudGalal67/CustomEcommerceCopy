import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const refreshToken = req.cookies.get("refresh_token")?.value;

    // Ignore Next.js internals and static files
    if (
        pathname.startsWith("/_next") ||
        pathname === "/favicon.ico" ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    // Login page
    if (pathname === "/login") {
        if (refreshToken) {
            const url = req.nextUrl.clone();
            url.pathname = "/";
            return NextResponse.redirect(url);
        }

        return NextResponse.next();
    }

    // Protect all other admin pages
    if (!refreshToken) {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/:path*",
    ],
};