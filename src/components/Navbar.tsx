import { useState, useEffect } from "react"
import { Link, useLocation }    from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plane, Hotel, Map, Car, Menu, X,
  User, LogOut, ChevronDown, Compass,
  Heart
} from "lucide-react"
import { useAuth }             from "@/context/AuthContext"
import { cn }                  from "@/lib/utils"

const NAV_LINKS = [
  { label: "Flights", href: "/flights", icon: Plane  },
  { label: "Hotels",  href: "/hotels",  icon: Hotel  },
  { label: "Tours",   href: "/tours",   icon: Map    },
  { label: "Cars",    href: "/cars",    icon: Car    },
]

export default function Navbar() {
  const { pathname }   = useLocation()
  const { user: session, logout } = useAuth()
  const [scrolled,     setScrolled]    = useState(false)
  const [mobileOpen,   setMobileOpen]  = useState(false)
  const [userMenu,     setUserMenu]    = useState(false)
  const isHome = pathname === "/"

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      scrolled || !isHome
        ? "bg-dark-900/95 backdrop-blur-xl border-b border-white/8 py-3"
        : "bg-transparent py-5"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl
            flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-blue-400
              bg-clip-text text-transparent">
              Safarni
            </span>
            <span className="block text-[9px] text-white/40 tracking-widest uppercase -mt-0.5">
              Travel & Explore
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center bg-white/5 rounded-2xl p-1.5 gap-1 border border-white/8">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                pathname.startsWith(link.href)
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-600/25"
                  : "text-white/70 hover:text-white hover:bg-white/8"
              )}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <Link to="/dashboard"
                className="hidden md:flex items-center gap-2 text-sm text-white/60
                  hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-white/8">
                <Heart className="w-4 h-4" />
                My Trips
              </Link>

              <div className="relative">
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl
                    hover:bg-white/8 transition-colors border border-white/10"
                >
                  {session.profilePicture?.url ? (
                    <img src={session.profilePicture.url} alt="" className="w-7 h-7 rounded-full" />
                  ) : (
                    <div className="w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {session.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm hidden md:block text-white/80">
                    {session.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-white/40" />
                </button>

                <AnimatePresence>
                  {userMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 top-12 w-52 bg-dark-800 border border-white/10
                        rounded-2xl shadow-2xl overflow-hidden"
                    >
                      <div className="p-1.5">
                        <div className="px-4 py-2.5 border-b border-white/8 mb-1">
                          <p className="text-sm font-semibold">{session.name}</p>
                          <p className="text-xs text-white/40 truncate">{session.email}</p>
                        </div>
                        <Link
                          to="/dashboard"
                          onClick={() => setUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm
                            text-white/70 hover:text-white hover:bg-white/8 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          My Dashboard
                        </Link>
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm
                            text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login"
                className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2">
                Sign In
              </Link>
              <Link to="/register"
                className="btn-primary text-sm py-2.5">
                Get Started
              </Link>
            </div>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-white/8 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/8 bg-dark-900/95 md:hidden"
          >
            <div className="p-4 grid grid-cols-2 gap-2">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 p-3 rounded-xl text-sm font-medium transition-all",
                    pathname.startsWith(link.href)
                      ? "bg-primary-600 text-white"
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}