import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import type { DropResult } from "@hello-pangea/dnd";

import { useCMS } from "../../../cms/store";
import SectionWrapper from "../../../cms/SectionWrapper";
import Hero from "../../../cms/section-types/Hero";
import Banner from "../../../cms/section-types/Banner";
import sliderFeaturedProducts from "../../../cms/section-types/SliderFeaturedProducts";
import CountDownOffers from "../../../cms/section-types/CountDownOffers";
import Text from "@/cms/section-types/Text";

import { useEffect, type FC } from "react";
import { Move } from "lucide-react";
import CategorySecation from "@/cms/section-types/CategorySection";
import type { SectionType } from "@/cms/Types";
import { useParams } from "react-router-dom";
import { useShowPageQuery } from "@/services/pagesApi";
import Brands from "@/cms/section-types/Brands";
import Testimonials from "@/cms/section-types/Testimonials";
import Features from "@/cms/section-types/Features";
import GeneralCountdownOffer from "@/cms/section-types/GeneralCountDownOffers";
import Hero2 from "@/cms/section-types/Hero2";

/* ------------------------------------------------------------------ */
/* Section map */
/* ------------------------------------------------------------------ */

const MAP: Record<SectionType, FC<any>> = {
  hero: Hero,
  hero2: Hero2,
  text: Text,
  banner: Banner,
  sliderFeaturedProducts: sliderFeaturedProducts,
  CountDownOffers: CountDownOffers,
  CategorySecation: CategorySecation,
  brandMarquee: Brands,
  features: Features,
  generalCountdownOffers: GeneralCountdownOffer,
  testimonials: Testimonials,
};

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function StaticPage() {
  const { id } = useParams();
  const { data, isLoading } = useShowPageQuery({ id });

  const { moveSection, setcurrentPage, currentPageData, selectedId } = useCMS();
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    moveSection(result.source.index, result.destination.index);
  };
  useEffect(() => {
    if (data) {
      setcurrentPage(data.id);
    }
  }, [data]);

  useEffect(() => {
    if (!selectedId) return;

    const element = document.querySelector(`[data-section-id="${selectedId}"]`);

    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [selectedId]);

  if (isLoading) return <div>Loading...</div>;
  if (!data) return null;
  console.log(data.id);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="page">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {currentPageData?.sections.map((s, i) => {
              const Component = MAP[s.type];

              if (!Component) return null;

              return (
                <Draggable key={s.id} draggableId={s.id} index={i}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                      <div
                        {...provided.dragHandleProps}
                        className="cursor-move p-2 -mb-4 z-10 relative bg-white w-fit rounded-md shadow"
                      >
                        <Move />
                      </div>
                      <SectionWrapper section={s} index={i}>
                        <Component {...s.props} id={s.id} />
                      </SectionWrapper>
                    </div>
                  )}
                </Draggable>
              );
            })}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
