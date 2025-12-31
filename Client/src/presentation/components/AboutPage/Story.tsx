import React from "react";

export default function Story() {
  return (
    <section className="bg-white">
      <div
        className="
          max-w-[56.25rem] 
          mx-auto 
          px-5 
          py-[clamp(1.5rem,3.5vw,5rem)]
        "
      >
        <h2
          id="story-title"
          className="
            text-[clamp(1.5rem,3.2vw,2.5rem)]
            mb-[1.875rem]
            text-center
            text-[#2c3e50]
          "
        >
          Our Story
        </h2>

        <p
          id="story-text"
          className="
            text-[clamp(0.95rem,1.15vw,1.15rem)]
            leading-[1.9]
            text-[#555]
            mb-5
          "
        >
          VoyAIage began with a simple question:{" "}
          <i>
            What if technology could help people open up before they meet a
            counsellor?
          </i>
        </p>

        <p
          className="
            text-[clamp(0.95rem,1.15vw,1.15rem)]
            leading-[1.9]
            text-[#555]
            mb-5
          "
        >
          As developers and advocates for mental well-being, we saw how
          counsellors often spend precious time gathering background information
          instead of focusing on care.
        </p>

        <p
          className="
            text-[clamp(0.95rem,1.15vw,1.15rem)]
            leading-[1.9]
            text-[#555]
            mb-5
          "
        >
          So, we built <b>VoyAIage</b> — a platform where users can chat with an
          intelligent, empathetic chatbot that listens, guides, and summarizes
          their stories. The chatbot collects relevant information about
          emotions, challenges, and context, then provides counsellors with
          clear insights — including <b>potential risk levels</b>, <b>themes</b>
          , and <b>key patterns</b> — before the session begins.
        </p>

        <p
          className="
            text-[clamp(0.95rem,1.15vw,1.15rem)]
            leading-[1.9]
            text-[#555]
            m-0
          "
        >
          This way, users feel heard sooner, and counsellors can focus on what
          they do best: <b>helping people heal</b>.
        </p>
      </div>
    </section>
  );
}
