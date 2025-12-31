import React from "react";

export default function Team() {
  return (
    <section className="bg-white">
      <div className="w-full max-w-[1200px] mx-auto px-5 py-[clamp(1.5rem,3.5vw,5rem)]">
        <h2
          id="team-title"
          className="
            text-[clamp(1.5rem,3.2vw,2.5rem)]
            mb-[3.75rem]
            text-center
            text-[#2c3e50]
          "
        >
          Our Team
        </h2>

        <div
          className="
            grid 
            gap-[2.5rem] 
            grid-cols-[repeat(auto-fit,minmax(220px,1fr))] 
            max-w-[68.75rem] 
            mx-auto
          "
        >
          {[
            { name: "Dat Pham", role: "Developer" },
            { name: "Phong Trinh", role: "Developer" },
            { name: "Hien Tran", role: "Developer" },
            { name: "Long Truong", role: "Developer" },
            { name: "Nam Lai", role: "Developer" },
            { name: "Phuc Nguyen", role: "Developer" },
            { name: "Trinh Nguyen", role: "Developer" },
            { name: "Vinh Nguyen", role: "Developer" },
          ].map((member, i) => (
            <div
              key={i}
              className="
                bg-[#f8f9fa]
                p-[2.5rem_1.875rem]
                rounded-[0.75rem]
                shadow-[0_4px_6px_rgba(0,0,0,0.07)]
                transition-transform
                duration-300
                hover:-translate-y-[5px]
                hover:shadow-[0_8px_15px_rgba(0,0,0,0.12)]
                text-center
                min-w-0
              "
            >
              <div
                className="
                  w-[7.5rem]
                  h-[7.5rem]
                  rounded-full
                  mx-auto
                  mb-[1.25rem]
                  flex
                  items-center
                  justify-center
                  text-[2.25rem]
                  text-white
                  bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]
                  flex-shrink-0
                "
              >
                👤
              </div>

              <h3
                className="
                  text-[1.5rem]
                  text-[#2c3e50]
                  mb-[0.625rem]
                "
                id={`team-${i + 1}-name`}
              >
                {member.name}
              </h3>

              <p
                className="
                  text-[1.0625rem]
                  text-[#667eea]
                  font-medium
                  m-0
                "
                id={`team-${i + 1}-role`}
              >
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
