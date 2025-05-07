"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import Header from "@/components/header"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/components/supabase-provider"

export default function AttendeeForm() {
  const [attendeeName, setAttendeeName] = useState("")
  const [dietaryRestrictions, setDietaryRestrictions] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { supabase } = useSupabase()

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to access this form.",
          variant: "destructive",
        })
        router.push("/login")
      }
    }

    checkAuth()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        throw new Error("User not authenticated")
      }

      const { error } = await supabase.from("attendee_forms").insert([
        {
          attendee_name: attendeeName,
          dietary_restrictions: dietaryRestrictions,
          user_id: userData.user.id,
        },
      ])

      if (error) {
        throw error
      }

      toast({
        title: "Form submitted",
        description: "Attendee form has been submitted successfully.",
      })

      // Use window.location for a hard refresh to ensure form status is updated
      window.location.href = "/forms"
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message || "An error occurred while submitting the form.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Attendee Form</CardTitle>
            <CardDescription>Please provide attendee information and any dietary restrictions</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="attendee-name">Attendee Name</Label>
                <Input
                  id="attendee-name"
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dietary-restrictions">Dietary Restrictions</Label>
                <Textarea
                  id="dietary-restrictions"
                  value={dietaryRestrictions}
                  onChange={(e) => setDietaryRestrictions(e.target.value)}
                  placeholder="Enter any dietary restrictions or preferences (optional)"
                  disabled={isLoading}
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={() => router.push("/forms")} disabled={isLoading}>
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
