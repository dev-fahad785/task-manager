import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsVisible(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div>
      <nav
        className={`container mx-auto px-6 py-4 transition-all duration-500 ${
          scrollY > 50
            ? "bg-white shadow-md fixed top-0 left-0 right-0 z-50"
            : ""
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <svg
              className={`h-8 w-8 text-indigo-600 transition-transform duration-700 ${
                isVisible ? "rotate-0" : "-rotate-180"
              }`}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 14L11 16L15 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className={`ml-2 text-2xl font-bold text-indigo-600 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4"
              }`}
            >
              <h1 className="text-2xl font-bold text-gray-800">
                Task AI <span className="text-indigo-600">Studio</span>
              </h1>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {["Features", "How it Works", "Pricing"].map((item, index) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className={`text-gray-600 hover:text-indigo-600 transition-all duration-500 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-4"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className={`px-4 py-2 text-indigo-600 font-medium hover:text-indigo-700 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-4"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className={`px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-all duration-700 hover:scale-105 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-4"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Toggle Button */}
          <button
            className="md:hidden text-gray-500 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 space-y-2 px-6">
            {["Features", "How it Works", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="block text-gray-600 hover:text-indigo-600 transition-all duration-300"
              >
                {item}
              </a>
            ))}
            <hr className="my-2" />
            <Link
              to="/login"
              className="block text-indigo-600 font-medium hover:text-indigo-700 transition duration-300"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="block bg-indigo-600 text-white text-center rounded-md py-2 font-medium hover:bg-indigo-700 transition duration-300"
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
