"use client";

import {
  AlertCircle,
  ChevronRight,
  FileText,
  Package,
  RefreshCcw,
  UserCheck,
} from "lucide-react";

import {
  ArrowRight,
  Heart,
  Instagram,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Truck,
  CreditCard,
  ShoppingBag,
  Star,
  Clock,
  Headphones,
  BadgeCheck,
  RotateCcw,
  Lock,
  Users,
  Award,
  CircleCheck,
  Store,
  Gift,
  Tag,
  Percent,
  Wallet,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { useGetSettingsQuery } from "@/services/SettingsApi";

const ICONS: Record<string, LucideIcon> = {
  FileText,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Heart,
  Truck,
  CreditCard,
  ShoppingBag,
  Star,
  Clock,
  Headphones,
  BadgeCheck,
  RotateCcw,
  Lock,
  Users,
  Award,
  CircleCheck,
  Store,
  Gift,
  Tag,
  Percent,
  Wallet,
  MapPin,
  Phone,
  Mail,
};

type LocalizedText = {
  en?: string;
  ar?: string;
};

const getLocalizedText = (
  value: LocalizedText | string | null | undefined,
  locale: string,
) => {
  if (!value) return "";

  // Backward compatibility with old string data
  if (typeof value === "string") {
    return value;
  }

  if (locale === "ar") {
    return value.ar || value.en || "";
  }

  return value.en || value.ar || "";
};

export default function PrivacyPolicyPage() {
  const params = useParams();
  const locale = (params.locale || "en") as string;
  const { data: settings } = useGetSettingsQuery(undefined);

  const privacy = settings?.privacy || [];
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-3xl" />

        <div className="absolute -right-40 top-[40%] h-[30rem] w-[30rem] rounded-full bg-primary/5 blur-3xl" />

        <div
          className="
            absolute inset-0 opacity-[0.035]
            [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)]
            [background-size:64px_64px]
          "
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        {/* Header */}
        <header className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
            <ShieldCheck className="h-4 w-4 text-primary" />

            {locale == "ar" ? "خصوصيتك تهمنا" : " Your privacy matters"}
          </div>

          <h1 className="text-4xl  font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {locale == "ar" ? "سياسة" : " Privacy"}
            <span className="text-primary">
              {" "}
              {locale == "ar" ? "الخصوصية" : " Policy"}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl leading-7 text-muted-foreground">
            {locale == "ar"
              ? "توضح سياسة الخصوصية هذه كيفية جمعنا لمعلوماتك واستخدامها وحمايتها وإدارتها عند استخدامك لموقعنا الإلكتروني."
              : "This Privacy Policy explains how we collect, use, protect, and manage your information when you use our website."}
          </p>

          <p className="mt-4 text-sm text-muted-foreground">
            {locale == "ar" ? "آخر تحديث:" : " Last updated:  "}
            {"     "}
            {locale == "ar"
              ? settings?.updated_at &&
                new Date(settings.updated_at).toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : settings?.updated_at &&
                new Date(settings.updated_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
          </p>
        </header>

        {/* Privacy promise */}
        <div className="mx-auto mt-12 max-w-4xl">
          <Card className="border-primary/20 bg-primary/5 shadow-sm">
            <CardContent className="flex gap-4 p-5 sm:p-6">
              <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-primary" />

              <div>
                <h2 className="font-semibold">
                  {locale == "ar"
                    ? "معلوماتك مهمة بالنسبة لنا."
                    : " Your information is important to us."}
                </h2>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {locale == "ar"
                    ? "نهدف إلى جمع المعلومات التي نحتاجها فقط لتقديم خدماتنا، والتعامل معها بمسؤولية وأمان."
                    : " We aim to collect only the information we need to provide our services and to handle it responsibly and securely."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="mt-10">
          {/* Policy */}
          <div className="min-w-0">
            <Card className="border-border/60 bg-background/90 shadow-lg backdrop-blur">
              <CardContent className="p-6 sm:p-10">
                <div className="space-y-12">
                  {privacy.map((term: any) => {
                    const Icon = ICONS[term.icon] || FileText;

                    return (
                      <section
                        key={term.id}
                        id={term.id}
                        className="scroll-mt-24"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Icon className="h-6 w-6" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h2 className="text-xl font-semibold tracking-tight">
                              {getLocalizedText(term.title, locale)}
                            </h2>

                            <div
                              className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground"
                              dangerouslySetInnerHTML={{
                                __html: getLocalizedText(
                                  term?.description,
                                  locale,
                                ),
                              }}
                            />
                          </div>
                        </div>
                      </section>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer note */}
        <div className="mx-auto mt-10 flex max-w-4xl items-start gap-3 rounded-2xl border bg-muted/30 p-5">
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

          <p className="text-sm leading-6 text-muted-foreground">
            {locale == "ar"
              ? " إذا كانت لديك أي أسئلة حول معلوماتك الشخصية، يُرجى التواصل مع فريق الدعم لدينا على"
              : "  If you have any questions about your personal information, please contact our support team at"}{" "}
            <span className="font-medium text-foreground">
              {settings?.site_contact_email}
            </span>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
