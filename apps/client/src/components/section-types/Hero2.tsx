"use client";

import { Hero2 } from "@shared/sections";
import { useParams } from "next/navigation";

export default function ClientHero2({
  badge,
  titleLine1,
  titleHighlight,
  titleLine3,
  description,
  primaryButton,
  secondaryButton,
  stats,
  featuredProduct,
  miniProduct,
  reviews,
  shipping,
}: any) {
  const params = useParams();
  const locale = (params.locale || "en") as string;
  return (
    <Hero2
      badge={badge}
      titleLine1={titleLine1}
      titleHighlight={titleHighlight}
      titleLine3={titleLine3}
      description={description}
      primaryButton={primaryButton}
      secondaryButton={secondaryButton}
      stats={stats}
      featuredProduct={featuredProduct}
      miniProduct={miniProduct}
      reviews={reviews}
      shipping={shipping}
      apiUrl={process.env.NEXT_PUBLIC_URL}
      locale={locale}
    />
  );
}
