import { useEffect, useState, Suspense, lazy, memo, useCallback } from "react";
import "@/presentation/styles/landing.css";
import NaviBar from "@/presentation/components/LandingPage/NaviBar";
import { Hero } from "@/presentation/components/LandingPage/Hero";
import { ScrollReveal } from "@/presentation/components/LandingPage/ScrollReveal";

// Lazy load các components không cần thiết ngay lập tức
const Features = lazy(() => 
  import("@/presentation/components/LandingPage/Features").then(m => ({ default: m.Features }))
);
const CTASection = lazy(() => 
  import("@/presentation/components/LandingPage/CTASection").then(m => ({ default: m.CTASection }))
);
const Footer = lazy(() => 
  import("@/presentation/components/LandingPage/Footer")
);
const HowItWorks = lazy(() => 
  import("@/presentation/components/LandingPage/HowItWorks").then(m => ({ default: m.HowItWorks }))
);
const ConcernSection = lazy(() => 
  import("@/presentation/components/LandingPage/ConcernSection")
);
const TestimonialsSection = lazy(() => 
  import("@/presentation/components/LandingPage/TestimonialsSection")
);
const FreeTestSection = lazy(() => 
  import("@/presentation/components/LandingPage/FreeTestSection")
);

// Fallback component cho loading
const SectionFallback = memo(() => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="animate-pulse text-gray-400">Loading...</div>
  </div>
));
SectionFallback.displayName = "SectionFallback";

// Memoize LandingPage để tránh re-render không cần thiết
function LandingPage() {
  const [toast, setToast] = useState("");

  useEffect(() => {
    const handler = (e: Event) => {
      const a = e.target as HTMLAnchorElement;
      const href = a?.getAttribute?.("href") ?? "";

      if (a?.tagName === "A" && href.startsWith("#")) {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Memoize callback để tránh re-render children
  const onCTA = useCallback(() => {
    setToast(
      "Thank you! We will contact you to schedule a consultation as soon as possible."
    );
    setTimeout(() => setToast(""), 3000);
  }, []);

  return (
    <div className="min-h-full flex flex-col">
      <div className="pointer-events-none absolute top-6 left-0 right-0 flex justify-center z-30">
        <div className="pointer-events-auto">
          <NaviBar />
        </div>
      </div>

      <Hero onCTA={onCTA} />

      <main className="flex-grow">
        <ScrollReveal>
          <section id="concerns">
            <Suspense fallback={<SectionFallback />}>
            <ConcernSection />
            </Suspense>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="about">
            <Suspense fallback={<SectionFallback />}>
            <Features />
            </Suspense>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <Suspense fallback={<SectionFallback />}>
          <HowItWorks />
          </Suspense>
        </ScrollReveal>

        <ScrollReveal>
          <section id="testimonials">
            <Suspense fallback={<SectionFallback />}>
            <TestimonialsSection />
            </Suspense>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="test">
            <Suspense fallback={<SectionFallback />}>
            <FreeTestSection />
            </Suspense>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <Suspense fallback={<SectionFallback />}>
          <CTASection onCTA={onCTA} />
          </Suspense>
        </ScrollReveal>
      </main>

      <Suspense fallback={<div className="min-h-[200px]" />}>
      <Footer />
      </Suspense>

      {toast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity">
          {toast}
        </div>
      )}
    </div>
  );
}

export default memo(LandingPage);
