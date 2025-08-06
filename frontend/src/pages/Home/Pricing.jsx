import React, { useState, useEffect } from 'react'
import { Check, Zap, Crown, Rocket, Star } from 'lucide-react'

const Pricing = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Floating particles animation
  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(25)].map((_, i) => (
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
        {[...Array(15)].map((_, i) => (
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

  const pricingPlans = [
    {
      title: 'Basic',
      description: 'Perfect for getting started',
      price: '$0',
      icon: Zap,
      features: [
        'Task reminders every 3 hours',
        'Unlimited tasks',
        '5 smart AI prioritizations/day',
        'WhatsApp integration',
      ],
      paymentLink: '/signup',
      gradient: 'from-cyan-500 to-blue-500',
      iconColor: 'text-cyan-400',
      popular: false
    },
    {
      title: 'Professional',
      description: 'Power-up your productivity',
      price: '$2',
      icon: Crown,
      features: [
        'Prioritize 50+ tasks with AI',
        'Customize your reminder times',
        'WhatsApp-based task management',
        'Weekly productivity report',
        'Advanced AI insights',
      ],
      paymentLink: 'https://buy.stripe.com/7sY9AVeAa56G8dt14f3F600',
      gradient: 'from-teal-500 to-green-500',
      iconColor: 'text-teal-400',
      popular: true
    },
    {
      title: 'Enterprise',
      description: 'Built for busy teams and power users',
      price: '$5',
      icon: Rocket,
      features: [
        'Unlimited AI prioritization & alerts',
        'Weekly and Monthly productivity insights',
        'Prioritization by AI as per your requirements',
        'Advanced reports about your productivity',
        'Priority support',
      ],
      paymentLink: 'https://buy.stripe.com/dRmbJ34ZAdDc79pfZ93F601',
      gradient: 'from-purple-500 to-pink-500',
      iconColor: 'text-purple-400',
      popular: false
    },
  ];

  return (
    <div className="relative bg-gray-900 overflow-hidden">
      <FloatingParticles />
      <NeuralNetwork />
      
      <section id="pricing" className="relative z-10 container mx-auto px-6 py-20">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Star className="w-8 h-8 text-yellow-400 animate-pulse" />
            <h2 
              className={`text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ 
                fontFamily: "'Orbitron', sans-serif",
                textShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
              }}
            >
              Simple Pricing That Scales With You
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
            Start free and let{" "}
            <span className="text-cyan-400 font-semibold">AI handle the complexity</span>. Upgrade only when your productivity demands grow.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <div
                key={plan.title}
                className={`relative group bg-gray-800/40 backdrop-blur-sm border ${
                  plan.popular 
                    ? 'border-cyan-500/50 shadow-xl shadow-cyan-500/20' 
                    : 'border-gray-700/50'
                } rounded-2xl p-8 transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-cyan-500/50 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${200 + index * 150}ms` }}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-900 px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Gradient background overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
                
                {/* Tech corner elements */}
                <div className="absolute top-3 right-3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
                <div className="absolute bottom-3 left-3 w-1 h-1 bg-teal-400 rounded-full animate-ping opacity-40"></div>

                {/* Plan Header */}
                <div className="relative z-10 text-center mb-8">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:border-cyan-500/50 transition-all duration-500">
                    <IconComponent className={`w-8 h-8 ${plan.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                  </div>

                  {/* Title and Description */}
                  <h3 
                    className="text-2xl md:text-3xl font-bold text-gray-100 mb-2 group-hover:text-white transition-colors duration-300"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                  >
                    {plan.title}
                  </h3>
                  <p 
                    className="text-gray-400 group-hover:text-gray-300 mb-6 transition-colors duration-300"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-center mb-2">
                    <span 
                      className="text-4xl md:text-5xl font-bold text-gray-100 group-hover:text-white transition-colors duration-300"
                      style={{ fontFamily: "'Orbitron', sans-serif" }}
                    >
                      {plan.price}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Per user / month
                  </p>
                </div>

                {/* Features List */}
                <ul className="relative z-10 space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li
                      key={feature}
                      className={`flex items-start gap-3 text-gray-300 group-hover:text-gray-200 transition-all duration-500 ${
                        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                      }`}
                      style={{ 
                        transitionDelay: `${400 + index * 150 + i * 50}ms`,
                        fontFamily: "'Montserrat', sans-serif"
                      }}
                    >
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="relative z-10">
                  <a
                    href={plan.paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full py-4 px-6 rounded-xl font-bold text-center transition-all duration-500 hover:scale-105 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-gray-900 hover:shadow-xl hover:shadow-cyan-500/25'
                        : 'bg-gray-700/50 text-gray-300 border border-gray-600/50 hover:border-cyan-500/50 hover:text-cyan-300 hover:shadow-lg hover:shadow-cyan-500/10'
                    } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                    style={{ 
                      transitionDelay: `${600 + index * 150}ms`,
                      fontFamily: "'Montserrat', sans-serif"
                    }}
                  >
                    {plan.price === '$0' ? 'Start Free' : 'Get Started'}
                  </a>
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
          style={{ transitionDelay: "800ms" }}
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gray-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-full">
            <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
            <span className="text-gray-300 font-medium text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              No hidden fees • Cancel anytime • Your productivity, our priority
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
  )
}

export default Pricing