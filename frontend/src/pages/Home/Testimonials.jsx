import React from 'react'

const testimonials = [
  {
    initials: "JS",
    name: "Jamie Smith",
    role: "Product Manager",
    quote: "Before Task AI, I was constantly reacting to deadlines. Now, my day is planned for me. It’s like having a personal productivity coach on WhatsApp.",
    bgColor: "from-cyan-500 to-blue-500",
    icon: "🧑‍💼"
  },
  {
    initials: "MJ",
    name: "Michael Johnson",
    role: "Freelance Developer",
    quote: "As a solo dev juggling 5+ clients, I don’t have time to plan everything manually. Task AI's reminders have saved me hours — and headaches.",
    bgColor: "from-teal-500 to-green-500",
    icon: "💻"
  },
  {
    initials: "AS",
    name: "Alice Smith",
    role: "Marketing Specialist",
    quote: "Task AI has this magical way of knowing just when to remind me. I feel more in control, and way less stressed.",
    bgColor: "from-purple-500 to-pink-500",
    icon: "📈"
  },
  {
    initials: "SM",
    name: "Smith",
    role: "Software Engineer",
    quote: "Task AI has transformed how I manage my tasks. The WhatsApp reminders are a game-changer, keeping me on track without overwhelming me.",
    bgColor: "from-blue-500 to-cyan-500",
    icon: "🧑‍💻"
  },
];

const Testimonials = () => {
  return (
    <section className="relative bg-gray-900 py-20 overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
      {/* Neural network background */}
      <div className="absolute inset-0 pointer-events-none opacity-10 z-0">
        <svg className="absolute inset-0 w-full h-full">
          {[...Array(8)].map((_, i) => (
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

      <div className="relative z-10 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent"
            style={{
              fontFamily: "'Orbitron', 'Audiowide', sans-serif",
              textShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
            }}
          >
            What Our Users Say
          </h2>
          <p
            className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto"
            style={{ fontFamily: "'Montserrat', 'Roboto', sans-serif" }}
          >
            Real users. Real productivity gains.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className={`relative group p-8 rounded-2xl bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 transition-all duration-700 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20 hover:border-cyan-500/50`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              {/* Gradient background overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.bgColor} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
              {/* Tech corner elements */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
              <div className="absolute bottom-3 left-3 w-1 h-1 bg-teal-400 rounded-full animate-ping opacity-40"></div>
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
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.bgColor} rounded-full flex items-center justify-center text-2xl font-bold mr-4 shadow-lg`}>
                    {testimonial.icon}
                  </div>
                  <div>
                    <h4
                      className="font-semibold text-gray-100"
                      style={{ fontFamily: "'Orbitron', 'Audiowide', sans-serif" }}
                    >
                      {testimonial.name}
                    </h4>
                    <p
                      className="text-gray-400 text-sm"
                      style={{ fontFamily: "'Montserrat', 'Roboto', sans-serif" }}
                    >
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p
                  className="text-gray-300 mb-4"
                  style={{ fontFamily: "'Montserrat', 'Roboto', sans-serif" }}
                >
                  “{testimonial.quote}”
                </p>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Custom Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Audiowide&family=Montserrat:wght@300;400;500;600;700&display=swap');
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </section>
  )
}

export default Testimonials