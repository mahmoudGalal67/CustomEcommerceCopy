"use client";

import { AppDictionary } from "@/types/types";
import { createContext, useContext } from "react";

const DictionaryContext = createContext<AppDictionary | null>(null);

export function DictionaryProvider({
  children,
  dictionary,
}: {
  children: React.ReactNode;
  dictionary: AppDictionary;
}) {
  return (
    <DictionaryContext.Provider value={dictionary}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const context = useContext(DictionaryContext);

  if (!context) {
    throw new Error("useDictionary must be used inside DictionaryProvider");
  }

  return context;
}
