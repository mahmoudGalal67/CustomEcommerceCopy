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

export default function TermsPage() {
  const params = useParams();
  const locale = (params.locale || "en") as string;
  const { data: settings } = useGetSettingsQuery(undefined);

  const terms = settings?.terms || [];

  console.log(settings);
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
            <FileText className="h-4 w-4 text-primary" />
            {locale == "ar" ? "معلومات قانونية" : " Legal information"}
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {locale == "ar" ? "الشروط و" : "Terms &"}{" "}
            <span className="text-primary">
              {locale == "ar" ? "الاحكام" : "Conditions"}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl leading-7 text-muted-foreground">
            {locale == "ar"
              ? "يرجى قراءة هذه الشروط بعناية قبل استخدام موقعنا أو تقديم الطلب."
              : "    Please read these terms carefully before using our website or placing an order."}
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

        {/* Notice */}
        <div className="mx-auto mt-12 max-w-4xl">
          <Card className="border-primary/20 bg-primary/5 shadow-sm">
            <CardContent className="flex gap-4 p-5">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <p className="text-sm leading-6 text-muted-foreground">
                {locale == "ar"
                  ? "تحكم هذه الشروط والأحكام استخدامك لموقعنا الإلكتروني وعمليات الشراء التي تقوم بها من متجرنا. وباستخدامك للموقع، فإنك توافق على هذه الشروط."
                  : "These Terms and Conditions govern your use of our website and your purchases from our store. By using the website, you agreeto these terms."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="mt-10 ">
          {/* Terms */}
          <div className="min-w-0">
            <Card className="border-border/60 bg-background/90 shadow-lg backdrop-blur">
              <CardContent className="p-6 sm:p-10">
                <div className="space-y-12">
                  {terms.map((term: any) => {
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
                <div className="mt-5 rounded-2xl border bg-gradient-to-br from-muted/50 to-muted/20 p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Store className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-semibold">
                        {settings?.site_name || "Our Store"}
                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {locale == "ar"
                          ? "للأسئلة المتعلقة بهذه الشروط، يمكنك الاتصال بنا مباشرة."
                          : " For questions regarding these terms, you can contact us directly."}
                      </p>

                      <div className="mt-4 flex flex-col gap-2.5 text-sm">
                        {settings?.site_contact_email && (
                          <a
                            href={`mailto:${settings.site_contact_email}`}
                            className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-primary"
                          >
                            <Mail className="h-4 w-4 shrink-0" />
                            <span className="truncate">
                              {settings.site_contact_email}
                            </span>
                          </a>
                        )}

                        {settings?.site_contact_phone && (
                          <a
                            href={`tel:${settings.site_contact_phone}`}
                            className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-primary"
                          >
                            <Phone className="h-4 w-4 shrink-0" />
                            <span>{settings.site_contact_phone}</span>
                          </a>
                        )}

                        {settings?.site_location && (
                          <div className="flex items-center gap-2.5 text-muted-foreground">
                            <MapPin className="h-4 w-4 shrink-0" />
                            <span>{settings.site_location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom */}
        <div className="mx-auto mt-10 flex max-w-4xl items-center gap-3 rounded-2xl border bg-muted/30 p-5">
          <Lock className="h-5 w-5 shrink-0 text-primary" />

          <p className="text-sm text-muted-foreground">
            {locale == "ar"
              ? "نلتزم بتوفير تجربة تسوق آمنة وشفافة وموثوقة."
              : "We are committed to providing a safe, transparent, and reliable shopping experience."}
          </p>
        </div>
      </div>
    </main>
  );
}
