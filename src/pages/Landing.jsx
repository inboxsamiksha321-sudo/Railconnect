import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Train, Shield, Users, Star, ChevronRight, CheckCircle } from 'lucide-react'

const slides = [
  {
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80',
    quote: 'Cleanliness is not just a habit, it is a commitment to our passengers.',
    dept: 'Cleanliness & Hygiene Department',
  },
  {
    url: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=1600&q=80',
    quote: 'Every meal served is a promise of quality and care.',
    dept: 'Food & Catering Department',
  },
  {
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&q=80',
    quote: 'Safety is our first priority, every journey, every time.',
    dept: 'Safety & Security Department',
  },
  {
    url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1600&q=80',
    quote: 'Every complaint resolved is a passenger retained.',
    dept: 'Railway Operations',
  },
  {
    url: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=1600&q=80',
    quote: 'Together we build a better railway for every Indian.',
    dept: 'Indian Railways',
  },
]

const stats = [
  { label: 'Complaints Resolved', value: '2.4L+' },
  { label: 'Departments Active',  value: '8'     },
  { label: 'Resolution Rate',     value: '98%'   },
  { label: 'Avg Resolution Time', value: '3 Days'},
]

const departments = [
  { icon: '🧹', label: 'Cleanliness'       },
  { icon: '⚡', label: 'Electrical'         },
  { icon: '🏗️', label: 'Infrastructure'    },
  { icon: '🛡️', label: 'Safety & Security' },
  { icon: '👮', label: 'Staff'             },
  { icon: '🍱', label: 'Catering'          },
  { icon: '💊', label: 'Medical'           },
  { icon: '📋', label: 'General'           },
]

const Landing = () => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen">

      {/* Minimal Navbar */}
      <nav className="bg-dept-blue sticky top-0 z-50 shadow-lg">
        <div className="h-1 bg-dept-accent w-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <div className="bg-dept-accent p-1.5 rounded-lg">
                <Train className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-syne font-bold text-white text-lg">
                  Rail<span className="text-dept-accent">Connect</span>
                </span>
                <p className="text-blue-300 text-xs font-dm leading-none">
                  Railway Departments Portal
                </p>
              </div>
            </div>
            <Link
              to="/login"
              className="bg-dept-accent hover:bg-orange-500 text-white font-dm text-sm font-semibold px-6 py-2 rounded-lg transition-all"
            >
              Department Login →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Slideshow */}
      <div className="relative h-[90vh] flex items-center justify-center overflow-hidden">

        {slides.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              opacity: i === current ? 1 : 0,
              backgroundImage: `url(${slide.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-dept-blue/75" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Train className="w-4 h-4 text-dept-accent" />
            <span className="text-white text-sm font-dm">
              Indian Railways · Internal Department Portal
            </span>
          </div>

          <h1 className="font-syne font-bold text-white text-5xl md:text-6xl mb-4 leading-tight">
            Railway<br />
            <span className="text-dept-accent">Departments Portal</span>
          </h1>

          {/* Quote */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-5 mb-8 max-w-2xl mx-auto">
            <p className="text-white font-dm text-lg italic mb-2">
              "{slides[current].quote}"
            </p>
            <p className="text-dept-accent text-sm font-dm font-medium">
              — {slides[current].dept}
            </p>
          </div>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-dept-accent hover:bg-orange-500 text-white font-dm font-semibold px-8 py-3.5 rounded-xl transition-all"
          >
            Login to Your Department <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current ? 'bg-dept-accent w-6' : 'bg-white/40'
              }`}
            />
          ))}
        </div>

      </div>

      {/* Stats */}
      <div className="bg-dept-blue py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-syne font-bold text-dept-accent text-3xl">{stat.value}</p>
                <p className="text-blue-200 font-dm text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="bg-dept-bg py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-syne font-bold text-dept-blue text-3xl mb-2">
              Active Departments
            </h2>
            <p className="text-dept-gray font-dm">
              Each department handles AI-routed complaints from passengers
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {departments.map((dept, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center hover:shadow-md transition-all">
                <p className="text-3xl mb-3">{dept.icon}</p>
                <p className="font-dm font-medium text-dept-blue text-sm">{dept.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-syne font-bold text-dept-blue text-3xl mb-2">
              How It Works
            </h2>
            <p className="text-dept-gray font-dm">
              AI-powered complaint management system
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Passenger Files Complaint', desc: 'Passenger submits complaint via text, voice or photo on RailConnect app.', icon: '📝' },
              { step: '02', title: 'AI Routes to Department',   desc: 'Our trained AI model automatically detects the issue and routes it to the correct department.', icon: '🤖' },
              { step: '03', title: 'Department Resolves',       desc: 'Department staff views, acts on and resolves the complaint within SLA time.', icon: '✅' },
            ].map((item, i) => (
              <div key={i} className="bg-dept-bg rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="font-syne font-bold text-dept-accent text-2xl">{item.step}</span>
                </div>
                <h3 className="font-syne font-bold text-dept-blue mb-2">{item.title}</h3>
                <p className="text-dept-gray text-sm font-dm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-dept-blue py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-syne font-bold text-white text-3xl mb-4">
            Ready to manage your department?
          </h2>
          <p className="text-blue-200 font-dm mb-8">
            Login with your department credentials to get started
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-dept-accent hover:bg-orange-500 text-white font-dm font-semibold px-8 py-3.5 rounded-xl transition-all"
          >
            Department Login <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  )
}

export default Landing