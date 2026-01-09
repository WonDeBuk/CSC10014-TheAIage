
import "@/presentation/styles/landing.css";
import NaviBar from "@/presentation/components/LandingPage/NaviBar";
import Footer from "@/presentation/components/LandingPage/Footer";
import TestSelection from "@/presentation/components/TestPage/TestSelection";

export default function TestPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="pointer-events-none absolute top-6 left-0 right-0 flex justify-center z-30">
        <div className="pointer-events-auto">
          <NaviBar />
        </div>
      </div>

      <main className="grow">
        <TestSelection />
      </main>
      <Footer />
    </div>
  );
}
