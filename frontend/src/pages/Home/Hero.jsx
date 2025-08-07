import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const heroRef = useRef(null);
  const videoRef = useRef(null);

  const words = ["Forget","Miss Task","Late"];
  const fullText = "Never ";

  // Typewriter effect
  useEffect(() => {
    setIsVisible(true);
    
    const currentWord = words[currentWordIndex];
    let currentIndex = 0;
    let isDeleting = false;
    
    const typeWriter = () => {
      if (!isDeleting && currentIndex <= currentWord.length) {
        setTypedText(currentWord.substring(0, currentIndex));
        currentIndex++;
        setTimeout(typeWriter, 80); // Slightly faster typing
      } else if (!isDeleting && currentIndex > currentWord.length) {
        // Pause before starting to delete
        setTimeout(() => { 
          isDeleting = true; 
          typeWriter(); 
        }, 1500); // Longer pause at full word
      } else if (isDeleting && currentIndex >= 0) {
        setTypedText(currentWord.substring(0, currentIndex));
        currentIndex--;
        setTimeout(typeWriter, 40); // Faster erasing
      } else if (isDeleting && currentIndex < 0) {
        isDeleting = false;
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setTimeout(typeWriter, 300); // Short pause before next word
      }
    };

    const timer = setTimeout(typeWriter, 1000);
    return () => clearTimeout(timer);
  }, [currentWordIndex]);

  // Mouse tracking for parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left - rect.width / 2) / rect.width,
          y: (e.clientY - rect.top - rect.height / 2) / rect.height,
        });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener("mousemove", handleMouseMove);
      return () => heroElement.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);


  return (
    <div ref={heroRef} className="relative min-h-screen bg-gray-900 overflow-hidden">
      {/* Background Effects */}
      
      {/* Main Content */}
      <section className="relative z-10 container mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row items-center min-h-[80vh]">
          
          {/* Left Content */}
          <div className="lg:w-1/2 lg:pr-12 space-y-8">
            
            {/* Main Headline with Typewriter */}
            <div className="space-y-6">
              <h1
                className={`text-5xl md:text-7xl font-black leading-tight transition-all duration-1000 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{
                  transform: `translateX(${mousePosition.x * 8}px) translateY(${mousePosition.y * 4}px)`,
                  fontFamily: "'Orbitron', 'Audiowide', sans-serif",
                  textShadow: '0 0 30px rgba(6, 182, 212, 0.3)'
                }}
              >
                <span className="text-gray-100">
                  {fullText}
                </span>
                <span className="relative inline-block">
                  {/* Fixed width container to prevent layout shift */}
                  <span 
                    className="inline-block bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent"
                    style={{ 
                      minWidth: '400px', // Adjust based on your longest word
                      textAlign: 'left'
                    }}
                  >
                    {typedText}
                  </span>
                  <span className="animate-pulse text-cyan-400 text-6xl md:text-7xl ml-1">|</span>
                  <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-lg blur-xl -z-10"></div>
                </span>
              </h1>
              
              <div
                className={`transform transition-all duration-1000 ${
                  isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
                }`}
                style={{ transitionDelay: "300ms" }}
              >
                <span 
                  className="text-3xl md:text-5xl font-bold text-gray-300"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  Again
                </span>
              </div>
            </div>

            {/* Subtitle */}
            <p
              className={`text-xl md:text-2xl text-gray-400 leading-relaxed transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ 
                transitionDelay: "500ms",
                transform: `translateX(${mousePosition.x * 3}px)`,
                fontFamily: "'Montserrat', 'Roboto', sans-serif"
              }}
            >
              An <span className="text-cyan-400 font-semibold glow-text">AI friend</span> that keeps your day on track. 
              Smart reminders every 3 hours on{" "}
              <span className="text-teal-400 font-semibold">WhatsApp</span> — 
              never let important tasks slip through the cracks.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-6 transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "700ms" }}
            >
              <Link
                to="/signup"
                className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-900 rounded-2xl font-bold text-lg text-center overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  🚀 Start Your AI Journey
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              
              <Link
                to="/signup"
                className="group px-8 py-4 border-2 border-cyan-500/50 text-cyan-400 rounded-2xl font-bold text-lg text-center transition-all duration-500 hover:border-cyan-400 hover:text-cyan-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20 backdrop-blur-sm bg-gray-800/30"
              >
                <span className="flex items-center justify-center gap-2">
                  💬 WhatsApp Bot
                  <svg className="w-5 h-5 transform group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Features List */}
            <div
              className={`space-y-4 transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "900ms" }}
            >
              {[
                { icon: "⚡", text: "No credit card • No downloads • Just get productive", color: "text-yellow-400" },
                { icon: "🎯", text: "Free forever WhatsApp bot access", color: "text-green-400" },
                { icon: "🧠", text: "AI learns your patterns for smarter reminders", color: "text-purple-400" }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:border-cyan-500/30"
                  style={{
                    transitionDelay: `${900 + index * 100}ms`,
                    transform: `translateX(${mousePosition.x * 1}px)`
                  }}
                >
                  <span className={`text-2xl ${feature.color}`}>{feature.icon}</span>
                  <span className="text-gray-300 font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Video */}
          <div
            className={`lg:w-1/2 mt-12 lg:mt-0 transition-all duration-1200 ${
              isVisible ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-12 scale-95"
            }`}
            style={{ 
              transitionDelay: "1100ms",
              transform: `translateX(${mousePosition.x * -10}px) translateY(${mousePosition.y * -8}px) rotateY(${mousePosition.x * 3}deg)`
            }}
          >
            <div className="relative group">
              {/* Glowing background */}
              <div className="absolute -inset-6 bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-blue-500/20 rounded-3xl blur-3xl group-hover:blur-2xl transition-all duration-700 animate-pulse"></div>
              
              {/* Neural network overlay */}
              <div className="absolute -inset-4 opacity-30">
                <div className="absolute top-0 left-0 w-8 h-8 border-2 border-cyan-400 rounded-full animate-ping"></div>
                <div className="absolute top-1/3 right-0 w-6 h-6 border-2 border-teal-400 rounded-lg animate-pulse"></div>
                <div className="absolute bottom-1/4 left-1/4 w-4 h-4 bg-blue-400 rounded-full animate-bounce"></div>
              </div>
              
              {/* Video container */}
              <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 transform group-hover:scale-105 transition-all duration-700">
                <video
                  ref={videoRef}
                  src="/banner-video.mp4"
                  alt="Task AI Studio Dashboard"
                  className="w-full h-auto rounded-3xl relative z-10"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                
                {/* Video overlay with circuit pattern */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-cyan-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                
                {/* Futuristic play button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="relative">
                    <div className="w-20 h-20 bg-cyan-500/20 backdrop-blur-md rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-700 border border-cyan-400/50">
                      <svg className="w-8 h-8 text-cyan-300 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <div className="absolute inset-0 rounded-full bg-cyan-400/10 animate-ping"></div>
                  </div>
                </div>
              </div>

              {/* Decorative tech elements */}
              <div className="absolute -top-4 -left-4 w-16 h-16 border border-cyan-400/30 rounded-full animate-spin-slow opacity-40">
                <div className="absolute top-2 left-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-12 h-12 border-2 border-teal-400/40 rounded-lg rotate-45 animate-pulse opacity-50"></div>
            </div>
          </div>
        </div>

        {/* Bottom Stats with Futuristic Design */}
        <div
          className={`mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "1300ms" }}
        >
          {[
            { number: "10K+", label: "Tasks Managed", icon: "📋", color: "from-cyan-500 to-blue-500" },
            { number: "5K+", label: "Happy Users", icon: "🚀", color: "from-teal-500 to-green-500" },
            { number: "99.9%", label: "Uptime", icon: "⚡", color: "from-purple-500 to-pink-500" }
          ].map((stat, index) => (
            <div
              key={index}
              className="relative group text-center p-6 rounded-2xl bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 transform hover:scale-110 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-500/20 hover:border-cyan-500/50"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
              <div className="relative z-10">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-100 mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  {stat.number}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
              <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Custom Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Audiowide&family=Montserrat:wght@300;400;500;600;700&display=swap');
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .glow-text {
          text-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
        }
        
        /* Custom scrollbar for dark theme */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #1f2937;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #14b8a6);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0891b2, #0f766e);
        }
      `}</style>
    </div>
  );
};

export default Hero;
