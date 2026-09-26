'use client'
import Hero from "@/components/section-types/Hero";
import Banner from "@/components/section-types/Banner";
import sliderFeaturedProducts from "@/components/section-types/SliderFeaturedProducts";
import CountDownOffers from "@/components/section-types/CountDownOffers";

import { type FC } from "react";
import { useGetPageQuery } from "@/services/pagesApi";
import CategorySecation from "@/components/section-types/CategorySection";

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

export default function Home() {
    const { data, isLoading } = useGetPageQuery(undefined);

    if (isLoading) return <div>Loading...</div>;
    if (!data) return null;

    return (
        <div >
            {data[0].content?.map((s: BaseSection) => {
                const Component = MAP[s.type];

                if (!Component) return null;

                return (
                    < Component key={s.id} {...s.props} />
                )
            })}
        </div>
    );
}
