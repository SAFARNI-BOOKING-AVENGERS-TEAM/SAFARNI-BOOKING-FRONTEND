import { useState }   from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion }          from "framer-motion"
import {
  MapPin, Star, Users, Calendar, ArrowLeft,
  Check, Shield, Wifi, Coffee, Car, Waves, ChevronLeft, ChevronRight
} from "lucide-react"
import { Link }             from "react-router-dom"
import Navbar              from "@/components/Navbar"
import { getHotelById }   from "@/data/mockData"
import { useBookingStore } from "@/store/bookingStore"
import { useAuth }         from "@/context/AuthContext"
import { formatPrice, cn } from "@/lib/utils"
import toast               from "react-hot-toast"

export default function HotelDetailsPage() {
  const { id }   = useParams<{ id: string }>()
  const hotel    = getHotelById(id || "")
  if (!hotel) return <div className="text-white text-center p-20">Hotel not found</div>

  const router   = useNavigate()
  const { user: session } = useAuth()
  const setBooking = useBookingStore(s => s.setBooking)

  const [activeImg,  setActiveImg]  = useState(0)
  const [checkIn,    setCheckIn]    = useState("")
  const [checkOut,   setCheckOut]   = useState("")
  const [guests,     setGuests]     = useState(1)

  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 1
  const total = hotel.pricePerNight * nights * guests

  function handleBook() {
    if (!session) { router("/login"); return }
    if (!checkIn || !checkOut) { toast.error("Please select check-in and check-out dates"); return }

    setBooking({
      type:  "hotel",
      item:  hotel,
      details: { checkIn, checkOut, guests, nights },
      totalPrice: total,
    })
    router("/checkout")
  }

  const AMENITY_ICONS: Record<string, any> = {
    Wifi: Wifi, Pool: Waves, Restaurant: Coffee,
    Parking: Car, Gym: Users, Spa: Shield,
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        <Link to="/hotels" className="flex items-center gap-2 text-white/40 hover:text-primary-400
          transition-colors text-sm mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Hotels
        </Link>

        {/* Image Gallery */}
        <div className="grid grid-cols-3 gap-3 mb-8 h-72 md:h-96">
          <div className="col-span-2 relative overflow-hidden rounded-2xl">
            <img src={hotel.images[activeImg]} alt={hotel.name}
              className="w-full h-full object-cover" />
            <div className="absolute bottom-3 right-3 flex gap-1.5">
              {hotel.images.map((_, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={cn("w-2 h-2 rounded-full transition-all",
                    activeImg === i ? "bg-white w-5" : "bg-white/50")} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {hotel.images.slice(1, 3).map((img, i) => (
              <div key={i} className="flex-1 overflow-hidden rounded-2xl cursor-pointer"
                onClick={() => setActiveImg(i + 1)}>
                <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(hotel.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-gold-400 fill-gold-400" />
                    ))}
                  </div>
                  <h1 className="text-2xl font-bold mb-1">{hotel.name}</h1>
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <MapPin className="w-4 h-4" />
                    {hotel.address}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end mb-1">
                    <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                    <span className="font-bold text-lg">{hotel.rating}</span>
                  </div>
                  <p className="text-xs text-white/40">{hotel.reviewCount.toLocaleString()} reviews</p>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">{hotel.description}</p>
            </motion.div>

            {/* Amenities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-5"
            >
              <h2 className="font-bold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {hotel.amenities.map(amenity => {
                  const Icon = AMENITY_ICONS[amenity] || Check
                  return (
                    <div key={amenity} className="flex items-center gap-2.5 text-sm text-white/70
                      bg-dark-900 rounded-xl p-3">
                      <div className="w-8 h-8 bg-primary-500/15 rounded-lg flex items-center justify-center">
                        <Icon className="w-4 h-4 text-primary-400" />
                      </div>
                      {amenity}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* Booking Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card p-5 h-fit sticky top-24"
          >
            <div className="text-center mb-4 pb-4 border-b border-white/8">
              <span className="text-3xl font-bold text-primary-400">{formatPrice(hotel.pricePerNight)}</span>
              <span className="text-white/40 text-sm">/night</span>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Check-in</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
                  <input type="date" value={checkIn}
                    onChange={e => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="input pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Check-out</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
                  <input type="date" value={checkOut}
                    onChange={e => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split("T")[0]}
                    className="input pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Guests</label>
                <div className="flex items-center gap-3 bg-dark-900 border border-white/10 rounded-xl p-3">
                  <button onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-8 h-8 bg-dark-800 rounded-lg flex items-center justify-center text-lg hover:bg-primary-500/20 transition-colors">
                    −
                  </button>
                  <span className="flex-1 text-center font-semibold">{guests}</span>
                  <button onClick={() => setGuests(Math.min(10, guests + 1))}
                    className="w-8 h-8 bg-dark-800 rounded-lg flex items-center justify-center text-lg hover:bg-primary-500/20 transition-colors">
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-dark-900 rounded-xl p-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">{formatPrice(hotel.pricePerNight)} × {nights} night{nights > 1 ? "s" : ""}</span>
                <span>{formatPrice(hotel.pricePerNight * nights)}</span>
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

            <button onClick={handleBook} className="btn-primary w-full">
              Reserve Now
            </button>
            <p className="text-xs text-white/30 text-center mt-2">Free cancellation · No credit card needed</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}