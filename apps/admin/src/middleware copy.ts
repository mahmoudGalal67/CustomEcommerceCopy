import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const refreshToken = req.cookies.get("refresh_token");
    const { pathname } = req.nextUrl;
    const url = req.nextUrl.clone();

    // Ignore static files
    if (
        pathname.startsWith("/_next") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    // ✅ Allow login
    if (pathname === "/login") {
        if (refreshToken) {
            url.pathname = "/";
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    // ❌ Protect everything else
    if (!refreshToken) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!login|_next/static|_next/public|_next/image|favicon.ico).*)",
    ],
};

