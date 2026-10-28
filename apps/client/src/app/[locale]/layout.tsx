import "./globals.css";

import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "@/providers/StoreProvider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ToastContainer } from "react-toastify";
import { DictionaryProvider } from "@/providers/dictionary-provider";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { getDictionary } from "@/i18n/config";
import SiteTheme from "@/components/site-theme";
import ChatBoxLazy from "@/components/chatBot/ChatBoxLazy";
import LazyToast from "@/components/LazyToast";

import { GoogleAnalytics } from "@next/third-parties/google";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Glalal Store - Best Shoes",
  description: "Glalal Store is the best place to find the best Shoes",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{
    locale: "en" | "ar";
  }>;
}>) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <body className={`antialiased min-h-screen`}>
        {/* <IntroLoader logo="/images/about-shoes.jpg" /> */}
        <Providers>
          <ThemeProvider>
            <SiteTheme>
              <div className="particle-background min-h-screen">
                <div className="background-orb orb-1" />
                <div className="background-orb orb-2" />
                <div className="background-orb orb-3" />
                {/* Grid lines */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.15]"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, hsl(var(--border) / 0.4) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.4) 1px, transparent 1px)",
                    backgroundSize: "64px 64px",
                    maskImage:
                      "radial-gradient(ellipse at center, black 30%, transparent 75%)",
                  }}
                />
                <div className="flex flex-col justify-between min-h-screen mx-auto  p-4 pt-0 sm:px-0 sm:max-w-xl md:max-w-2xl lg:max-w-5xl xl:max-w-[1400px]">
                  <DictionaryProvider dictionary={dict}>
                    <Navbar dict={dict} />
                    {children}
                    <GoogleAnalytics gaId="G-FNC08KTVQP" />
                    <Footer locale={locale} />
                    <ChatBoxLazy dict={dict} />
                  </DictionaryProvider>
                </div>
              </div>
            </SiteTheme>
          </ThemeProvider>
        </Providers>
        <LazyToast />
      </body>
    </html>
  );
}
