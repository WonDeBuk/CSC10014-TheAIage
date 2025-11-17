import { ReactNode } from "react";
import { useScrollAnimation } from "@/presentation/hooks/useScrollAnimation";

type Props = {
  children: ReactNode;
  className?: string;
};

export function ScrollReveal({ children, className = "" }: Props) {
  const ref = useScrollAnimation(); 

  return (
    <div ref={ref} className={`js-scroll-reveal ${className}`}>
      {children}
    </div>
  );
}
