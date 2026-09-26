import { Hero } from "@shared/sections";

export default function ClientHero({ title, subtitle, bg }: any) {
  return (
    <Hero
      title={title}
      subtitle={subtitle}
      bg={bg}
      apiUrl={process.env.NEXT_PUBLIC_URL}
    />
  );
}
