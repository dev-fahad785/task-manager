import React from 'react'

const Pricing = () => {
  return (
    <div>
              {/* Pricing */}
      <section id="pricing" className="bg-gray-50 py-20 animate-on-scroll">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-3xl font-bold text-gray-800 transition-all duration-700 opacity-100 translate-y-0 `}>Simple Pricing That Scales With You</h2>
            <p className={`mt-4 text-xl text-gray-600 max-w-2xl mx-auto transition-all duration-700 opacity-100 translate-y-0' `} style={{ transitionDelay: '100ms' }}>
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
                  className={`bg-gray-600 p-8 rounded-xl shadow-lg transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 
                    opacity-100 translate-y-0`}
                >
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    {plan.title}
                  </h3>
                  <p className="text-gray-300 mb-4">{plan.description}</p>
                  <div
                    className={`flex items-center justify-center bg-indigo-500 text-white font-bold rounded-lg h-12 w-24 mb-4 text-lg transition-all duration-500`}
                    style={{ transitionDelay: '300ms' }}
                  >
                    {plan.price}
                  </div>
                  <p className="text-gray-400 mb-4">Per user / month</p>
                  <ul className="text-gray-300">
                    {plan.features.map((feature, i) => (
                      <li
                        key={feature}
                        className={`flex items-center gap-2 mb-2 transition-all duration-500 opacity-100 translate-x-0`}
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
                    className={`block bg-indigo-500 text-white rounded-lg font-semibold text-center py-3 hover:bg-indigo-600 transition mt-6 'opacity-100 translate-y-0 hover:scale-105`}
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
    </div>
  )
}

export default Pricing