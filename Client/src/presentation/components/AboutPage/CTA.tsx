import React from "react";

export default function CTA() {
  return (
    <section
      className="bg-[linear-gradient(135deg,#764ba2_0%,#667eea_100%)]
                 text-white text-center"
    >
      <div className="w-full max-w-[1200px] mx-auto px-5 py-[clamp(1.5rem,3.5vw,5rem)]">
        <h2 className="text-[clamp(1.5rem,3.2vw,2.5rem)] font-bold mb-5">
          Join Our Journey
        </h2>

        <p className="text-[clamp(1rem,1.25vw,1.25rem)] mb-10 opacity-95">
          Be part of something meaningful. Together, we can make a difference.
        </p>

        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white px-10 py-3 rounded-pill font-semibold text-base
                     shadow-[0_4px_15px_rgba(0,0,0,0.2)]
                     transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)]
                     text-primary"
        >
          Get Involved
        </a>
      </div>
    </section>
  );
}
