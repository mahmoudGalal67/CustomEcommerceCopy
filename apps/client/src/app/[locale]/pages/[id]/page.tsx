
import ChatBox from "@/components/chatBot/ChatBox";
import ProductList from "@/components/ProductList";
import Banner from "@/components/section-types/Banner";
import Hero from "@/components/section-types/Hero";
import sliderFeaturedProducts from "@/components/section-types/SliderFeaturedProducts";
import CountDownOffers from "@/components/section-types/CountDownOffers";

import { type FC } from "react";
import CategorySecation from "@/components/section-types/CategorySection";
import { PagesApi } from "@/utilis/api";

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

type SectionType = "hero" | 'banner' | 'sliderFeaturedProducts' | 'CountDownOffers' | 'CategorySecation';

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
    banner: Banner,
    sliderFeaturedProducts: sliderFeaturedProducts,
    CountDownOffers: CountDownOffers,
    CategorySecation: CategorySecation,
};

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

const Homepage = async ({
    searchParams,
    params
}: {
    searchParams: Record<string, string>;
    params: Promise<{
        locale: string;
        id: string;
    }>;
}) => {
    const { locale, id } = await params;
    const { data: Page } = await PagesApi.showPage({ id });
    console.log(Page)
    return (
        <div className="">
            {Page.sections?.map((s: BaseSection) => {
                const Component = MAP[s.type];

                if (!Component) return null;

                return (
                    < Component key={s.id} {...s.props} />
                )
            })}
            <ProductList query={searchParams} params="homepage" locale={locale} />
            <ChatBox />
        </div>
    );
};

export default Homepage;
