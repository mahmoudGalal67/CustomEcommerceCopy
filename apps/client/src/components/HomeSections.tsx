import Banner from "@/components/section-types/Banner";
import Hero from "@/components/section-types/Hero";
import CountDownOffers from "@/components/section-types/CountDownOffers";

import { type FC } from "react";
import CategorySecation from "@/components/section-types/CategorySection";
import { PagesApi } from "@/utilis/api";
import Hero2 from "@/components/section-types/Hero2";
import ClientBrands from "@/components/section-types/Brands";
import ClientFeatures from "@/components/section-types/Features";
import GeneralCountdownOffer from "@/components/section-types/GeneralCountDownOffers";
import ClientTestimonials from "@/components/section-types/Testimonials";
import Client2ColumnRichText from "@/components/section-types/ClientRichText";

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

/* ------------------------------------------------------------------ */
/* Section map */
/* ------------------------------------------------------------------ */

const MAP: Record<SectionType, FC<any>> = {
  hero: Hero,
  hero2: Hero2,
  banner: Banner,
  CountDownOffers: CountDownOffers,
  CategorySecation: CategorySecation,
  brandMarquee: ClientBrands,
  features: ClientFeatures,
  generalCountdownOffers: GeneralCountdownOffer,
  testimonials: ClientTestimonials,
  twoColumnRichText: Client2ColumnRichText,
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
