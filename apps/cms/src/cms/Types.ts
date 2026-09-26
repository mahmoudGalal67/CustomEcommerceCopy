/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

import type { ReactNode } from "react";

export type SectionType =
  | "hero"
  | "hero2"
  | "text"
  | "banner"
  | "sliderFeaturedProducts"
  | "CountDownOffers"
  | "CategorySecation"
  | "brandMarquee"
  | "features"
  | "generalCountdownOffers"
  | "testimonials"
  | "twoColumnRichText";

export interface LocalizedText {
  en?: string;
  ar?: string;
}

export interface HeroProps {
  title: string;
  subtitle: string;
  bg: string;
}

export interface Hero2Props {
  badge: LocalizedText;

  titleLine1: LocalizedText;
  titleHighlight: LocalizedText;
  titleLine3: LocalizedText;

  description: LocalizedText;

  primaryButton: {
    text: LocalizedText;
    href: string;
  };

  secondaryButton: {
    text: LocalizedText;
    href: string;
  };

  stats: {
    id: string;

    value: LocalizedText;
    label: LocalizedText;
  }[];

  featuredProduct: {
    id: string;

    badge: LocalizedText;
    brand: LocalizedText;
    name: LocalizedText;
    price: LocalizedText;

    image?: string;

    fallbackText: LocalizedText;
  };

  miniProduct: {
    id: string;

    brand: LocalizedText;
    name: LocalizedText;

    image?: string;
  };

  reviews: {
    rating: number;
    text: LocalizedText;
  };

  shipping: {
    title: LocalizedText;
    value: LocalizedText;
  };
}

export interface CountdownButton {
  text: LocalizedText | string;
  href: string;
}

export interface GeneralCountdownOffersProps {
  badge: LocalizedText | string;

  titleBefore: LocalizedText | string;
  titleHighlight: LocalizedText | string;
  titleAfter: LocalizedText | string;

  description: LocalizedText | string;

  primaryButton: CountdownButton;

  secondaryButton: {
    text: LocalizedText | string;
  };

  countdown: {
    endDate: string;
  };
}

export interface TextProps {
  text: string;
}
export interface BannerSlide {
  id: string;
  title: LocalizedText | string;
  subTitle: LocalizedText | string;
  image: string;
}

export interface BannerProps {
  slides: BannerSlide[];
}
export interface sliderFeaturedProductsProps {
  products: string[];
  title: string;
  slider?: boolean;
}
export interface CountDownOffers {
  offers: any;
  title: string;
}
export interface CategorySecation {
  title: string;
  limit: number;
  category: string;
}
export interface BrandMarqueeProps {
  title: LocalizedText | string;
  brands: (LocalizedText | string)[];
}

export interface Feature {
  id: string;
  title: LocalizedText | string;
  description: LocalizedText | string;
  icon: string;
}

export interface FeaturesDataProps {
  heading: LocalizedText | string;
  title1: LocalizedText | string;
  title2: LocalizedText | string;
  features: Feature[];
}

export interface Testimonial {
  id: string;

  name: LocalizedText | string;

  handle: string;

  avatar: string;

  role: LocalizedText | string;

  rating: number;

  text: LocalizedText | string;
}

export interface TestimonialsProps {
  heading: LocalizedText | string;
  title1: LocalizedText | string;
  title2: LocalizedText | string;
  testimonials: Testimonial[];
}
export interface TwoColumnRichTextHeading {
  mainTitle: LocalizedText | string;
  title1: LocalizedText | string;
  title2: LocalizedText | string;
}

export interface TwoColumnRichTextProps {
  image: string;

  imageAlt?: LocalizedText | string;

  imageSide?: "left" | "right";

  heading?: TwoColumnRichTextHeading;

  content: LocalizedText | string;
}

export type SectionProps =
  | HeroProps
  | Hero2Props
  | TextProps
  | BannerProps
  | sliderFeaturedProductsProps
  | CountDownOffers
  | CategorySecation
  | BrandMarqueeProps
  | FeaturesDataProps
  | GeneralCountdownOffersProps
  | TestimonialsProps
  | TwoColumnRichTextProps;

export interface Section {
  id: string;
  type: SectionType;
  props: SectionProps;
}

export interface Page {
  id: string;
  title: LocalizedText;
  slug: string;
  sections: Section[];
}
export interface LinkType {
  id: string;
  title: LocalizedText;
  slug: string;
}

export type Pages = Page[];

export interface CMSContextValue {
  pages: Pages;
  setPages: React.Dispatch<React.SetStateAction<Pages>>;
  currentPage: string;
  setcurrentPage: React.Dispatch<React.SetStateAction<number>>;
  createPage: () => Page;
  currentPageData: Page | null;
  pageLinks: LinkType[];
  setpageLinks: React.Dispatch<React.SetStateAction<LinkType[]>>;

  selectedId: string | null;
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedSection: Section | null;

  updateProp: (id: string, prop: any, value: any) => void;
  updatePageProp: (prop: any, value: any) => void;
  updatePageTranslation: (
    prop: any,
    locale: "en" | "ar",
    value: string,
  ) => void;

  deleteSection: (id: string) => void;
  moveSection: (from: number, to: number) => void;
  addSection: (index: number, type: SectionType) => string;
  showAdd: boolean;
  setShowAdd: React.Dispatch<React.SetStateAction<boolean>>;
  undo: () => void;
  redo: () => void;
  saveToBackend: () => Promise<void>;
  isLoading: boolean;
  success: boolean;
}

export interface CMSProviderProps {
  children: ReactNode;
}

// const DummyPages = [{ "id": "id1", "type": "hero", "props": { "title": "Welcome", "subtitle": "Click to edit", "bg": "#0f172a" } }, { "id": "Ir_t6VJFrYJshA60YYhuc", "type": "banner", "props": { "slides": [{ "id": "ecd7c7d7-3b7b-4567-80c6-beb8410334ea", "title": "New Slide 01", "subTitle": "Subtitle 01", "image": "\/storage\/uploads\/u0ESKNYvENjP9Zx8NphnRTYWfUx0GBxhgJ4cLRZH.jpg" }, { "id": "3f0d96fc-6faa-4975-acdd-f6f428d22e2b", "title": "New Slide 02", "subTitle": "Subtitle 02", "image": "\/storage\/uploads\/bo5j7f5Wu2M87y6HmGdbr0yTXGZhxix5Vv91GKLs.jpg" }] } }, { "id": "FvwCJvh0UOgnd82LcwKpL", "type": "hero", "props": { "title": "New Hero 2", "subtitle": "test", "bg": "#020617" } }]
