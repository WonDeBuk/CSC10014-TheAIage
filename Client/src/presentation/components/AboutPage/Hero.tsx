import React from "react";

export default function Hero() {
  return (
    <section
      className="
        w-full 
        bg-[linear-gradient(135deg,#030f46_0%,#2f005e_100%)]
        text-white 
        text-center 
        flex 
        items-center 
        justify-center
        py-[clamp(2.5rem,8vw,6rem)] 
        px-5
        min-h-[10%]
      "
    >
      <div className="hero-content max-w-[1200px]">
        <h1
          id="hero-title"
          className="
            text-[clamp(1.6rem,4.4vw,3.5rem)]
            font-bold
            tracking-[-0.02em]
            leading-[1.05]
            mb-4
          "
        >
          About Our Organization
        </h1>

        <p
          id="hero-subtitle"
          className="
            text-[clamp(1rem,1.8vw,1.5rem)]
            opacity-95
            font-light
            m-0
          "
        >
          Building a better future together
        </p>
      </div>
    </section>
  );
}
