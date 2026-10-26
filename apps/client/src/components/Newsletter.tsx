"use client";

import * as React from "react";
import { ArrowRight, CheckCircle2, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useState } from "react";

import { useSubscribeNewsletterMutation } from "@/services/newsletterSlice";

import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const params = useParams();
  const locale = (params.locale || "en") as string;

  const [subscribeNewsletter, { isLoading }] = useSubscribeNewsletterMutation();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccess(false);
    const value = email.trim();

    if (!EMAIL_RE.test(value)) {
      setError(
        locale === "ar"
          ? "حدث خطأ أثناء الاشتراك. حاول مرة أخرى."
          : "Something went wrong. Please try again.",
      ); // use your existing Arabic/English text here
      return;
    }
    setError("");

    try {
      await subscribeNewsletter({ email: value }).unwrap();
      setSuccess(true);
      setEmail("");
    } catch (err: any) {
      setError(err?.data?.message ?? "Something went wrong, please try again");
    }
  }

  return (
    <section className="mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/40 p-8 text-center sm:p-12 lg:p-16">
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/15 blur-[100px]" />
        <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.03]" />

        <div className="relative mx-auto max-w-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Mail className="h-6 w-6" />
          </div>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {locale == "ar"
              ? "كن أول من يحصل على كل إصدار جديد."
              : " Get first dibs on every drop."}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {locale == "ar"
              ? "انضم إلى أكثر من 50,000 عضو للحصول على وصول مبكر للإصدارات، وأسعار حصرية للأعضاء، وخصم 10% على طلبك الأول."
              : "Join 50,000+ members for early access to releases, member-only pricing, and 10% off your first order."}
          </p>

          {success && (
            <Alert className="border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />

              <AlertDescription>
                {locale === "ar"
                  ? "تم الاشتراك بنجاح!"
                  : "You've successfully subscribed!"}
              </AlertDescription>
            </Alert>
          )}

          {error && <p role="alert">{error}</p>}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="mx-auto group mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder={
                locale === "ar" ? "أدخل بريدك الإلكتروني" : "Enter your email"
              }
              className="h-12 flex-1 rounded-full border border-border/60
            bg-background/60 px-5 text-sm outline-none transition-colors
            placeholder:text-muted-foreground focus:border-primary focus:ring-2
            focus:ring-primary/30"
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer h-12 gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                  {locale === "ar" ? "جاري الاشتراك..." : "Subscribing..."}
                </>
              ) : locale === "ar" ? (
                "اشترك الآن"
              ) : (
                "Subscribe"
              )}
              <ArrowRight
                className={` h-4 w-4 transition-transform group-hover:translate-x-1 ${locale === "ar" ? "rotate-180" : ""}`}
              />
            </Button>
          </form>

          <p className="mt-4 text-xs text-muted-foreground">
            {locale == "ar"
              ? "لا رسائل مزعجة، بل محتوىً مميز ومثير. يمكنك إلغاء الاشتراك في أي وقت."
              : "No spam, just heat. Unsubscribe anytime."}
          </p>
          <p className="text-xs text-muted-foreground">
            {locale === "ar"
              ? "بالاشتراك، ستتلقى آخر الأخبار والعروض والتحديثات."
              : "By subscribing, you'll receive our latest news, offers, and updates."}
          </p>
        </div>
      </div>
    </section>
  );
}
