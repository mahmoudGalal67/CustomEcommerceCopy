import dynamic from "next/dynamic";
import { type ComponentType } from "react";
import { PagesApi } from "@/utilis/api";

// above the fold: keep static
import Banner from "@/components/section-types/Banner";
import Hero from "@/components/section-types/Hero";
import Hero2 from "@/components/section-types/Hero2";

// below the fold: loaded only when the page actually contains them
const CountDownOffers = dynamic(
  () => import("@/components/section-types/CountDownOffers"),
);
const CategorySection = dynamic(
  () => import("@/components/section-types/CategorySection"),
);
const Brands = dynamic(() => import("@/components/section-types/Brands"));
const Features = dynamic(() => import("@/components/section-types/Features"));
const GeneralCountdownOffer = dynamic(
  () => import("@/components/section-types/GeneralCountDownOffers"),
);
const Testimonials = dynamic(
  () => import("@/components/section-types/Testimonials"),
);
const TwoColumnRichText = dynamic(
  () => import("@/components/section-types/ClientRichText"),
);

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

type SectionType =
  | "hero"
  | "hero2"
  | "banner"
  | "CountDownOffers"
  | "CategorySecation"
  | "brandMarquee"
  | "features"
  | "generalCountdownOffers"
  | "testimonials"
  | "twoColumnRichText";

interface BaseSection {
  id: string;
  type: SectionType;
  props: Record<string, any>;
}

const MAP: Record<SectionType, ComponentType<any>> = {
  hero: Hero,
  hero2: Hero2,
  banner: Banner,
  CountDownOffers: CountDownOffers,
  CategorySecation: CategorySection,
  brandMarquee: Brands,
  features: Features,
  generalCountdownOffers: GeneralCountdownOffer,
  testimonials: Testimonials,
  twoColumnRichText: TwoColumnRichText,
};
/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

async function HomeSections() {
  const { data: Home } = await PagesApi.showPage({ id: "1" });

  return (
    <>
      {Home.sections?.map((s: BaseSection, i: number) => {
        const Component = MAP[s.type];

        if (!Component) return null;

        return <Component key={s.id} {...s.props} priority={i === 0} />;
      })}
    </>
  );
}

export default HomeSections;
