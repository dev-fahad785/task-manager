import React from 'react'

const Testimonials = () => {
  return (
    <div>
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
    </div>
  )
}

export default Testimonials