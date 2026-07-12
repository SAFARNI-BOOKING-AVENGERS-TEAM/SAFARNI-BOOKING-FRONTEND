import React, { createContext, useContext, useState, useEffect } from "react"

export interface User {
  id: string
  name: string
  email: string
  isVerified: boolean
  profilePicture?: {
    url: string
    publicId: string
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch current user on mount
  const checkSession = async () => {
    try {
      const res = await fetch("/users/my-profile", { credentials: "include" })
      if (res.ok) {
        const body = await res.json()
        const u = body.data || body
        if (u && (u._id || u.id || u.email)) {
          setUser({
            id: u._id || u.id,
            name: u.name,
            email: u.email,
            isVerified: u.isVerified !== undefined ? u.isVerified : true,
            profilePicture: u.profilePicture,
          })
          return
        }
      }
      setUser(null)
    } catch (err) {
      console.error("Session check failed:", err)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkSession()
  }, [])

  const login = async (email: string, password: string) => {
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    })

    const body = await res.json()
    if (!res.ok) {
      throw new Error(body.error_message || body.message || "Failed to log in")
    }

    // Refresh profile to update user state
    await checkSession()
  }

  const logout = async () => {
    try {
      await fetch("/auth/logout", { method: "POST", credentials: "include" })
    } catch (err) {
      console.error("Logout request failed:", err)
    } finally {
      setUser(null)
    }
  }

  const register = async (name: string, email: string, password: string, phone?: string) => {
    // 1. Sign up the user
    const signUpRes = await fetch("/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
      credentials: "include",
    })

    const signUpBody = await signUpRes.json()
    if (!signUpRes.ok) {
      throw new Error(signUpBody.error_message || signUpBody.message || "Failed to sign up")
    }

    // 2. Auto-verify the email for smooth developer/user experience
    try {
      await fetch("/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      })
    } catch (err) {
      console.error("Auto verification failed:", err)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
