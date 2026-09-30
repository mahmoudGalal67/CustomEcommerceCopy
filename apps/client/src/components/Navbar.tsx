"use client";
import Image from "next/image";
import Link from "next/link";

import SearchBar from "./SearchBar";
import ShoppingCartIcon from "./ShoppingCartIcon";
import { useGetUserInfo } from "@/hooks/GetUserINfo";

import { Bell, Heart } from "lucide-react";
import { useSelector } from "react-redux";
import UserProfileIcon from "./UserProfileIcon";
import ThemeToggle from "./theme-toggle";
import { useParams } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import AnimatedHamburgerMenu from "./AnimatedHamburgerMenu";

import { AnnouncementMarquee } from "@shared/sections";
import { PopupCampaign } from "@shared/sections";
import { useShowAnnouncementBarQuery } from "../services/AnnouncementBarAoi";

import { useShowPopupCampaignQuery } from "../services/PopupCampaign";
import { useGetSettingsQuery } from "@/services/SettingsApi";

const Navbar = ({ dict }: { dict: any }) => {
  const { data: announcementBar } = useShowAnnouncementBarQuery(undefined);
  const { data: settings } = useGetSettingsQuery(undefined);

  const { data: popupCampaign } = useShowPopupCampaignQuery(undefined);

  useGetUserInfo();

  const user = useSelector((state: any) => state.auth.user);
  const params = useParams();
  const locale = (params.locale || "en") as string;

  return (
    <div>
      {!!announcementBar?.enabled && (
        <AnnouncementMarquee data={announcementBar} locale={locale} />
      )}
      {
        // !!popupCampaign?.enabled && (
        //   <PopupCampaign data={popupCampaign} apiUrl={process.env.NEXT_PUBLIC_API_URL} />
        // )
      }
      <nav className="w-full relative z-100 flex items-center justify-between border-b border-gray-200 pb-4">
        {/* LEFT */}
        <Link href={`/${locale}`} className="group flex items-center gap-3">
          <Image
            src={
              settings?.logo
                ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${settings?.logo}`
                : "/logo.png"
            }
            alt={settings?.site_name || "Logo"}
            width={150}
            height={120}
            priority
            className="
      h-[12] w-12
      shrink-0
      object-contain
      transition-transform duration-200
      group-hover:scale-105
      md:h-[80px] md:w-[120px]
    "
          />
        </Link>
        {/* RIGHT */}
        <div className="flex items-center gap-6">
          <LanguageSwitcher />
          <SearchBar dict={dict} />
          {/* <Link href="/">
          <Home className="w-4 h-4 text-gray-600" />
        </Link> */}
          <ThemeToggle />
          <Bell className="w-4 h-4 text-text" />
          <Link href={`/${locale}/wishlist`} className="relative">
            <Heart className="w-4 h-4  text-text" />
          </Link>
          <ShoppingCartIcon locale={locale} />
          {user ? (
            <UserProfileIcon user={user} locale={locale} dict={dict} />
          ) : (
            <Link href={`/${locale}/login`}>{dict.Buttons.login}</Link>
          )}
        </div>
        <AnimatedHamburgerMenu locale={locale} />
      </nav>
    </div>
  );
};

export default Navbar;
