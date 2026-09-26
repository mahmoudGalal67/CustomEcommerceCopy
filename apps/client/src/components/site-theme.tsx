"use client";

import { useGetSettingsQuery } from "@/services/SettingsApi";
import { ThemeProvider } from "./theme-provider";

type Props = {
  children: React.ReactNode;
};

export default function SiteTheme({ children }: Props) {
  const { data: settings } = useGetSettingsQuery(undefined);

  return (
    <ThemeProvider
      primary={settings?.colors?.primary}
      secondary={settings?.colors?.secondary}
    >
      {children}
    </ThemeProvider>
  );
}
