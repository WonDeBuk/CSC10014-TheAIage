import { useReAnimateText } from "@/presentation/hooks/useReAnimateText";

export function AnimatedText({ text }: { text: string }) {
  const ref = useReAnimateText();

  return (
    <span ref={ref} className="animated-text-wrapper inline-block">
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="reveal-char"
          style={{ animationDelay: `${i * 0.04}s` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}
