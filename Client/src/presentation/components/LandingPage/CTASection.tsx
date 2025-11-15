type Props = { onCTA: () => void };

export function CTASection({ onCTA }: Props) {
  return (
    <section
      className="py-20 px-6 sm:px-6 lg:py-24 text-white hero-bg"
    >
      <div className="mx-auto w-full max-w-screen-2xl 
                      px-4 text-center">

        <h2 className="text-3xl sm:text-4xl text-[#26282a]
                       lg:text-5xl font-bold mb-6">
          You are not alone.
        </h2>

        <p className="text-base sm:text-lg lg:text-2xl mb-10 text-[#3c3c40a6]">
          We’re here to support your journey toward better mental health.
        </p>

        <button
          onClick={onCTA}
          className="cta-button px-8 sm:px-10 py-3 
                     sm:py-4 rounded-full text-base 
                     sm:text-lg sm:w-auto
                     font-semibold hover:opacity-90 
                     shadow-lg text-gray-600 mx-auto block"
        >
          Get started
        </button>
      </div>
    </section>
  );
}
