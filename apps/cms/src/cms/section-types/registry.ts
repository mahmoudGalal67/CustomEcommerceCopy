import {
  Image,
  Layout,
  Megaphone,
  ShoppingBag,
  Star,
  Columns3,
  GalleryHorizontal,
  Type,
} from "lucide-react";

export const SECTION_REGISTRY = {
  layout: [
    { type: "hero", label: "Hero Section", icon: Megaphone },
    { type: "hero2", label: "Advanced Hero Section", icon: Image },
    { type: "banner", label: "Banner Section", icon: Image },
    {
      type: "sliderFeaturedProducts",
      label: "Featured Products",
      icon: Type,
    },
    { type: "CategorySecation", label: "CategorySecation", icon: ShoppingBag },
    { type: "CountDownOffers", label: "CountDownOffers", icon: Megaphone },
    { type: "brandMarquee", label: "Brands", icon: Star },
    { type: "features", label: "Features", icon: GalleryHorizontal },
    {
      type: "generalCountdownOffers",
      label: " Countdown Offers",
      icon: Layout,
    },
    { type: "testimonials", label: "Testimonials", icon: GalleryHorizontal },
    {
      type: "twoColumnRichText",
      label: "Two Column Rich Text",
      icon: Columns3,
    },
  ],
};
