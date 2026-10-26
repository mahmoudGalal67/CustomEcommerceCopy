"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Children,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CarouselProps = {
  children: ReactNode;
  rtl?: boolean; // pass locale === "ar"
  loop?: boolean;
  autoplayMs?: number; // e.g. 4000. Leave undefined for no autoplay
  showArrows?: boolean;
  showDots?: boolean;
  // Tailwind classes that decide how many slides are visible
  slideClassName?: string;
};

export default function Carousel({
  children,
  rtl = false,
  loop = false,
  autoplayMs,
  showArrows = true,
  showDots = false,
  slideClassName = "basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4",
}: CarouselProps) {
  const plugins = useMemo(
    () =>
      autoplayMs
        ? [Autoplay({ delay: autoplayMs, stopOnInteraction: true })]
        : [],
    [autoplayMs],
  );

  const [viewportRef, api] = useEmblaCarousel(
    {
      loop,
      align: "start",
      containScroll: "trimSnaps",
      direction: rtl ? "rtl" : "ltr",
    },
    plugins,
  );

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const sync = useCallback(() => {
    if (!api) return;
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
    setSelected(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const onReInit = () => {
      setSnaps(api.scrollSnapList());
      sync();
    };
    onReInit();
    api.on("select", sync);
    api.on("reInit", onReInit);
    return () => {
      api.off("select", sync);
      api.off("reInit", onReInit);
    };
  }, [api, sync]);

  const slides = Children.toArray(children);

  return (
    <div className="relative" dir={rtl ? "rtl" : "ltr"}>
      <div className="overflow-hidden" ref={viewportRef}>
        {/* -ms-4 cancels the ps-4 gap on the first slide */}
        <div className="-ms-4 flex">
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`min-w-0 shrink-0 grow-0 ps-4 ${slideClassName}`}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {showArrows && (
        <>
          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            disabled={!canPrev && !loop}
            aria-label="Previous"
            className="absolute start-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            disabled={!canNext && !loop}
            aria-label="Next"
            className="absolute end-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5 rtl:rotate-180" />
          </button>
        </>
      )}

      {showDots && snaps.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {snaps.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => api?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === selected ? "w-6 bg-primary" : "w-2 bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
