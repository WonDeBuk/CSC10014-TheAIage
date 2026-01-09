import NaviBar from "@/presentation/components/LandingPage/NaviBar";
import Footer from "@/presentation/components/LandingPage/Footer";
import PersonalProfile from "@/presentation/components/PersonalPage/PersonalProfile";
import "@/presentation/styles/landing.css";

export default function PersonalPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <div className="pointer-events-none absolute top-6 left-0 right-0 flex justify-center z-30">
                <div className="pointer-events-auto w-full flex justify-center">
                    <NaviBar />
                </div>
            </div>

            <main className="flex-1 w-full">
                <PersonalProfile />
            </main>

            <Footer />
        </div>
    );
}

