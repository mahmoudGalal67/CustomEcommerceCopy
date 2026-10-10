import ProductList from "@/components/ProductList";
import Banner from "@/components/section-types/Banner";
import Hero from "@/components/section-types/Hero";
import sliderFeaturedProducts from "@/components/section-types/SliderFeaturedProducts";
import CountDownOffers from "@/components/section-types/CountDownOffers";

import { type FC } from "react";
import CategorySecation from "@/components/section-types/CategorySection";
import { PagesApi } from "@/utilis/api";
import { getDictionary } from "@/i18n/config";
import Hero2 from "@/components/section-types/Hero2";
import ClientBrands from "@/components/section-types/Brands";
import ClientFeatures from "@/components/section-types/Features";
import { Newsletter } from "@/components/Newsletter";
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
  | "sliderFeaturedProducts"
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
  sliderFeaturedProducts: sliderFeaturedProducts,
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

const Homepage = async ({
  searchParams,
  params,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const { locale } = await params;
  const queryParams = await searchParams;
  const dict = await getDictionary(locale);
  const { data: Home } = await PagesApi.showPage({ id: "1" });
  return (
    <div className="">
      {Home.sections?.map((s: BaseSection) => {
        const Component = MAP[s.type];

        if (!Component) return null;

        return <Component key={s.id} {...s.props} />;
      })}
      <ProductList
        query={queryParams}
        params="homepage"
        locale={locale}
        dict={dict}
      />
      <Newsletter />
    </div>
  );
};

export default Homepage;
