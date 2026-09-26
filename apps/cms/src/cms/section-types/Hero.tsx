import { useCMS } from "../store";
import type { HeroProps } from "../Types";
import { Hero } from '@shared/sections'

/* ------------------------------------------------------------------ */
/* Props */
/* ------------------------------------------------------------------ */

interface HeroComponentProps extends HeroProps {
  id: string;
}

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function CMSHero({ title, subtitle, bg, id }: HeroComponentProps) {
  const { selectedSection, updateProp } = useCMS();

  const active = selectedSection?.id === id;

  return (
    <Hero
      bg={bg}
      title={
        active ? (
          <input
            className="w-full block text-center bg-transparent outline-none text-3xl font-semibold tracking-tight text-balance text-white sm:text-5xl"
            value={title}
            onChange={(e) =>
              updateProp(id, "title", e.target.value)
            }
          />
        ) : (
          title
        )
      }
      subtitle={
        active ? (
          <input
            className="w-full block text-center bg-transparent outline-none text-xl  text-balance text-white sm:text-2xl"
            value={subtitle}
            onChange={(e) =>
              updateProp(id, "subtitle", e.target.value)
            }
          />
        ) : (
          subtitle
        )
      }
    />
  );
}




