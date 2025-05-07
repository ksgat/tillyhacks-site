"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/header"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/components/supabase-provider"

export default function Forms() {
  const [formStatus, setFormStatus] = useState({
    parentForm: false,
    attendeeForm: false,
    waiverForm: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const { supabase } = useSupabase()

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to access this page.",
          variant: "destructive",
        })
        router.push("/login")
        return
      }

      fetchFormStatus()
    }

    checkAuth()
  }, [])

  const fetchFormStatus = async () => {
    setIsLoading(true)
    try {
      // Get current user ID
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        throw new Error("User not authenticated")
      }

      const userId = userData.user.id

      // Check parent form status - using count instead of single
      const { data: parentData, error: parentError } = await supabase
        .from("parent_forms")
        .select("id")
        .eq("user_id", userId)

      if (parentError) {
        console.error("Error fetching parent form status:", parentError)
      }

      // Check attendee form status
      const { data: attendeeData, error: attendeeError } = await supabase
        .from("attendee_forms")
        .select("id")
        .eq("user_id", userId)

      if (attendeeError) {
        console.error("Error fetching attendee form status:", attendeeError)
      }

      // Check waiver form status
      const { data: waiverData, error: waiverError } = await supabase
        .from("waiver_forms")
        .select("id")
        .eq("user_id", userId)

      if (waiverError) {
        console.error("Error fetching waiver form status:", waiverError)
      }

      setFormStatus({
        parentForm: parentData && parentData.length > 0,
        attendeeForm: attendeeData && attendeeData.length > 0,
        waiverForm: waiverData && waiverData.length > 0,
      })

      console.log("Form status:", {
        parentForm: parentData && parentData.length > 0,
        attendeeForm: attendeeData && attendeeData.length > 0,
        waiverForm: waiverData && waiverData.length > 0,
      })
    } catch (error) {
      console.error("Error fetching form status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Event Registration</h1>
        <p className="mb-8">Please complete all forms to finalize your registration for TillyHacks.</p>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <Card className={formStatus.parentForm ? "opacity-50" : ""}>
              <CardHeader>
                <CardTitle>Parent Form</CardTitle>
                <CardDescription>Parent/guardian contact information</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => router.push("/forms/parent")}
                  className="w-full"
                  disabled={formStatus.parentForm}
                >
                  {formStatus.parentForm ? "Completed" : "Complete Form"}
                </Button>
              </CardContent>
            </Card>

            <Card className={formStatus.attendeeForm ? "opacity-50" : ""}>
              <CardHeader>
                <CardTitle>Attendee Form</CardTitle>
                <CardDescription>Attendee details and dietary restrictions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => router.push("/forms/attendee")}
                  className="w-full"
                  disabled={formStatus.attendeeForm}
                >
                  {formStatus.attendeeForm ? "Completed" : "Complete Form"}
                </Button>
              </CardContent>
            </Card>

            <Card className={formStatus.waiverForm ? "opacity-50" : ""}>
              <CardHeader>
                <CardTitle>Waiver Form</CardTitle>
                <CardDescription>Legal waiver and consent</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => router.push("/forms/waiver")}
                  className="w-full"
                  disabled={formStatus.waiverForm}
                >
                  {formStatus.waiverForm ? "Completed" : "Complete Form"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
