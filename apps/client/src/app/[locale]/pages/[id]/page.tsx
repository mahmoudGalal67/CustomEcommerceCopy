import ChatBox from "@/components/chatBot/ChatBox";
import ProductList from "@/components/ProductList";
import Banner from "@/components/section-types/Banner";
import Hero from "@/components/section-types/Hero";
import sliderFeaturedProducts from "@/components/section-types/SliderFeaturedProducts";
import CountDownOffers from "@/components/section-types/CountDownOffers";

import { type FC } from "react";
import CategorySecation from "@/components/section-types/CategorySection";
import { PagesApi } from "@/utilis/api";
import { getDictionary } from "@/i18n/config";
import ClientHero2 from "@/components/section-types/Hero2";
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
  | "banner"
  | "sliderFeaturedProducts"
  | "hero2"
  | "CountDownOffers"
  | "brandMarquee"
  | "features"
  | "generalCountdownOffers"
  | "testimonials"
  | "twoColumnRichText"
  | "CountDownOffers"
  | "CategorySecation";

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
  hero2: ClientHero2,
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
  searchParams: Record<string, string>;
  params: Promise<{
    locale: string;
    id: string;
  }>;
}) => {
  const { locale, id } = await params;
  const { data: Page } = await PagesApi.showPage({ id });
  const dict = await getDictionary(locale);
  console.log(Page);
  return (
    <div className="">
      {Page.sections?.map((s: BaseSection) => {
        const Component = MAP[s.type];

        if (!Component) return null;

        return <Component key={s.id} {...s.props} />;
      })}
      <ProductList
        query={searchParams}
        params="homepage"
        locale={locale}
        dict={dict}
      />
      <ChatBox dict={dict} />
    </div>
  );
};

export default Homepage;
