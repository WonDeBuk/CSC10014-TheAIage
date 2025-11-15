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

export default function LandingPage() {
  const [toast, setToast] = useState("");

  // useEffect smooth scroll bạn đã có, giữ nguyên
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

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".js-scroll-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target); 
          }
        });
      },
      {
        threshold: 0.15, 
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const onCTA = () => {
    setToast("Thank you! We will contact you to schedule a consultation as soon as possible.");
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="min-h-full flex flex-col">
      <NaviBar />

      <Hero onCTA={onCTA} />

      <main className="flex-grow">
        <section id="concerns">
          <ConcernSection />
        </section>

        <section id="about">
          <Features />
        </section>

        <HowItWorks />

        <section id="testimonials">
          <TestimonialsSection />
        </section>

        <section id="test">
          <FreeTestSection />
        </section>

        <CTASection onCTA={onCTA} />

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
