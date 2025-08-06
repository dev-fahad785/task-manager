import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Brain, MessageCircle, TrendingUp, ArrowRight, Zap } from 'lucide-react';

const HowItWorks = () => {
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

  const steps = [
    {
      step: "1",
      title: "Add Your Tasks",
      desc: "Simply write what needs to be done with deadlines and estimated time. Our AI understands natural language.",
      btnText: "Add Task",
      icon: Plus,
      gradient: "from-cyan-500 to-blue-500",
      iconColor: "text-cyan-400"
    },
    {
      step: "2", 
      title: "AI Prioritizes Your Day",
      desc: "Our neural engine analyzes urgency, importance, and your productivity patterns to create the perfect task sequence.",
      btnText: "See Magic",
      icon: Brain,
      gradient: "from-teal-500 to-green-500", 
      iconColor: "text-teal-400"
    },
    {
      step: "3",
      title: "Get WhatsApp Reminders", 
      desc: "Receive intelligent notifications every 3 hours directly on WhatsApp — no more missed deadlines or forgotten tasks.",
      btnText: "Try Now",
      icon: MessageCircle,
      gradient: "from-purple-500 to-pink-500",
      iconColor: "text-purple-400"
    },
    {
      step: "4",
      title: "AI Gets Smarter Over Time",
      desc: "Machine learning adapts to your habits, energy levels, and preferences — becoming your perfect productivity partner.",
      btnText: "Start Journey",
      icon: TrendingUp,
      gradient: "from-orange-500 to-red-500",
      iconColor: "text-orange-400"
    }
  ];

  return (
    <div className="relative bg-gray-900 overflow-hidden">
      <FloatingParticles />
      <NeuralNetwork />
      
      <section id="how-it-works" className="relative z-10 container mx-auto px-6 py-20">
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
              How Task AI Works (Spoiler: It's Really Smart)
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
            No complicated setup. Just enter tasks and let the{" "}
            <span className="text-cyan-400 font-semibold">AI handle the complexity</span>. 
            Four simple steps to productivity mastery.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.step}
                className={`relative group bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-cyan-500/50 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${200 + index * 150}ms` }}
              >
                {/* Gradient background overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
                
                {/* Tech corner elements */}
                <div className="absolute top-3 right-3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
                <div className="absolute bottom-3 left-3 w-1 h-1 bg-teal-400 rounded-full animate-ping opacity-40"></div>

                {/* Step number circle */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-full flex items-center justify-center mx-auto group-hover:border-cyan-500/50 transition-all duration-500">
                    <span 
                      className="text-2xl font-bold text-gray-100 group-hover:text-white transition-colors duration-300"
                      style={{ fontFamily: "'Orbitron', sans-serif" }}
                    >
                      {step.step}
                    </span>
                  </div>
                  
                  {/* Glowing ring */}
                  <div className="absolute inset-0 w-16 h-16 mx-auto border border-cyan-400/30 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-500"></div>
                </div>

                {/* Icon */}
                <div className="mb-4">
                  <IconComponent className={`w-10 h-10 ${step.iconColor} mx-auto group-hover:scale-110 transition-transform duration-300`} />
                </div>

                {/* Content */}
                <div className="relative z-10 mb-6">
                  <h3 
                    className="text-lg md:text-xl font-bold text-gray-100 mb-3 group-hover:text-white transition-colors duration-300"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                  >
                    {step.title}
                  </h3>
                  <p 
                    className="text-sm md:text-base text-gray-400 group-hover:text-gray-300 leading-relaxed transition-colors duration-300"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {step.desc}
                  </p>
                </div>

                {/* CTA Button */}
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg font-medium border border-gray-600/50 hover:border-cyan-500/50 hover:text-cyan-300 hover:bg-gray-600/50 transition-all duration-300 group-hover:scale-105"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {step.btnText}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

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

        {/* Progress Flow Visualization */}
        <div 
          className={`mt-12 flex justify-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          <div className="relative w-3/4 h-1 bg-gray-700 rounded-full overflow-hidden">
            {/* Animated progress bar */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-500 rounded-full animate-pulse opacity-60"></div>
            
            {/* Progress dots */}
            {[25, 50, 75].map((pos, index) => (
              <div 
                key={pos} 
                className="absolute top-1/2 -translate-y-1/2" 
                style={{ left: `${pos}%` }}
              >
                <div 
                  className={`w-4 h-4 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full border-2 border-gray-900 shadow-lg transition-all duration-500 hover:scale-125 ${
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
                  }`}
                  style={{ transitionDelay: `${900 + index * 100}ms` }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div 
          className={`text-center mt-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "1000ms" }}
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gray-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-full">
            <Brain className="w-6 h-6 text-purple-400 animate-pulse" />
            <span className="text-gray-300 font-medium text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Ready to let AI transform your productivity workflow?
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

export default HowItWorks;