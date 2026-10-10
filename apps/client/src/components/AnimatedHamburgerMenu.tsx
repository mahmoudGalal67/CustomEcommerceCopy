"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ShoppingBag, Heart, User, Search, Bell } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

import { useGetPageLinksQuery } from "@/services/pagesApi";
import { useDictionary } from "@/providers/dictionary-provider";
import { useParams, useRouter } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./theme-toggle";

export default function AnimatedHamburgerMenu({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const { data: pagesLinks } = useGetPageLinksQuery(undefined);
  const dict = useDictionary();

  const params = useParams();
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

    // Backward compatibility with old string data
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
      // Force navigate to /products
      router.push(`/${locale}/products?${params.toString()}`, {
        scroll: false,
      });
    }
  };

  return (
    <>
      {/* Navbar */}
      {/* Hamburger */}
      {!open ? (
        <Button
          size="icon"
          variant="ghost"
          className="h-14 w-14 relative z-[100] cursor-pointer"
          onClick={() => setOpen((prev) => !prev)}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="md:!h-6 md:!w-6 !h-4 !w-4" />
            </motion.div>
          </AnimatePresence>
        </Button>
      ) : (
        <Button size="icon" variant="ghost"></Button>
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm "
              onClick={() => setOpen(false)}
            />

            {/* Sliding Panel */}
            <motion.div
              initial={locale === "en" ? { x: "100%" } : { x: "-100%" }}
              animate={{ x: 0 }}
              exit={locale === "en" ? { x: "100%" } : { x: "-100%" }}
              transition={{
                type: "spring",
                damping: 22,
                stiffness: 180,
              }}
              className={`fixed ${locale === "en" ? "right-0" : "left-0"} top-0 z-1000 flex h-screen w-[85%] max-w-sm flex-col overflow-hidden border-l bg-white shadow-2xl dark:bg-neutral-950`}
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
                  >
                    <X className="h-5 w-5 " />
                  </Button>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="search"
                    placeholder={dict.Navbar.search}
                    className="text-sm outline-0 pl-9"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown} // 🔑 handle Enter press
                  />
                </div>
              </div>
              <div className="border-b border-gray-200 px-4 py-3 flex items center justify-between">
                <LanguageSwitcher />
                <ThemeToggle />
                <button className="p-2 rounded-lg bg-bg cursor-pointer">
                  <Bell className="h-5 w-5 shrink-0 text-text rounded flex justify-center items-center" />
                </button>
              </div>
              {/* Navigation */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-8">
                <div className="space-y-3">
                  {pagesLinks.map(
                    (link: { title: string; id: number }, index: number) => (
                      <motion.div
                        key={link.id}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{
                          delay: index * 0.08,
                          duration: 0.35,
                        }}
                      >
                        <Link
                          href={`/${locale}/pages/${link.id}`}
                          onClick={() => setOpen(false)}
                          className={`group flex items-center justify-between ${locale === "en" ? "flex-row" : "flex-row-reverse"} rounded-2xl border p-4 transition-all hover:translate-x-1 hover:bg-muted`}
                        >
                          <span className="text-lg font-semibold">
                            {getLocalizedText(link.title, locale)}
                          </span>

                          <motion.div
                            initial={{ x: 0 }}
                            whileHover={{ x: 5 }}
                            className="text-muted-foreground"
                          >
                            →
                          </motion.div>
                        </Link>
                      </motion.div>
                    ),
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t p-6 relative">
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    className="flex h-16 flex-col gap-1 rounded-2xl"
                    variant="outline"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <Link
                      className="flex flex-col gap-1 items-center"
                      href={`/${locale}/wishlist`}
                    >
                      <Heart className="h-5 w-5" />
                      <span className="text-xs">{dict.Navbar.whishlist}</span>
                    </Link>
                  </Button>
                  <Button
                    className="flex h-16 flex-col gap-1 rounded-2xl"
                    variant="outline"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <Link
                      className="flex flex-col gap-1 items-center"
                      href={`/${locale}/cart`}
                    >
                      <ShoppingBag className="h-5 w-5" />
                      <span className="text-xs">{dict.Navbar.cart}</span>
                    </Link>
                  </Button>
                  <Button
                    onClick={() => {
                      setOpen(false);
                    }}
                    variant="outline"
                    className="flex h-16 flex-col gap-1 rounded-2xl"
                  >
                    <Link
                      className="flex flex-col gap-1 items-center"
                      href={`/${locale}/profile`}
                    >
                      <User className="h-5 w-5" />
                      <span className="text-xs">{dict.Navbar.profile}</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
