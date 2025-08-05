import React from 'react'

const HowItWorks = () => {
    
  return (
    <div>

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
    </div>
  )
}

export default HowItWorks