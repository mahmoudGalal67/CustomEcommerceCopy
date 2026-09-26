"use client";

import { useEffect } from "react";

type ThemeProviderProps = {
  primary?: string;
  secondary?: string;
  children: React.ReactNode;
};

export function ThemeProvider({
  primary,
  secondary,
  children,
}: ThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement;

    if (primary) {
      root.style.setProperty("--primary-light", primary);
    }

    if (secondary) {
      root.style.setProperty("--primary-dark", secondary);
    }

    return () => {
      root.style.removeProperty("--primary-light");
      root.style.removeProperty("--primary-dark");
    };
  }, [primary, secondary]);

  return children;
}
