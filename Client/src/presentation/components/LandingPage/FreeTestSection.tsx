export default function FreeTestSection() {
  return (
    <section className="py-20 px-6 bg-[#f1f5f9]">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-5xl md:text-5xl font-bold text-[#0f172a] mb-4">
          Free emotional health test
        </h2>

        <div className="w-full h-0.5 bg-black mb-10"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

          <p className="text-[#1e293b] text-2xl leading-relaxed max-w-3xl">
            Do you think you might be suffering from sadness, anxiety, stress, or any other issue?
            Take our free emotional assessment today and find out! This quick and easy test will help
            you understand more about how you’re feeling and give you insight into what might be going on.
          </p>

          <button 
            className="
              bg-[#7dd3fc] hover:bg-[#38bdf8]
              text-white font-semibold text-lg
              px-12 py-4 rounded-full
              transition-all duration-200 shadow-md
            ">
            Begin Test
          </button>
        </div>
      </div>
    </section>
  );
}
