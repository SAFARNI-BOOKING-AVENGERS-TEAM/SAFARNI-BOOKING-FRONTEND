import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Plane, Hotel, Map, Car, Search, MapPin, Calendar, Users } from "lucide-react"
import { cn } from "@/lib/utils"

type TabType = "flights" | "hotels" | "tours" | "cars"

const TABS = [
  { id: "flights" as TabType, label: "Flights", icon: Plane  },
  { id: "hotels"  as TabType, label: "Hotels",  icon: Hotel  },
  { id: "tours"   as TabType, label: "Tours",   icon: Map    },
  { id: "cars"    as TabType, label: "Cars",    icon: Car    },
]

const POPULAR = ["Dubai", "Istanbul", "Paris", "Cairo", "Maldives", "Tokyo", "London", "New York"]

export default function SearchBar() {
  const navigate = useNavigate()
  const [tab,    setTab]    = useState<TabType>("flights")
  const [from,   setFrom]   = useState("")
  const [to,     setTo]     = useState("")
  const [dates,  setDates]  = useState({ checkIn: "", checkOut: "" })
  const [guests, setGuests] = useState(1)

  function handleSearch() {
    const params = new URLSearchParams()
    if (from)          params.set("from",    from)
    if (to)            params.set("to",      to)
    if (dates.checkIn) params.set("checkIn", dates.checkIn)
    if (guests > 1)    params.set("guests",  String(guests))
    navigate(`/${tab}?${params}`)
  }

  return (
    <div className="glass rounded-3xl p-2 w-full max-w-5xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-1 p-1 mb-3">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-medium transition-all",
              tab === t.id
                ? "bg-primary-600 text-white shadow-lg shadow-primary-600/25"
                : "text-white/60 hover:text-white hover:bg-white/8"
            )}
          >
            <t.icon className="w-4 h-4" />
            <span className="hidden sm:block">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Search Fields */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">

        {/* From / Destination */}
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
          <input
            type="text"
            value={from}
            onChange={e => setFrom(e.target.value)}
            placeholder={tab === "flights" ? "From (City)" : "Destination"}
            className="input pl-10 bg-white/8 border-white/10 rounded-2xl"
          />
        </div>

        {/* To (flights only) */}
        {tab === "flights" ? (
          <div className="relative">
            <Plane className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
            <input
              type="text"
              value={to}
              onChange={e => setTo(e.target.value)}
              placeholder="To (City or Airport)"
              className="input pl-10 bg-white/8 border-white/10 rounded-2xl"
            />
          </div>
        ) : (
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
            <input
              type="date"
              value={dates.checkIn}
              onChange={e => setDates({ ...dates, checkIn: e.target.value })}
              min={new Date().toISOString().split("T")[0]}
              className="input pl-10 bg-white/8 border-white/10 rounded-2xl"
            />
          </div>
        )}

        {/* Date */}
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
          <input
            type="date"
            value={tab === "flights" ? dates.checkIn : dates.checkOut}
            onChange={e => setDates(
              tab === "flights"
                ? { ...dates, checkIn: e.target.value }
                : { ...dates, checkOut: e.target.value }
            )}
            min={new Date().toISOString().split("T")[0]}
            placeholder={tab === "flights" ? "Departure" : "Check-out"}
            className="input pl-10 bg-white/8 border-white/10 rounded-2xl"
          />
        </div>

        {/* Guests + Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
            <select
              value={guests}
              onChange={e => setGuests(Number(e.target.value))}
              className="input pl-9 bg-white/8 border-white/10 rounded-2xl appearance-none"
            >
              {[1,2,3,4,5,6,7,8].map(n => (
                <option key={n} value={n} className="bg-dark-900">{n} {n === 1 ? "Guest" : "Guests"}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSearch}
            className="btn-primary px-5 py-3 rounded-2xl flex items-center gap-2 whitespace-nowrap"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:block">Search</span>
          </button>
        </div>
      </div>

      {/* Popular */}
      <div className="flex items-center gap-2 mt-3 px-1 flex-wrap">
        <span className="text-xs text-white/30">Popular:</span>
        {POPULAR.map(dest => (
          <button
            key={dest}
            onClick={() => setFrom(dest)}
            className="text-xs text-white/50 hover:text-primary-400 transition-colors
              bg-white/5 px-2.5 py-1 rounded-lg hover:bg-primary-500/10"
          >
            {dest}
          </button>
        ))}
      </div>
    </div>
  )
}