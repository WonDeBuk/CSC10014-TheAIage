import React from "react";

import NavBar from "@/presentation/components/LandingPage/NaviBar";
import Hero from "@/presentation/components/AboutPage/Hero";
import Mission from "@/presentation/components/AboutPage/Mission";
import Story from "@/presentation/components/AboutPage/Story";
import Team from "@/presentation/components/AboutPage/Team";
import Values from "@/presentation/components/AboutPage/Values";
import Help from "@/presentation/components/AboutPage/Help";
import Donate from "@/presentation/components/AboutPage/Donate";
import CTA from "@/presentation/components/AboutPage/CTA";
import Footer from "@/presentation/components/LandingPage/Footer";

export default function AboutPage() {
  return (
    <main>
      <NavBar />
      <Hero />
      <Mission />
      <Story />
      <Team />
      <Values />
      <Help />
      <Donate />
      <CTA />
      <Footer />
    </main>
  );
}
