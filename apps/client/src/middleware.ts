import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "ar"];
const defaultLocale = "en";

export function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get("refresh_token");
  const url = req.nextUrl.clone();
  const { pathname } = url;

  // =========================
  // Redirect root "/" -> "/en" or "/ar"
  // =========================
  if (pathname === "/") {
    const browserLocale =
      req.headers
        .get("accept-language")
        ?.split(",")[0]
        .split("-")[0] || defaultLocale;

    const locale = locales.includes(browserLocale)
      ? browserLocale
      : defaultLocale;

    url.pathname = `/${locale}`;

    return NextResponse.redirect(url);
  }

  // =========================
  // Get locale from URL
  // Example: /en/dashboard
  // =========================
  const segments = pathname.split("/");
  const locale = segments[1];

  const isValidLocale = locales.includes(locale);

  // Redirect invalid locale
  if (!isValidLocale) {
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

  // =========================
  // Protected routes
  // =========================
  const protectedRoutes = [
    `/${locale}/dashboard`,
    `/${locale}/admin`,
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!refreshToken && isProtected) {
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  // =========================
  // Prevent logged users from
  // visiting login/register
  // =========================
  if (
    refreshToken &&
    (pathname === `/${locale}/login` ||
      pathname === `/${locale}/register`)
  ) {
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/:locale/dashboard/:path*",
    "/:locale/admin/:path*",
    "/:locale/login",
    "/:locale/register",
  ],
};