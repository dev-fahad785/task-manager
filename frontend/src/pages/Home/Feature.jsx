import React, { useState, useEffect } from 'react';
import { Brain, MessageCircle, BarChart3, Zap, Target, Clock } from 'lucide-react';

const Feature = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Floating particles animation
  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );

  // Neural network background
  const NeuralNetwork = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      <svg className="absolute inset-0 w-full h-full">
        {[...Array(12)].map((_, i) => (
          <line
            key={i}
            x1={`${Math.random() * 100}%`}
            y1={`${Math.random() * 100}%`}
            x2={`${Math.random() * 100}%`}
            y2={`${Math.random() * 100}%`}
            stroke="url(#gradient)"
            strokeWidth="1"
            className="animate-pulse"
          />
        ))}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0" />
            <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Prioritization",
      description: "Our neural engine calculates urgency, effort, and your productivity peaks to build your perfect task sequence.",
      gradient: "from-cyan-500 to-blue-500",
      iconColor: "text-cyan-400",
      delay: "200ms"
    },
    {
      icon: MessageCircle,
      title: "Smart WhatsApp Integration",
      description: "Get intelligent reminders and task updates directly on WhatsApp — no more missed deadlines or cluttered inboxes.",
      gradient: "from-teal-500 to-green-500",
      iconColor: "text-teal-400",
      delay: "350ms"
    },
    {
      icon: BarChart3,
      title: "Real-Time Task Analytics",
      description: "Chat with our AI assistant anytime to review pending tasks, get insights, and optimize your productivity patterns.",
      gradient: "from-purple-500 to-pink-500",
      iconColor: "text-purple-400",
      delay: "500ms"
    }
  ];

  return (
    <div className="relative bg-gray-900 overflow-hidden">
      <FloatingParticles />
      <NeuralNetwork />
      
      <section id="features" className="relative z-10 container mx-auto px-6 py-20">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Zap className="w-8 h-8 text-yellow-400 animate-pulse" />
            <h2 
              className={`text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ 
                fontFamily: "'Orbitron', sans-serif",
                textShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
              }}
            >
              AI-Powered Task Intelligence
            </h2>
          </div>
          <p 
            className={`text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ 
              transitionDelay: '100ms',
              fontFamily: "'Montserrat', sans-serif"
            }}
          >
            Task AI doesn't just organize your day — it{" "}
            <span className="text-cyan-400 font-semibold">understands your habits</span>, deadlines, and mental flow to keep you in the{" "}
            <span className="text-teal-400 font-semibold">productivity zone</span>.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.title}
                className={`relative group bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-cyan-500/50 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: feature.delay }}
              >
                {/* Gradient background overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
                
                {/* Tech corner elements */}
                <div className="absolute top-3 right-3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
                <div className="absolute bottom-3 left-3 w-1 h-1 bg-teal-400 rounded-full animate-ping opacity-40"></div>

                {/* Icon container */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl flex items-center justify-center mx-auto group-hover:border-cyan-500/50 transition-all duration-500">
                    <IconComponent className={`w-10 h-10 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                  
                  {/* Glowing ring */}
                  <div className="absolute inset-0 w-20 h-20 mx-auto border border-cyan-400/30 rounded-2xl opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-500"></div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 
                    className="text-xl md:text-2xl font-bold text-gray-100 mb-4 group-hover:text-white transition-colors duration-300"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                  >
                    {feature.title}
                  </h3>
                  <p 
                    className="text-gray-400 group-hover:text-gray-300 leading-relaxed transition-colors duration-300"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {feature.description}
                  </p>
                </div>

                {/* Neural network pattern overlay */}
                <div className="absolute inset-4 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                  <svg className="w-full h-full">
                    <path
                      d="M20,20 Q50,10 80,20 T140,20"
                      stroke="currentColor"
                      strokeWidth="1"
                      fill="none"
                      className="text-cyan-400 animate-pulse"
                    />
                    <circle cx="20" cy="20" r="2" fill="currentColor" className="text-cyan-400" />
                    <circle cx="80" cy="20" r="2" fill="currentColor" className="text-teal-400" />
                    <circle cx="140" cy="20" r="2" fill="currentColor" className="text-blue-400" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div 
          className={`text-center mt-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gray-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-full">
            <Target className="w-6 h-6 text-green-400 animate-pulse" />
            <span className="text-gray-300 font-medium text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Transform your productivity with AI that actually gets you
            </span>
          </div>
        </div>
      </section>

      {/* Custom Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Montserrat:wght@300;400;500;600;700&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default Feature;