"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, Heart, User, Search, Bell } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useGetPageLinksQuery } from "@/services/pagesApi";
import { useDictionary } from "@/providers/dictionary-provider";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./theme-toggle";

export default function AnimatedHamburgerMenu({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const { data: pagesLinks = [] } = useGetPageLinksQuery(undefined);
  const dict = useDictionary();
  const router = useRouter();
  const [value, setValue] = useState("");

  type LocalizedText = {
    en?: string;
    ar?: string;
  };

  const getLocalizedText = (
    value: LocalizedText | string | null | undefined,
    locale: string,
  ) => {
    if (!value) return "";

    if (typeof value === "string") {
      return value;
    }

    if (locale === "ar") {
      return value.ar || value.en || "";
    }

    return value.en || value.ar || "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const params = new URLSearchParams();
      params.set("search", value || "");
      setOpen(false);
      router.push(`/${locale}/products?${params.toString()}`, {
        scroll: false,
      });
    }
  };

  return (
    <>
      {/* Hamburger */}
      <Button
        size="icon"
        variant="ghost"
        className="relative z-[100] h-14 w-14 cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <span
          className={`menu-icon-transition inline-flex ${
            open ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
          }`}
        >
          <Menu className="!h-4 !w-4 md:!h-6 md:!w-6" />
        </span>
      </Button>

      {/* Overlay and mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-250 ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <div
        aria-hidden={!open}
        className={`fixed ${
          locale === "en" ? "right-0" : "left-0"
        } top-0 z-[1000] flex h-screen w-[85%] max-w-sm flex-col overflow-hidden border-l bg-white shadow-2xl transition-transform duration-300 ease-out dark:bg-neutral-950 ${
          open
            ? "translate-x-0"
            : locale === "en"
              ? "translate-x-full"
              : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="border-b p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">{dict.Navbar.menu}</h2>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="cursor-pointer"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="search"
              placeholder={dict.Navbar.search}
              className="pl-9 text-sm outline-0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <button className="cursor-pointer rounded-lg bg-bg p-2">
            <Bell className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-text" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-8">
          <div className="space-y-3">
            {pagesLinks.map(
              (link: { title: string; id: number }, index: number) => (
                <div
                  key={link.id}
                  style={{
                    transitionDelay: open ? `${index * 60}ms` : "0ms",
                  }}
                  className={`menu-link-transition ${
                    open
                      ? "translate-x-0 opacity-100"
                      : "translate-x-10 opacity-0"
                  }`}
                >
                  <Link
                    href={`/${locale}/pages/${link.id}`}
                    onClick={() => setOpen(false)}
                    className={`group flex items-center justify-between ${
                      locale === "en" ? "flex-row" : "flex-row-reverse"
                    } rounded-2xl border p-4 transition-all hover:translate-x-1 hover:bg-muted`}
                  >
                    <span className="text-lg font-semibold">
                      {getLocalizedText(link.title, locale)}
                    </span>

                    <span className="menu-arrow-transition text-muted-foreground">
                      →
                    </span>
                  </Link>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="relative border-t p-6">
          <div className="grid grid-cols-3 gap-3">
            <Button
              className="flex h-16 flex-col gap-1 rounded-2xl"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              <Link
                className="flex flex-col items-center gap-1"
                href={`/${locale}/wishlist`}
              >
                <Heart className="h-5 w-5" />
                <span className="text-xs">{dict.Navbar.whishlist}</span>
              </Link>
            </Button>

            <Button
              className="flex h-16 flex-col gap-1 rounded-2xl"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              <Link
                className="flex flex-col items-center gap-1"
                href={`/${locale}/cart`}
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="text-xs">{dict.Navbar.cart}</span>
              </Link>
            </Button>

            <Button
              onClick={() => setOpen(false)}
              variant="outline"
              className="flex h-16 flex-col gap-1 rounded-2xl"
            >
              <Link
                className="flex flex-col items-center gap-1"
                href={`/${locale}/profile`}
              >
                <User className="h-5 w-5" />
                <span className="text-xs">{dict.Navbar.profile}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .menu-icon-transition {
          transition:
            transform 200ms ease,
            opacity 200ms ease;
        }

        .menu-link-transition {
          transition:
            transform 300ms ease,
            opacity 300ms ease;
        }

        .menu-arrow-transition {
          display: inline-block;
          transition: transform 200ms ease;
        }

        :global(a:hover) .menu-arrow-transition {
          transform: translateX(5px);
        }

        @media (prefers-reduced-motion: reduce) {
          .menu-icon-transition,
          .menu-link-transition,
          .menu-arrow-transition {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}
