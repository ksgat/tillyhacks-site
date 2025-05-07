import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    try {
      // Exchange the code for a session
      await supabase.auth.exchangeCodeForSession(code)

      // Get the user data
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Check if a profile already exists for this user
        const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", user.id).single()

        // If no profile exists, create one
        if (!existingProfile) {
          await supabase.from("profiles").insert({
            id: user.id,
            name: user.user_metadata.name || user.user_metadata.preferred_username || "GitHub User",
            email: user.email || "",
          })
        }
      }
    } catch (error) {
      console.error("Error in auth callback:", error)
    }
  }

  // Get the origin from the request URL to ensure correct redirection
  const origin = requestUrl.origin.includes("localhost") ? requestUrl.origin : "https://tillyhacks.org"

  // Redirect to the home page
  return NextResponse.redirect(`${origin}/`)
}
