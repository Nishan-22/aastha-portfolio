"use client";

import { useEffect, useRef, useState } from "react";

function parseNumeric(raw: string): { prefix: string; value: number; suffix: string } | null {
  const match = raw.match(/^(.*?)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  return { prefix: match[1], value: parseFloat(match[2]), suffix: match[3] };
}

export default function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    const parsed = parseNumeric(value);
    const el = ref.current;
    if (!parsed || !el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        observer.unobserve(el);

        const duration = 1100;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          const current = parsed.value * eased;
          setDisplay(`${parsed.prefix}${Math.round(current)}${parsed.suffix}`);
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}