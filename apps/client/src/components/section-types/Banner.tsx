"use client";

import { Banner } from "@shared/sections";
import { useParams } from "next/navigation";

export default function ClientBanner({ slides }: any) {
  const params = useParams();
  const locale = (params.locale || "en") as string;
  return (
    <Banner
      slides={slides}
      locale={locale}
      apiUrl={process.env.NEXT_PUBLIC_URL}
    />
  );
}
