"use client";

import { Brands } from "@shared/sections";
import { useParams } from "next/navigation";

export default function ClientBrands({ brands, title }: any) {
  const params = useParams();
  const locale = (params.locale || "en") as string;
  return <Brands brands={brands} title={title} locale={locale} />;
}
