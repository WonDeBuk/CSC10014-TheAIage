import consultationIcon from "@/assets/LandingPage/FeaturesSection/consultation.png";
import securityIcon from "@/assets/LandingPage/FeaturesSection/security.png";
import expertIcon from "@/assets/LandingPage/FeaturesSection/expert.png";

export function Features() {
  const items = [
    {
      title: "Online consultation",
      desc: "Connect with certified specialists via video call, chat, or phone.",
      img: consultationIcon,
    },
    {
      title: "Complete confidentiality",
      desc: "Your personal information is fully encrypted and securely protected.",
      img: securityIcon,
    },
    {
      title: "Trusted professionals",
      desc: "A team of certified experts with years of experience.",
      img: expertIcon,
    },
  ];

  return (
    <section id="features" className="py-20 px-6 bg-white sm:px-6 lg:py-24">
      <div className="mx-auto w-full max-w-screen-2xl px-4">
        <h2 className="text-3xl sm:text-4xl 
                       lg:text-5xl font-bold 
                       text-center mb-4 text-gray-800">
          Why choose TheAIage?
        </h2>

        <p className="text-center text-gray-600 sm:mb-16 text-lg">
          Comprehensive support for your mental well-being
        </p>

        {/* ĐỔI GRID → FLEX + WRAP + JUSTIFY-CENTER */}
        <div className="flex flex-wrap justify-center 
                        gap-8 sm:gap-10">
          {items.map((f, i) => (
            <div
              key={i}
              className="
                feature-card
                bg-white rounded-xl shadow-lg
                p-6 sm:p-8 
                flex flex-col items-center text-center
              "
              style={{ width: "280px" }} 
            >
              <div className="flex w-20 h-20 rounded-full 
                              items-center justify-center 
                              mb-6 overflow-hidden">
                <img
                  src={f.img}
                  alt={f.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <h3 className="text-xl font-bold mb-4 text-gray-800">
                {f.title}
              </h3>
              <p className="text-base text-gray-600 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
