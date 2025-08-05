import React, { useState, useEffect } from "react";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [animatedElements, setAnimatedElements] = useState({});

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Find elements to animate on scroll
      const sections = document.querySelectorAll(".animate-on-scroll");
      const newAnimatedElements = { ...animatedElements };

      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionId = section.id || section.className;

        if (sectionTop < window.innerHeight * 0.75) {
          newAnimatedElements[sectionId] = true;
        }
      });

      setAnimatedElements(newAnimatedElements);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div>
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12">
            <h1
              className={`text-4xl md:text-5xl font-bold text-gray-800 leading-tight transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Tired of Forgetting Tasks{" "}
              <span className="text-indigo-600">Let us Handle this</span>
            </h1>
            <p
              className={`mt-4 text-xl text-gray-600 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              Task AI Studio learns your work style and sends{" "}
              <span className="font-bold">smart reminders</span> on WhatsApp —
              so you <span className="font-bold">never miss a deadline </span>{" "}
              again.
            </p>
            <div
              className={`mt-8 flex flex-col sm:flex-row gap-4 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <Link
                to="/signup"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium text-center hover:bg-indigo-700 transition hover:scale-105 transform"
              >
                Try Task AI Free
              </Link>
              <Link
                to="/signup"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium text-center hover:border-gray-400 transition hover:scale-105 transform"
              >
                use whatsapp bot instantly
              </Link>
            </div>
            <div
              className={`mt-8 flex flex-col md:flex-row md:items-center text-gray-500 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <div className="flex items-center mb-2 md:mb-0 ">
                <svg
                  className="h-5 w-5 text-green-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>No credit card, no downloads just get productive</span>
              </div>
              <div className="flex items-center mb-2 md:mb-0">
                <svg
                  className="h-5 w-5 text-green-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>

                <span>Free forever WhatsApp bot access</span>
              </div>
              <div className="flex items-center mb-2 md:mb-0">
                <svg
                  className="h-5 w-5 text-green-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>

                <span>See Your Pending Tasks Directly on WhatsApp</span>
              </div>
            </div>
          </div>
          <div
            className={`md:w-1/2 mt-12 md:mt-0 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="relative">
              <div
                className={`absolute inset-0  rounded-lg transform rotate-3 scale-105 opacity-10 transition-all duration-1000 ${
                  isVisible ? "animate-pulse" : ""
                }`}
              ></div>
              {/* Video element instead of image */}
              <video
                src="/banner-video.mp4"
                alt="Task AI Studio AI Dashboard"
                className="rounded-lg shadow-2xl relative z-10 transition-transform hover:scale-102 transform"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
