"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { signIn, signUp, loading, error, clearError } = useAuth()

  // Clear errors when switching modes
  useEffect(() => {
    setLocalError("")
    setSuccessMessage("")
    clearError()
  }, [mode, clearError])

  const validateForm = () => {
    if (!email.trim()) {
      setLocalError("Email is required")
      return false
    }

    if (!email.includes("@")) {
      setLocalError("Please enter a valid email address")
      return false
    }

    if (!password) {
      setLocalError("Password is required")
      return false
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters long")
      return false
    }

    if (mode === "signup" && password !== confirmPassword) {
      setLocalError("Passwords do not match")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLocalError("")
    setSuccessMessage("")
    clearError()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      let result

      if (mode === "signup") {
        result = await signUp(email, password)
        if (result.success) {
          setSuccessMessage("Account created! Please check your email for a confirmation link.")
          setEmail("")
          setPassword("")
          setConfirmPassword("")
        }
      } else {
        result = await signIn(email, password)
        if (result.success) {
          setSuccessMessage("Sign in successful! Redirecting...")
        }
      }

      if (!result.success && result.error) {
        setLocalError(result.error)
      }
    } catch (err) {
      console.error("Form submission error:", err)
      setLocalError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const switchMode = () => {
    setMode(mode === "signin" ? "signup" : "signin")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setLocalError("")
    setSuccessMessage("")
    clearError()
  }

  const currentError = localError || error
  const isLoading = loading || isSubmitting

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-gray-900">
            {mode === "signup" ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            {mode === "signup"
              ? "Create your account to access the Power Platform Assessment Suite"
              : "Sign in to your account to continue"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {mode === "signup" && (
                <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
              )}
            </div>

            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full"
                  required
                />
              </div>
            )}

            {currentError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{currentError}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !email || !password || (mode === "signup" && !confirmPassword)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "signup" ? "Creating Account..." : "Signing In..."}
                </>
              ) : mode === "signup" ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full bg-transparent"
            onClick={switchMode}
            disabled={isLoading}
          >
            {mode === "signup" ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </Button>

          {/* Troubleshooting Section */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Having trouble?</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Make sure your email and password are correct</li>
              <li>• Check your internet connection</li>
              <li>• If signing up, check your email for a confirmation link</li>
              <li>• Try refreshing the page if buttons aren't responding</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
