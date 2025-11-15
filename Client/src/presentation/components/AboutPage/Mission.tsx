import React from "react";

export default function Mission() {
  return (
    <section className="bg-[#f8f9fa]">
      <div
        className="
          max-w-[50rem] 
          mx-auto 
          text-center 
          px-5 
          py-[clamp(1.5rem,3.5vw,5rem)]
        "
      >
        <h2
          id="mission-title"
          className="
            text-[clamp(1.5rem,3.2vw,2.5rem)] 
            mb-[1.875rem] 
            text-[#667eea]
          "
        >
          Our Mission
        </h2>

        <p
          id="mission-text"
          className="
            text-[clamp(1rem,1.25vw,1.25rem)] 
            leading-[1.8] 
            text-[#555] 
            mb-5
          "
        >
          We believe that no one should struggle alone. VoyAIage helps people
          take their first step toward support through safe, guided
          conversations powered by AI and human empathy.
        </p>

        <p
          className="
            text-[clamp(1rem,1.25vw,1.25rem)] 
            leading-[1.8] 
            text-[#555]
            m-0
          "
        >
          Our mission is to make mental health care more accessible, efficient,
          and human-centered – using AI to reduce counsellors’ workload while
          ensuring every individual receives thoughtful, personalized attention.
        </p>
      </div>
    </section>
  );
}
