"use client"

import { useState, useMemo }    from "react"
import { useSearchParams }      from "react-router-dom"
import { motion }               from "framer-motion"
import {
  Plane, Clock, ArrowRight, Filter,
  Star, Wifi, Luggage, ChevronDown,
  ArrowLeftRight
} from "lucide-react"
import Navbar        from "@/components/Navbar"
import { flights }   from "@/data/mockData"
import { formatPrice, formatDuration, cn } from "@/lib/utils"
import { Link }          from "react-router-dom"

const AIRLINES  = ["All Airlines", "Emirates", "Qatar Airways", "EgyptAir", "Turkish Airlines", "Lufthansa"]
const STOPS     = ["Any",          "Non-stop", "1 Stop",       "2+ Stops"]
const CLASSES   = ["All Classes",  "Economy",  "Business",     "First"]

export default function FlightsPage() {
  const [params]       = useSearchParams()
  const [sort,       setSort]       = useState("price")
  const [airline,    setAirline]    = useState("All Airlines")
  const [stops,      setStops]      = useState("Any")
  const [flightClass, setFlightClass] = useState("All Classes")
  const [maxPrice,   setMaxPrice]   = useState(2000)
  const [showFilter, setShowFilter] = useState(false)

  const filtered = useMemo(() => {
    let result = [...flights]
    if (airline !== "All Airlines") result = result.filter(f => f.airline === airline)
    if (stops === "Non-stop")       result = result.filter(f => f.stops === 0)
    if (stops === "1 Stop")         result = result.filter(f => f.stops === 1)
    if (flightClass !== "All Classes") result = result.filter(f => f.class === flightClass)
    result = result.filter(f => f.price <= maxPrice)

    switch (sort) {
      case "price":    return result.sort((a, b) => a.price - b.price)
      case "duration": return result.sort((a, b) => a.duration - b.duration)
      case "rating":   return result.sort((a, b) => b.rating - a.rating)
      default:         return result
    }
  }, [airline, stops, flightClass, maxPrice, sort])

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-b from-dark-900 to-dark-950 pt-24 pb-8 border-b border-white/8">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Plane className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Available Flights</h1>
                <p className="text-white/40 text-sm">{filtered.length} flights found</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Filters Sidebar */}
          <div className="lg:w-64 shrink-0">
            <div className="card p-5 sticky top-24">
              <h3 className="font-bold mb-5 flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary-400" />
                Filters
              </h3>

              {/* Airline */}
              <div className="mb-5">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Airline</p>
                <div className="space-y-2">
                  {AIRLINES.map(a => (
                    <label key={a} className="flex items-center gap-2.5 cursor-pointer group">
                      <div className={cn(
                        "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
                        airline === a ? "border-primary-500 bg-primary-500" : "border-white/20 group-hover:border-primary-400"
                      )} onClick={() => setAirline(a)}>
                        {airline === a && <div className="w-2 h-2 bg-white rounded-sm" />}
                      </div>
                      <span className="text-sm text-white/70 group-hover:text-white transition-colors">{a}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Stops */}
              <div className="mb-5">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Stops</p>
                <div className="flex flex-wrap gap-2">
                  {STOPS.map(s => (
                    <button key={s} onClick={() => setStops(s)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-xs border transition-all",
                        stops === s
                          ? "border-primary-500 bg-primary-500/20 text-primary-400"
                          : "border-white/10 text-white/50 hover:border-primary-500/50"
                      )}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Class */}
              <div className="mb-5">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Class</p>
                <div className="space-y-2">
                  {CLASSES.map(c => (
                    <button key={c} onClick={() => setFlightClass(c)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-xl text-sm border transition-all",
                        flightClass === c
                          ? "border-primary-500 bg-primary-500/10 text-primary-400"
                          : "border-transparent text-white/50 hover:text-white hover:bg-white/5"
                      )}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Price */}
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-3">
                  Max Price — <span className="text-primary-400">{formatPrice(maxPrice)}</span>
                </p>
                <input
                  type="range" min={200} max={2000} step={50}
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary-500"
                />
                <div className="flex justify-between text-xs text-white/30 mt-1">
                  <span>$200</span>
                  <span>$2000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Sort */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-white/40">{filtered.length} results</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">Sort by:</span>
                {["price", "duration", "rating"].map(s => (
                  <button key={s} onClick={() => setSort(s)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs border transition-all capitalize",
                      sort === s
                        ? "border-primary-500 bg-primary-500/20 text-primary-400"
                        : "border-white/10 text-white/50 hover:border-primary-500/50"
                    )}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Flight Cards */}
            <div className="space-y-4">
              {filtered.map((flight, i) => (
                <motion.div
                  key={flight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link to={`/flights/${flight.id}`}>
                    <div className="card p-5 hover:border-primary-500/30 transition-all group cursor-pointer">
                      <div className="flex items-center gap-4 flex-wrap">

                        {/* Airline */}
                        <div className="flex items-center gap-3 min-w-[140px]">
                          <span className="text-2xl">{flight.logo}</span>
                          <div>
                            <p className="font-semibold text-sm">{flight.airline}</p>
                            <p className="text-xs text-white/40">{flight.class}</p>
                          </div>
                        </div>

                        {/* Route */}
                        <div className="flex-1 flex items-center gap-4 justify-center">
                          <div className="text-center">
                            <p className="text-2xl font-bold">{flight.departure}</p>
                            <p className="text-xs text-white/40">{flight.from}</p>
                            <p className="text-xs text-white/60">{flight.fromCity}</p>
                          </div>
                          <div className="flex flex-col items-center gap-1 flex-1 max-w-32">
                            <p className="text-xs text-white/40">{formatDuration(flight.duration)}</p>
                            <div className="w-full flex items-center gap-1">
                              <div className="w-2 h-2 bg-primary-500 rounded-full" />
                              <div className="flex-1 border-t-2 border-dashed border-white/20 relative">
                                {flight.stops > 0 && (
                                  <div className="absolute left-1/2 -translate-x-1/2 -top-1.5
                                    w-3 h-3 bg-dark-800 border-2 border-primary-400 rounded-full" />
                                )}
                              </div>
                              <Plane className="w-4 h-4 text-primary-400" />
                            </div>
                            <p className="text-xs text-white/40">
                              {flight.stops === 0 ? "Non-stop" : `${flight.stops} Stop`}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold">{flight.arrival}</p>
                            <p className="text-xs text-white/40">{flight.to}</p>
                            <p className="text-xs text-white/60">{flight.toCity}</p>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right min-w-[120px]">
                          <p className="text-2xl font-bold text-primary-400">
                            {formatPrice(flight.price)}
                          </p>
                          <p className="text-xs text-white/40">per person</p>
                          <div className="flex items-center gap-1 justify-end mt-1">
                            <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
                            <span className="text-xs text-white/60">{flight.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-green-400 mt-1">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                            {flight.seats} seats left
                          </div>
                        </div>

                        {/* Book Button */}
                        <button className="btn-primary text-sm py-2.5 opacity-0 group-hover:opacity-100
                          transition-opacity whitespace-nowrap">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}