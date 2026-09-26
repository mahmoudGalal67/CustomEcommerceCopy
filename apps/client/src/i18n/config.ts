// src/i18n.ts
export const locales = ["en", "ar"];
export const defaultLocale = "en";

const dictionaries: any = {
  en: () => import("@/messages/en.json").then((m) => m.default),
  ar: () => import("@/messages/ar.json").then((m) => m.default),
};

export type Locale = keyof typeof dictionaries;
export const getDictionary = async (locale: string) => {
  const normalizedLocale = locale?.split("-")[0];
  if (normalizedLocale in dictionaries) {
    return dictionaries[normalizedLocale as Locale]();
  }
  return dictionaries.en();
};
