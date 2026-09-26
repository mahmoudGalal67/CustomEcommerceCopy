"use client";

import { Features } from "@shared/sections";
import { useParams } from "next/navigation";

export default function ClientFeatures(props: any) {
  const params = useParams();
  const locale = (params.locale || "en") as string;
  return <Features {...props} locale={locale} />;
}
