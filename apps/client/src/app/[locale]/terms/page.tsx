import { notFound } from "next/navigation";
import TermsPageClient from "./TermsPageClient";

async function getFeatures() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${apiUrl}/api/features`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Failed to load features:", error);
    return null;
  }
}

export default async function TermsPage() {
  const features = await getFeatures();

  if (features?.show_terms_page === false) {
    notFound();
  }

  return <TermsPageClient />;
}
