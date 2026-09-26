"use client";

import { useEffect, useRef, useState } from "react";

import { useLogout } from "@/hooks/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserProfileIcon({ user, locale, dict }: any) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { logOutrHook, isLoading } = useLogout();
  const router = useRouter();

  const colors = [
    "bg-indigo-600",
    "bg-emerald-600",
    "bg-rose-600",
    "bg-amber-600",
  ];

  const color = colors[user?.name?.length % colors.length];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return "??";

    const parts = name.trim().split(" ");

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const hnadleLogout = async () => {
    logOutrHook();
    router.push(`${locale}/`);
  };

  return (
    <div className="relative inline-block" ref={ref}>
      {/* Trigger  */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-9 h-9 rounded-full bg-primary text-white 
             flex items-center justify-center 
             font-semibold text-sm 
             hover:bg-amber-700 transition cursor-pointer`}
      >
        {getInitials(user?.name)}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={`absolute ${locale == "ar" ? "left-0" : "right-0"}  mt-2 w-40 bg-white dark:bg-gray-800 border border-amber-400
                     rounded-lg shadow-lg z-50`}
        >
          <ul className="py-1 text-sm text-gray-700 dark:text-primary">
            <li className="rounded-lg">
              <Link
                href={`/${locale}/orders`}
                className="w-full rounded-lg block text-left px-4 py-2 cursor-pointer hover:bg-secondary"
              >
                {locale == "ar" ? "الطلبات" : "Orders"}
              </Link>
            </li>
            <li className="rounded-lg">
              <Link
                href={`/${locale}/profile`}
                className="w-full rounded-lg block text-left px-4 py-2 cursor-pointer hover:bg-secondary"
              >
                {locale == "ar" ? "الملف الشخصي" : "Profile"}
              </Link>
            </li>
            <li className="rounded-lg">
              <button
                onClick={hnadleLogout}
                className="w-full rounded-lg text-left px-4 py-2 cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-gray-600"
              >
                {isLoading ? dict.Buttons.loading : dict.Buttons.logout}
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
