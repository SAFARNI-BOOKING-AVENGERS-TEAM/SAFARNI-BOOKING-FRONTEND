import { useState }  from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion }         from "framer-motion"
import {
  MapPin, Star, Users, Clock, ArrowLeft,
  Check, Calendar, Shield, Camera
} from "lucide-react"
import { Link }               from "react-router-dom"
import Navbar             from "@/components/Navbar"
import { getTourById }    from "@/data/mockData"
import { useBookingStore } from "@/store/bookingStore"
import { useAuth }        from "@/context/AuthContext"
import { formatPrice, cn } from "@/lib/utils"
import toast              from "react-hot-toast"

export default function TourDetailsPage() {
  const { id }  = useParams<{ id: string }>()
  const tour    = getTourById(id || "")
  if (!tour) return <div className="text-white text-center p-20">Tour not found</div>

  const router  = useNavigate()
  const { user: session } = useAuth()
  const setBooking = useBookingStore(s => s.setBooking)

  const [persons, setPersons] = useState(1)
  const [date,    setDate]    = useState("")
  const [activeImg, setActiveImg] = useState(0)

  const total = tour.price * persons

  function handleBook() {
    if (!session) { router("/login"); return }
    if (!date) { toast.error("Please select a tour date"); return }
    setBooking({ type: "tour", item: tour, details: { persons, date }, totalPrice: total })
    router("/checkout")
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        <Link to="/tours" className="flex items-center gap-2 text-white/40 hover:text-green-400
          transition-colors text-sm mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Tours
        </Link>

        {/* Image */}
        <div className="relative h-72 md:h-96 rounded-3xl overflow-hidden mb-8">
          <img src={tour.images[activeImg]} alt={tour.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 to-transparent" />
          <div className="absolute bottom-5 left-5">
            <div className="flex items-center gap-2 mb-2">
              <span className={cn("badge text-white", {
                "bg-green-600": tour.difficulty === "Easy",
                "bg-orange-600": tour.difficulty === "Moderate",
                "bg-red-600": tour.difficulty === "Hard",
              })}>
                {tour.difficulty}
              </span>
              <span className="badge bg-dark-900/80 text-white">{tour.category}</span>
            </div>
            <h1 className="text-3xl font-bold">{tour.name}</h1>
            <div className="flex items-center gap-1 text-white/70 mt-1">
              <MapPin className="w-4 h-4" />
              {tour.destination}, {tour.country}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: Clock, label: "Duration", value: `${tour.duration} Days` },
                { icon: Users, label: "Group Size", value: `Max ${tour.groupSize}` },
                { icon: Star,  label: "Rating",    value: `${tour.rating}/5`     },
                { icon: Camera, label: "Reviews",   value: `${tour.reviewCount}`  },
              ].map(stat => (
                <div key={stat.label} className="card p-3 text-center">
                  <stat.icon className="w-5 h-5 text-green-400 mx-auto mb-1.5" />
                  <p className="text-xs text-white/40 mb-0.5">{stat.label}</p>
                  <p className="font-bold text-sm">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="card p-5">
              <h2 className="font-bold mb-3">About This Tour</h2>
              <p className="text-white/60 text-sm leading-relaxed">{tour.description}</p>
            </div>

            {/* Highlights */}
            <div className="card p-5">
              <h2 className="font-bold mb-4">Tour Highlights</h2>
              <div className="grid grid-cols-2 gap-2.5">
                {tour.highlights.map(h => (
                  <div key={h} className="flex items-center gap-2.5 text-sm text-white/70">
                    <div className="w-6 h-6 bg-green-500/15 rounded-lg flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-green-400" />
                    </div>
                    {h}
                  </div>
                ))}
              </div>
            </div>

            {/* Includes */}
            <div className="card p-5">
              <h2 className="font-bold mb-4">What's Included</h2>
              <div className="grid grid-cols-2 gap-2.5">
                {tour.includes.map(inc => (
                  <div key={inc} className="flex items-center gap-2.5 text-sm text-white/70">
                    <Shield className="w-4 h-4 text-primary-400 shrink-0" />
                    {inc}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card p-5 h-fit sticky top-24"
          >
            <div className="text-center mb-4 pb-4 border-b border-white/8">
              <span className="text-3xl font-bold text-green-400">{formatPrice(tour.price)}</span>
              <span className="text-white/40 text-sm"> / person</span>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Tour Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                  <input type="date" value={date}
                    onChange={e => setDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="input pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">
                  Persons (Max {tour.groupSize})
                </label>
                <div className="flex items-center gap-3 bg-dark-900 border border-white/10 rounded-xl p-3">
                  <button onClick={() => setPersons(Math.max(1, persons - 1))}
                    className="w-8 h-8 bg-dark-800 rounded-lg flex items-center justify-center text-lg hover:bg-green-500/20 transition-colors">
                    −
                  </button>
                  <span className="flex-1 text-center font-semibold">{persons}</span>
                  <button onClick={() => setPersons(Math.min(tour.groupSize, persons + 1))}
                    className="w-8 h-8 bg-dark-800 rounded-lg flex items-center justify-center text-lg hover:bg-green-500/20 transition-colors">
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-dark-900 rounded-xl p-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">{formatPrice(tour.price)} × {persons}</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-green-400 text-lg">{formatPrice(total)}</span>
              </div>
            </div>

            <button onClick={handleBook}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3
                rounded-xl transition-all flex items-center justify-center gap-2">
              Book This Tour
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}