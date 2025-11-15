import logo from "@/assets/LandingPage/HeroSection/logo.png";

export default function NavBar() {
  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-center flex justify-between">
      <div className="mx-auto w-full max-w-screen-2xl flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <a href="/" className="block">
            <img
              src={logo}
              alt="logo"
              className="ml-20 transform scale-[5] w-auto h-12"
            />
          </a>
        </div>

        <div className="flex items-center space-x-6 ml-50">
          <a
            href="/about"
            className="inline-block font-medium text-black! visited:text-black! hover:text-purple-600 transform hover:scale-105">
            About Us
          </a>

          <a
            href="/counsellors" 
            className="inline-block font-medium text-black! visited:text-black! hover:text-purple-600 transform hover:scale-105" >
            Counsellors
          </a>

          <button
            className="text-white px-6 py-2 rounded-full font-medium bg-black transform hover:scale-105">
            Login
          </button>

          <button
            className="text-white px-6 py-2 rounded-full font-medium bg-black transform hover:scale-105">
            Sign Up
          </button>

        </div>
      </div>
    </nav>
  );
}
