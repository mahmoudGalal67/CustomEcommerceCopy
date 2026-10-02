import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BASE_PATH = "/admin";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const appPath =
        pathname.startsWith(BASE_PATH)
            ? pathname.slice(BASE_PATH.length) || "/"
            : pathname;

    const refreshToken = req.cookies.get("refresh_token")?.value;

    // Static/internal files
    if (
        appPath.startsWith("/_next") ||
        appPath === "/favicon.ico" ||
        appPath.includes(".")
    ) {
        return NextResponse.next();
    }

    // Login page
    if (appPath === "/login") {
        if (refreshToken) {
            const url = req.nextUrl.clone();
            url.pathname = `${BASE_PATH}/`;

            return NextResponse.redirect(url);
        }

        return NextResponse.next();
    }

    // Protected routes
    if (!refreshToken) {
        const url = req.nextUrl.clone();
        url.pathname = `${BASE_PATH}/login`;

        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};