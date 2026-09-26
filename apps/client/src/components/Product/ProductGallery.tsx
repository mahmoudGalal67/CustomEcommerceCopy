"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import { AnimatePresence, motion } from "framer-motion";

interface ProductGalleryProps {
  images: string[];
  locale: string;
}

export default function ProductGallery({
  images,
  locale,
}: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [openLightbox, setOpenLightbox] = useState(false);

  const [zoomStyle, setZoomStyle] = useState({});
  const [showZoom, setShowZoom] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: true,
    containScroll: "keepSnaps",
    align: "start",
  });

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      imageRef.current!.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL}/storage/${mainImage})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "350%",
    });
  };
  useEffect(() => {
    setMainImage(images[0]);
    setSelectedIndex(0);

    if (emblaApi) {
      emblaApi.scrollTo(0);
    }
  }, [images, emblaApi]);
  useEffect(() => {
    if (emblaApi) {
      emblaApi.scrollTo(selectedIndex);
    }
  }, [selectedIndex, emblaApi]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!openLightbox) return;

      if (e.key === "ArrowRight") {
        const next =
          selectedIndex === images.length - 1 ? 0 : selectedIndex + 1;

        setSelectedIndex(next);
        setMainImage(images[next]);
      }

      if (e.key === "ArrowLeft") {
        const prev =
          selectedIndex === 0 ? images.length - 1 : selectedIndex - 1;

        setSelectedIndex(prev);
        setMainImage(images[prev]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [openLightbox, selectedIndex, images]);

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative overflow-visible rounded-3xl border  bg-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
          {/* Blurred Background */}
          {/* <div className="absolute inset-0 scale-110 blur-3xl opacity-20">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${mainImage}`}
              alt="Blur Background"
              fill
              className="relative z-10 cursor-zoom-in object-cover"
              onClick={() => setOpenLightbox(true)}
            />
          </div> */}
          <div
            ref={imageRef}
            className="relative z-10 hidden cursor-zoom-in overflow-visible md:block"
            onMouseEnter={() => setShowZoom(true)}
            onMouseLeave={() => setShowZoom(false)}
            onMouseMove={handleMouseMove}
            onClick={() => setOpenLightbox(true)}
          >
            {showZoom && (
              <div
                style={zoomStyle}
                className={`
      absolute
      ${locale === "ar" ? "right-[105%]" : "left-[105%]"}
      top-0
      hidden
      h-full
      w-[500px]
      rounded-3xl
      border
      border-neutral-200
      bg-white
      shadow-2xl
      md:block
    `}
              />
            )}
            <AnimatePresence mode="wait">
              <motion.div
                key={mainImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${mainImage}`}
                  alt="Product"
                  width={800}
                  height={800}
                  className="h-[500px] w-full object-contain transition-all duration-300 "
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="relative z-10 block md:hidden">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${mainImage}`}
              alt="Product"
              width={800}
              height={800}
              className="h-[500px] w-full object-contain"
            />
          </div>
        </div>
        {/* Thumbnail Slider */}
        {images && (
          <div className="relative">
            <Button
              size="icon"
              variant="secondary"
              className="absolute left-0 top-1/2 z-10 -translate-y-1/2"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div
              className="overflow-hidden px-2 sm:px-10 touch-pan-x"
              ref={emblaRef}
            >
              <div className="flex gap-3 select-none">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setMainImage(image);
                      setSelectedIndex(index);
                    }}
                    className={`group relative min-w-[90px] overflow-hidden rounded-2xl border transition-all duration-300 ${
                      mainImage === image
                        ? "border-black shadow-lg"
                        : "border-neutral-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${image}`}
                      alt={`Thumbnail ${index}`}
                      width={100}
                      height={100}
                      className="h-[90px] w-[90px] object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </button>
                ))}
              </div>
            </div>

            <Button
              size="icon"
              variant="secondary"
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2"
              onClick={scrollNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <Dialog open={openLightbox} onOpenChange={setOpenLightbox}>
        <DialogContent className="max-w-8xl border-none bg-black/90 p-0 shadow-none">
          <div className="relative flex h-[90vh] flex-col items-center justify-center overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setOpenLightbox(false)}
              className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 text-white backdrop-blur transition hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Prev */}
            <button
              onClick={() => {
                const prev =
                  selectedIndex === 0 ? images.length - 1 : selectedIndex - 1;

                setSelectedIndex(prev);
                setMainImage(images[prev]);
              }}
              className="absolute left-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Next */}
            <button
              onClick={() => {
                const next =
                  selectedIndex === images.length - 1 ? 0 : selectedIndex + 1;

                setSelectedIndex(next);
                setMainImage(images[next]);
              }}
              className="absolute right-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/20"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Main Fullscreen Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mainImage}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="relative flex h-full w-full items-center justify-center p-10"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${mainImage}`}
                  alt="Fullscreen Product"
                  fill
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>

            {/* Bottom Thumbnails */}
            <div className="absolute bottom-4 flex max-w-full gap-3 overflow-auto px-6">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedIndex(index);
                    setMainImage(image);
                  }}
                  className={`overflow-hidden rounded-xl border-2 transition ${
                    selectedIndex === index
                      ? "border-white"
                      : "border-transparent opacity-60"
                  }`}
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${image}`}
                    alt="Thumbnail"
                    width={80}
                    height={80}
                    className="h-20 w-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
