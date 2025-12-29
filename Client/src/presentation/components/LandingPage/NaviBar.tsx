import { useState } from "react";
import logo from "@/assets/LandingPage/HeroSection/logo.png";
import userIcon from "@/assets/LandingPage/HeroSection/userIcon.png";
import { useAuth } from "@/app/providers/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex justify-center">
      <nav
        className="
          inline-flex items-center justify-between gap-8
          px-8 sm:px-10 py-3
          bg-gradient-to-r from-neutral-200/60 via-neutral-100/25 to-neutral-200/60
          backdrop-blur
          rounded-full
          border border-neutral-200/80
          shadow-lg 
        "
      >
        <div className="sm:px-6 w-full">
          <div className="flex justify-between items-center w-full gap-4">
            {/* Logo */}
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
            <div className="hidden md:flex flex-1 justify-center gap-10 items-center">
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

              {/* Only show Login / Sign Up when not logged in */}
              {!user && (
                <>
                  <a
                    href="/login"
                    className="inline-block font-medium 
                              text-black hover:underline 
                              underline-offset-4"
                  >
                    Login
                  </a>

                  <a
                    href="/register"
                    className="inline-block font-medium 
                              text-black underline-offset-4 
                              text-center"
                  >
                    Sign Up
                  </a>
                </>
              )}

              {/* If logged in: show User + Logout */}
              {user && (
                <div className="flex items-center gap-6">
                  <a href="/dashboard" className="flex items-center gap-2">
                    <img
                      src={userIcon}
                      alt="userIcon"
                      className="h-8 sm:h-10 md:h-12"
                    />
                  </a>
                </div>
              )}
            </div>

            {/* Toggle mobile */}
            <button
              className="inline-flex items-center 
                        justify-center rounded-md 
                        p-2 text-black 
                        hover:bg-gray-100 md:hidden"
              onClick={() => setOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              <span className="text-2xl leading-none">☰</span>
            </button>
          </div>

          {/* Menu mobile */}
          <div
            className={`md:hidden transition-all duration-200
              ${open ? "max-h-80 opacity-100 py-3" : "max-h-0 opacity-0 py-0"}
            `}
          >
            <div className="flex flex-col gap-3 border-t border-gray-200 pt-3">
              <a
                href="/about"
                className="inline-block font-medium 
                          text-black hover:underline 
                          underline-offset-4 text-center"
              >
                About Us
              </a>

              <a
                href="/counsellors"
                className="inline-block font-medium 
                          text-black hover:underline 
                          underline-offset-4 text-center"
              >
                Counsellors
              </a>

              {/* Mobile: also only shows Login / Sign Up when not logged in */}
              {!user && (
                <>
                  <a
                    href="/login"
                    className="inline-block font-medium 
                              text-black hover:underline 
                              underline-offset-4 text-center"
                  >
                    Login
                  </a>

                  <a
                    href="/register"
                    className="inline-block font-medium 
                              text-black hover:underline 
                              underline-offset-4 text-center"
                  >
                    Sign Up
                  </a>
                </>
              )}

              {user && (
              <div className="flex flex-col items-center gap-2" onClick={() => navigate('/dashboard')}>
                  <img
                    src={userIcon}
                    alt="userIcon"
                    className="h-8 sm:h-10 md:h-12"
                  />
                  
              </div>
            )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
