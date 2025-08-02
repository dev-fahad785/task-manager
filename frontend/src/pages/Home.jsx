import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Footer from '../components/Footer';
import Analytics from '../components/Analytics';
const Home = () => {
  // States for controlling animations
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [animatedElements, setAnimatedElements] = useState({});

  const [menuOpen, setMenuOpen] = useState(false);

  // Observer for elements scrolling into view
  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Find elements to animate on scroll
      const sections = document.querySelectorAll('.animate-on-scroll');
      const newAnimatedElements = { ...animatedElements };

      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionId = section.id || section.className;

        if (sectionTop < window.innerHeight * 0.75) {
          newAnimatedElements[sectionId] = true;
        }
      });

      setAnimatedElements(newAnimatedElements);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Navigation */}

      <nav className={`container mx-auto px-6 py-4 transition-all duration-500 ${scrollY > 50 ? 'bg-white shadow-md fixed top-0 left-0 right-0 z-50' : ''}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <svg className={`h-8 w-8 text-indigo-600 transition-transform duration-700 ${isVisible ? 'rotate-0' : '-rotate-180'}`} viewBox="0 0 24 24" fill="none">
              <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 14L11 16L15 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={`ml-2 text-2xl font-bold text-indigo-600 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}><h1 className="text-2xl font-bold text-gray-800">
              Task AI <span className="text-indigo-600">Studio</span>
            </h1></span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {['Features', 'How it Works', 'Pricing'].map((item, index) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className={`text-gray-600 hover:text-indigo-600 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className={`px-4 py-2 text-indigo-600 font-medium hover:text-indigo-700 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
              style={{ transitionDelay: '200ms' }}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className={`px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-all duration-700 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
              style={{ transitionDelay: '200ms' }}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Toggle Button */}
          <button
            className="md:hidden text-gray-500 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 space-y-2 px-6">
            {['Features', 'How it Works', 'Pricing'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
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


      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12">
            <h1 className={`text-4xl md:text-5xl font-bold text-gray-800 leading-tight transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Tired of Forgetting Tasks <span className="text-indigo-600">Let us Handle this</span>
            </h1>
            <p className={`mt-4 text-xl text-gray-600 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '100ms' }}>
              Task AI Studio learns your work style and sends <span className='font-bold'>smart reminders</span> on WhatsApp — so you <span className='font-bold'>never miss a deadline </span> again.</p>
            <div className={`mt-8 flex flex-col sm:flex-row gap-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
              <Link to="/signup" className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium text-center hover:bg-indigo-700 transition hover:scale-105 transform">
                Try Task AI Free
              </Link>
              <Link to="/signup" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium text-center hover:border-gray-400 transition hover:scale-105 transform">
                use whatsapp bot instantly
              </Link>

            </div>
            <div
              className={`mt-8 flex flex-col md:flex-row md:items-center text-gray-500 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="flex items-center mb-2 md:mb-0 ">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>No credit card, no downloads  just get productive</span>
              </div>
              <div className="flex items-center mb-2 md:mb-0">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>

                <span>Free forever WhatsApp bot access</span>
              </div>
              <div className="flex items-center mb-2 md:mb-0">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>


                <span>See  Your Pending Tasks Directly on WhatsApp</span>
              </div>



            </div>

          </div>
          <div className={`md:w-1/2 mt-12 md:mt-0 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`} style={{ transitionDelay: '400ms' }}>
            <div className="relative">
              <div className={`absolute inset-0  rounded-lg transform rotate-3 scale-105 opacity-10 transition-all duration-1000 ${isVisible ? 'animate-pulse' : ''}`}></div>
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

      <Analytics />

      {/* Features */}
      <section id="features" className="container mx-auto px-6 py-20 animate-on-scroll">
        <div className="text-center mb-16">
          <h2 className={`text-3xl font-bold text-gray-800 transition-all duration-700 ${animatedElements['features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>Smarter Task Management with Built-in AI</h2>
          <p className={`mt-4 text-xl text-gray-600 max-w-2xl mx-auto transition-all duration-700 ${animatedElements['features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '100ms' }}>
            Task AI doesn’t just organize your day — it understands your habits, deadlines, and mental flow to keep you focused.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 place-items-center">
          {[
            {
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
              title: "AI-Powered Prioritization",
              description: "Our system calculates urgency, effort, and your productivity peaks to build your perfect to-do sequence."
            },
            {
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
              title: "Smart WhatsApp Alerts",
              description: "Task AI sends timely reminders for important tasks directly on WhatsApp — no more missed deadlines or cluttered inboxes."
            },
            {
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
              title: "Your To-Do List on WhatsApp",
              description: "Chat with our AI assistant anytime to review your pending tasks — right from your phone."
            }
          ].map((feature, index) => (
            <div
              key={feature.title}
              className={`bg-white p-8 border-1 text-center rounded-xl shadow-lg transition-all duration-700 hover:shadow-xl hover:-translate-y-2 ${animatedElements['features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 150 + 200}ms` }}
            >
              <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {feature.icon}
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-50 py-20 animate-on-scroll">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-3xl font-bold text-gray-800 transition-all duration-700 ${animatedElements['how-it-works'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>How Task AI Works (Spoiler: It’s Really Smart)</h2>
            <p className={`mt-4 text-xl text-gray-600 max-w-2xl mx-auto transition-all duration-700 ${animatedElements['how-it-works'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '100ms' }}>

              No complicated setup. Just enter tasks and let the AI do the rest.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Add Your Tasks", desc: "Write what needs to be done — with deadlines and estimated time.", btnText: "Add Task" },
              { step: "2", title: " AI Prioritizes Your Day", desc: "Our AI sorts tasks based on urgency, importance, and your energy levels", btnText: "See How" },
              { step: "3", title: "Get WhatsApp Reminders", desc: "Automatic reminders every 3 hours for tasks that need your attention.", btnText: "Try it Now" },
              { step: "4", title: "AI Gets Smarter Over Time", desc: "The more you use it, the better the suggestions and timing.", btnText: "Start Now" }
            ].map((step, index) => (
              <div
                key={step.step}
                className="flex flex-col bg-gray-600 rounded-2xl items-center text-center p-6 shadow-md hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 bg-indigo-500 rounded-full flex items-center justify-center text-white text-lg font-bold mb-4">
                  {step.step}
                </div>
                <h3 className="text-base md:text-lg font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  {step.desc}
                </p>

                <Link to="/signup" className="mt-auto px-5 py-2.5 bg-white text-gray-900 font-medium rounded-lg border border-white hover:bg-gray-100 hover:border-gray-300 transition-all">
                  {step.btnText}
                </Link>
              </div>

            ))}
          </div>

          <div className={`mt-12 flex justify-center transition-all duration-1000 ${animatedElements['how-it-works'] ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} style={{ transitionDelay: '800ms' }}>
            <div className="h-1 bg-indigo-200 w-3/4 relative">
              {[25, 50, 75].map((pos) => (
                <div key={pos} className="absolute top-1/2 -translate-y-1/2" style={{ left: `${pos}%` }}>
                  <div className="h-3 w-3 bg-indigo-600 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800">What Our Users Say</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Real users. Real productivity gains.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              initials: "JS",
              name: "Jamie Smith",
              role: "Product Manager",
              quote: "Before Task AI, I was constantly reacting to deadlines. Now, my day is planned for me. It’s like having a personal productivity coach on WhatsApp.",
              bgColor: "bg-blue-100",
              textColor: "text-blue-600"
            },
            {
              initials: "MJ",
              name: "Michael Johnson",
              role: "Freelance Developer",
              quote: "As a solo dev juggling 5+ clients, I don’t have time to plan everything manually. Task AI's reminders have saved me hours — and headaches.",
              bgColor: "bg-green-100",
              textColor: "text-green-600"
            },
            {
              initials: "AS",
              name: "Alice Smith",
              role: "Marketing Specialist",
              quote: "Task AI has this magical way of knowing just when to remind me. I feel more in control, and way less stressed.",
              bgColor: "bg-yellow-100",
              textColor: "text-pink-600"
            },
            {
              initials: "SM",
              name: "Smith",
              role: "Software Engineer",
              quote: "Task AI has transformed how I manage my tasks. The WhatsApp reminders are a game-changer, keeping me on track without overwhelming me.",
              bgColor: "bg-purple-100",
              textColor: "text-pink-600"
            },
          ].map((testimonial, index) => (
            <div key={testimonial.name} className="bg-white p-8  border-1 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 ${testimonial.bgColor} rounded-full flex items-center justify-center ${testimonial.textColor} font-bold mr-4`}>
                  {testimonial.initials}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600">{testimonial.quote}</p>
              <div className="mt-4 flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 py-20 animate-on-scroll">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-3xl font-bold text-gray-800 transition-all duration-700 ${animatedElements['pricing'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>Simple Pricing That Scales With You</h2>
            <p className={`mt-4 text-xl text-gray-600 max-w-2xl mx-auto transition-all duration-700 ${animatedElements['pricing'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '100ms' }}>
              Start free. Upgrade only when your needs grow.
            </p>
          </div>

          <div className=" py-12 px-6 md:px-16">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Pricing Card */}
              {[
                {
                  title: 'Basic',
                  description: 'Perfect for getting started',
                  price: '$0',
                  features: [
                    'Task reminders every 3 hours',
                    'Unlimited task',
                    '5 smart AI prioritizations/day',
                  ],
                  paymentLink: '/signup'
                },
                {
                  title: 'Professional',
                  description: 'Power-up your productivity',
                  price: '$2',
                  features: [
                    'Prioritize 50+ tasks with AI',
                    'Customize your reminder times',
                    'WhatsApp-based task management',
                    'Weekly productivity report',
                  ],
                  paymentLink: 'https://buy.stripe.com/7sY9AVeAa56G8dt14f3F600'
                },
                {
                  title: 'Enterprise',
                  description: 'Built for busy teams and power users',
                  price: '$5',
                  features: [
                    'Unlimited AI prioritization & alerts',
                    'Weekly and Monthly productivity insights',
                    'Prioritization by AI as per your requirements',
                    'Advance reports about your productivity',
                  ],
                  paymentLink: 'https://buy.stripe.com/dRmbJ34ZAdDc79pfZ93F601'
                },
              ].map((plan, index) => (
                <div
                  key={plan.title}
                  className={`bg-gray-600 p-8 rounded-xl shadow-lg transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 ${animatedElements['pricing']
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                    }`}
                >
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    {plan.title}
                  </h3>
                  <p className="text-gray-300 mb-4">{plan.description}</p>
                  <div
                    className={`flex items-center justify-center bg-indigo-500 text-white font-bold rounded-lg h-12 w-24 mb-4 text-lg transition-all duration-500 ${animatedElements['pricing'] ? 'scale-100' : 'scale-0'
                      }`}
                    style={{ transitionDelay: '300ms' }}
                  >
                    {plan.price}
                  </div>
                  <p className="text-gray-400 mb-4">Per user / month</p>
                  <ul className="text-gray-300">
                    {plan.features.map((feature, i) => (
                      <li
                        key={feature}
                        className={`flex items-center gap-2 mb-2 transition-all duration-500 ${animatedElements['pricing']
                          ? 'opacity-100 translate-x-0'
                          : 'opacity-0 -translate-x-4'
                          }`}
                        style={{ transitionDelay: `${i * 100 + 400}ms` }}
                      >
                        <svg
                          className="h-5 w-5 text-green-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 011-1h1V6a1 1 0 112 0v2h1a1 1 0 110 2h-1v1a1 1 0 11-2 0V9H9a1 1 0 01-1-1z"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={plan.paymentLink}
                    target="_blank"
                    className={`block bg-indigo-500 text-white rounded-lg font-semibold text-center py-3 hover:bg-indigo-600 transition mt-6 ${animatedElements['pricing']
                      ? 'opacity-100 translate-y-0 hover:scale-105'
                      : 'opacity-0 translate-y-4'
                      }`}
                    style={{ transitionDelay: '700ms' }}
                  >
                    Get Started
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>


      {/* Back to top button that appears when scrolling */}
      {scrollY > 500 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-all duration-300 hover:scale-110 z-50"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
      <Footer />
    </div>
  );
}

export default Home;