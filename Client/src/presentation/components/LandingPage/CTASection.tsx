type Props = { onCTA: () => void };

export function CTASection({ onCTA }: Props) {
  return (
    <section
      className="py-20 px-6 text-white"
      style={{ background: "linear-gradient(135deg,#ffc2e8 0%,#000b3d 100%)" }}
    >
      <div className="mx-auto w-full max-w-screen-2xl px-4 text-center">
        <h2 className="text-5xl font-bold mb-6">You are not alone.</h2>
        <p className="text-3xl mb-10 text-gray-100">
          We’re here to support your journey toward better mental health.
        </p>

        <button
          onClick={onCTA}
          className="cta-button px-10 py-4 rounded-full text-lg font-semibold hover:opacity-90 shadow-lg bg-white text mx-auto block"
        >
          Get started
        </button>
      </div>
    </section>
  );
}
