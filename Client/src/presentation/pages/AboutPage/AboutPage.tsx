import React, { Suspense, lazy, memo } from "react";

import NavBar from "@/presentation/components/LandingPage/NaviBar";
import Hero from "@/presentation/components/AboutPage/Hero";

// Lazy load các components không cần thiết ngay lập tức
const Mission = lazy(() => import("@/presentation/components/AboutPage/Mission"));
const Story = lazy(() => import("@/presentation/components/AboutPage/Story"));
const Team = lazy(() => import("@/presentation/components/AboutPage/Team"));
const Values = lazy(() => import("@/presentation/components/AboutPage/Values"));
const Help = lazy(() => import("@/presentation/components/AboutPage/Help"));
const Donate = lazy(() => import("@/presentation/components/AboutPage/Donate"));
const CTA = lazy(() => import("@/presentation/components/AboutPage/CTA"));
const Footer = lazy(() => import("@/presentation/components/LandingPage/Footer"));

// Fallback component cho loading
const SectionFallback = memo(() => (
  <div className="min-h-[300px] flex items-center justify-center">
    <div className="animate-pulse text-gray-400">Loading...</div>
  </div>
));
SectionFallback.displayName = "SectionFallback";

function AboutPage() {
  return (
    <main>
      <NavBar />
      <Hero />
      <Suspense fallback={<SectionFallback />}>
        <Mission />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Story />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Team />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Values />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Help />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Donate />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <CTA />
      </Suspense>
      <Suspense fallback={<div className="min-h-[200px]" />}>
        <Footer />
      </Suspense>
    </main>
  );
}

export default memo(AboutPage);
