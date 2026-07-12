"use client"

import { useState, useEffect } from "react"
import { useNavigate }           from "react-router-dom"
import { motion }              from "framer-motion"
import {
  Plane, Hotel, Map, Car, Calendar,
  Check, X, Clock, DollarSign,
  User, Mail, Shield, TrendingUp
} from "lucide-react"
import Navbar          from "@/components/Navbar"
import { useAuth }     from "@/context/AuthContext"
import { Booking }     from "@/types"
import { formatPrice, formatDate, cn } from "@/lib/utils"
import toast           from "react-hot-toast"

const TYPE_CONFIG = {
  FLIGHT: { icon: Plane,  color: "text-blue-400",   bg: "bg-blue-500/15",   label: "Flight"  },
  HOTEL:  { icon: Hotel,  color: "text-purple-400",  bg: "bg-purple-500/15", label: "Hotel"   },
  TOUR:   { icon: Map,    color: "text-green-400",   bg: "bg-green-500/15",  label: "Tour"    },
  CAR:    { icon: Car,    color: "text-orange-400",  bg: "bg-orange-500/15", label: "Car"     },
}

const STATUS_CONFIG = {
  PENDING:   { label: "Pending",   color: "text-yellow-400", bg: "bg-yellow-500/15", border: "border-yellow-500/30" },
  CONFIRMED: { label: "Confirmed", color: "text-green-400",  bg: "bg-green-500/15",  border: "border-green-500/30"  },
  CANCELLED: { label: "Cancelled", color: "text-red-400",    bg: "bg-red-500/15",    border: "border-red-500/30"    },
  COMPLETED: { label: "Completed", color: "text-blue-400",   bg: "bg-blue-500/15",   border: "border-blue-500/30"   },
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user: session, loading: authLoading } = useAuth()
  const [bookings,   setBookings]   = useState<Booking[]>([])
  const [loading,    setLoading]    = useState(true)
  const [activeTab,  setActiveTab]  = useState("ALL")
  const [cancelling, setCancelling] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading) {
      if (!session) {
        navigate("/login")
      } else {
        fetchBookings()
      }
    }
  }, [session, authLoading, navigate])

  async function fetchBookings() {
    try {
      const res  = await fetch("/bookings", { credentials: "include" })
      if (res.status === 404) {
        setBookings([])
        return
      }
      if (!res.ok) throw new Error("Failed to fetch bookings")
      const data = await res.json()
      const bookingsArray = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : [])
      setBookings(bookingsArray)
    } catch (err) {
      console.error(err)
      toast.error("Failed to load bookings")
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel(id: string) {
    setCancelling(id)
    try {
      await fetch(`/bookings/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status: "CANCELLED" }),
        credentials: "include",
      })
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "CANCELLED" } : b))
      toast.success("Booking cancelled")
    } catch {
      toast.error("Failed to cancel")
    } finally {
      setCancelling(null)
    }
  }

  const filtered = activeTab === "ALL"
    ? bookings
    : bookings.filter(b => b.type === activeTab)

  const stats = {
    total:    bookings.length,
    upcoming: bookings.filter(b => b.status === "CONFIRMED").length,
    spent:    bookings.filter(b => b.status !== "CANCELLED").reduce((sum, b) => sum + b.totalPrice, 0),
    trips:    new Set(bookings.map(b => b.type)).size,
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold">My Dashboard</h1>
            <p className="text-white/40 text-sm mt-0.5">
              Welcome back, {session?.name?.split(" ")[0]}! 👋
            </p>
          </div>
          <div className="flex items-center gap-3">
            {session?.profilePicture?.url ? (
              <img src={session.profilePicture.url} alt="" className="w-10 h-10 rounded-full border-2 border-primary-500/50" />
            ) : (
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center font-bold">
                {session?.name?.[0]}
              </div>
            )}
            <div className="hidden md:block">
              <p className="text-sm font-semibold">{session?.name}</p>
              <p className="text-xs text-white/40">{session?.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Bookings", value: stats.total,               icon: Calendar,   color: "text-primary-400", bg: "bg-primary-500/15" },
            { label: "Upcoming Trips", value: stats.upcoming,            icon: TrendingUp, color: "text-green-400",   bg: "bg-green-500/15"   },
            { label: "Total Spent",    value: formatPrice(stats.spent),  icon: DollarSign, color: "text-gold-400",    bg: "bg-gold-500/15"    },
            { label: "Trip Types",     value: stats.trips,               icon: Shield,     color: "text-purple-400",  bg: "bg-purple-500/15"  },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card p-4"
            >
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Bookings */}
        <div className="card overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-4 border-b border-white/8 overflow-x-auto">
            {["ALL", "FLIGHT", "HOTEL", "TOUR", "CAR"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all",
                  activeTab === tab
                    ? "bg-primary-600 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/8"
                )}
              >
                {tab === "ALL" ? "All Bookings" : `${tab.charAt(0) + tab.slice(1).toLowerCase()}s`}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 shimmer-bg rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-14 h-14 text-white/10 mx-auto mb-4" />
              <p className="text-white/40 mb-2">No bookings found</p>
              <p className="text-sm text-white/20 mb-6">Start exploring and book your next adventure</p>
              <div className="flex gap-3 justify-center flex-wrap">
                {[
                  { label: "Find Flights", href: "/flights" },
                  { label: "Find Hotels",  href: "/hotels"  },
                  { label: "Find Tours",   href: "/tours"   },
                ].map(l => (
                  <a key={l.label} href={l.href} className="btn-outline text-sm">{l.label}</a>
                ))}
              </div>
            </div>
          ) : (
            <div className="divide-y divide-white/8">
              {filtered.map((booking, i) => {
                const typeConf   = TYPE_CONFIG[booking.type as keyof typeof TYPE_CONFIG]
                const statusConf = STATUS_CONFIG[booking.status as keyof typeof STATUS_CONFIG]
                const Icon       = typeConf.icon
                const details    = booking.details as any

                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-5 hover:bg-white/3 transition-colors"
                  >
                    {/* Icon */}
                    <div className={`w-12 h-12 ${typeConf.bg} rounded-xl flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${typeConf.color}`} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-sm">
                          {booking.type === "FLIGHT"
                            ? `${details?.item?.fromCity || "—"} → ${details?.item?.toCity || "—"}`
                            : booking.type === "CAR"
                            ? `${details?.item?.brand} ${details?.item?.model}`
                            : details?.item?.name || "—"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/40">
                        <span className="capitalize">{typeConf.label}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(booking.createdAt)}
                        </div>
                        <span>•</span>
                        <span className="font-semibold text-primary-400">
                          {formatPrice(booking.totalPrice)}
                        </span>
                      </div>
                    </div>

                    {/* Status + Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn(
                        "badge border text-xs",
                        statusConf.bg, statusConf.color, statusConf.border
                      )}>
                        {booking.status === "CONFIRMED" && <Check className="w-3 h-3 mr-1" />}
                        {booking.status === "PENDING"   && <Clock className="w-3 h-3 mr-1" />}
                        {statusConf.label}
                      </span>

                      {["CONFIRMED", "PENDING"].includes(booking.status) && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          disabled={cancelling === booking.id}
                          className="text-xs text-red-400 hover:text-red-300 transition-colors
                            px-2 py-1 hover:bg-red-500/10 rounded-lg"
                        >
                          {cancelling === booking.id ? "..." : "Cancel"}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}