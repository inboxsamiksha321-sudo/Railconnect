import { Link } from 'react-router-dom'
import { Train, Phone, Mail, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-rail-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-rail-accent p-1.5 rounded-lg">
                <Train className="w-5 h-5 text-white" />
              </div>
              <span className="font-syne font-bold text-white text-xl">
                Rail<span className="text-rail-accent">Connect</span>
              </span>
            </div>
            <p className="text-blue-200 text-sm font-dm leading-relaxed">
              Unified Smart Complaint Platform for Indian Railways.
              Your grievance, our priority.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-syne font-bold text-white mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Home',            path: '/'        },
                { label: 'Track Complaint', path: '/track'   },
                { label: 'Public Notices',  path: '/notices' },
                { label: 'About Us',        path: '/about'   },
              ].map((link, i) => (
                <Link
                  key={i}
                  to={link.path}
                  className="text-blue-200 hover:text-white text-sm font-dm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Portals */}
          <div>
            <h3 className="font-syne font-bold text-white mb-4">Portals</h3>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Passenger Portal', path: '/login'    },
                { label: 'Staff Portal',     path: '/login'    },
                { label: 'Admin Portal',     path: '/login'    },
                { label: 'Register',         path: '/register' },
              ].map((link, i) => (
                <Link
                  key={i}
                  to={link.path}
                  className="text-blue-200 hover:text-white text-sm font-dm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-syne font-bold text-white mb-4">Contact</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rail-accent flex-shrink-0" />
                <span className="text-blue-200 text-sm font-dm">139 (Railway Helpline)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rail-accent flex-shrink-0" />
                <span className="text-blue-200 text-sm font-dm">support@railconnect.in</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rail-accent flex-shrink-0" />
                <span className="text-blue-200 text-sm font-dm">Ministry of Railways, New Delhi</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-blue-300 text-xs font-dm">
            © 2026 RailConnect · Ministry of Railways, Government of India
          </p>
          <p className="text-blue-300 text-xs font-dm">
            All rights reserved
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer