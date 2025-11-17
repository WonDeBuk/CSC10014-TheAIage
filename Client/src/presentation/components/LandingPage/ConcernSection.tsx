import React from "react";

// Import images from assets
import marriage from "@/assets/LandingPage/ConcernSection/marriage.jpg";
import lonely from "@/assets/LandingPage/ConcernSection/lonely.jpg";
import trauma from "@/assets/LandingPage/ConcernSection/trauma.png";
import overthinking from "@/assets/LandingPage/ConcernSection/overthinking.jpg";
import sadness from "@/assets/LandingPage/ConcernSection/sadness.jpg";
import anxiety from "@/assets/LandingPage/ConcernSection/anxiety.jpg";
import stress from "@/assets/LandingPage/ConcernSection/stress.jpg";
import relationship from "@/assets/LandingPage/ConcernSection/relationship.jpg";

type Concern = {
  title: string;
  description: string;
  image: string;
};

const CONCERNS: Concern[] = [
  {
    title: "Marriage Issues",
    description:
      "Dealing with tensions in your relationship? Feeling disconnected? Seek help from experts who can help you grow closer.",
    image: marriage,
  },
  {
    title: "Feeling Lonely",
    description:
      "Struggling to understand your emotions? Reach out to professionals who provide a supportive and encouraging environment.",
    image: lonely,
  },
  {
    title: "Trauma",
    description:
      "Having trouble identifying the roots of your triggers? Start your journey of healing and self-discovery with trained specialists.",
    image: trauma,
  },
  {
    title: "Overthinking",
    description:
      "Feeling overwhelmed by constant thoughts? Get support from experts who help you find clarity and inner peace.",
    image: overthinking,
  },
  {
    title: "Sadness",
    description:
      "Lost touch with your joyful self? Share your concerns with experts and experience emotional uplift.",
    image: sadness,
  },
  {
    title: "Anxiety",
    description:
      "Are negative thoughts distancing you from reality? Get help from professionals and see meaningful progress.",
    image: anxiety,
  },
  {
    title: "Stress",
    description:
      "Is stress affecting your daily life? Reconnect with specialists and reclaim emotional balance.",
    image: stress,
  },
  {
    title: "Relationship Problems",
    description:
      "Feeling stuck in your relationship? Experts can assist you in navigating and resolving conflicts effectively.",
    image: relationship,
  },
];

export default function ConcernsSection() {
  return (
    <section className="bg-[#f1f5f9] px-4 py-16 sm:px-6 lg:py-24">
      <div className="max-w-screen-2xl mx-auto">

        <h2 className="mb-10 text-center text-3xl 
                       sm:text-4xl lg:text-5xl 
                       font-bold text-[#0f172a]">
          We've got you covered for almost every concern
        </h2>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {CONCERNS.map((item, index) => (
            <div
              key={index}
              className="
                card-motion bg-white rounded-xl shadow-md 
                border border-blue-100 h-full
                hover:shadow-xl transition duration-300 
                p-4 sm:p-5 flex flex-col
              "
              style={{
                animationDelay: `${index * 0.1}s`,
                width: "300px",        
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                className="
                  h-40 w-full object-cover rounded-md mb-4
                  shadow-sm transition-transform duration-300 
                  hover:scale-[1.03]
                "
              />

              <h3 className="font-semibold text-xl text-[#1e293b] mb-2">
                {item.title}
              </h3>

              <p className="text-sm text-[#475569] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
