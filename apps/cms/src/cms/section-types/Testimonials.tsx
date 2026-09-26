"use client";

import { Testimonials } from "@shared/sections";
import type { TestimonialsProps } from "../Types";

export default function CMSTestimonials(props: TestimonialsProps) {
  return <Testimonials testimonialsData={props} />;
}
