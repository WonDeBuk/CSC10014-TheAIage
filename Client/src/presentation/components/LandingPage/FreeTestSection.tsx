export default function FreeTestSection() {
  return (
    <section className="bg-[#f1f5f9] px-4 py-16 sm:px-6 lg:py-24">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-3xl sm:text-4xl 
                       lg:text-5xl font-bold 
                       text-[#0f172a] mb-4">
          Free emotional health test
        </h2>

        <div className="w-full h-0.5 bg-black mb-8 sm:mb-10"></div>

        <div className="flex flex-col gap-6 
                        md:gap-8 md:flex-row 
                        items-start md:items-center 
                        justify-between">

          <p className="text-[#1e293b] text-sm 
                        sm:text-base lg:text-lg 
                        leading-relaxed max-w-3xl">
            Do you think you might be suffering from sadness, anxiety, stress, or any other issue?
            Take our free emotional assessment today and find out! This quick and easy test will help
            you understand more about how you’re feeling and give you insight into what might be going on.
          </p>

          <button 
            className="
              w-full sm:w-auto
              bg-[#7dd3fc] hover:bg-[#38bdf8]
              text-gray-600 
              font-semibold text-base sm:text-lg
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
