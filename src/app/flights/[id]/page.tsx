import { useState }  from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion }         from "framer-motion"
import {
  Plane, Clock, Star, Users, Luggage,
  Wifi, ArrowLeft, Shield, Check,
  ChevronRight, Calendar
} from "lucide-react"
import { Link }               from "react-router-dom"
import Navbar             from "@/components/Navbar"
import { getFlightById }  from "@/data/mockData"
import { useBookingStore } from "@/store/bookingStore"
import { useAuth }        from "@/context/AuthContext"
import { formatPrice, formatDuration, cn } from "@/lib/utils"
import toast              from "react-hot-toast"

export default function FlightDetailsPage() {
  const { id }    = useParams<{ id: string }>()
  const flight    = getFlightById(id || "")
  if (!flight) return <div className="text-white text-center p-20">Flight not found</div>

  const router    = useNavigate()
  const { user: session } = useAuth()
  const setBooking = useBookingStore(s => s.setBooking)

  const [passengers, setPassengers] = useState(1)
  const [selectedClass, setSelectedClass] = useState(flight.class)
  const [date,   setDate]   = useState("")

  const total = flight.price * passengers

  function handleBook() {
    if (!session) { router("/login"); return }
    if (!date) { toast.error("Please select a travel date"); return }

    setBooking({
      type:  "flight",
      item:  flight,
      details: { passengers, class: selectedClass, date },
      totalPrice: total,
    })
    router("/checkout")
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <Link to="/flights" className="flex items-center gap-2 text-white/40 hover:text-primary-400
          transition-colors text-sm mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Flights
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main */}
          <div className="lg:col-span-2 space-y-5">

            {/* Flight Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl">{flight.logo}</span>
                <div>
                  <h1 className="text-2xl font-bold">{flight.airline}</h1>
                  <div className="flex items-center gap-3 text-sm text-white/50">
                    <span>{flight.class}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                      {flight.rating} rating
                    </div>
                  </div>
                </div>
              </div>

              {/* Route Visual */}
              <div className="bg-dark-900 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-bold">{flight.departure}</p>
                    <p className="text-xl font-semibold mt-1">{flight.from}</p>
                    <p className="text-white/50">{flight.fromCity}</p>
                  </div>

                  <div className="flex-1 flex flex-col items-center px-6">
                    <p className="text-sm text-white/40 mb-2">{formatDuration(flight.duration)}</p>
                    <div className="w-full flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary-500 rounded-full" />
                      <div className="flex-1 border-t-2 border-dashed border-primary-500/40 relative">
                        <Plane className="absolute left-1/2 -translate-x-1/2 -top-3 w-5 h-5 text-primary-400" />
                      </div>
                      <div className="w-3 h-3 bg-primary-500 rounded-full" />
                    </div>
                    <p className="text-xs text-white/40 mt-2">
                      {flight.stops === 0 ? "Direct Flight" : `${flight.stops} Stop`}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-4xl font-bold">{flight.arrival}</p>
                    <p className="text-xl font-semibold mt-1">{flight.to}</p>
                    <p className="text-white/50">{flight.toCity}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Includes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-5"
            >
              <h2 className="font-bold mb-4">What's Included</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Luggage, text: "23kg Checked Baggage" },
                  { icon: Luggage, text: "7kg Cabin Baggage"    },
                  { icon: Wifi,    text: "In-flight WiFi"        },
                  { icon: Users,   text: "Meal Service"          },
                  { icon: Shield,  text: "Travel Insurance"      },
                  { icon: Check,   text: "Flexible Rebooking"    },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2.5 text-sm text-white/70">
                    <div className="w-7 h-7 bg-primary-500/15 rounded-lg flex items-center justify-center shrink-0">
                      <item.icon className="w-3.5 h-3.5 text-primary-400" />
                    </div>
                    {item.text}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card p-5 h-fit sticky top-24"
          >
            <h3 className="font-bold text-lg mb-5">Book This Flight</h3>

            {/* Date */}
            <div className="mb-4">
              <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Travel Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Passengers */}
            <div className="mb-4">
              <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Passengers</label>
              <div className="flex items-center gap-3 bg-dark-900 border border-white/10 rounded-xl p-3">
                <button
                  onClick={() => setPassengers(Math.max(1, passengers - 1))}
                  className="w-8 h-8 bg-dark-800 rounded-lg flex items-center justify-center
                    hover:bg-primary-500/20 transition-colors text-lg"
                >
                  −
                </button>
                <span className="flex-1 text-center font-semibold">{passengers}</span>
                <button
                  onClick={() => setPassengers(Math.min(flight.seats, passengers + 1))}
                  className="w-8 h-8 bg-dark-800 rounded-lg flex items-center justify-center
                    hover:bg-primary-500/20 transition-colors text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-dark-900 rounded-xl p-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">{formatPrice(flight.price)} × {passengers}</span>
                <span>{formatPrice(flight.price * passengers)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Taxes & Fees</span>
                <span className="text-green-400">Included</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary-400 text-lg">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={handleBook}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Plane className="w-4 h-4" />
              Book Now
            </button>

            <p className="text-xs text-white/30 text-center mt-3">
              Free cancellation within 24 hours
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}