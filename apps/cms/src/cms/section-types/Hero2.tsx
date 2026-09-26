"use client";

import { Hero2 } from "@shared/sections";
import type { Hero2Props } from "../Types";

export default function CVMSHero2({
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
}: Hero2Props) {
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
      apiUrl={import.meta.env.VITE_API_URL}
    />
  );
}
