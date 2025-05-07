"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FaGithub } from "react-icons/fa"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/components/supabase-provider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { supabase } = useSupabase()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message || "Incorrect email or password. Please try again.")
        throw error
      }

      if (data.user) {
        // Show success toast
        toast({
          title: "Login successful",
          description: "You are now logged in and being redirected.",
        })

        // Force a hard navigation to the home page
        window.location.href = "/"
      }
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "Incorrect email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Update the handleGithubLogin function
  const handleGithubLogin = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Get the current site URL dynamically
      const currentOrigin =
        typeof window !== "undefined" ? window.location.origin : "https://tillyhacks.org"

      console.log("Using redirect URL:", `${currentOrigin}/api/auth/callback`)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${currentOrigin}/api/auth/callback`,
        },
      })

      if (error) {
        setError(error.message || "An error occurred during GitHub login.")
        throw error
      }
    } catch (error: any) {
      console.error("GitHub login error:", error)
      setError(error.message || "An error occurred during GitHub login.")
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
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full mb-6" onClick={handleGithubLogin} disabled={isLoading}>
            <FaGithub className="mr-2" />
            Login with GitHub
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
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
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link" className="px-0" disabled={isLoading}>
                Forgot your password?
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Password Reset</DialogTitle>
                <DialogDescription>
                  Please contact{" "}
                  <a href="mailto:hello@tillyhacks.org" className="text-purple-500 hover:underline">
                    hello@tillyhacks.org
                  </a>{" "}
                  to reset your password.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
