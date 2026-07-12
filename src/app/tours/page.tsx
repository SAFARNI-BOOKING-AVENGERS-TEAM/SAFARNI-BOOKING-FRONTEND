"use client"

import { useState, useMemo } from "react"
import { motion }            from "framer-motion"
import { Map, MapPin, Star, Clock, Users, Filter } from "lucide-react"
import { Link }    from "react-router-dom"
import Navbar  from "@/components/Navbar"
import { tours }      from "@/data/mockData"
import { formatPrice, cn } from "@/lib/utils"

const CATEGORIES  = ["All", "Cultural", "Adventure", "Island", "Safari"]
const DURATIONS   = ["Any", "1 Day", "2-3 Days", "4-7 Days", "8+ Days"]
const DIFFICULTIES = ["Any", "Easy", "Moderate", "Hard"]

export default function ToursPage() {
  const [category,   setCategory]   = useState("All")
  const [duration,   setDuration]   = useState("Any")
  const [difficulty, setDifficulty] = useState("Any")
  const [maxPrice,   setMaxPrice]   = useState(5000)
  const [sort,       setSort]       = useState("rating")

  const filtered = useMemo(() => {
    let result = [...tours]
    if (category !== "All")      result = result.filter(t => t.category === category)
    if (difficulty !== "Any")    result = result.filter(t => t.difficulty === difficulty)
    if (duration === "1 Day")    result = result.filter(t => t.duration === 1)
    if (duration === "2-3 Days") result = result.filter(t => t.duration >= 2 && t.duration <= 3)
    if (duration === "4-7 Days") result = result.filter(t => t.duration >= 4 && t.duration <= 7)
    if (duration === "8+ Days")  result = result.filter(t => t.duration >= 8)
    result = result.filter(t => t.price <= maxPrice)

    switch (sort) {
      case "price":  return result.sort((a, b) => a.price - b.price)
      case "rating": return result.sort((a, b) => b.rating - a.rating)
      default:       return result
    }
  }, [category, duration, difficulty, maxPrice, sort])

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />

      <div className="bg-gradient-to-b from-dark-900 to-dark-950 pt-24 pb-8 border-b border-white/8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Map className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Explore Tours & Experiences</h1>
              <p className="text-white/40 text-sm">{filtered.length} experiences found</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm border transition-all",
                  category === c
                    ? "border-green-500 bg-green-500/20 text-green-400"
                    : "border-white/10 text-white/50 hover:border-green-500/50"
                )}>
                {c}
              </button>
            ))}
          </div>

          <div className="flex gap-2 ml-auto flex-wrap">
            {DIFFICULTIES.map(d => (
              <button key={d} onClick={() => setDifficulty(d)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs border transition-all",
                  difficulty === d
                    ? "border-orange-500 bg-orange-500/20 text-orange-400"
                    : "border-white/10 text-white/50"
                )}>
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Duration + Sort */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs text-white/40 self-center">Duration:</span>
            {DURATIONS.map(d => (
              <button key={d} onClick={() => setDuration(d)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs border transition-all",
                  duration === d
                    ? "border-primary-500 bg-primary-500/20 text-primary-400"
                    : "border-white/10 text-white/50"
                )}>
                {d}
              </button>
            ))}
          </div>
          <div className="flex gap-2 ml-auto">
            <span className="text-xs text-white/40 self-center">Sort:</span>
            {["rating", "price"].map(s => (
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

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((tour, i) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
            >
              <Link to={`/tours/${tour.id}`}>
                <div className="card overflow-hidden group cursor-pointer hover:border-green-500/30 transition-all h-full">
                  <div className="relative h-52 overflow-hidden">
                    <img src={tour.image} alt={tour.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={cn("badge text-white", {
                        "bg-green-600": tour.difficulty === "Easy",
                        "bg-orange-600": tour.difficulty === "Moderate",
                        "bg-red-600": tour.difficulty === "Hard",
                      })}>
                        {tour.difficulty}
                      </span>
                      <span className="badge bg-dark-900/80 text-white">{tour.category}</span>
                    </div>
                    <div className="absolute bottom-3 right-3 badge bg-dark-900/90 text-white">
                      {tour.duration}D / {tour.groupSize} people
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                      <span className="text-sm font-semibold">{tour.rating}</span>
                      <span className="text-xs text-white/40">({tour.reviewCount})</span>
                    </div>
                    <h3 className="font-bold mb-1 group-hover:text-green-400 transition-colors line-clamp-1">
                      {tour.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-white/50 mb-3">
                      <MapPin className="w-3.5 h-3.5" />
                      {tour.destination}, {tour.country}
                    </div>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {tour.highlights.slice(0, 2).map(h => (
                        <span key={h} className="text-xs bg-white/5 border border-white/8 px-2 py-0.5 rounded-lg text-white/50">
                          {h}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-white/40">From</span>
                        <p className="text-lg font-bold text-green-400">{formatPrice(tour.price)}</p>
                      </div>
                      <span className="text-xs text-white/40">per person</span>
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