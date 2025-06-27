"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (mounted) {
          if (error) {
            console.error("Session error:", error)
            setError(error.message)
          } else {
            setUser(session?.user ?? null)
          }
          setLoading(false)
        }
      } catch (err) {
        console.error("Auth initialization error:", err)
        if (mounted) {
          setError("Failed to initialize authentication")
          setLoading(false)
        }
      }
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session?.user?.email)

      if (mounted) {
        setUser(session?.user ?? null)
        setLoading(false)

        if (event === "SIGNED_IN") {
          setError(null)
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        console.error("Sign in error:", error)
        setError(error.message)
        return { success: false, error: error.message }
      }

      if (data.user) {
        console.log("Sign in successful:", data.user.email)
        return { success: true }
      }

      return { success: false, error: "Unknown error occurred" }
    } catch (err) {
      console.error("Sign in exception:", err)
      const errorMessage = err instanceof Error ? err.message : "Network error occurred"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      })

      if (error) {
        console.error("Sign up error:", error)
        setError(error.message)
        return { success: false, error: error.message }
      }

      if (data.user) {
        console.log("Sign up successful:", data.user.email)
        return { success: true }
      }

      return { success: false, error: "Unknown error occurred" }
    } catch (err) {
      console.error("Sign up exception:", err)
      const errorMessage = err instanceof Error ? err.message : "Network error occurred"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Sign out error:", error)
        setError(error.message)
      }
    } catch (err) {
      console.error("Sign out exception:", err)
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
