import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import HomePage from "./app/page"
import LoginPage from "./app/login/page"
import RegisterPage from "./app/register/page"
import DashboardPage from "./app/dashboard/page"
import CheckoutPage from "./app/checkout/page"
import FlightsPage from "./app/flights/page"
import FlightDetailPage from "./app/flights/[id]/page"
import HotelsPage from "./app/hotels/page"
import HotelDetailPage from "./app/hotels/[id]/page"
import ToursPage from "./app/tours/page"
import TourDetailPage from "./app/tours/[id]/page"
import CarsPage from "./app/cars/page"
import { useAuth } from "./context/AuthContext"

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route path="/flights" element={<FlightsPage />} />
        <Route path="/flights/:id" element={<FlightDetailPage />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/hotels/:id" element={<HotelDetailPage />} />
        <Route path="/tours" element={<ToursPage />} />
        <Route path="/tours/:id" element={<TourDetailPage />} />
        <Route path="/cars" element={<CarsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
