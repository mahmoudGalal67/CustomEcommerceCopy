"use client";

import { Features } from "@shared/sections";
import type { FeaturesDataProps } from "../Types";

export default function CMSFeatures(props: FeaturesDataProps) {
  return <Features {...props} />;
}
