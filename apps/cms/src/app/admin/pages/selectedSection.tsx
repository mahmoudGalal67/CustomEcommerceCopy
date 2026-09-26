import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Section Types */
/* ------------------------------------------------------------------ */

export type SectionType = "hero" | "text";

export interface HeroProps {
  title: string;
  subtitle: string;
  bg: string;
}

export interface TextProps {
  text: string;
}

export type SectionProps = HeroProps | TextProps;

export interface Section {
  id: string;
  type: SectionType;
  props: SectionProps;
}

/* ------------------------------------------------------------------ */
/* Pages Type */
/* ------------------------------------------------------------------ */

export interface Pages {
  home: Section[];
}

/* ------------------------------------------------------------------ */
/* Context Type */
/* ------------------------------------------------------------------ */

interface CMSContextType {
  pages: Pages;
  setPages: React.Dispatch<React.SetStateAction<Pages>>;
  selectedSection: Section | null;
  setSelectedSection: React.Dispatch<React.SetStateAction<Section | null>>;
  updateSectionProp: (id: string, prop: string, value: string) => void;
}

/* ------------------------------------------------------------------ */
/* Context & Provider */
/* ------------------------------------------------------------------ */

const CMSContext = createContext<CMSContextType | null>(null);

interface CMSProviderProps {
  children: ReactNode;
}

export function CMSProvider({ children }: CMSProviderProps) {
  const [pages, setPages] = useState<Pages>({
    home: [
      {
        id: "hero-1",
        type: "hero",
        props: {
          title: "Welcome to My Site",
          subtitle: "Click me to edit",
          bg: "#0f172a",
        },
      },
      {
        id: "text-1",
        type: "text",
        props: { text: "This is a CMS section" },
      },
    ],
  });

  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  const updateSectionProp = (id: string, prop: string, value: string) => {
    setPages((prev) => {
      const updated = prev.home.map((s) =>
        s.id === id ? { ...s, props: { ...s.props, [prop]: value } } : s
      );
      return { ...prev, home: updated };
    });

    if (selectedSection?.id === id) {
      setSelectedSection((prev) =>
        prev ? { ...prev, props: { ...prev.props, [prop]: value } } : prev
      );
    }
  };

  return (
    <CMSContext.Provider
      value={{
        pages,
        setPages,
        selectedSection,
        setSelectedSection,
        updateSectionProp,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Hook */
/* ------------------------------------------------------------------ */

export const useCMS = (): CMSContextType => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error("useCMS must be used within CMSProvider");
  }
  return context;
};
