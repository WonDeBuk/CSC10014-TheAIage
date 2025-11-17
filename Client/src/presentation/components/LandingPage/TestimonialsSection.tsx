import React from "react";

type Testimonial = {
  name: string;
  title: string;
  content: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Anna",
    title: "My comfort place",
    content:
      "I’ve found a refuge here whenever loneliness strikes. I express my thoughts and consistently get support from my therapist, creating a safe space for me. Thank you for your trust & kind words.",
  },
  {
    name: "Michael",
    title: "Extremely grateful",
    content:
      "Despite these individuals not knowing me personally, they’re always willing to listen to my rants and feelings. I’m immensely grateful for this app and the support it provides.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-screen-2xl mx-auto">

        <h2 className="text-center text-4xl font-bold text-[#0f172a] mb-12">
          Read how our users feel
        </h2>

        <div className="flex flex-wrap justify-center gap-10">
          {TESTIMONIALS.map((item, index) => (
            <article
              key={index}
              className="
                bg-white rounded-2xl shadow-lg 
                px-8 py-8 flex flex-col gap-4
              "
              style={{ width: "360px" }} 
            >
              <div className="text-[#0ea5e9] text-2xl">★★★★★</div>

              <h3 className="font-semibold text-2xl text-[#0f172a]">
                {item.title}
              </h3>

              <p className="text-[#475569] leading-relaxed text-base mb-4">
                {item.content}
              </p>

              <span className="font-semibold text-[#1e293b] text-lg">
                — {item.name}
              </span>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
