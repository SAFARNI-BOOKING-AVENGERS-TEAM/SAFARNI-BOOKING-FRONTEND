"use client"

import { useState, useMemo } from "react"
import { motion }            from "framer-motion"
import { Hotel, MapPin, Star, Filter, Wifi, Coffee, Car, Waves } from "lucide-react"
import { Link }     from "react-router-dom"
import Navbar   from "@/components/Navbar"
import { hotels }     from "@/data/mockData"
import { formatPrice, cn } from "@/lib/utils"

const CITIES    = ["All Cities", "Dubai", "Istanbul", "Cairo", "Abu Dhabi", "Petra"]
const AMENITIES = ["Pool", "Spa", "Gym", "Beach", "Restaurant", "WiFi"]

export default function HotelsPage() {
  const [city,      setCity]      = useState("All Cities")
  const [stars,     setStars]     = useState(0)
  const [maxPrice,  setMaxPrice]  = useState(2000)
  const [sort,      setSort]      = useState("rating")
  const [amenity,   setAmenity]   = useState("")

  const filtered = useMemo(() => {
    let result = [...hotels]
    if (city !== "All Cities") result = result.filter(h => h.city === city)
    if (stars > 0)             result = result.filter(h => h.stars >= stars)
    if (amenity)               result = result.filter(h => h.amenities.includes(amenity))
    result = result.filter(h => h.pricePerNight <= maxPrice)

    switch (sort) {
      case "price":  return result.sort((a, b) => a.pricePerNight - b.pricePerNight)
      case "rating": return result.sort((a, b) => b.rating - a.rating)
      case "stars":  return result.sort((a, b) => b.stars - a.stars)
      default:       return result
    }
  }, [city, stars, maxPrice, sort, amenity])

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />

      <div className="bg-gradient-to-b from-dark-900 to-dark-950 pt-24 pb-8 border-b border-white/8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Hotel className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Find Your Perfect Stay</h1>
              <p className="text-white/40 text-sm">{filtered.length} hotels available</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters Top Bar */}
        <div className="flex items-center gap-3 flex-wrap mb-6">
          {/* Cities */}
          <div className="flex gap-2 flex-wrap">
            {CITIES.map(c => (
              <button key={c} onClick={() => setCity(c)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm border transition-all",
                  city === c
                    ? "border-primary-500 bg-primary-500/20 text-primary-400"
                    : "border-white/10 text-white/50 hover:border-primary-500/50"
                )}>
                {c}
              </button>
            ))}
          </div>

          {/* Stars */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-white/40">Min Stars:</span>
            {[0,3,4,5].map(s => (
              <button key={s} onClick={() => setStars(s)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs border transition-all",
                  stars === s
                    ? "border-gold-500 bg-gold-500/20 text-gold-400"
                    : "border-white/10 text-white/50"
                )}>
                {s === 0 ? "All" : `${s}★+`}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex gap-2">
            {["rating","price","stars"].map(s => (
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

        {/* Amenities */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <span className="text-xs text-white/40 self-center">Amenities:</span>
          {AMENITIES.map(a => (
            <button key={a} onClick={() => setAmenity(amenity === a ? "" : a)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs border transition-all",
                amenity === a
                  ? "border-green-500 bg-green-500/20 text-green-400"
                  : "border-white/10 text-white/50 hover:border-green-500/50"
              )}>
              {a}
            </button>
          ))}
        </div>

        {/* Hotel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((hotel, i) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
            >
              <Link to={`/hotels/${hotel.id}`}>
                <div className="card overflow-hidden group cursor-pointer hover:border-primary-500/30 transition-all h-full">
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
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
                    <div className="absolute top-3 right-3 badge bg-dark-900/80 text-white">
                      {formatPrice(hotel.pricePerNight)}/night
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

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {hotel.amenities.slice(0, 4).map(a => (
                        <span key={a} className="text-xs bg-white/5 border border-white/8 px-2 py-0.5 rounded-lg text-white/50">
                          {a}
                        </span>
                      ))}
                      {hotel.amenities.length > 4 && (
                        <span className="text-xs text-white/30">+{hotel.amenities.length - 4}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                        <span className="font-semibold">{hotel.rating}</span>
                        <span className="text-xs text-white/40">({hotel.reviewCount.toLocaleString()})</span>
                      </div>
                      <span className="text-primary-400 font-bold">{formatPrice(hotel.pricePerNight)}<span className="text-xs text-white/40">/night</span></span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}