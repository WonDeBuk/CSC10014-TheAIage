import hero_illustration from "@/assets/LandingPage/HeroSection/hero_illustration.png";
import { AnimatedText } from "./AnimatedText";

type Props = { onCTA: () => void };
export function Hero({ onCTA }: Props) {
  return (
    <header className="text-white px-4 py-16 sm:px-6 md:py-24 hero-bg w-1vw">

      <div className="mx-auto w-full 
                      max-w-screen-2xl 
                      px-6 py-20 
                      grid md:grid-cols-2 
                      gap-12 items-center">

        <div className="animate-fade-in-up 
                        text-center md:text-left 
                        px-2 md:px-0 md:order-1">

          <h1
            id="hero-title"
            className="hero-motion-title text-[#26282a]
                       text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
                       mb-6 md:mb-10 font-bold leading-tight"
          >
            <AnimatedText text="Supporting student"/>
            <AnimatedText text="mental health"/>
          </h1>

          <p id="hero-subtitle" className="text-base sm:text-lg md:text-2xl 
                                           mb-8 md:mb-10 text-[#3c3c40a6]
                                           max-w-xl font-mono
                                           mx-auto md:mx-0">
            Improve your emotional well-being with online therapy from licensed therapists, live peer support, mental health tests.
          </p>

          <button id="cta-button"
                  className="hero-motion-button cta-button
                             inline-flex items-center justify-center
                             w-full sm:w-auto 
                             px-10 py-4 rounded-full 
                             text-base sm:text-lg md:text-xl
                             font-semibold hover:opacity-90 shadow-lg 
                             text-gray-600"
                  onClick={onCTA}>
            Free mental health assessment
          </button>

        </div>
        <div className="order-1 md:order-2 flex justify-center md:justify-end">
          <div className="md:scale-[1.5] 
                          transition-transform duration-500 
                          md:hover:scale-[1.6]">
            <img
              src={hero_illustration}
              alt="Hero illustration"
              className="hero-motion-image w-3/4 
                         max-w-sm sm:max-w-md 
                         md:w-[85%] h-auto object-contain 
                         drop-shadow-2xl rounded-xl scale-120"
            />

          </div>
        </div>
      </div>
    </header>
  );
}
