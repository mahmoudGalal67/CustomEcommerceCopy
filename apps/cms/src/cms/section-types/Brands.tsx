"use client";

import { Brands } from "@shared/sections";
import type { BrandMarqueeProps } from "../Types";

export default function CMSBrands({ brands, title }: BrandMarqueeProps) {
  return <Brands brands={brands} title={title} />;
}
