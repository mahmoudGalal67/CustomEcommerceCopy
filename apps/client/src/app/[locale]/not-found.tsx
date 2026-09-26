"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Home, Search, ShoppingBag } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const params = useParams();

  const locale = (params.locale || "en") as string;
  const isArabic = locale === "ar";

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-20"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />

        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full border border-primary/10" />

        <div className="absolute -bottom-40 -right-40 h-[30rem] w-[30rem] rounded-full border border-primary/10" />

        <div
          className="
            absolute inset-0
            opacity-[0.025]
            [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)]
            [background-size:64px_64px]
          "
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
        {/* Icon */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-lg shadow-primary/10">
          <ShoppingBag className="h-9 w-9" />
        </div>

        {/* 404 */}
        <div className="relative">
          <h1
            className="
              select-none
              text-[clamp(8rem,25vw,18rem)]
              font-black
              leading-[0.75]
              tracking-[-0.08em]
              text-primary/10
            "
          >
            404
          </h1>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-black tracking-tight sm:text-8xl">
              404
            </span>
          </div>
        </div>

        {/* Heading */}
        <h2 className="mt-10 text-3xl font-bold tracking-tight sm:text-4xl">
          {isArabic ? "عذرًا، الصفحة غير موجودة" : "Oops! Page not found"}
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          {isArabic
            ? "يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى مكان آخر."
            : "The page you're looking for doesn't exist or may have been moved to another location."}
        </p>

        {/* Actions */}
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-12 rounded-xl px-7 font-semibold"
          >
            <Link href={`/${locale}`}>
              <Home className="me-2 h-4 w-4" />

              {isArabic ? "العودة للرئيسية" : "Back to home"}
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 rounded-xl px-7"
          >
            <Link href={`/${locale}/products`}>
              <Search className="me-2 h-4 w-4" />

              {isArabic ? "تصفح المنتجات" : "Browse products"}
            </Link>
          </Button>
        </div>

        {/* Brand */}
        <div className="mt-14 flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.3em] text-muted-foreground">
          <span>GALAL</span>
          <span className="h-1 w-1 rounded-full bg-primary" />
          <span>STORE</span>
        </div>
      </div>
    </main>
  );
}
