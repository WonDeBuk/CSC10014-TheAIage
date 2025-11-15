import { useEffect, useRef } from "react";

export function useReAnimateText() {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const chars = Array.from(
      el.querySelectorAll<HTMLElement>(".reveal-char")
    );

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          chars.forEach((c) => {
            c.classList.remove("animate");

            void c.offsetWidth;

            c.classList.add("animate");
          });
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
