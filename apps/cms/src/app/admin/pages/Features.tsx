import { useCMS } from "../../../cms/store";
import Hero from "../../../cms/section-types/Hero";
import Banner from "../../../cms/section-types/Banner";
import sliderFeaturedProducts from "../../../cms/section-types/SliderFeaturedProducts";
import CountDownOffers from "../../../cms/section-types/CountDownOffers";
import Text from "@/cms/section-types/Text";

import { useEffect, type FC } from "react";
import CategorySecation from "@/cms/section-types/CategorySection";
import type { SectionType } from "@/cms/Types";
import { useShowAnnouncementBarQuery } from "@/services/AnnouncementBarAoi";

import { AnnouncementMarquee } from "@shared/sections";
import { PopupCampaign } from "@shared/sections";
import { useShowPopupCampaignQuery } from "@/services/PopupCampaign";
import Brands from "@/cms/section-types/Brands";
import Testimonials from "@/cms/section-types/Testimonials";
import Featuress from "@/cms/section-types/Features";
import GeneralCountdownOffer from "@/cms/section-types/GeneralCountDownOffers";
import Hero2 from "@/cms/section-types/Hero2";

const MAP: Record<SectionType, FC<any>> = {
  hero: Hero,
  hero2: Hero2,
  text: Text,
  banner: Banner,
  sliderFeaturedProducts: sliderFeaturedProducts,
  CountDownOffers: CountDownOffers,
  CategorySecation: CategorySecation,
  brandMarquee: Brands,
  features: Featuress,
  generalCountdownOffers: GeneralCountdownOffer,
  testimonials: Testimonials,
};

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function Features() {
  const { setcurrentPage, currentPageData } = useCMS();
  const { data: announcementBar } = useShowAnnouncementBarQuery(undefined);
  const { data: popupCampaign } = useShowPopupCampaignQuery(undefined);

  useEffect(() => {
    setcurrentPage(1);
  }, []);

  return (
    <div>
      {!!announcementBar?.enabled && (
        <AnnouncementMarquee data={announcementBar} />
      )}
      {!!popupCampaign?.enabled && (
        <PopupCampaign
          data={popupCampaign}
          apiUrl={import.meta.env.VITE_API_URL}
        />
      )}
      {currentPageData?.sections.map((s) => {
        const Component = MAP[s.type];

        if (!Component) return null;

        return <Component key={s.id} {...s.props} />;
      })}
    </div>
  );
}
