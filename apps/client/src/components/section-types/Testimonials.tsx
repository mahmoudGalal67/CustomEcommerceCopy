"use client";

import { Testimonials } from "@shared/sections";
import { useParams } from "next/navigation";

export default function ClientTestimonials(props: any) {
  const params = useParams();
  const locale = (params.locale || "en") as string;
  return <Testimonials testimonialsData={props} locale={locale} />;
}
