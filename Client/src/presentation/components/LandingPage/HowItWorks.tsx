export function HowItWorks() {
  return (
    <section className="py-20 px-6 bg-[#f1f5f9] sm:px-6 lg:py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold 
                       text-center mb-4 text-gray-800">
          How the consultation works
        </h2>
        
        <p className="text-center text-gray-600 
                      mb-12 sm:mb-16 text-base sm:text-lg">
          Get started in 3 easy steps
        </p>

        <div className="grid gap-8 sm:gap-10 
                        md:grid-cols-3">

          <div className="text-center">

            <div className="h-16 w-16 sm:h-20 sm:w-20 bg-pink-100 
                            rounded-full flex items-center 
                            justify-center mx-auto mb-6">

              <span className="text-2xl sm:text-3xl 
                               font-bold text-pink-600">1</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-800">
              Create an account
            </h3>
            
            <p className="text-sm sm:text-base text-gray-600">
              Chat with our AI assistant for an initial check-in before we connect you with a qualified counsellor.
            </p>
          </div>

          <div className="text-center">

            <div className="h-16 w-16 sm:h-20 sm:w-20 bg-pink-100 rounded-full 
                            flex items-center justify-center mx-auto mb-6">

              <span className="text-2xl sm:text-3xl 
                               font-bold text-pink-600">2</span>

            </div>
            <h3 className="text-lg sm:text-xl 
                           font-bold mb-3 text-gray-800">
              Connection
            </h3>

            <p className="text-sm sm:text-base text-gray-600">
              We’ll match you with the counsellor who best fits your needs.
            </p>

          </div>

          <div className="text-center">
            <div className="h-16 w-16 sm:h-20 sm:w-20 
                            bg-pink-100 rounded-full flex 
                            items-center justify-center 
                            mx-auto mb-6">

              <span className="text-2xl sm:text-3xl 
                               font-bold text-pink-600">3</span>
            </div>
            <h3 className="text-lg sm:text-xl 
                           font-bold mb-3 
                           text-gray-800">
                Consultation
            </h3>

            <p className="text-sm sm:text-base text-gray-600">
              Start your consultation and receive professional support
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
