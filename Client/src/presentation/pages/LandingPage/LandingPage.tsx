import { useEffect, useState } from "react";
import "@/presentation/styles/landing.css";
import NaviBar from "@/presentation/components/LandingPage/NaviBar";
import { Hero } from "@/presentation/components/LandingPage/Hero";
import { Features } from "@/presentation/components/LandingPage/Features";
import { CTASection } from "@/presentation/components/LandingPage/CTASection";
import Footer from "@/presentation/components/LandingPage/Footer";
import { HowItWorks } from "@/presentation/components/LandingPage/HowItWorks";
import ConcernSection from "@/presentation/components/LandingPage/ConcernSection";
import TestimonialsSection from "@/presentation/components/LandingPage/TestimonialsSection";
import FreeTestSection from "@/presentation/components/LandingPage/FreeTestSection";
import { ScrollReveal } from "@/presentation/components/LandingPage/ScrollReveal";

export default function LandingPage() {
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

  const onCTA = () => {
    setToast(
      "Thank you! We will contact you to schedule a consultation as soon as possible."
    );
    setTimeout(() => setToast(""), 3000);
  };

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
            <ConcernSection />
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="about">
            <Features />
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <HowItWorks />
        </ScrollReveal>

        <ScrollReveal>
          <section id="testimonials">
            <TestimonialsSection />
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="test">
            <FreeTestSection />
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <CTASection onCTA={onCTA} />
        </ScrollReveal>
      </main>

      <Footer />

      {toast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity">
          {toast}
        </div>
      )}
    </div>
  );
}
