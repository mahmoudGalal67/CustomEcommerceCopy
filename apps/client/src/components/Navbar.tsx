"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, Heart } from "lucide-react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";

import SearchBar from "./SearchBar";
import ShoppingCartIcon from "./ShoppingCartIcon";
import UserProfileIcon from "./UserProfileIcon";
import ThemeToggle from "./theme-toggle";
import LanguageSwitcher from "./LanguageSwitcher";
import AnimatedHamburgerMenu from "./AnimatedHamburgerMenu";

import { useGetUserInfo } from "@/hooks/GetUserINfo";
import { useGetSettingsQuery } from "@/services/SettingsApi";
import { useShowAnnouncementBarQuery } from "../services/AnnouncementBarAoi";
import { AnnouncementMarquee } from "@shared/sections";

const Navbar = ({ dict }: { dict: any }) => {
  const { data: announcementBar } = useShowAnnouncementBarQuery(undefined);

  const { data: settings } = useGetSettingsQuery(undefined);

  useGetUserInfo();

  const user = useSelector((state: any) => state.auth.user);
  const params = useParams();
  const locale = (params.locale || "en") as string;

  const logoSrc = settings?.logo
    ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${settings.logo}`
    : "/logo.png";

  return (
    <nav className="relative z-5 w-full border-b border-gray-200 px-3 py-2 sm:px-5 md:px-6">
      <div className="flex min-h-14 w-full items-center justify-between gap-2 md:min-h-20">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          aria-label={settings?.site_name || "Home"}
          className="flex shrink-0 items-center"
        >
          <Image
            src={logoSrc}
            alt={settings?.site_name || "Logo"}
            width={180}
            height={100}
            priority
            sizes="(max-width: 639px) 140px, 180px"
            className="h-[52px] w-[80px] object-contain object-left sm:h-[62px] sm:w-[165px] md:h-[76px] md:w-[180px]"
          />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden min-w-0 flex-1 items-center justify-end gap-5 lg:flex">
          <LanguageSwitcher />
          <SearchBar dict={dict} />
          <ThemeToggle />
          <Bell className="h-5 w-5 shrink-0 text-text" />

          <Link href={`/${locale}/wishlist`} aria-label="Wishlist">
            <Heart className="h-5 w-5 text-text" />
          </Link>

          <ShoppingCartIcon locale={locale} />

          {user ? (
            <UserProfileIcon user={user} locale={locale} dict={dict} />
          ) : (
            <Link href={`/${locale}/login`}>{dict.Buttons.login}</Link>
          )}
        </div>

        {/* Mobile and tablet actions */}
        <div className="flex shrink-0 items-center gap-3 lg:hidden">
          <div className="flex items-center">
            <SearchBar dict={dict} />
          </div>

          <Link
            href={`/${locale}/wishlist`}
            aria-label="Wishlist"
            className="flex shrink-0 items-center justify-center"
          >
            <Heart className="h-5 w-5 text-text" />
          </Link>

          <div className="flex shrink-0 items-center">
            <ShoppingCartIcon locale={locale} />
          </div>
          {user ? (
            <UserProfileIcon user={user} locale={locale} dict={dict} />
          ) : (
            <Link
              className="text-sm mx-2 font-medium text-text hover:text-primary"
              href={`/${locale}/login`}
            >
              {dict.Buttons.login}
            </Link>
          )}
          <AnimatedHamburgerMenu locale={locale} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
