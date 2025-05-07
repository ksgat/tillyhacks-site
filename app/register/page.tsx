"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/components/supabase-provider"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { supabase } = useSupabase()

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long"
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one number"
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character"
    }
    return ""
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    setPasswordError(validatePassword(newPassword))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError(null)

    // Validate password
    const passwordValidationError = validatePassword(password)
    if (passwordValidationError) {
      setPasswordError(passwordValidationError)
      return
    }

    setIsLoading(true)

    try {
      // Check if email already exists in auth
      const { data: existingUsers, error: emailCheckError } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", email)

      if (existingUsers && existingUsers.length > 0) {
        setGeneralError("This email is already registered. Please use a different email or login.")
        setIsLoading(false)
        return
      }

      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (error) {
        if (error.message.includes("already registered")) {
          setGeneralError("This email is already registered. Please use a different email or login.")
        } else {
          setGeneralError(error.message || "An error occurred during registration.")
        }
        throw error
      }

      if (data.user) {
        
        toast({
          title: "Registration successful",
          description: "Your account has been created. You can now log in.",
        })

        // Sign out the user since we want them to explicitly log in
        await supabase.auth.signOut()

        // Redirect to login page using window.location for a hard redirect
        window.location.href = "/login"
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      if (!generalError) {
        setGeneralError(error.message || "An error occurred during registration.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-4">
            <h1 className="text-4xl font-bold">
              <span className="text-primary">Tilly</span>Hacks
            </h1>
          </Link>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Create an account to participate in TillyHacks</CardDescription>
        </CardHeader>
        <CardContent>
          {generalError && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">{generalError}</div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required
                disabled={isLoading}
              />
              {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long and include a number and special character.
              </p>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
