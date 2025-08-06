import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-gray-900/95 backdrop-blur-lg border-b border-cyan-500/20 shadow-lg shadow-cyan-500/10"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <div className="flex items-center group">
              {/* Futuristic Logo Icon */}
              <div className="relative">
                <svg
                  className="h-10 w-10 text-cyan-400 transition-all duration-700 group-hover:text-teal-300 group-hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.4))'
                  }}
                >
                  {/* Neural network inspired icon */}
                  <path
                    d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
                    fill="currentColor"
                    className="animate-pulse"
                  />
                  <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.6" />
                  <circle cx="12" cy="12" r="1" fill="currentColor" />
                </svg>
                {/* Glowing ring around logo */}
                <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping opacity-0 group-hover:opacity-100"></div>
              </div>

              {/* Brand Text */}
              <div className="ml-4">
                <h1 
                  className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent transition-all duration-700 group-hover:from-teal-300 group-hover:to-cyan-300"
                  style={{ 
                    fontFamily: "'Orbitron', 'Audiowide', sans-serif",
                    textShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
                  }}
                >
                  Task AI <span className="text-gray-300 font-light">Studio</span>
                </h1>
                <div className="h-0.5 bg-gradient-to-r from-cyan-400 to-transparent w-0 group-hover:w-full transition-all duration-500"></div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { name: "Features", href: "#features" },
                { name: "How it Works", href: "#how-it-works" },
                { name: "Pricing", href: "#pricing" }
              ].map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="relative group text-gray-300 hover:text-cyan-300 transition-all duration-500 font-medium"
                  style={{ 
                    transitionDelay: `${index * 100}ms`,
                    fontFamily: "'Montserrat', sans-serif"
                  }}
                >
                  <span className="relative z-10">{item.name}</span>
                  {/* Hover effect underline */}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-teal-400 group-hover:w-full transition-all duration-500"></div>
                  {/* Glowing dot */}
                  <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/login"
                className="relative px-6 py-2 text-cyan-300 font-medium hover:text-white transition-all duration-500 group"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 border border-cyan-500/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-cyan-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link
                to="/signup"
                className="relative px-6 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-900 rounded-lg font-bold transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 group overflow-hidden"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                <span className="relative z-10 flex items-center gap-2">
                  🚀 Get Started
                </span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-300 hover:text-cyan-300 focus:outline-none transition-colors duration-300"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg
                className="h-6 w-6 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{
                  transform: menuOpen ? 'rotate(90deg)' : 'rotate(0deg)'
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    menuOpen 
                      ? "M6 18L18 6M6 6l12 12" 
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <div 
            className={`md:hidden mt-4 transition-all duration-500 ease-in-out ${
              menuOpen 
                ? "max-h-96 opacity-100" 
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-6 space-y-4">
              {[
                { name: "Features", href: "#features" },
                { name: "How it Works", href: "#how-it-works" },
                { name: "Pricing", href: "#pricing" }
              ].map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-gray-300 hover:text-cyan-300 transition-all duration-300 font-medium py-2 border-l-2 border-transparent hover:border-cyan-400 pl-4 hover:pl-6"
                  onClick={() => setMenuOpen(false)}
                  style={{ 
                    fontFamily: "'Montserrat', sans-serif",
                    transitionDelay: `${index * 50}ms`
                  }}
                >
                  {item.name}
                </a>
              ))}
              
              <hr className="border-gray-700/50 my-4" />
              
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block text-cyan-300 font-medium hover:text-white transition duration-300 py-2 px-4 rounded-lg hover:bg-gray-700/30"
                  onClick={() => setMenuOpen(false)}
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-900 text-center rounded-lg py-3 font-bold hover:scale-105 transition-transform duration-300"
                  onClick={() => setMenuOpen(false)}
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  🚀 Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Custom Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Audiowide&family=Montserrat:wght@300;400;500;600;700&display=swap');
      `}</style>
    </div>
  );
};

export default Navbar;
