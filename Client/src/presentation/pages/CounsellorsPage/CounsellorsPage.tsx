import React, { useState } from "react";
import CounsellorCards from "@/presentation/components/CounsellorsPage/CounsellorCards";
import NavBar from "@/presentation/components/LandingPage/NaviBar";
import Footer from "@/presentation/components/LandingPage/Footer";

export default function CounsellorsPage() {
  return (
    <div className="min-h-full flex flex-col">
      <div className="pointer-events-none absolute top-6 left-0 right-0 flex justify-center z-30">
        <div className="pointer-events-auto">
          <NavBar />
        </div>
      </div>
      <main className="grow">
        <CounsellorCards />
      </main>
      <Footer />
    </div>
  );
}