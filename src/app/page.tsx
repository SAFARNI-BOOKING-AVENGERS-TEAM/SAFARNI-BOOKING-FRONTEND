import { motion, useScroll, useTransform } from "framer-motion"
import { useRef }   from "react"
import { Link }     from "react-router-dom"
import {
  Plane, Hotel, Map, Car, Star, ArrowRight,
  Shield, Clock, Award, HeadphonesIcon,
  ChevronRight, MapPin, TrendingUp
} from "lucide-react"
import Navbar      from "@/components/Navbar"
import SearchBar   from "@/components/SearchBar"
import { tours, hotels } from "@/data/mockData"
import { formatPrice }   from "@/lib/utils"

const DESTINATIONS = [
  { name: "Dubai",     country: "UAE",     img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80", tours: 48 },
  { name: "Istanbul",  country: "Turkey",  img: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600&q=80", tours: 32 },
  { name: "Cairo",     country: "Egypt",   img: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=600&q=80", tours: 41 },
  { name: "Santorini", country: "Greece",  img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", tours: 19 },
  { name: "Maldives",  country: "Maldives",img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80", tours: 24 },
  { name: "Paris",     country: "France",  img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80", tours: 37 },
]

const FEATURES = [
  { icon: Shield,          title: "Best Price Guarantee",  desc: "Find a lower price? We'll match it"           },
  { icon: Clock,           title: "24/7 Support",          desc: "Round-the-clock assistance wherever you are"  },
  { icon: Award,           title: "Verified Reviews",      desc: "Trusted ratings from real travelers"          },
  { icon: HeadphonesIcon,  title: "Expert Guidance",       desc: "Travel specialists ready to help plan"        },
]

const STATS = [
  { value: "2M+",  label: "Happy Travelers"  },
  { value: "150+", label: "Destinations"     },
  { value: "98%",  label: "Satisfaction Rate" },
  { value: "10+",  label: "Years Experience" },
]

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY       = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* BG */}
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1800&q=80"
            alt="Travel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-950/70 via-dark-950/50 to-dark-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-950/80 to-transparent" />
        </motion.div>

        {/* Floating Cards */}
        <div className="absolute top-32 right-10 hidden xl:block">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="glass rounded-2xl p-4 w-48"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Plane className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/50">Next Flight</p>
                <p className="text-sm font-semibold">Cairo → Dubai</p>
              </div>
            </div>
            <div className="flex justify-between text-xs text-white/50">
              <span>08:00 AM</span>
              <span className="text-primary-400 font-semibold">$450</span>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-40 right-20 hidden xl:block">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 4, delay: 1 }}
            className="glass rounded-2xl p-4 w-44"
          >
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
              <span className="text-sm font-semibold">4.9/5</span>
            </div>
            <p className="text-xs text-white/50">Based on 50K+ reviews</p>
            <div className="flex -space-x-2 mt-2">
              {["bg-blue-500","bg-green-500","bg-purple-500","bg-pink-500"].map(c => (
                <div key={c} className={`w-6 h-6 ${c} rounded-full border-2 border-dark-900`} />
              ))}
              <div className="w-6 h-6 bg-dark-700 rounded-full border-2 border-dark-900 flex items-center justify-center text-[9px]">
                +99
              </div>
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-24 pb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-500/30
              px-4 py-2 rounded-full text-sm text-primary-300 mb-6">
              <TrendingUp className="w-4 h-4" />
              <span>Over 2 Million Trips Booked</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              <span className="block text-white">Discover the</span>
              <span className="block bg-gradient-to-r from-primary-400 via-blue-400 to-cyan-400
                bg-clip-text text-transparent">
                World With Us
              </span>
            </h1>

            <p className="text-xl text-white/60 max-w-xl leading-relaxed">
              Book flights, hotels, unforgettable tours, and car rentals — all in one place.
              Your perfect journey starts here.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <SearchBar />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-8 mt-10"
          >
            {STATS.map(stat => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/40">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── SERVICES ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Plane, label: "Flights",      href: "/flights", count: "500+ Airlines",    color: "from-blue-500 to-blue-600"    },
            { icon: Hotel, label: "Hotels",       href: "/hotels",  count: "10K+ Properties",  color: "from-purple-500 to-purple-600" },
            { icon: Map,   label: "Tours",        href: "/tours",   count: "200+ Experiences", color: "from-green-500 to-green-600"  },
            { icon: Car,   label: "Car Rentals",  href: "/cars",    count: "50+ Brands",       color: "from-orange-500 to-orange-600" },
          ].map((service, i) => (
            <motion.div
              key={service.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <Link to={service.href}>
                <div className="card p-5 hover:border-primary-500/30 transition-all group cursor-pointer">
                  <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-xl
                    flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold mb-1 group-hover:text-primary-400 transition-colors">
                    {service.label}
                  </h3>
                  <p className="text-sm text-white/40">{service.count}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs text-primary-400 opacity-0
                    group-hover:opacity-100 transition-opacity">
                    <span>Explore</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── POPULAR DESTINATIONS ──────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary-400 text-sm font-medium mb-1">Explore the World</p>
            <h2 className="text-3xl md:text-4xl font-bold">Popular <span className="text-primary-400">Destinations</span></h2>
          </div>
          <Link to="/tours" className="btn-outline text-sm hidden md:flex items-center gap-2">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {DESTINATIONS.map((dest, i) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={i === 0 ? "md:row-span-2" : ""}
            >
              <Link to={`/tours?destination=${dest.name}`}>
                <div className={`relative overflow-hidden rounded-2xl group cursor-pointer
                  ${i === 0 ? "h-full min-h-[300px]" : "h-44 md:h-52"}`}>
                  <img
                    src={dest.img}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="font-bold text-lg">{dest.name}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-white/60">
                      <MapPin className="w-3.5 h-3.5" />
                      {dest.country}
                      <span className="ml-1 text-primary-400">{dest.tours} tours</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURED TOURS ────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary-400 text-sm font-medium mb-1">Top Rated</p>
            <h2 className="text-3xl md:text-4xl font-bold">Featured <span className="text-primary-400">Tours</span></h2>
          </div>
          <Link to="/tours" className="btn-outline text-sm hidden md:flex items-center gap-2">
            All Tours <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tours.slice(0, 3).map((tour, i) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Link to={`/tours/${tour.id}`}>
                <div className="card overflow-hidden group cursor-pointer hover:border-primary-500/30 transition-all">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={tour.image}
                      alt={tour.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="badge bg-primary-600 text-white">{tour.category}</span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="badge bg-dark-900/80 text-white">{tour.duration}D</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                      <span className="text-sm font-semibold">{tour.rating}</span>
                      <span className="text-xs text-white/40">({tour.reviewCount})</span>
                    </div>
                    <h3 className="font-bold mb-1 group-hover:text-primary-400 transition-colors line-clamp-1">
                      {tour.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-white/50 mb-3">
                      <MapPin className="w-3.5 h-3.5" />
                      {tour.destination}, {tour.country}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-white/40">From</span>
                        <p className="text-lg font-bold text-primary-400">{formatPrice(tour.price)}</p>
                      </div>
                      <span className="text-xs text-white/40">per person</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURED HOTELS ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary-400 text-sm font-medium mb-1">Luxury Stays</p>
            <h2 className="text-3xl md:text-4xl font-bold">Top <span className="text-primary-400">Hotels</span></h2>
          </div>
          <Link to="/hotels" className="btn-outline text-sm hidden md:flex items-center gap-2">
            All Hotels <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {hotels.slice(0, 3).map((hotel, i) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Link to={`/hotels/${hotel.id}`}>
                <div className="card overflow-hidden group cursor-pointer hover:border-primary-500/30 transition-all">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 flex gap-1">
                      {[...Array(hotel.stars)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                      ))}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-1 group-hover:text-primary-400 transition-colors line-clamp-1">
                      {hotel.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-white/50 mb-3">
                      <MapPin className="w-3.5 h-3.5" />
                      {hotel.city}, {hotel.country}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-white/40">From</span>
                        <p className="text-lg font-bold text-primary-400">
                          {formatPrice(hotel.pricePerNight)}<span className="text-xs text-white/40">/night</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                        <span className="text-sm font-semibold">{hotel.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── WHY US ────────────────────────────────────── */}
      <section className="bg-dark-900 border-y border-white/8 py-20 mt-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-primary-400 text-sm font-medium mb-2">Why Safarni</p>
            <h2 className="text-3xl md:text-4xl font-bold">Travel Smarter, Not Harder</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 bg-primary-500/15 border border-primary-500/20 rounded-2xl
                  flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900/50 to-blue-900/30
            border border-primary-500/20 p-10 md:p-16 text-center"
        >
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "30px 30px" }}
          />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to <span className="text-primary-400">Explore?</span>
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
              Join millions of travelers who trust Safarni for their perfect journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-base px-8 py-4">
                Start Your Journey
              </Link>
              <Link to="/tours" className="btn-outline text-base px-8 py-4">
                Browse Tours
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">
              Safarni
            </span>
            <span className="text-white/20 text-sm">© 2025</span>
          </div>
          <div className="flex gap-6 text-sm text-white/40">
            {["About", "Privacy", "Terms", "Contact"].map(l => (
              <Link key={l} to="#" className="hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
          <p className="text-white/30 text-sm">Built by Mohammed Sherif</p>
        </div>
      </footer>
    </div>
  )
}