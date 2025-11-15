import React from "react";

export default function Help() {
  return (
    <section className="bg-white text-[#2c3e50]">
      <div className="w-full max-w-[1200px] mx-auto px-5 py-[clamp(1.5rem,3.5vw,5rem)]">
        <h2
          id="help-title"
          className="text-[clamp(1.5rem,3.2vw,2.5rem)] text-center mb-[3.75rem] text-[#2c3e50]"
        >
          How Can We Help
        </h2>

        <div className="grid gap-[2.5rem] grid-cols-[repeat(auto-fit,minmax(240px,1fr))] max-w-[68.75rem] mx-auto">
          {/* Card 1 */}
          <div className="bg-[#f8f9fa] py-[2.5rem] px-[1.875rem] rounded-[0.75rem] shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(0,0,0,0.12)] text-center">
            <div className="text-[3rem] mb-[1.25rem]">🤖</div>
            <h3
              id="help-1-title"
              className="text-[1.125rem] mb-[0.9375rem] text-[#667eea]"
            >
              AI Pre-Chat
            </h3>
            <p
              id="help-1-text"
              className="text-[1.0625rem] text-[#666] leading-[1.7] m-0"
            >
              Helps users open up and share their feelings safely.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#f8f9fa] py-[2.5rem] px-[1.875rem] rounded-[0.75rem] shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(0,0,0,0.12)] text-center">
            <div className="text-[3rem] mb-[1.25rem]">📋</div>
            <h3
              id="help-2-title"
              className="text-[1.125rem] mb-[0.9375rem] text-[#667eea]"
            >
              Smart Summaries
            </h3>
            <p
              id="help-2-text"
              className="text-[1.0625rem] text-[#666] leading-[1.7] m-0"
            >
              Gives counsellors quick insights and potential risk levels for
              more effective preparation.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#f8f9fa] py-[2.5rem] px-[1.875rem] rounded-[0.75rem] shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(0,0,0,0.12)] text-center">
            <div className="text-[3rem] mb-[1.25rem]">🥼</div>
            <h3
              id="help-3-title"
              className="text-[1.125rem] mb-[0.9375rem] text-[#667eea]"
            >
              Counsellor Matching
            </h3>
            <p
              id="help-3-text"
              className="text-[1.0625rem] text-[#666] leading-[1.7] m-0"
            >
              Connects each user to the most suitable counsellor based on
              availability.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-[#f8f9fa] py-[2.5rem] px-[1.875rem] rounded-[0.75rem] shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(0,0,0,0.12)] text-center">
            <div className="text-[3rem] mb-[1.25rem]">💻</div>
            <h3
              id="help-4-title"
              className="text-[1.125rem] mb-[0.9375rem] text-[#667eea]"
            >
              Insight Dashboard
            </h3>
            <p
              id="help-4-text"
              className="text-[1.0625rem] text-[#666] leading-[1.7] m-0"
            >
              Tracks emotional patterns and progress.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-[#f8f9fa] py-[2.5rem] px-[1.875rem] rounded-[0.75rem] shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(0,0,0,0.12)] text-center">
            <div className="text-[3rem] mb-[1.25rem]">💬</div>
            <h3
              id="help-5-title"
              className="text-[1.125rem] mb-[0.9375rem] text-[#667eea]"
            >
              24/7 Access
            </h3>
            <p
              id="help-5-text"
              className="text-[1.0625rem] text-[#666] leading-[1.7] m-0"
            >
              Always available when users need to talk - anytime, anywhere.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-[#f8f9fa] py-[2.5rem] px-[1.875rem] rounded-[0.75rem] shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(0,0,0,0.12)] text-center">
            <div className="text-[3rem] mb-[1.25rem]">🦾</div>
            <h3
              id="help-6-title"
              className="text-[1.125rem] mb-[0.9375rem] text-[#667eea]"
            >
              Team Support Tools
            </h3>
            <p
              id="help-6-text"
              className="text-[1.0625rem] text-[#666] leading-[1.7] m-0"
            >
              Eases counsellors’ workloads at scale and offer proactive
              emotional support to their communities.
            </p>
          </div>

          {/* Card 7 */}
          <div className="bg-[#f8f9fa] py-[2.5rem] px-[1.875rem] rounded-[0.75rem] shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(0,0,0,0.12)] text-center">
            <div className="text-[3rem] mb-[1.25rem]">🧷</div>
            <h3 className="text-[1.125rem] mb-[0.9375rem] text-[#667eea]">
              Crisis Alerts
            </h3>
            <p className="text-[1.0625rem] text-[#666] leading-[1.7] m-0">
              Flags early signs of distress for quick action, ensuring timely
              support and intervention.
            </p>
          </div>

          {/* Card 8 */}
          <div className="bg-[#f8f9fa] py-[2.5rem] px-[1.875rem] rounded-[0.75rem] shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(0,0,0,0.12)] text-center">
            <div className="text-[3rem] mb-[1.25rem]">⛓</div>
            <h3 className="text-[1.125rem] mb-[0.9375rem] text-[#667eea]">
              Continuous Learning
            </h3>
            <p className="text-[1.0625rem] text-[#666] leading-[1.7] m-0">
              Improves empathy and accuracy over time with every interaction.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
