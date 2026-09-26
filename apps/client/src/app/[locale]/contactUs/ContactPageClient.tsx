"use client";

import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShoppingBag,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";
import { useGetSettingsQuery } from "@/services/SettingsApi";

import { useSendContactMessageMutation } from "@/services/contactSlice";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

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

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type LaravelValidationError = {
  message?: string;
  errors?: {
    [key: string]: string[];
  };
};

export default function ContactPage() {
  const params = useParams();
  const locale = (params.locale || "en") as string;
  const { data: settings } = useGetSettingsQuery(undefined);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (!successMessage && !errorMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [successMessage, errorMessage]);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ContactFormData>();

  const [sendContactMessage, { isLoading }] = useSendContactMessageMutation();
  const onSubmit = async (data: ContactFormData) => {
    setSuccessMessage("");
    setErrorMessage("");
    try {
      await sendContactMessage(data).unwrap();

      reset();

      setSuccessMessage(
        locale === "ar"
          ? "تم إرسال رسالتك بنجاح. سنتواصل معك قريبًا."
          : "Your message has been sent successfully. We'll get back to you soon.",
      );
    } catch (error: any) {
      console.error("Contact form error:", error);

      const backendError = error?.data as LaravelValidationError;

      if (backendError?.errors) {
        Object.entries(backendError.errors).forEach(([field, messages]) => {
          if (
            field === "name" ||
            field === "email" ||
            field === "subject" ||
            field === "message"
          ) {
            setError(field, {
              type: "server",
              message: messages[0],
            });
          }
        });

        return;
      }
      setErrorMessage(
        locale === "ar"
          ? "حدث خطأ أثناء إرسال الرسالة. حاول مرة أخرى."
          : "Something went wrong while sending your message. Please try again.",
      );
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-10rem] top-[30%] h-[30rem] w-[30rem] rounded-full bg-primary/5 blur-3xl" />

        <div
          className="
            absolute inset-0 opacity-[0.035]
            [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)]
            [background-size:64px_64px]
          "
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        {/* Hero */}
        <section className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
            <MessageCircle className="h-4 w-4 text-primary" />
            {locale == "ar" ? "نحن هنا للمساعدة" : " We’re here to help"}
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {locale == "ar" ? "دعونا نتحدث عن" : "  Let’s talk about"}
            <span className="block text-primary">
              {locale == "ar" ? "ما تحتاجه." : " what you need."}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            .
            {locale == "ar"
              ? "هل لديك سؤال بخصوص طلبك أو منتجاتنا أو أي شيء آخر؟ أرسل لنا رسالة وسيتواصل معك فريقنا في أقرب وقت ممكن."
              : " Have a question about your order, our products, or anything else? Send us a message and our team will get back to you as soon as possible"}
          </p>
        </section>

        {/* Contact cards */}
        <section className="mt-14 grid gap-4 md:grid-cols-3">
          <Card
            className="
                  group border-border/60 bg-background/80
                  shadow-sm backdrop-blur transition-all
                  duration-300 hover:-translate-y-1
                  hover:shadow-lg
                "
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className="
                        flex h-12 w-12 shrink-0 items-center justify-center
                        rounded-2xl bg-primary/10 text-primary
                        transition-colors group-hover:bg-primary
                        group-hover:text-primary-foreground
                      "
                >
                  <Phone className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">
                    {locale == "ar" ? "اتصل بنا" : " Call us"}
                  </p>

                  <p className="mt-1 break-words font-semibold">
                    {locale == "ar"
                      ? "من السبت إلى الخميس، 10:00 صباحاً – 10:00 مساءً"
                      : "Sat – Thu, 10:00 AM – 10:00 PM"}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {settings?.site_contact_phone}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className="
                  group border-border/60 bg-background/80
                  shadow-sm backdrop-blur transition-all
                  duration-300 hover:-translate-y-1
                  hover:shadow-lg
                "
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className="
                        flex h-12 w-12 shrink-0 items-center justify-center
                        rounded-2xl bg-primary/10 text-primary
                        transition-colors group-hover:bg-primary
                        group-hover:text-primary-foreground
                      "
                >
                  <Mail className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">
                    {locale == "ar" ? "تفضل بزيارة متجرنا" : " Visit our store"}
                  </p>

                  <p className="mt-1 break-words font-semibold">
                    {locale == "ar"
                      ? "تفضل بزيارتنا في صالة العرض."
                      : "Come say hello at our showroom."}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {settings?.site_location}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className="
                  group border-border/60 bg-background/80
                  shadow-sm backdrop-blur transition-all
                  duration-300 hover:-translate-y-1
                  hover:shadow-lg
                "
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className="
                        flex h-12 w-12 shrink-0 items-center justify-center
                        rounded-2xl bg-primary/10 text-primary
                        transition-colors group-hover:bg-primary
                        group-hover:text-primary-foreground
                      "
                >
                  <Mail className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">
                    {locale == "ar"
                      ? "راسلنا عبر البريد الإلكتروني"
                      : " Email us"}
                  </p>

                  <p className="mt-1 break-words font-semibold">
                    {locale == "ar"
                      ? "عادةً ما نرد في غضون 24 ساعة."
                      : "We usually reply within 24 hours."}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {settings?.site_contact_email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Main section */}
        <section className="mt-16 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Left side */}
          <div className="group relative isolate overflow-hidden rounded-3xl bg-foreground p-8 text-background shadow-xl sm:p-10">
            {/* Background gradient */}
            <div
              className="
      pointer-events-none
      absolute inset-0
      bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_90%_85%,rgba(255,255,255,0.08),transparent_30%)]
    "
            />

            {/* Large glowing orb - top right */}
            <div
              className="
      pointer-events-none
      absolute
      -right-32
      -top-32
      h-80
      w-80
      rounded-full
      bg-background/10
      blur-3xl
      transition-transform
      duration-700
      group-hover:scale-110
    "
            />

            {/* Large glowing orb - bottom left */}
            <div
              className="
      pointer-events-none
      absolute
      -bottom-40
      -left-32
      h-96
      w-96
      rounded-full
      bg-background/5
      blur-3xl
    "
            />

            {/* Decorative circles */}
            <div
              className="
      pointer-events-none
      absolute
      -right-20
      -top-20
      h-64
      w-64
      rounded-full
      border
      border-background/10
      transition-transform
      duration-700
      group-hover:rotate-12
      group-hover:scale-105
    "
            />

            <div
              className="
      pointer-events-none
      absolute
      -right-8
      top-8
      h-40
      w-40
      rounded-full
      border
      border-background/5
    "
            />

            <div
              className="
      pointer-events-none
      absolute
      -bottom-32
      -left-20
      h-72
      w-72
      rounded-full
      border
      border-background/10
    "
            />

            {/* Subtle grid */}
            <div
              className="
      pointer-events-none
      absolute
      inset-0
      opacity-[0.035]
      [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)]
      [background-size:32px_32px]
    "
            />

            {/* Content */}
            <div className="relative z-10">
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-background/10 shadow-inner ring-1 ring-background/10 backdrop-blur-sm">
                <ShoppingBag className="h-6 w-6" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {locale == "ar" ? "يسرّنا ان" : "We’d love to"}
                <br />
                {locale == "ar" ? "نسمع منك" : "hear from you."}
              </h2>

              <p className="mt-5 max-w-md leading-7 text-background/70">
                {locale == "ar"
                  ? "سواء كنت تبحث عن الزوج المثالي، أو تحتاج إلى مساعدة بشأن طلب ما، أو ترغب ببساطة في إلقاء التحية، فإن فريقنا على أتم الاستعداد."
                  : "Whether you're looking for the perfect pair, need help with an order, or simply want to say hello — our team is ready."}
              </p>

              <div className="mt-10 space-y-6">
                {/* Working hours */}
                <div className="group/item flex gap-4">
                  <div
                    className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-background/10
            ring-1
            ring-background/10
            transition-all
            duration-300
            group-hover/item:bg-background/15
            group-hover/item:scale-105
          "
                  >
                    <Clock3 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-semibold">
                      {locale == "ar" ? "ساعات العمل" : "Opening hours"}
                    </p>

                    <p
                      className="mt-1 text-sm text-background/60"
                      dangerouslySetInnerHTML={{
                        __html: getLocalizedText(
                          settings?.info?.about?.workingHours,
                          locale,
                        ),
                      }}
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="group/item flex gap-4">
                  <div
                    className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-background/10
            ring-1
            ring-background/10
            transition-all
            duration-300
            group-hover/item:bg-background/15
            group-hover/item:scale-105
          "
                  >
                    <MapPin className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-semibold">
                      {locale == "ar" ? "موقعنا" : "Our location"}
                    </p>

                    <p
                      className="mt-1 text-sm text-background/60"
                      dangerouslySetInnerHTML={{
                        __html: getLocalizedText(
                          settings?.info?.about?.location,
                          locale,
                        ),
                      }}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="group/item flex gap-4">
                  <div
                    className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-background/10
            ring-1
            ring-background/10
            transition-all
            duration-300
            group-hover/item:bg-background/15
            group-hover/item:scale-105
          "
                  >
                    <Phone className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-semibold">
                      {locale == "ar" ? "هاتف" : "Phone"}
                    </p>

                    <p className="mt-1 text-sm text-background/60">
                      {settings?.site_contact_phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <Card className="border-border/60 bg-background/90 shadow-xl backdrop-blur">
            <CardHeader className="p-7 pb-2 sm:p-9 sm:pb-3">
              <CardTitle className="text-2xl sm:text-3xl">
                {locale == "ar" ? "أرسل لنا رسالة" : "  Send us a message "}
              </CardTitle>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {" "}
                {locale == "ar"
                  ? "املأ النموذج أدناه وسنتواصل معك في أقرب وقت."
                  : " Fill out the form below and we’ll get back to you shortly."}
              </p>
            </CardHeader>

            <CardContent className="p-7 pt-6 sm:p-9 sm:pt-7">
              <div className="space-y-4">
                {successMessage && (
                  <Alert className="border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4" />

                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                )}

                {errorMessage && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />

                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* your existing fields */}
                </form>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      {locale === "ar" ? "اسمك" : "Your name"}
                    </Label>

                    <Input
                      id="name"
                      placeholder={
                        locale === "ar" ? "محمود جلال" : "Mahmoud Galal"
                      }
                      className="h-12 rounded-xl"
                      {...register("name", {
                        required:
                          locale === "ar" ? "الاسم مطلوب" : "Name is required",
                        maxLength: {
                          value: 100,
                          message:
                            locale === "ar"
                              ? "الاسم طويل جدًا"
                              : "Name is too long",
                        },
                      })}
                    />

                    {errors.name && (
                      <p className="text-sm text-destructive">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {locale === "ar"
                        ? "عنوان البريد الإلكتروني"
                        : "Email address"}
                    </Label>

                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="h-12 rounded-xl"
                      {...register("email", {
                        required:
                          locale === "ar"
                            ? "البريد الإلكتروني مطلوب"
                            : "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message:
                            locale === "ar"
                              ? "البريد الإلكتروني غير صحيح"
                              : "Please enter a valid email",
                        },
                      })}
                    />

                    {errors.email && (
                      <p className="text-sm text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject">
                    {locale === "ar" ? "الموضوع" : "Subject"}
                  </Label>

                  <Input
                    id="subject"
                    placeholder={
                      locale === "ar"
                        ? "كيف يمكننا المساعدة؟"
                        : "How can we help?"
                    }
                    className="h-12 rounded-xl"
                    {...register("subject", {
                      required:
                        locale === "ar"
                          ? "الموضوع مطلوب"
                          : "Subject is required",
                      maxLength: {
                        value: 255,
                        message:
                          locale === "ar"
                            ? "الموضوع طويل جدًا"
                            : "Subject is too long",
                      },
                    })}
                  />

                  {errors.subject && (
                    <p className="text-sm text-destructive">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">
                    {locale === "ar" ? "رسالة" : "Message"}
                  </Label>

                  <Textarea
                    id="message"
                    placeholder={
                      locale === "ar"
                        ? "أخبرنا المزيد عن سؤالك..."
                        : "Tell us a little more about your question..."
                    }
                    className="min-h-36 resize-none rounded-xl"
                    {...register("message", {
                      required:
                        locale === "ar"
                          ? "الرسالة مطلوبة"
                          : "Message is required",
                      maxLength: {
                        value: 5000,
                        message:
                          locale === "ar"
                            ? "الرسالة طويلة جدًا"
                            : "Message is too long",
                      },
                    })}
                  />

                  {errors.message && (
                    <p className="text-sm text-destructive">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="h-12 w-full rounded-xl text-base font-semibold sm:w-auto sm:px-8 cursor-pointer transform duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading
                    ? locale === "ar"
                      ? "جاري الإرسال..."
                      : "Sending..."
                    : locale === "ar"
                      ? "إرسال رسالة"
                      : "Send message"}

                  {!isLoading && (
                    <Send
                      className={`ms-2 h-4 w-4 ${
                        locale === "ar" ? "rotate-270" : "rotate-0"
                      }`}
                    />
                  )}
                </Button>

                <p className="text-xs leading-5 text-muted-foreground">
                  {locale === "ar"
                    ? "بإرسال هذه الرسالة، فإنك توافق على التواصل معك بخصوص طلبك."
                    : "By sending this message, you agree to be contacted regarding your request."}
                </p>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Bottom CTA */}
        <section className="mt-16 rounded-3xl border bg-muted/40 p-8 text-center sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MessageCircle className="h-6 w-6" />
          </div>

          <h2 className="mt-5 text-2xl font-bold sm:text-3xl">
            {" "}
            {locale == "ar"
              ? "هل تبحث عن شيء محدد؟"
              : " Looking for something specific?"}
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            {" "}
            {locale == "ar"
              ? "يمكن لفريق الدعم لدينا مساعدتك في العثور على المقاس المناسب، أو التحقق من توفر المنتج، أو تتبع طلبك."
              : " Our support team can help you find the right size, check product availability, or track your order."}
          </p>

          <Button variant="outline" className="mt-6 rounded-xl">
            {locale == "ar" ? "تفضل بزيارة متجرنا" : " Visit our shop"}

            {locale == "ar" ? (
              <ArrowLeft className="ml-2 h-4 w-4" />
            ) : (
              <ArrowRight className="ml-2 h-4 w-4" />
            )}
          </Button>
        </section>
      </div>
    </main>
  );
}
