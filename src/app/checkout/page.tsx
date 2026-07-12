"use client"

import { useState }    from "react"
import { useNavigate, Link }   from "react-router-dom"
import { motion }      from "framer-motion"
import {
  CreditCard, Lock, Check, Plane,
  Hotel, Map, Car, ArrowLeft, User,
  Mail, Phone, Calendar
} from "lucide-react"
import Navbar          from "@/components/Navbar"
import { useBookingStore } from "@/store/bookingStore"
import { useAuth }         from "@/context/AuthContext"
import { formatPrice, formatDate, cn } from "@/lib/utils"
import toast           from "react-hot-toast"

type Step = "details" | "payment" | "success"

const TYPE_ICONS = {
  flight: Plane,
  hotel:  Hotel,
  tour:   Map,
  car:    Car,
}

const TYPE_COLORS = {
  flight: "text-blue-400",
  hotel:  "text-purple-400",
  tour:   "text-green-400",
  car:    "text-orange-400",
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { user: session } = useAuth()
  const { current, clearBooking } = useBookingStore()

  const [step,    setStep]    = useState<Step>("details")
  const [loading, setLoading] = useState(false)
  const [ref,     setRef]     = useState("")
  const [form,    setForm]    = useState({
    firstName: session?.name?.split(" ")[0] || "",
    lastName:  session?.name?.split(" ")[1] || "",
    email:     session?.email || "",
    phone:     "",
    cardNumber: "", cardName: "", expiry: "", cvv: "",
  })

  if (!current) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 mb-4">No booking selected</p>
          <Link to="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    )
  }

  const Icon  = TYPE_ICONS[current.type as keyof typeof TYPE_ICONS]
  const color = TYPE_COLORS[current.type as keyof typeof TYPE_COLORS]

  async function handlePayment() {
    if(!current) return
    setLoading(true)
    try {
      const res = await fetch("/bookings", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type:       current.type.toUpperCase(),
          details:    { ...current.details, item: current.item },
          totalPrice: current.totalPrice,
        }),
        credentials: "include",
      })

      if (!res.ok) throw new Error("Booking failed")

      const booking = await res.json()
      const bookingId = booking._id || booking.id
      setRef(`SF-${bookingId.slice(-8).toUpperCase()}`)
      setStep("success")
      clearBooking()
    } catch {
      toast.error("Payment failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-green-500/20 border-2 border-green-500 rounded-full
            flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-white/50 mb-4">
            Your booking has been confirmed successfully.
          </p>
          <div className="card p-4 mb-6">
            <p className="text-xs text-white/40 mb-1">Booking Reference</p>
            <p className="text-2xl font-bold text-primary-400">{ref}</p>
          </div>
          <p className="text-sm text-white/40 mb-8">
            A confirmation has been sent to <span className="text-white/70">{form.email}</span>
          </p>
          <div className="flex gap-3">
            <Link to="/dashboard" className="flex-1 btn-primary text-center">
              View My Bookings
            </Link>
            <Link to="/" className="flex-1 btn-outline text-center">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">

        <Link to="/" className="flex items-center gap-2 text-white/40 hover:text-white
          transition-colors text-sm mb-6">
          <ArrowLeft className="w-4 h-4" />
          Continue Browsing
        </Link>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[
            { id: "details", label: "Details" },
            { id: "payment", label: "Payment" },
          ].map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-2 text-sm font-medium",
                step === s.id ? "text-primary-400" : "text-white/30"
              )}>
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2",
                  step === s.id
                    ? "border-primary-500 bg-primary-500/20 text-primary-400"
                    : step === "payment" && i === 0
                    ? "border-green-500 bg-green-500/20 text-green-400"
                    : "border-white/20 text-white/30"
                )}>
                  {step === "payment" && i === 0 ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                {s.label}
              </div>
              {i === 0 && <div className="w-12 h-px bg-white/10" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Form */}
          <div className="lg:col-span-3">

            {/* Booking Summary Mini */}
            <div className="card p-4 mb-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                ${current.type === "flight" ? "bg-blue-500/20" :
                  current.type === "hotel"  ? "bg-purple-500/20" :
                  current.type === "tour"   ? "bg-green-500/20" : "bg-orange-500/20"}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">
                  {current.type === "flight" ? `${current.item.fromCity} → ${current.item.toCity}` :
                   current.type === "car"    ? `${current.item.brand} ${current.item.model}` :
                   current.item.name}
                </p>
                <p className="text-xs text-white/40 capitalize">{current.type} booking</p>
              </div>
              <p className="text-primary-400 font-bold">{formatPrice(current.totalPrice)}</p>
            </div>

            {step === "details" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="card p-6">
                  <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary-400" />
                    Passenger Details
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: "firstName", label: "First Name", placeholder: "Mohammed" },
                        { key: "lastName",  label: "Last Name",  placeholder: "Sherif"   },
                      ].map(f => (
                        <div key={f.key}>
                          <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">
                            {f.label}
                          </label>
                          <input
                            type="text"
                            value={(form as any)[f.key]}
                            onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                            placeholder={f.placeholder}
                            className="input"
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          className="input pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">
                        Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={e => setForm({ ...form, phone: e.target.value })}
                          placeholder="+20 1234567890"
                          className="input pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep("payment")}
                    className="btn-primary w-full mt-6"
                  >
                    Continue to Payment
                  </button>
                </div>
              </motion.div>
            )}

            {step === "payment" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="card p-6">
                  <h2 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary-400" />
                    Payment Details
                  </h2>
                  <div className="flex items-center gap-2 bg-primary-500/10 border border-primary-500/20
                    rounded-xl p-3 mb-5">
                    <Lock className="w-4 h-4 text-primary-400" />
                    <p className="text-xs text-white/50">Your payment is 256-bit SSL encrypted</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={form.cardNumber}
                        onChange={e => setForm({ ...form, cardNumber: e.target.value })}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={form.cardName}
                        onChange={e => setForm({ ...form, cardName: e.target.value })}
                        placeholder="Mohammed Sherif"
                        className="input"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={form.expiry}
                          onChange={e => setForm({ ...form, expiry: e.target.value })}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={form.cvv}
                          onChange={e => setForm({ ...form, cvv: e.target.value })}
                          placeholder="123"
                          maxLength={3}
                          className="input"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Pay {formatPrice(current.totalPrice)}
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="card p-5 sticky top-24">
              <h3 className="font-bold mb-4">Order Summary</h3>

              <div className="space-y-3 mb-4 pb-4 border-b border-white/8">
                {current.type === "flight" && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Route</span>
                      <span>{current.item.from} → {current.item.to}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Airline</span>
                      <span>{current.item.airline}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Date</span>
                      <span>{current.details.date ? formatDate(current.details.date) : "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Passengers</span>
                      <span>{current.details.passengers}</span>
                    </div>
                  </>
                )}
                {current.type === "hotel" && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Hotel</span>
                      <span className="truncate max-w-32 text-right">{current.item.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Check-in</span>
                      <span>{current.details.checkIn ? formatDate(current.details.checkIn) : "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Check-out</span>
                      <span>{current.details.checkOut ? formatDate(current.details.checkOut) : "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Nights</span>
                      <span>{current.details.nights}</span>
                    </div>
                  </>
                )}
                {current.type === "tour" && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Tour</span>
                      <span className="truncate max-w-32 text-right">{current.item.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Date</span>
                      <span>{current.details.date ? formatDate(current.details.date) : "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Persons</span>
                      <span>{current.details.persons}</span>
                    </div>
                  </>
                )}
                {current.type === "car" && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Car</span>
                      <span>{current.item.brand} {current.item.model}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Pick-up</span>
                      <span>{current.details.pickUp ? formatDate(current.details.pickUp) : "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Days</span>
                      <span>{current.details.days}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Subtotal</span>
                  <span>{formatPrice(current.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Taxes & Fees</span>
                  <span className="text-green-400">Included</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg border-t border-white/8 pt-3">
                <span>Total</span>
                <span className="text-primary-400">{formatPrice(current.totalPrice)}</span>
              </div>

              <div className="mt-4 space-y-2">
                {["Free cancellation 24h", "Price match guarantee", "Secure payment"].map(item => (
                  <div key={item} className="flex items-center gap-2 text-xs text-white/40">
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}