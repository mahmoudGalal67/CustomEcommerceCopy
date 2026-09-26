"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedCounterProps = {
  value: string;
  duration?: number;
};

export default function AnimatedCounter({
  value,
  duration = 1500,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const match = value.match(/^([\d,.]+)(.*)$/);

    // If the value isn't numeric, just display it normally
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const target = Number(match[1].replace(/,/g, ""));
    const suffix = match[2];

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;

        hasAnimated.current = true;

        const startTime = performance.now();

        const animate = (currentTime: number) => {
          const progress = Math.min((currentTime - startTime) / duration, 1);

          // Smooth ease-out animation
          const easedProgress = 1 - Math.pow(1 - progress, 3);

          const currentValue = Math.floor(easedProgress * target);

          setDisplayValue(currentValue.toLocaleString() + suffix);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setDisplayValue(target.toLocaleString() + suffix);
          }
        };

        requestAnimationFrame(animate);
      },
      {
        threshold: 0.3,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{displayValue}</span>;
}
