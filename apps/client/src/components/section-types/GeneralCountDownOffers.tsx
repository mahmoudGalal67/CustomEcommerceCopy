"use client";

import { GeneralCountdownOffers } from "@shared/sections";
import { useParams } from "next/navigation";

export default function GeneralCountdownOffer(props: any) {
  const params = useParams();
  const locale = (params.locale || "en") as string;
  return <GeneralCountdownOffers {...props} locale={locale} />;
}
