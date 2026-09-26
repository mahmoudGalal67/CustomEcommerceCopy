"use client";

import { Globe } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { useState } from "react";

const languages = [
  {
    code: "en",
    label: "English",
    flag: "🇺🇸",
  },
  {
    code: "ar",
    label: "العربية",
    flag: "🇪🇬",
  },
];

export default function LanguageSwitcher() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocale] = useState(params.locale || "en");

  const switchLanguage = (lang: string) => {
    const newPath = `/${lang}${pathname.substring(3)}`;
    router.push(newPath);

    setLocale(lang);
  };

  const currentLanguage = languages.find((lang) => lang.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="
            flex items-center gap-2
            rounded-full
            px-4
            border-border/50
            bg-background/80
            backdrop-blur-md
            hover:bg-accent
      
            shadow-sm
            cursor-pointer
          "
        >
          <Globe className="w-4 h-4" />

          <span className="text-lg">{currentLanguage?.flag}</span>

          <span className="font-medium">{currentLanguage?.label}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="
           z-100
          w-44
          rounded-2xl
          p-2
          shadow-xl
          border
        "
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => switchLanguage(lang.code)}
            className={`
              flex items-center gap-3
              rounded-xl
              px-3 py-2
              cursor-pointer

              ${locale === lang.code ? "bg-accent" : ""}
            `}
          >
            <span className="text-xl">{lang.flag}</span>

            <span className="font-medium">{lang.label}</span>

            {locale === lang.code && (
              <span className="ml-auto text-xs text-muted-foreground">
                Active
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
