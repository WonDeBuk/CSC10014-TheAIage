import React from "react";

export default function Values() {
  return (
    <section className="bg-[#f8f9fa] text-[#2c3e50]">
      <div className="w-full max-w-[1200px] mx-auto px-5 py-[clamp(1.5rem,3.5vw,5rem)]">
        <h2
          id="values-title"
          className="text-[clamp(1.5rem,3.2vw,2.5rem)] mb-[3.75rem] text-center text-[#2c3e50]"
        >
          Our Values
        </h2>

        <div className="grid gap-[2.5rem] grid-cols-[repeat(auto-fit,minmax(240px,1fr))] max-w-[68.75rem] mx-auto">
          <div className="bg-white p-[2.5rem_1.875rem] rounded-[0.75rem] shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(0,0,0,0.12)] text-center">
            <div className="text-[3rem] mb-[1.25rem]">🎯</div>
            <h3
              id="value-1-title"
              className="text-[1.125rem] mb-[0.9375rem] text-[#667eea]"
            >
              Empathy First
            </h3>
            <p
              id="value-1-text"
              className="text-[1.0625rem] text-[#666] leading-[1.7] m-0"
            >
              Every design choice and line of code reflects our respect for
              human emotions. We aim to build technology that feels supportive,
              not mechanical.
            </p>
          </div>

          <div className="bg-white p-[2.5rem_1.875rem] rounded-[0.75rem] shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(0,0,0,0.12)] text-center">
            <div className="text-[3rem] mb-[1.25rem]">💡</div>
            <h3
              id="value-2-title"
              className="text-[1.125rem] mb-[0.9375rem] text-[#667eea]"
            >
              Privacy & Trust
            </h3>
            <p
              id="value-2-text"
              className="text-[1.0625rem] text-[#666] leading-[1.7] m-0"
            >
              We protect users’ data as carefully as we protect their stories.
              Transparency, confidentiality, and respect are the cornerstones of
              everything we do.
            </p>
          </div>

          <div className="bg-white p-[2.5rem_1.875rem] rounded-[0.75rem] shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(0,0,0,0.12)] text-center">
            <div className="text-[3rem] mb-[1.25rem]">🤝</div>
            <h3
              id="value-3-title"
              className="text-[1.125rem] mb-[0.9375rem] text-[#667eea]"
            >
              Collaboration Over Automation
            </h3>
            <p
              id="value-3-text"
              className="text-[1.0625rem] text-[#666] leading-[1.7] m-0"
            >
              VoyAIage doesn’t replace counsellors — it strengthens them. Our
              system is built to enhance human connection, not replace it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
