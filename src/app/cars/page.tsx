import { useState, useMemo } from "react"
import { useNavigate }         from "react-router-dom"
import { motion }            from "framer-motion"
import { Car, MapPin, Star, Users, Gauge, Calendar } from "lucide-react"
import Navbar  from "@/components/Navbar"
import { cars }       from "@/data/mockData"
import { useBookingStore } from "@/store/bookingStore"
import { useAuth }         from "@/context/AuthContext"
import { formatPrice, cn } from "@/lib/utils"
import toast  from "react-hot-toast"

const TYPES    = ["All", "Economy", "Compact", "SUV", "Luxury", "Van"]
const BRANDS   = ["All", "Toyota", "BMW", "Mercedes", "Hyundai", "Rolls-Royce"]
const TRANS    = ["All", "Automatic", "Manual"]
const LOCATIONS = ["All", "Cairo Airport", "Dubai Airport", "Istanbul Airport"]

export default function CarsPage() {
  const navigate = useNavigate()
  const { user: session } = useAuth()
  const setBooking = useBookingStore(s => s.setBooking)

  const [type,     setType]     = useState("All")
  const [brand,    setBrand]    = useState("All")
  const [trans,    setTrans]    = useState("All")
  const [location, setLocation] = useState("All")
  const [pickUp,   setPickUp]   = useState("")
  const [dropOff,  setDropOff]  = useState("")
  const [sort,     setSort]     = useState("price")

  const days = pickUp && dropOff
    ? Math.max(1, Math.ceil((new Date(dropOff).getTime() - new Date(pickUp).getTime()) / 86400000))
    : 1

  const filtered = useMemo(() => {
    let result = [...cars]
    if (type !== "All")     result = result.filter(c => c.type === type)
    if (brand !== "All")    result = result.filter(c => c.brand === brand)
    if (trans !== "All")    result = result.filter(c => c.transmission === trans)
    if (location !== "All") result = result.filter(c => c.location === location)

    switch (sort) {
      case "price":  return result.sort((a, b) => a.pricePerDay - b.pricePerDay)
      case "rating": return result.sort((a, b) => b.rating - a.rating)
      default:       return result
    }
  }, [type, brand, trans, location, sort])

  function handleBook(car: typeof cars[0]) {
    if (!session) { navigate("/login"); return }
    if (!pickUp || !dropOff) { toast.error("Please select pick-up and drop-off dates"); return }

    setBooking({
      type:  "car",
      item:  car,
      details: { pickUp, dropOff, days, location: car.location },
      totalPrice: car.pricePerDay * days,
    })
    navigate("/checkout")
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />

      <div className="bg-gradient-to-b from-dark-900 to-dark-950 pt-24 pb-8 border-b border-white/8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Car className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Car Rentals</h1>
              <p className="text-white/40 text-sm">{filtered.length} cars available</p>
            </div>
          </div>

          {/* Date Picker */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
              <input type="date" value={pickUp}
                onChange={e => setPickUp(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                placeholder="Pick-up Date"
                className="input pl-10 bg-dark-800 border-white/10" />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
              <input type="date" value={dropOff}
                onChange={e => setDropOff(e.target.value)}
                min={pickUp || new Date().toISOString().split("T")[0]}
                placeholder="Drop-off Date"
                className="input pl-10 bg-dark-800 border-white/10" />
            </div>
            <div>
              <select value={location} onChange={e => setLocation(e.target.value)}
                className="input bg-dark-800 border-white/10">
                {LOCATIONS.map(l => <option key={l} value={l} className="bg-dark-900">{l}</option>)}
              </select>
            </div>
            {pickUp && dropOff && (
              <div className="flex items-center justify-center bg-orange-500/20 border border-orange-500/30 rounded-xl px-4">
                <span className="text-orange-400 font-semibold">{days} day{days > 1 ? "s" : ""} rental</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {[
            { label: "Type",  items: TYPES,    state: type,     setState: setType     },
            { label: "Brand", items: BRANDS,   state: brand,    setState: setBrand    },
            { label: "Trans", items: TRANS,    state: trans,    setState: setTrans    },
          ].map(filter => (
            <div key={filter.label} className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-white/40">{filter.label}:</span>
              {filter.items.map(item => (
                <button key={item}
                  onClick={() => filter.setState(item)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs border transition-all",
                    filter.state === item
                      ? "border-orange-500 bg-orange-500/20 text-orange-400"
                      : "border-white/10 text-white/50 hover:border-orange-500/50"
                  )}>
                  {item}
                </button>
              ))}
            </div>
          ))}

          <div className="ml-auto flex gap-2 items-center">
            <span className="text-xs text-white/40">Sort:</span>
            {["price", "rating"].map(s => (
              <button key={s} onClick={() => setSort(s)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs border transition-all capitalize",
                  sort === s
                    ? "border-primary-500 bg-primary-500/20 text-primary-400"
                    : "border-white/10 text-white/50"
                )}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((car, i) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="card overflow-hidden group hover:border-orange-500/30 transition-all"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden bg-dark-900">
                <img src={car.image} alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-3 right-3">
                  <span className={cn("badge text-white text-xs", {
                    "bg-blue-600":   car.type === "Economy"  || car.type === "Compact",
                    "bg-green-600":  car.type === "SUV",
                    "bg-purple-600": car.type === "Luxury",
                    "bg-orange-600": car.type === "Van",
                  })}>
                    {car.type}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold group-hover:text-orange-400 transition-colors">
                      {car.brand} {car.model}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-white/50 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {car.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                    <span className="text-sm font-semibold">{car.rating}</span>
                  </div>
                </div>

                {/* Specs */}
                <div className="flex items-center gap-3 text-xs text-white/50 mb-3">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {car.seats} seats
                  </div>
                  <div className="flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5" />
                    {car.transmission}
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {car.features.slice(0, 3).map(f => (
                    <span key={f} className="text-xs bg-white/5 border border-white/8 px-2 py-0.5 rounded-lg text-white/50">
                      {f}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-orange-400">{formatPrice(car.pricePerDay)}</p>
                    <p className="text-xs text-white/40">per day {days > 1 && `· ${formatPrice(car.pricePerDay * days)} total`}</p>
                  </div>
                  <button
                    onClick={() => handleBook(car)}
                    className="bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold
                      px-4 py-2 rounded-xl transition-all"
                  >
                    Rent Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}