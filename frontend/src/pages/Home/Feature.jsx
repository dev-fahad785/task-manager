import React from 'react'

const Feature = () => {
  return (
    <div>
              {/* Features */}
              <section id="features" className="container mx-auto px-6 py-20 animate-on-scroll">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-gray-800 transition-all duration-700 opacity-100 translate-y-0">
                    Smarter Task Management with Built-in AI
                  </h2>
                  <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto transition-all duration-700 opacity-100 translate-y-0" style={{ transitionDelay: '100ms' }}>
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
                      className="bg-white p-8 border-1 text-center rounded-xl shadow-lg transition-all duration-700 hover:shadow-xl hover:-translate-y-2 opacity-100 translate-y-0"
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
    </div>
  )
}

export default Feature