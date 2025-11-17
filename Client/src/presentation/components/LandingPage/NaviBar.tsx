import { useState } from "react";
import logo from "@/assets/LandingPage/HeroSection/logo.png";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="
        bg-gradient-to-r from-neutral-200/60 via-neutral-100/25 to-neutral-200/60
        backdrop-blur
        rounded-[999px]
        border border-neutral-200/80
        shadow-lg
        px-8 sm:px-12 py-3
        flex items-center justify-between gap-4
        w-full max-w-screen-2xl mx-auto 
      "
    >
      <div className="sm:px-6 w-full">
        
        <div className="flex justify-between 
                        items-center w-full gap-4">

          <div className="flex items-center mr-8">
            <a href="/" className="flex items-center gap-2">
              <img
                src={logo}
                alt="logo"
                className="h-8 sm:h-10 md:h-12" 
              />
            </a>
          </div>

          {/* Menu desktop */}
          <div className="hidden md:flex flex-1 justify-center gap-10">
            <a
              href="/about"
              className="inline-block font-medium 
                         text-black hover:underline 
                         underline-offset-4"
            >
              About Us
            </a>

            <a
              href="/counsellors"
              className="inline-block font-medium 
                         text-black hover:underline 
                         underline-offset-4"
            >
              Counsellors
            </a>

            <a
              href="/login"
              className="inline-block font-medium 
                         text-black hover:underline 
                         underline-offset-4"
            >
              Login
            </a>

            <a
              href="/signup"
              className="inline-block font-medium 
                         text-black hover:underline 
                         underline-offset-4"
            >
              Sign Up
            </a>
          </div>

          {/* Toggle mobile*/}
          <button
            className="inline-flex items-center 
                       justify-center rounded-md 
                       p-2 text-black 
                       hover:bg-gray-100 md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle navigation">
            <span className="text-2xl leading-none">☰</span>
          </button>
        </div>

        {/* Menu mobile*/}
        <div
          className={`md:hidden origin-top transition-all duration-200 ${
            open ? "max-h-64 opacity-100 py-3" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="flex flex-col gap-3 border-t border-gray-200 pt-3">
            <a
              href="/about"
              className="inline-block font-medium 
                         text-black hover:underline 
                         underline-offset-4 text-center" >
              About Us
            </a>

            <a
              href="/counsellors"
              className="inline-block font-medium 
                         text-black hover:underline 
                         underline-offset-4 text-center">
              Counsellors
            </a>

            <button className="inline-block font-medium 
                               text-black hover:underline 
                               underline-offset-4">
              Login
            </button>

            <button className="inline-block font-medium 
                               text-black hover:underline 
                               underline-offset-4">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
