import React from "react";

export default function Donate() {
  return (
    <section className="bg-[#f8f9fa] text-[#2c3e50]">
      <div className="w-full max-w-[900px] mx-auto px-5 py-[clamp(1.5rem,3.5vw,5rem)] donate-content">
        <h2
          id="donate-title"
          className="text-[clamp(1.5rem,3.2vw,2.5rem)] mb-3 text-center"
        >
          Support Our Mission
        </h2>

        <p
          id="donate-subtitle"
          className="text-[clamp(1rem,1.25vw,1.25rem)] text-[#555] text-center mb-10"
        >
          Choose a donation tier that works for you
        </p>

        <div className="w-full donation-table bg-white rounded-[1rem] overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.1)]">
          {/* Header row */}
          <div className="donation-row donation-header grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] border-b border-[#e9ecef] bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] text-white font-semibold">
            <div className="donation-cell p-[1.5625rem] flex items-center justify-center text-center">
              Tier
            </div>
            <div className="donation-cell p-[1.5625rem] flex items-center justify-center text-center">
              Impact
            </div>
            <div className="donation-cell p-[1.5625rem] flex items-center justify-center text-center">
              Amount
            </div>
          </div>

          {/* Rows */}
          {[
            {
              tier: "Friend",
              impact: "Supports basic program materials",
              amount: "$25",
            },
            {
              tier: "Supporter",
              impact: "Funds one workshop session",
              amount: "$100",
            },
            {
              tier: "Advocate",
              impact: "Sponsors a community event",
              amount: "$250",
            },
            {
              tier: "Champion",
              impact: "Provides full program access for one family",
              amount: "$500",
            },
            {
              tier: "Benefactor",
              impact: "Creates lasting impact with annual support",
              amount: "$1,000+",
            },
          ].map(({ tier, impact, amount }) => (
            <div
              key={tier}
              className="donation-row grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] border-b border-[#e9ecef] last:border-none hover:bg-[#f8f9fa] items-center"
            >
              <div className="donation-cell donation-tier p-[1.5625rem] flex items-center justify-center text-center font-semibold text-[#2c3e50]">
                {tier}
              </div>

              <div className="donation-cell p-[1.5625rem] flex items-center justify-center text-center text-[1.0625rem] text-[#555]">
                {impact}
              </div>

              <div className="donation-cell p-[1.5625rem] flex items-center justify-center">
                <button
                  className="donation-button bg-[#667eea] text-white border-none px-[1.875rem] py-3 rounded-full text-base font-semibold cursor-pointer w-full max-w-[10rem] transition-transform duration-300 hover:bg-[#764ba2] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(102,126,234,0.4)]"
                  aria-label={`Donate ${amount} - ${tier}`}
                >
                  {amount}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
