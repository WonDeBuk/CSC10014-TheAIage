import hero_illustration from "@/assets/LandingPage/HeroSection/hero_illustration.png";

type Props = { onCTA: () => void };
export function Hero({ onCTA }: Props) {
  return (
    <header className="text-white py-20 px-6"
            style={{background:"linear-gradient(135deg,#ffc2e8 0%,#000b3d 100%)"}}>
      <div className="mx-auto w-full max-w-screen-2xl px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-in-up text-center md:text-left md:-translate-x-20">
          <h1 id="hero-title" className="hero-motion-title text-6xl md:text-6xl font-bold mb-10 leading-tight">
            Supporting student mental health
          </h1>
          <div className="hero-motion-subtitle mx-auto md:mx-0 h-0.5 w-200 bg-white/80 rounded-full mb-6" />
          <p id="hero-subtitle" className="text-xl md:text-3xl mb-10 text-gray-100">
            Improve your emotional well-being with online therapy from licensed therapists, live peer support, mental health tests.
          </p>
          <button id="cta-button"
                  className="hero-motion-button cta-button px-10 py-4 rounded-full text-2xl font-semibold hover:opacity-90 shadow-lg bg-white text"
                  onClick={onCTA}>
            Free mental health assessment
          </button>
        </div>
        <div className="flex justify-center md:justify-end">
          <div className="scale-[1.5] transition-transform duration-500 hover:scale-[1.6]">
            <img
              src={hero_illustration}
              alt="Hero illustration"
              className="hero-motion-image w-3/4 md:w-[85%] h-auto object-contain drop-shadow-2xl rounded-xl ml-20"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
