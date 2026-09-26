"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useParams } from "next/navigation";

export default function ScrollButton() {
  const [atBottom, setAtBottom] = useState(false);
  const [visible, setVisible] = useState(false);

  const params = useParams();
  const locale = (params.locale || "en") as string;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      setVisible(scrollTop > 250);

      setAtBottom(scrollTop + viewportHeight >= documentHeight - 100);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scroll = () => {
    window.scrollTo({
      top: atBottom ? 0 : document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scroll}
      aria-label={atBottom ? "Back to top" : "Go to bottom"}
      className={`
        fixed
        bottom-6
        right-[120px]
        z-50

        group
        flex
        items-center
        gap-2

        rounded-full
        border
        border-border/60

        bg-background/80
        px-4
        py-3

        text-sm
        font-medium
        text-foreground

        shadow-xl
        backdrop-blur-xl

        transition-all
        duration-300
        ease-out

        hover:-translate-y-1
        hover:shadow-2xl
        active:translate-y-0
        active:scale-95

        ${
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-8 opacity-0"
        }
      `}
    >
      {/* Icon */}
      <span
        className="
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-full
          bg-primary
          text-primary-foreground
          transition-transform
          duration-300
          group-hover:scale-110
        "
      >
        {atBottom ? (
          <ArrowUp
            className="
              h-4
              w-4
              transition-transform
              duration-300
              group-hover:-translate-y-0.5
            "
          />
        ) : (
          <ArrowDown
            className="
              h-4
              w-4
              transition-transform
              duration-300
              group-hover:translate-y-0.5
            "
          />
        )}
      </span>

      {/* Label */}
      <span
        className="
          hidden
          sm:block
          whitespace-nowrap
        "
      >
        {atBottom
          ? locale == "ar"
            ? "العودة إلى الأعلى"
            : "Back to top"
          : locale == "ar"
            ? "انتقل إلى الأسفل"
            : "Go to bottom"}
      </span>
    </button>
  );
}
