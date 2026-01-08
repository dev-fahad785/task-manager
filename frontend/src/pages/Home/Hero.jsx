import React, { useState, useEffect, useRef } from 'react';

const ResponsiveHeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const videoRef = useRef(null);

  const fullText = "Never Forget To(test commit to main2) ";
  const words = ["Work", "Exercise", "Study", "Create"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Typewriter effect
  useEffect(() => {
    const currentWord = words[currentWordIndex];
    let currentIndex = 0;
    let isDeleting = false;
    
    const typeTimer = setInterval(() => {
      if (!isDeleting) {
        if (currentIndex < currentWord.length) {
          setTypedText(currentWord.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          setTimeout(() => {
            isDeleting = true;
          }, 2000);
        }
      } else {
        if (currentIndex > 0) {
          setTypedText(currentWord.substring(0, currentIndex - 1));
          currentIndex--;
        } else {
          isDeleting = false;
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearInterval(typeTimer);
  }, [currentWordIndex]);

  // Mouse parallax effect (only on desktop)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (window.innerWidth >= 1024) { // Only on desktop
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth - 0.5) * 0.5;
        const y = (clientY / innerHeight - 0.5) * 0.5;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const Link = ({ to, children, className, ...props }) => (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  );

  return (
    <div ref={heroRef} className="relative min-h-screen bg-gray-900 overflow-hidden">
      {/* Main Content */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-8 sm:pb-12 md:pb-16 lg:pb-24">
        <div className="flex flex-col lg:flex-row items-center min-h-[calc(100vh-8rem)] sm:min-h-[calc(100vh-6rem)] gap-8 lg:gap-12">
          
          {/* Left Content */}
          <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8 text-center lg:text-left">
            
            {/* Main Headline with Typewriter */}
            <div className="space-y-4 sm:space-y-6">
              <h1
                className={`text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight transition-all duration-1000 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{
                  transform: `translateX(${mousePosition.x * 8}px) translateY(${mousePosition.y * 4}px)`,
                  fontFamily: "'Orbitron', 'Audiowide', sans-serif",
                  textShadow: '0 0 30px rgba(6, 182, 212, 0.3)'
                }}
              >
                <span className="text-gray-100 block sm:inline">
                  {fullText}
                </span>
                <span className="relative inline-block mt-2 sm:mt-0">
                  {/* Responsive width container */}
                  <span 
                    className="inline-block bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent"
                    style={{ 
                      minWidth: window.innerWidth >= 768 ? '300px' : '150px',
                      textAlign: 'left'
                    }}
                  >
                    {typedText}
                  </span>
                  <span className="animate-pulse text-cyan-400 text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl ml-1">|</span>
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
                  className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-300"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  Again
                </span>
              </div>
            </div>

            {/* Subtitle */}
            <p
              className={`text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 leading-relaxed transition-all duration-1000 max-w-2xl mx-auto lg:mx-0 px-2 sm:px-0 ${
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
              className={`flex flex-col sm:flex-row gap-4 sm:gap-6 transition-all duration-1000 justify-center lg:justify-start ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "700ms" }}
            >
              <Link
                to="/signup"
                className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-900 rounded-2xl font-bold text-base sm:text-lg text-center overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span className="text-xl sm:hidden">🚀</span>
                  <span className="hidden sm:inline">🚀 Start Your AI Journey</span>
                  <span className="sm:hidden">Start Journey</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              
              <Link
                to="/signup"
                className="group px-6 sm:px-8 py-3 sm:py-4 border-2 border-cyan-500/50 text-cyan-400 rounded-2xl font-bold text-base sm:text-lg text-center transition-all duration-500 hover:border-cyan-400 hover:text-cyan-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20 backdrop-blur-sm bg-gray-800/30 w-full sm:w-auto"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="text-xl sm:hidden">💬</span>
                  <span className="hidden sm:inline">💬 WhatsApp Bot</span>
                  <span className="sm:hidden">WhatsApp Bot</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Features List */}
            <div
              className={`space-y-3 sm:space-y-4 transition-all duration-1000 ${
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
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:border-cyan-500/30"
                  style={{
                    transitionDelay: `${900 + index * 100}ms`,
                    transform: `translateX(${mousePosition.x * 1}px)`
                  }}
                >
                  <span className={`text-lg sm:text-2xl flex-shrink-0 ${feature.color}`}>{feature.icon}</span>
                  <span className="text-sm sm:text-base text-gray-300 font-medium leading-tight">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Video */}
          <div
            className={`w-full lg:w-1/2 mt-8 lg:mt-0 transition-all duration-1200 ${
              isVisible ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-12 scale-95"
            }`}
            style={{ 
              transitionDelay: "1100ms",
              transform: `translateX(${mousePosition.x * -10}px) translateY(${mousePosition.y * -8}px) rotateY(${mousePosition.x * 3}deg)`
            }}
          >
            <div className="relative group max-w-2xl mx-auto">
              {/* Glowing background */}
              <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-blue-500/20 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl group-hover:blur-xl sm:group-hover:blur-2xl transition-all duration-700 animate-pulse"></div>
              
              {/* Neural network overlay */}
              <div className="absolute -inset-2 sm:-inset-4 opacity-30">
                <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-2 border-cyan-400 rounded-full animate-ping"></div>
                <div className="absolute top-1/3 right-0 w-4 h-4 sm:w-6 sm:h-6 border-2 border-teal-400 rounded-lg animate-pulse"></div>
                <div className="absolute bottom-1/4 left-1/4 w-3 h-3 sm:w-4 sm:h-4 bg-blue-400 rounded-full animate-bounce"></div>
              </div>
              
              {/* Video container */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 transform group-hover:scale-105 transition-all duration-700">
  
  {/* Video Element */}
  <div className="aspect-video relative bg-black">
    <video
      autoPlay
      loop
      muted
      ref={videoRef}
      // src="/banner-video.mp4"  // 👈 Put your video path here
      src="/banner-video.mp4"  // 👈 Put your video path here
      controls
      className="w-full h-full object-cover rounded-2xl sm:rounded-3xl"
    />
  </div>

  {/* Overlay with gradient */}
  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-cyan-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl sm:rounded-3xl"></div>
  
  {/* Futuristic play button overlay (optional if video is autoplay or controls are enough) */}
  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
    <div className="relative">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-cyan-500/20 backdrop-blur-md rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-700 border border-cyan-400/50">
        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-300 ml-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
      <div className="absolute inset-0 rounded-full bg-cyan-400/10 animate-ping"></div>
    </div>
  </div>
</div>


              {/* Decorative tech elements */}
              <div className="absolute -top-2 sm:-top-4 -left-2 sm:-left-4 w-12 h-12 sm:w-16 sm:h-16 border border-cyan-400/30 rounded-full animate-spin-slow opacity-40">
                <div className="absolute top-1 left-1 sm:top-2 sm:left-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 w-10 h-10 sm:w-12 sm:h-12 border-2 border-teal-400/40 rounded-lg rotate-45 animate-pulse opacity-50"></div>
            </div>
          </div>
        </div>

        {/* Bottom Stats with Futuristic Design */}
        <div
          className={`mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 transition-all duration-1000 ${
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
              className="relative group text-center p-4 sm:p-6 rounded-2xl bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 transform hover:scale-110 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-500/20 hover:border-cyan-500/50"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
              <div className="relative z-10">
                <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-100 mb-1 sm:mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-gray-400 font-medium">{stat.label}</div>
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

        /* Extra small screens */
        @media (max-width: 475px) {
          .container {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
          
          /* Ensure proper spacing from navbar */
          section {
            padding-top: 5rem !important;
          }
        }

        /* Very small screens */
        @media (max-width: 375px) {
          .container {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
        }
      `}</style>
    </div>  
  );
};

export default ResponsiveHeroSection;